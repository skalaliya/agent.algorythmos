from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import json
import uuid

from .database import get_db, engine
from . import models, schemas
from .routes import workflows, runs, steps, connectors, email

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Relay Clone API",
    description="Python FastAPI backend for Relay Clone",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(workflows.router, prefix="/api/workflows", tags=["workflows"])
app.include_router(runs.router, prefix="/api/runs", tags=["runs"])
app.include_router(steps.router, prefix="/api/steps", tags=["steps"])
app.include_router(connectors.router, prefix="/api/connectors", tags=["connectors"])
app.include_router(email.router, prefix="/api/email", tags=["email"])

@app.get("/")
async def root():
    return {"message": "Relay Clone API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "relay-clone-api"}

@app.get("/api/workflows", response_model=List[schemas.Workflow])
async def get_workflows(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all workflows"""
    workflows = db.query(models.Workflow).offset(skip).limit(limit).all()
    return workflows

@app.post("/api/workflows", response_model=schemas.Workflow)
async def create_workflow(
    workflow: schemas.WorkflowCreate,
    db: Session = Depends(get_db)
):
    """Create a new workflow"""
    db_workflow = models.Workflow(
        id=str(uuid.uuid4()),
        name=workflow.name,
        description=workflow.description,
        definition=json.dumps(workflow.definition),
        is_active=workflow.is_active,
        user_id=workflow.user_id
    )
    db.add(db_workflow)
    db.commit()
    db.refresh(db_workflow)
    
    # Parse definition back to dict for response
    db_workflow.definition = json.loads(db_workflow.definition)
    return db_workflow

@app.get("/api/workflows/{workflow_id}", response_model=schemas.Workflow)
async def get_workflow(
    workflow_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific workflow"""
    workflow = db.query(models.Workflow).filter(models.Workflow.id == workflow_id).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Parse definition to dict
    workflow.definition = json.loads(workflow.definition)
    return workflow

@app.put("/api/workflows/{workflow_id}", response_model=schemas.Workflow)
async def update_workflow(
    workflow_id: str,
    workflow_update: schemas.WorkflowUpdate,
    db: Session = Depends(get_db)
):
    """Update a workflow"""
    workflow = db.query(models.Workflow).filter(models.Workflow.id == workflow_id).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    update_data = workflow_update.dict(exclude_unset=True)
    if "definition" in update_data:
        update_data["definition"] = json.dumps(update_data["definition"])
    
    for field, value in update_data.items():
        setattr(workflow, field, value)
    
    db.commit()
    db.refresh(workflow)
    
    # Parse definition to dict
    workflow.definition = json.loads(workflow.definition)
    return workflow

@app.delete("/api/workflows/{workflow_id}")
async def delete_workflow(
    workflow_id: str,
    db: Session = Depends(get_db)
):
    """Delete a workflow"""
    workflow = db.query(models.Workflow).filter(models.Workflow.id == workflow_id).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    db.delete(workflow)
    db.commit()
    return {"message": "Workflow deleted successfully"}

@app.get("/api/runs", response_model=List[schemas.Run])
async def get_runs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all runs"""
    runs = db.query(models.Run).offset(skip).limit(limit).all()
    return runs

@app.post("/api/runs", response_model=schemas.Run)
async def create_run(
    run: schemas.RunCreate,
    db: Session = Depends(get_db)
):
    """Create a new run"""
    db_run = models.Run(
        id=str(uuid.uuid4()),
        workflow_id=run.workflow_id,
        status=models.RunStatus.QUEUED
    )
    db.add(db_run)
    db.commit()
    db.refresh(db_run)
    return db_run

@app.get("/api/runs/{run_id}", response_model=schemas.RunWithSteps)
async def get_run(
    run_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific run with its steps"""
    run = db.query(models.Run).filter(models.Run.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    
    # Parse step data
    for step in run.steps:
        if step.input_data:
            step.input_data = json.loads(step.input_data)
        if step.output_data:
            step.output_data = json.loads(step.output_data)
    
    return run

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
