from celery_app import app
from ..runners.connector_runner import ConnectorRunner

@app.task
def execute_connector_step(step_config: dict):
    """Execute a connector step"""
    runner = ConnectorRunner()
    return runner.execute(step_config)
