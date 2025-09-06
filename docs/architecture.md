# System Architecture

This document provides a comprehensive overview of Algorythmos AI Agents' system architecture, components, and data flow.

## 🏗️ High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Layer     │    │  Worker Layer   │
│   (Next.js)     │────│   (FastAPI)     │────│   (Celery)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Database      │    │   Queue/Cache   │
                       │  (PostgreSQL)   │    │    (Redis)      │
                       └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐              │
                       │ External APIs   │◄─────────────┘
                       │ (OpenAI, Email) │
                       └─────────────────┘
```

## 🧩 Component Overview

### Frontend (Next.js)
- **Location**: `apps/web/`
- **Purpose**: User interface and workflow building
- **Tech**: Next.js 14, TypeScript, Tailwind CSS

### Backend API (FastAPI)
- **Location**: `apps/api-python/`
- **Purpose**: RESTful API and business logic
- **Tech**: FastAPI, Python 3.11+, SQLAlchemy

### Worker System (Celery)
- **Location**: `apps/worker-python/`
- **Purpose**: Background task processing
- **Tech**: Celery, Redis, Python task runners

### Database (PostgreSQL)
- **Purpose**: Persistent data storage
- **Schema**: Users, Workflows, Runs, Run Steps

### Cache/Queue (Redis)
- **Purpose**: Task queue and caching
- **Usage**: Celery broker, session storage, API cache

## 🔄 Data Flow

1. **User** creates workflow in frontend
2. **Frontend** sends request to API
3. **API** saves workflow to database
4. **User** triggers workflow execution
5. **API** queues task in Redis
6. **Worker** processes task and executes steps
7. **Worker** updates database with results
8. **Frontend** displays real-time updates

## 🗄️ Database Schema

```sql
users (id, email, name, created_at, updated_at)
workflows (id, name, description, definition, user_id, is_active)
runs (id, workflow_id, status, started_at, completed_at, error_message)
run_steps (id, run_id, step_id, step_type, status, input_data, output_data)
```

## 🔧 API Endpoints

- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `GET /api/runs` - List runs
- `POST /api/runs` - Execute workflow
- `GET /api/steps` - List steps
- `POST /api/connectors/test` - Test connector

## 🔐 Security

- JWT-based authentication
- Input validation with Pydantic
- SQL injection prevention
- HTTPS/TLS encryption
- Rate limiting

## 📊 Performance

- API Response: < 100ms p95
- Workflow Execution: < 2 seconds average
- Concurrent Users: 1000+ simultaneous
- Database Queries: < 50ms p95

## 🚀 Scalability

- Horizontal pod autoscaling (Kubernetes)
- Queue-based worker scaling
- Database read replicas
- Redis clustering
- CDN for static assets