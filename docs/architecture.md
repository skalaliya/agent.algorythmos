# Relay Clone - Architecture Documentation

## Overview

Relay Clone is a monorepo implementing a Relay.app-style automation MVP with workflow building, scheduling, execution, and monitoring capabilities.

## System Architecture

### High-Level Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App      │    │   API Server    │    │   Worker       │
│   (Next.js)    │◄──►│   (Fastify)     │◄──►│   (BullMQ)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   PostgreSQL    │    │     Redis       │
                       │   (Prisma)      │    │   (BullMQ)      │
                       └─────────────────┘    └─────────────────┘
```

### Service Responsibilities

#### Web App (`apps/web`)
- **Workflow Builder**: React Flow-based visual workflow editor
- **Run Monitoring**: Real-time execution timeline and step inspection
- **Dashboard**: Workflow management and analytics

#### API Server (`apps/api`)
- **REST API**: Workflow CRUD, run management, connector endpoints
- **Database Layer**: Prisma ORM with PostgreSQL
- **Authentication**: User management (basic implementation)
- **Validation**: Zod schema validation

#### Worker (`apps/worker`)
- **Job Processing**: BullMQ-based workflow execution
- **Step Runners**: AI, email, LinkedIn, table, loop, log processors
- **Scheduling**: Cron-based workflow triggers

## Data Models

### Core Entities

#### Workflow
```typescript
{
  id: string
  name: string
  definition: JSON // Workflow DSL
  schedule?: string // Cron expression
  timezone: string
  createdAt: DateTime
}
```

#### Run
```typescript
{
  id: string
  workflowId: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  startedAt: DateTime
  finishedAt?: DateTime
  aiCredits: number
}
```

#### RunStep
```typescript
{
  id: string
  runId: string
  parentStepId?: string // For loop iterations
  index: number
  name: string
  type: string
  input: JSON
  output: JSON
  status: string
  aiCredits: number
}
```

## Workflow DSL

### Step Types

#### AI Steps
```json
{
  "type": "ai",
  "provider": "openai|anthropic|perplexity",
  "model": "gpt-4|claude-3-5-sonnet|sonar-reasoning-pro",
  "prompt": "Template with {{variables}}"
}
```

#### Loop Steps
```json
{
  "type": "loop",
  "items": "s1.rows",
  "children": [
    // Nested steps to execute for each item
  ]
}
```

#### Connector Steps
```json
{
  "type": "linkedin.searchPosts",
  "query": "{{item.topic}}",
  "limit": 10
}
```

### Template Variables

- **Step References**: `{{s1.output}}` - Output from step s1
- **Loop Context**: `{{item.topic}}` - Current item in loop
- **Wildcards**: `{{s2.*}}` - All outputs from step s2

## Execution Engine

### Workflow Runner

1. **Parse Definition**: Load workflow DSL and validate
2. **Create Run Record**: Initialize database entry
3. **Execute Steps**: Process each step sequentially
4. **Handle Loops**: Spawn child steps for iterations
5. **Update Status**: Track progress and results
6. **Calculate Credits**: Sum AI usage across steps

### Step Execution

```typescript
interface StepRunner {
  execute(step: WorkflowStep, context: Record<string, any>): Promise<{
    output: any
    credits: number
  }>
}
```

### Context Management

- **Global Context**: Shared across all steps
- **Step Outputs**: Stored as `{ stepId: output }`
- **Loop Context**: Enhanced with `item` and `index`

## Scheduling System

### Cron Patterns

- **FIRST_WED_08_CET**: First Wednesday of each month at 08:00 CET
- **Custom Patterns**: Standard cron expressions supported

### Trigger Service

- **Registration**: Parse schedule and create BullMQ repeatable jobs
- **Execution**: Enqueue workflow runs on schedule
- **Management**: Enable/disable schedules dynamically

## AI Provider System

### Provider Registry

```typescript
class AIService {
  private providers: Map<string, AIProvider>
  
  async generateResponse(provider: string, model: string, prompt: string)
  estimateCredits(provider: string, model: string, prompt: string)
}
```

### Credit Estimation

- **API Usage**: Use actual token counts when available
- **Fallback**: Estimate based on prompt length and model rates
- **Rates**: Configurable per-provider, per-model pricing

### Mock Mode

- **Deterministic**: Same input produces same output
- **Realistic**: Responses mimic actual AI behavior
- **Development**: Enables testing without API keys

## Connector System

### LinkedIn Connector

- **Search Posts**: Query-based post retrieval
- **Mock Data**: Deterministic fixture responses
- **Fields**: activityId, content, reactions, comments, date, author, URLs

### Email Connector

- **SMTP Support**: Configurable mail servers
- **Template Resolution**: Variable substitution in content
- **Fallback**: Mailhog for local development

## Queue System

### BullMQ Integration

- **Workflow Queue**: Execute workflow runs
- **Trigger Queue**: Handle scheduled workflows
- **Redis Backend**: Persistent job storage
- **Concurrency Control**: Configurable worker processes

### Job Types

```typescript
// Workflow execution
{
  name: 'execute-workflow',
  data: { runId, workflowId, definition }
}

// Scheduled trigger
{
  name: 'workflow:${workflowId}',
  data: { workflowId, type: 'scheduled' },
  repeat: { pattern: cronExpression }
}
```

## Security & Validation

### Input Validation

- **Zod Schemas**: Type-safe request validation
- **Template Injection**: Safe variable resolution
- **SQL Injection**: Prisma ORM protection

### API Security

- **CORS**: Configurable cross-origin policies
- **Rate Limiting**: Basic request throttling
- **Error Handling**: Sanitized error responses

## Development Workflow

### Local Setup

1. **Docker Compose**: Start infrastructure services
2. **Database**: Run Prisma migrations
3. **Seed Data**: Execute seed script
4. **Development**: Hot-reload all services

### Testing Strategy

- **Unit Tests**: Individual service testing
- **Integration Tests**: API endpoint validation
- **E2E Tests**: Workflow execution flows
- **Mock Services**: AI and connector stubs

## Deployment Considerations

### Environment Variables

- **Database**: PostgreSQL connection string
- **Redis**: Queue backend configuration
- **AI Keys**: Provider API credentials
- **SMTP**: Email server settings

### Scaling

- **Horizontal**: Multiple worker instances
- **Vertical**: Resource allocation per service
- **Database**: Connection pooling and indexing
- **Caching**: Redis-based result caching

## Future Enhancements

### Planned Features

- **Human Approval**: Pause/resume workflow execution
- **Real Connectors**: Replace LinkedIn stub with actual API
- **Advanced Scheduling**: Complex recurrence patterns
- **Monitoring**: Prometheus metrics and Grafana dashboards
- **Webhooks**: External system integration

### Architecture Improvements

- **Event Sourcing**: CQRS pattern for audit trails
- **Microservices**: Service decomposition
- **Message Queues**: Event-driven architecture
- **API Gateway**: Centralized routing and auth
