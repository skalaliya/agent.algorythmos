from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
import uuid

from ..database import get_db
from .. import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.RunStep])
async def get_steps(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all run steps"""
    steps = db.query(models.RunStep).offset(skip).limit(limit).all()
    for step in steps:
        if step.input_data:
            step.input_data = json.loads(step.input_data)
        if step.output_data:
            step.output_data = json.loads(step.output_data)
    return steps

@router.post("/", response_model=schemas.RunStep)
async def create_step(
    step: schemas.RunStepCreate,
    db: Session = Depends(get_db)
):
    """Create a new run step"""
    db_step = models.RunStep(
        id=str(uuid.uuid4()),
        run_id=step.run_id,
        step_id=step.step_id,
        step_type=step.step_type,
        input_data=json.dumps(step.input_data) if step.input_data else None,
        status=models.StepStatus.PENDING
    )
    db.add(db_step)
    db.commit()
    db.refresh(db_step)
    
    # Parse input_data back to dict for response
    if db_step.input_data:
        db_step.input_data = json.loads(db_step.input_data)
    
    return db_step

@router.get("/{step_id}", response_model=schemas.RunStep)
async def get_step(
    step_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific run step"""
    step = db.query(models.RunStep).filter(models.RunStep.id == step_id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Step not found")
    
    # Parse data to dict
    if step.input_data:
        step.input_data = json.loads(step.input_data)
    if step.output_data:
        step.output_data = json.loads(step.output_data)
    
    return step

@router.put("/{step_id}", response_model=schemas.RunStep)
async def update_step(
    step_id: str,
    step_update: schemas.RunStepUpdate,
    db: Session = Depends(get_db)
):
    """Update a run step"""
    step = db.query(models.RunStep).filter(models.RunStep.id == step_id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Step not found")
    
    update_data = step_update.dict(exclude_unset=True)
    
    # Handle JSON fields
    if "input_data" in update_data and update_data["input_data"]:
        update_data["input_data"] = json.dumps(update_data["input_data"])
    if "output_data" in update_data and update_data["output_data"]:
        update_data["output_data"] = json.dumps(update_data["output_data"])
    
    for field, value in update_data.items():
        setattr(step, field, value)
    
    db.commit()
    db.refresh(step)
    
    # Parse data back to dict for response
    if step.input_data:
        step.input_data = json.loads(step.input_data)
    if step.output_data:
        step.output_data = json.loads(step.output_data)
    
    return step
