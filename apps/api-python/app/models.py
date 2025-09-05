from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
from .database import Base

class RunStatus(str, Enum):
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

class StepStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"

class StepType(str, Enum):
    AI = "AI"
    EMAIL = "EMAIL"
    LOOP = "LOOP"
    CONNECTOR = "CONNECTOR"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    workflows = relationship("Workflow", back_populates="user")

class Workflow(Base):
    __tablename__ = "workflows"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    definition = Column(Text, nullable=False)  # JSON string
    is_active = Column(Boolean, default=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="workflows")
    runs = relationship("Run", back_populates="workflow")

class Run(Base):
    __tablename__ = "runs"
    
    id = Column(String, primary_key=True, index=True)
    workflow_id = Column(String, ForeignKey("workflows.id"), nullable=False)
    status = Column(SQLEnum(RunStatus), default=RunStatus.QUEUED)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    workflow = relationship("Workflow", back_populates="runs")
    steps = relationship("RunStep", back_populates="run")

class RunStep(Base):
    __tablename__ = "run_steps"
    
    id = Column(String, primary_key=True, index=True)
    run_id = Column(String, ForeignKey("runs.id"), nullable=False)
    step_id = Column(String, nullable=False)
    step_type = Column(SQLEnum(StepType), nullable=False)
    status = Column(SQLEnum(StepStatus), default=StepStatus.PENDING)
    input_data = Column(Text, nullable=True)  # JSON string
    output_data = Column(Text, nullable=True)  # JSON string
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    run = relationship("Run", back_populates="steps")
