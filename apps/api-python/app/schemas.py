from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from .models import RunStatus, StepStatus, StepType

# User Schemas
class UserBase(BaseModel):
    email: str
    name: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Workflow Schemas
class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None
    definition: Dict[str, Any]
    is_active: bool = True

class WorkflowCreate(WorkflowBase):
    user_id: str

class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    definition: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class Workflow(WorkflowBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Run Schemas
class RunBase(BaseModel):
    workflow_id: str

class RunCreate(RunBase):
    pass

class Run(RunBase):
    id: str
    status: RunStatus
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# RunStep Schemas
class RunStepBase(BaseModel):
    run_id: str
    step_id: str
    step_type: StepType
    input_data: Optional[Dict[str, Any]] = None

class RunStepCreate(RunStepBase):
    pass

class RunStepUpdate(BaseModel):
    status: Optional[StepStatus] = None
    output_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class RunStep(RunStepBase):
    id: str
    status: StepStatus
    output_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# API Response Schemas
class WorkflowWithRuns(Workflow):
    runs: List[Run] = []

class RunWithSteps(Run):
    steps: List[RunStep] = []
