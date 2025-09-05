# Relay Clone 🚀

A Relay.app-style automation MVP built with modern web technologies. Create, schedule, and monitor AI-powered workflows with a visual builder interface.

## ✨ Features

- **🎨 Visual Workflow Builder**: Drag-and-drop interface using React Flow
- **⏰ Scheduled Triggers**: Cron-based automation (e.g., "FIRST_WED_08_CET")
- **🔄 Loop Operations**: Iterate over data with nested step execution
- **🤖 AI Integration**: Multi-provider support (OpenAI, Anthropic, Perplexity)
- **💼 LinkedIn Connector**: Search and analyze LinkedIn posts (stub implementation)
- **📧 Email Automation**: SMTP-based email sending with template support
- **📊 Run History**: Complete execution timeline with step-by-step inspection
- **💳 AI Credit Tracking**: Per-step and per-run usage estimation
- **🐳 Docker Ready**: Complete containerized development environment

## 🏗️ Architecture

```
relay-clone/
├─ apps/
│  ├─ web/          # Next.js + React Flow frontend
│  ├─ api/          # Fastify + Prisma backend
│  └─ worker/       # BullMQ job processor
├─ packages/
│  └─ fixtures/     # Sample data and fixtures
└─ docs/            # Architecture and examples
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm

### 1. Clone and Setup

```bash
git clone <repository-url>
cd relay-clone
npm install
```

### 2. Environment Configuration

The root `.env` file contains all necessary configuration:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/relayclone
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USER=
MAIL_PASS=
MAIL_FROM="Relay Clone <noreply@local.dev>"
DEFAULT_TZ=Europe/Paris
```

## 📋 **Runbook - Local Development**

### Start Infrastructure

```bash
# Start PostgreSQL, Redis, and Mailhog
docker compose up -d db redis mailhog
```

### Migrate Database

```bash
# Generate Prisma client and run migrations
cd apps/api
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/relayclone"
npm run prisma:generate
npm run prisma:migrate

# Seed with demo data
cd ../../
npm run seed
```

### Start Services (3 separate terminals)

**Terminal 1 - API:**
```bash
cd apps/api
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/relayclone"
npm run dev
# Expected: listening on 0.0.0.0:8080
```

**Terminal 2 - Worker:**
```bash
cd apps/worker
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/relayclone"
npm run dev
# Expected: "Stub worker polling every 3s…"
```

**Terminal 3 - Web:**
```bash
cd apps/web
npm run dev
# Expected: Next.js on http://localhost:3000
```

### Create a Run (Smoke Test)

```bash
# Health check
curl -s http://localhost:8080/health

# List workflows
curl -s http://localhost:8080/workflows | jq

# Create a new run
curl -s -X POST http://localhost:8080/runs \
  -H 'content-type: application/json' \
  -d '{"workflowId":"demo-workflow-id","startedBy":"local"}' | jq

# Wait 3-6 seconds, then check run status
curl -s http://localhost:8080/runs/<RUN_ID> | jq
# Expected: status "completed", steps array, aiCredits > 0
```

### Where to Check

- **Web UI**: http://localhost:3000 (Runs list and Run detail)
- **Mailhog**: http://localhost:8025 (Email testing interface)
- **API Health**: http://localhost:8080/health
- **Database**: `npm run db:studio` (Prisma Studio)

### 2. Environment Configuration

Copy the environment template and configure your settings:

```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/relayclone
REDIS_URL=redis://redis:6379
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_FROM="Relay Clone <noreply@local.dev>"
DEFAULT_TZ=Europe/Paris
```

### 3. Start Infrastructure

```bash
docker compose up -d db redis mailhog
```

### 4. Database Setup

```bash
pnpm db:generate
pnpm db:migrate
pnpm seed
```

### 5. Start Development

```bash
pnpm dev
```

This will start all services:
- **Web App**: http://localhost:3000
- **API Server**: http://localhost:8080
- **Mailhog**: http://localhost:8025
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 📖 Usage

### Creating a Workflow

1. Navigate to the web interface at http://localhost:3000
2. Click "Create Workflow"
3. Use the visual builder to add steps:
   - **Table**: Define data sources
   - **AI**: Configure AI agents with prompts
   - **LinkedIn**: Search for posts
   - **Loop**: Iterate over data
   - **Email**: Send notifications

### Sample Workflow

The seed script creates a "LinkedIn Post Analyzer" workflow that:
1. Creates a table with topics to analyze
2. Loops through each topic
3. Researches using AI (Perplexity Sonar)
4. Fetches LinkedIn posts
5. Synthesizes insights with AI (OpenAI o3)
6. Generates a final report with Claude
7. Sends results via email

### Running Workflows

