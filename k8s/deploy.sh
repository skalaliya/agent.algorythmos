#!/bin/bash

# Kubernetes deployment script for Algorythmos AI Agents
set -e

echo "🚀 Deploying Algorythmos AI Agents to Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if helm is available
if ! command -v helm &> /dev/null; then
    echo "❌ helm is not installed. Please install helm first."
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

echo "✅ Kubernetes cluster is accessible"

# Create namespace if it doesn't exist
kubectl create namespace algorythmos-ai-agents --dry-run=client -o yaml | kubectl apply -f -

# Build and push Docker images (if not using external registry)
echo "🐳 Building Docker images..."
docker build -t algorythmos-ai-agents-api:latest ./apps/api-python/
docker build -t algorythmos-ai-agents-worker:latest ./apps/worker-python/
docker build -t algorythmos-ai-agents-web:latest ./apps/web/

# Load images into kind/minikube if using local cluster
if kubectl config current-context | grep -q "kind\|minikube"; then
    echo "📦 Loading images into local cluster..."
    kind load docker-image algorythmos-ai-agents-api:latest --name kind 2>/dev/null || true
    kind load docker-image algorythmos-ai-agents-worker:latest --name kind 2>/dev/null || true
    kind load docker-image algorythmos-ai-agents-web:latest --name kind 2>/dev/null || true
fi

# Deploy using Helm
echo "📦 Deploying with Helm..."
helm upgrade --install algorythmos-ai-agents ./k8s/helm/algorythmos-ai-agents \
    --namespace algorythmos-ai-agents \
    --create-namespace \
    --wait \
    --timeout=10m

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/api-python -n algorythmos-ai-agents
kubectl wait --for=condition=available --timeout=300s deployment/worker-python -n algorythmos-ai-agents
kubectl wait --for=condition=available --timeout=300s deployment/web -n algorythmos-ai-agents

# Show status
echo "📊 Deployment Status:"
kubectl get pods -n algorythmos-ai-agents
kubectl get services -n algorythmos-ai-agents

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Access URLs:"
echo "   Local: http://localhost:3000 (port-forward)"
echo "   Ingress: http://algorythmos-ai-agents.local (if ingress is configured)"
echo ""
echo "🔧 Useful commands:"
echo "   kubectl port-forward -n algorythmos-ai-agents svc/web-service 3000:3000"
echo "   kubectl port-forward -n algorythmos-ai-agents svc/api-python-service 8000:8000"
echo "   kubectl logs -n algorythmos-ai-agents -l app=api-python -f"
echo "   kubectl logs -n algorythmos-ai-agents -l app=worker-python -f"
echo ""
echo "🛑 To delete deployment:"
echo "   helm uninstall algorythmos-ai-agents -n algorythmos-ai-agents"
