from celery_app import app
from ..runners.email_runner import EmailRunner

@app.task
def execute_email_step(step_config: dict):
    """Execute an email step"""
    runner = EmailRunner()
    return runner.execute(step_config)
