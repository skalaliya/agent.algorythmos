import os
from celery import Celery
from celery.schedules import crontab
from dotenv import load_dotenv

load_dotenv()

# Redis configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Create Celery app
app = Celery(
    "relay_worker",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=[
        "app.tasks.workflow_tasks",
        "app.tasks.ai_tasks",
        "app.tasks.email_tasks",
        "app.tasks.connector_tasks"
    ]
)

# Celery configuration
app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Periodic tasks (cron jobs)
app.conf.beat_schedule = {
    "check-scheduled-workflows": {
        "task": "app.tasks.workflow_tasks.check_scheduled_workflows",
        "schedule": crontab(minute="*/5"),  # Every 5 minutes
    },
    "cleanup-old-runs": {
        "task": "app.tasks.workflow_tasks.cleanup_old_runs",
        "schedule": crontab(hour=2, minute=0),  # Daily at 2 AM
    },
}

if __name__ == "__main__":
    app.start()
