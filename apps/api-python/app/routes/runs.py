from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
import uuid

from ..database import get_db
from .. import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Run])
async def get_runs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all runs"""
    runs = db.query(models.Run).offset(skip).limit(limit).all()
    return runs

@router.post("/", response_model=schemas.Run)
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

@router.get("/{run_id}", response_model=schemas.RunWithSteps)
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

@router.put("/{run_id}/status")
async def update_run_status(
    run_id: str,
    status_update: dict,
    db: Session = Depends(get_db)
):
    """Update run status"""
    run = db.query(models.Run).filter(models.Run.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    
    if "status" in status_update:
        run.status = models.RunStatus(status_update["status"])
    
    if "error_message" in status_update:
        run.error_message = status_update["error_message"]
    
    db.commit()
    db.refresh(run)
    return run
