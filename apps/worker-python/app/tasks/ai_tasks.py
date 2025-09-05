from celery_app import app
from ..runners.ai_runner import AIRunner

@app.task
def execute_ai_step(step_config: dict):
    """Execute an AI step"""
    runner = AIRunner()
    return runner.execute(step_config)
