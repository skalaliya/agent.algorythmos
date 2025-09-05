#!/bin/bash

# Start Python services for Relay Clone
echo "🚀 Starting Relay Clone with Python backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp env.python.example .env
    echo "📝 Please edit .env file with your API keys and configuration"
    echo "   Required: OPENAI_API_KEY, ANTHROPIC_API_KEY, SMTP_* variables"
    exit 1
fi

# Create database migration if needed
echo "🗄️  Setting up database..."
cd apps/api-python
if [ ! -d "alembic/versions" ] || [ -z "$(ls -A alembic/versions)" ]; then
    echo "📋 Creating initial database migration..."
    alembic revision --autogenerate -m "Initial migration"
fi

echo "🔄 Applying database migrations..."
alembic upgrade head
cd ../..

# Start services
echo "🐳 Starting Docker services..."
docker-compose up -d db redis

# Wait for services to be ready
echo "⏳ Waiting for database and Redis to be ready..."
sleep 10

# Start Python services
echo "🐍 Starting Python API..."
docker-compose up -d api-python

echo "⚙️  Starting Celery worker..."
docker-compose up -d worker-python

echo "⏰ Starting Celery beat scheduler..."
docker-compose up -d celery-beat

echo "🌐 Starting web frontend..."
docker-compose up -d web

echo "✅ All services started!"
echo ""
echo "📊 Service URLs:"
echo "   Frontend: http://localhost:3000"
echo "   API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "   MailHog: http://localhost:8025"
echo ""
echo "📝 To view logs:"
echo "   docker-compose logs -f api-python"
echo "   docker-compose logs -f worker-python"
echo "   docker-compose logs -f web"
echo ""
echo "🛑 To stop all services:"
echo "   docker-compose down"
