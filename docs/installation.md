# Installation Guide

This guide will help you install and set up Relay Clone on your local machine or server.

## 📋 Prerequisites

### System Requirements

- **Operating System**: macOS 10.15+, Ubuntu 18.04+, Windows 10+
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 10GB free space
- **Network**: Internet connection for API calls

### Required Software

- **Docker**: 20.10+ and Docker Compose 2.0+
- **Node.js**: 18.0+ (for local development)
- **Python**: 3.11+ (for local development)
- **Git**: Latest version

## 🐳 Docker Installation (Recommended)

### 1. Install Docker

#### macOS
```bash
# Using Homebrew
brew install --cask docker

# Or download from Docker Desktop website
open https://www.docker.com/products/docker-desktop/
```

#### Ubuntu/Debian
```bash
# Update package index
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
```

#### Windows
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Install and restart your computer
3. Enable WSL 2 integration if using Windows 11

### 2. Clone Repository
```bash
git clone https://github.com/your-username/Agent.algorythmos.git
cd Agent.algorythmos
```

### 3. Environment Setup
```bash
# Copy environment template
cp env.python.example .env

# Edit .env file with your configuration
nano .env  # or use your preferred editor
```

### 4. Start Services
```bash
# Quick start
./start-python.sh

# Or manually
docker-compose up -d
```

## 🛠️ Local Development Installation

### 1. Install Node.js

#### macOS
```bash
# Using Homebrew
brew install node

# Or using nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Ubuntu/Debian
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Windows
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the instructions

### 2. Install Python

#### macOS
```bash
# Using Homebrew
brew install python@3.11

# Or using pyenv
brew install pyenv
pyenv install 3.11.0
pyenv global 3.11.0
```

#### Ubuntu/Debian
```bash
# Install Python 3.11
sudo apt-get update
sudo apt-get install python3.11 python3.11-pip python3.11-venv
```

#### Windows
1. Download Python from [python.org](https://www.python.org/downloads/)
2. Run the installer with "Add Python to PATH" checked

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd apps/web
npm install
cd ../..

# Install Python dependencies
cd apps/api-python
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..

cd apps/worker-python
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

### 4. Database Setup

```bash
# Start PostgreSQL and Redis
docker-compose up -d db redis

# Run database migrations
cd apps/api-python
source venv/bin/activate
alembic upgrade head
cd ../..
```

### 5. Start Development Servers

```bash
# Terminal 1: Start API
cd apps/api-python
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Start Worker
cd apps/worker-python
source venv/bin/activate
celery -A celery_app worker --loglevel=info

# Terminal 3: Start Frontend
cd apps/web
npm run dev
```

## ☸️ Kubernetes Installation

### Prerequisites
- Kubernetes cluster (local or cloud)
- kubectl configured
- Helm 3.0+

### 1. Local Kubernetes (Kind)

```bash
# Install Kind
# macOS
brew install kind

# Ubuntu/Debian
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Create cluster
./k8s/kind-setup.sh
```

### 2. Deploy Application

```bash
# Deploy with Helm
./k8s/deploy.sh

# Or manually
kubectl apply -f k8s/manifests/
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/relayclone

# Redis
REDIS_URL=redis://localhost:6379/0

# AI Services
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=your_email@gmail.com

# LinkedIn Integration
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
```

### API Keys Setup

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

#### Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

#### Email Configuration
1. **Gmail**: Enable 2-factor authentication and create an app password
2. **Other Providers**: Use your SMTP credentials

## ✅ Verification

### 1. Check Services

```bash
# Docker Compose
docker-compose ps

# Kubernetes
kubectl get pods -n relay-clone
```

### 2. Test API

```bash
# Health check
curl http://localhost:8000/health

# API documentation
open http://localhost:8000/docs
```

### 3. Test Frontend

```bash
# Open in browser
open http://localhost:3000
```

## 🔍 Troubleshooting

### Common Issues

#### Docker Issues
```bash
# Check Docker status
docker --version
docker-compose --version

# Restart Docker
# macOS: Restart Docker Desktop
# Linux: sudo systemctl restart docker
```

#### Port Conflicts
```bash
# Check if ports are in use
lsof -i :3000  # Frontend
lsof -i :8000  # API
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Kill processes if needed
kill -9 <PID>
```

#### Database Connection Issues
```bash
# Check PostgreSQL
docker-compose logs db

# Test connection
docker-compose exec db psql -U postgres -d relayclone -c "SELECT 1;"
```

#### API Key Issues
```bash
# Verify environment variables
docker-compose exec api-python env | grep API_KEY

# Check API key format
echo $OPENAI_API_KEY | wc -c  # Should be around 50 characters
```

### Getting Help

1. **Check Logs**: `docker-compose logs <service-name>`
2. **GitHub Issues**: [Report problems](https://github.com/your-username/Agent.algorythmos/issues)
3. **Documentation**: [Full docs](docs/)
4. **Community**: [Discord/Slack](https://discord.gg/your-server)

## 🎉 Next Steps

After successful installation:

1. **Read the Tutorial**: [First Workflow](tutorials/first-workflow.md)
2. **Explore Templates**: Check out the template gallery
3. **Build Your First Workflow**: Create a simple automation
4. **Join the Community**: Connect with other users

## 📚 Additional Resources

- [Configuration Guide](configuration.md)
- [API Reference](../apps/api-python/README.md)
- [Development Setup](../CONTRIBUTING.md)
- [Deployment Guide](deployment/docker-compose.md)
