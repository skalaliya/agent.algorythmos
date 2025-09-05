# Python Migration Guide

This document outlines the migration from Node.js/TypeScript to Python for the backend and worker services.

## Overview

The project has been updated to use Python instead of Node.js for:
- **Backend API**: FastAPI + SQLAlchemy + PostgreSQL
- **Worker**: Celery + Redis for background job processing

## New Architecture

### Backend (FastAPI)
- **Location**: `apps/api-python/`
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL
- **Migrations**: Alembic
- **Port**: 8000

### Worker (Celery)
- **Location**: `apps/worker-python/`
- **Framework**: Celery
- **Broker**: Redis
- **Scheduler**: Celery Beat
- **Task Runners**: AI, Email, Connector runners

## Key Features

### FastAPI Backend
- RESTful API with automatic OpenAPI documentation
- SQLAlchemy models with proper relationships
- Pydantic schemas for request/response validation
- CORS middleware for frontend integration
- Health check endpoints

### Celery Worker
- Background task processing
- Retry logic with exponential backoff
- Scheduled tasks (cron jobs)
- Multiple task runners for different step types
- Database integration for tracking runs and steps

### Task Runners
1. **AI Runner**: OpenAI and Anthropic integration
2. **Email Runner**: SMTP email sending
3. **Connector Runner**: LinkedIn API and webhook integrations
4. **Workflow Runner**: Orchestrates step execution

## Setup Instructions

### 1. Environment Variables
Copy `env.python.example` to `.env` and configure:
```bash
cp env.python.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key
- `SMTP_*`: Email configuration
- `LINKEDIN_ACCESS_TOKEN`: LinkedIn API token

### 2. Database Setup
```bash
# Create initial migration
cd apps/api-python
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 3. Docker Services
```bash
# Start all services
docker-compose up -d

# Or start only Python services
docker-compose up -d db redis api-python worker-python celery-beat
```

### 4. Development
```bash
# Start API in development mode
cd apps/api-python
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Start Celery worker
cd apps/worker-python
celery -A celery_app worker --loglevel=info

# Start Celery beat (scheduler)
celery -A celery_app beat --loglevel=info
```

## API Endpoints

### Workflows
- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows/{id}` - Get workflow
- `PUT /api/workflows/{id}` - Update workflow
- `DELETE /api/workflows/{id}` - Delete workflow

### Runs
- `GET /api/runs` - List runs
- `POST /api/runs` - Create run
- `GET /api/runs/{id}` - Get run with steps
- `PUT /api/runs/{id}/status` - Update run status

### Steps
- `GET /api/steps` - List steps
- `POST /api/steps` - Create step
- `GET /api/steps/{id}` - Get step
- `PUT /api/steps/{id}` - Update step

### Connectors
- `POST /api/connectors/test` - Test connector
- `GET /api/connectors/types` - Get connector types

### Email
- `POST /api/email/send` - Send email
- `POST /api/email/test` - Test email config

## Database Schema

### Tables
- `users` - User accounts
- `workflows` - Workflow definitions
- `runs` - Workflow execution instances
- `run_steps` - Individual step executions

### Enums
- `RunStatus`: QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED
- `StepStatus`: PENDING, RUNNING, COMPLETED, FAILED, SKIPPED
- `StepType`: AI, EMAIL, LOOP, CONNECTOR

## Migration from Node.js

### What Changed
1. **Backend**: Fastify → FastAPI
2. **Worker**: BullMQ → Celery
3. **ORM**: Prisma → SQLAlchemy
4. **Language**: TypeScript → Python
5. **Port**: 8080 → 8000

### What Stayed the Same
1. **Frontend**: Next.js (unchanged)
2. **Database**: PostgreSQL
3. **Queue**: Redis
4. **API Structure**: Similar endpoints and data flow

## Benefits of Python Migration

1. **Better AI Integration**: Native support for OpenAI and Anthropic
2. **Rich Ecosystem**: Extensive libraries for data processing
3. **Simpler Deployment**: Fewer dependencies and configuration
4. **Better Error Handling**: More robust exception handling
5. **Easier Testing**: Python's testing ecosystem
6. **Performance**: Better for CPU-intensive tasks

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure PostgreSQL is running and accessible
2. **Redis Connection**: Check Redis server status
3. **API Keys**: Verify all required API keys are set
4. **Port Conflicts**: Ensure ports 8000, 5432, 6379 are available

### Logs
```bash
# View API logs
docker-compose logs api-python

# View worker logs
docker-compose logs worker-python

# View all logs
docker-compose logs
```

## Next Steps

1. Update frontend API calls to use port 8000
2. Test all workflow functionality
3. Set up production deployment
4. Configure monitoring and logging
5. Add comprehensive tests
