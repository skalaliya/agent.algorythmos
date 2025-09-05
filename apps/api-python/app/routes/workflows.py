from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
import uuid

from ..database import get_db
from .. import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Workflow])
async def get_workflows(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all workflows"""
    workflows = db.query(models.Workflow).offset(skip).limit(limit).all()
    for workflow in workflows:
        workflow.definition = json.loads(workflow.definition)
    return workflows

@router.post("/", response_model=schemas.Workflow)
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

@router.get("/{workflow_id}", response_model=schemas.Workflow)
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

@router.put("/{workflow_id}", response_model=schemas.Workflow)
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

@router.delete("/{workflow_id}")
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