- **Manual**: Click "Run Now" on any workflow
- **Scheduled**: Set up cron patterns for automatic execution
- **API**: Use `POST /runs` endpoint with workflow ID

## 🔧 Development

### Project Structure

```
apps/
├─ web/                    # Frontend application
│  ├─ src/pages/          # Next.js pages
│  ├─ src/components/     # React components
│  └─ src/types/          # TypeScript definitions
├─ api/                    # Backend API
│  ├─ src/routes/         # API endpoints
│  ├─ src/services/       # Business logic
│  └─ prisma/             # Database schema
└─ worker/                 # Job processor
    ├─ src/runners/        # Step execution logic
    └─ src/schedulers/     # Cron job management
```

### Key Commands

```bash
# Development
pnpm dev                    # Start all services
pnpm build                  # Build all packages

# Database
pnpm db:generate           # Generate Prisma client
pnpm db:migrate            # Run database migrations
pnpm db:studio             # Open Prisma Studio

# Seeding
pnpm seed                  # Create demo data
```

### Adding New Step Types

1. **Create Runner**: Implement in `apps/worker/src/runners/`
2. **Add to WorkflowRunner**: Register in `executeStep` method
3. **Update Types**: Add to workflow DSL schema
4. **Create UI Component**: Add to React Flow node types

### AI Provider Integration

1. **Implement Provider**: Extend `AIProvider` interface
2. **Add to Registry**: Register in `AIService.initializeProviders()`
3. **Configure Rates**: Add pricing to `getBaseRate()` method
4. **Handle Mock Mode**: Implement fallback for missing API keys

## 🧪 Testing

### Manual Testing

1. **Workflow Creation**: Build and save workflows
2. **Execution**: Run workflows and verify step outputs
3. **Scheduling**: Test cron-based triggers
4. **Error Handling**: Introduce failures and verify recovery

### API Testing

```bash
# Test workflow creation
curl -X POST http://localhost:8080/workflows \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","definition":{"steps":[]}}'

# Test workflow execution
curl -X POST http://localhost:8080/runs \
  -H "Content-Type: application/json" \
  -d '{"workflowId":"workflow_id_here"}'
```

## 📚 API Reference

### Core Endpoints

- `GET /workflows` - List all workflows
- `POST /workflows` - Create new workflow
- `GET /workflows/:id` - Get workflow details
- `PUT /workflows/:id` - Update workflow
- `POST /runs` - Start workflow execution
- `GET /runs/:id` - Get run details
- `GET /steps/run/:runId` - Get run steps

### Connector Endpoints

- `POST /connectors/linkedin/searchPosts` - Search LinkedIn posts
- `POST /email/send` - Send emails
- `GET /schedule/workflow/:id/next-run` - Get next scheduled run

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check if PostgreSQL is running
docker compose ps db

# Verify connection string in .env
DATABASE_URL=postgresql://postgres:postgres@db:5432/relayclone
```

**Redis Connection Failed**
```bash
# Check Redis status
docker compose ps redis

# Verify Redis URL
REDIS_URL=redis://redis:6379
```

**Workflow Execution Hangs**
```bash
# Check worker logs
docker compose logs worker

# Verify job queues
docker exec -it relay-clone-redis-1 redis-cli
> KEYS *bullmq*
```

**Email Not Sending**
```bash
# Check Mailhog interface
open http://localhost:8025

# Verify SMTP settings in .env
MAIL_HOST=mailhog
MAIL_PORT=1025
```

### Debug Mode

Enable verbose logging by setting environment variables:
```env
DEBUG=*
LOG_LEVEL=debug
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Implement** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Development Guidelines

- **TypeScript**: Use strict mode and proper typing
- **Error Handling**: Implement comprehensive error handling
- **Testing**: Add tests for new functionality
- **Documentation**: Update docs for API changes
- **Code Style**: Follow existing patterns and conventions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Relay.app** for inspiration and workflow concepts
- **React Flow** for the visual workflow builder
- **BullMQ** for robust job queue management
- **Prisma** for type-safe database operations

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Basic workflow builder
- ✅ Step execution engine
- ✅ AI provider integration
- ✅ Email and LinkedIn connectors
- ✅ Scheduling system

### Phase 2 (Next)
- 🔄 Human approval steps
- 🔄 Real LinkedIn API integration
- 🔄 Advanced scheduling patterns
- 🔄 Webhook support
- 🔄 Monitoring dashboard

### Phase 3 (Future)
- 🔮 Multi-tenant support
- 🔮 Advanced analytics
- 🔮 Plugin system
- 🔮 Mobile app
- 🔮 Enterprise features

---

**Built with ❤️ using modern web technologies**
# Force new deployment
