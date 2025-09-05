import json
import uuid
from datetime import datetime, timedelta
from celery import current_task
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

from ..runners.workflow_runner import WorkflowRunner
from ..runners.ai_runner import AIRunner
from ..runners.email_runner import EmailRunner
from ..runners.connector_runner import ConnectorRunner

load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/relayclone")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from celery_app import app

@app.task(bind=True, max_retries=3)
def execute_workflow(self, run_id: str):
    """Execute a workflow run"""
    db = SessionLocal()
    try:
        # Get run from database
        result = db.execute(text("SELECT * FROM runs WHERE id = :run_id"), {"run_id": run_id})
        run = result.fetchone()
        
        if not run:
            raise Exception(f"Run {run_id} not found")
        
        # Update run status to running
        db.execute(
            text("UPDATE runs SET status = 'RUNNING', started_at = :started_at WHERE id = :run_id"),
            {"run_id": run_id, "started_at": datetime.utcnow()}
        )
        db.commit()
        
        # Get workflow definition
        result = db.execute(
            text("SELECT definition FROM workflows WHERE id = :workflow_id"),
            {"workflow_id": run.workflow_id}
        )
        workflow = result.fetchone()
        
        if not workflow:
            raise Exception(f"Workflow {run.workflow_id} not found")
        
        workflow_definition = json.loads(workflow.definition)
        
        # Initialize workflow runner
        runner = WorkflowRunner(db, run_id)
        
        # Execute workflow steps
        result = runner.execute(workflow_definition)
        
        # Update run status
        if result.get("success", False):
            db.execute(
                text("UPDATE runs SET status = 'COMPLETED', completed_at = :completed_at WHERE id = :run_id"),
                {"run_id": run_id, "completed_at": datetime.utcnow()}
            )
        else:
            db.execute(
                text("UPDATE runs SET status = 'FAILED', error_message = :error_message, completed_at = :completed_at WHERE id = :run_id"),
                {
                    "run_id": run_id,
                    "error_message": result.get("error", "Unknown error"),
                    "completed_at": datetime.utcnow()
                }
            )
        
        db.commit()
        return result
        
    except Exception as exc:
        # Update run status to failed
        db.execute(
            text("UPDATE runs SET status = 'FAILED', error_message = :error_message, completed_at = :completed_at WHERE id = :run_id"),
            {
                "run_id": run_id,
                "error_message": str(exc),
                "completed_at": datetime.utcnow()
            }
        )
        db.commit()
        
        # Retry if we haven't exceeded max retries
        if self.request.retries < self.max_retries:
            raise self.retry(countdown=60 * (2 ** self.request.retries))
        else:
            raise exc
    finally:
        db.close()

@app.task
def check_scheduled_workflows():
    """Check for workflows that need to be scheduled"""
    db = SessionLocal()
    try:
        # This would check for scheduled workflows and create runs
        # Implementation depends on your scheduling logic
        pass
    finally:
        db.close()

@app.task
def cleanup_old_runs():
    """Clean up old completed runs"""
    db = SessionLocal()
    try:
        # Delete runs older than 30 days
        cutoff_date = datetime.utcnow() - timedelta(days=30)
        db.execute(
            text("DELETE FROM runs WHERE status IN ('COMPLETED', 'FAILED') AND completed_at < :cutoff_date"),
            {"cutoff_date": cutoff_date}
        )
        db.commit()
    finally:
        db.close()

@app.task
def execute_step(step_id: str, step_type: str, input_data: dict):
    """Execute a single workflow step"""
    db = SessionLocal()
    try:
        # Create step record
        step_run_id = str(uuid.uuid4())
        db.execute(
            text("""
                INSERT INTO run_steps (id, step_id, step_type, input_data, status, created_at)
                VALUES (:id, :step_id, :step_type, :input_data, 'PENDING', :created_at)
            """),
            {
                "id": step_run_id,
                "step_id": step_id,
                "step_type": step_type,
                "input_data": json.dumps(input_data),
                "created_at": datetime.utcnow()
            }
        )
        db.commit()
        
        # Update status to running
        db.execute(
            text("UPDATE run_steps SET status = 'RUNNING', started_at = :started_at WHERE id = :id"),
            {"id": step_run_id, "started_at": datetime.utcnow()}
        )
        db.commit()
        
        # Execute based on step type
        runner = None
        if step_type == "AI":
            runner = AIRunner()
        elif step_type == "EMAIL":
            runner = EmailRunner()
        elif step_type == "CONNECTOR":
            runner = ConnectorRunner()
        
        if runner:
            result = runner.execute(input_data)
            
            # Update step with result
            db.execute(
                text("""
                    UPDATE run_steps 
                    SET status = :status, output_data = :output_data, completed_at = :completed_at
                    WHERE id = :id
                """),
                {
                    "id": step_run_id,
                    "status": "COMPLETED" if result.get("success", False) else "FAILED",
                    "output_data": json.dumps(result),
                    "completed_at": datetime.utcnow()
                }
            )
        else:
            # Unknown step type
            db.execute(
                text("""
                    UPDATE run_steps 
                    SET status = 'FAILED', error_message = :error_message, completed_at = :completed_at
                    WHERE id = :id
                """),
                {
                    "id": step_run_id,
                    "error_message": f"Unknown step type: {step_type}",
                    "completed_at": datetime.utcnow()
                }
            )
        
        db.commit()
        return result
        
    except Exception as exc:
        # Update step status to failed
        db.execute(
            text("""
                UPDATE run_steps 
                SET status = 'FAILED', error_message = :error_message, completed_at = :completed_at
                WHERE id = :id
            """),
            {
                "id": step_run_id,
                "error_message": str(exc),
                "completed_at": datetime.utcnow()
            }
        )
        db.commit()
        raise exc
    finally:
        db.close()
