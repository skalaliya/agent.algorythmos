#!/bin/bash

# Kubernetes deployment script for Relay Clone
set -e

echo "🚀 Deploying Relay Clone to Kubernetes..."

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
kubectl create namespace relay-clone --dry-run=client -o yaml | kubectl apply -f -

# Build and push Docker images (if not using external registry)
echo "🐳 Building Docker images..."
docker build -t relay-clone-api:latest ./apps/api-python/
docker build -t relay-clone-worker:latest ./apps/worker-python/
docker build -t relay-clone-web:latest ./apps/web/

# Load images into kind/minikube if using local cluster
if kubectl config current-context | grep -q "kind\|minikube"; then
    echo "📦 Loading images into local cluster..."
    kind load docker-image relay-clone-api:latest --name kind 2>/dev/null || true
    kind load docker-image relay-clone-worker:latest --name kind 2>/dev/null || true
    kind load docker-image relay-clone-web:latest --name kind 2>/dev/null || true
fi

# Deploy using Helm
echo "📦 Deploying with Helm..."
helm upgrade --install relay-clone ./k8s/helm/relay-clone \
    --namespace relay-clone \
    --create-namespace \
    --wait \
    --timeout=10m

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/api-python -n relay-clone
kubectl wait --for=condition=available --timeout=300s deployment/worker-python -n relay-clone
kubectl wait --for=condition=available --timeout=300s deployment/web -n relay-clone

# Show status
echo "📊 Deployment Status:"
kubectl get pods -n relay-clone
kubectl get services -n relay-clone

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Access URLs:"
echo "   Local: http://localhost:3000 (port-forward)"
echo "   Ingress: http://relay-clone.local (if ingress is configured)"
echo ""
echo "🔧 Useful commands:"
echo "   kubectl port-forward -n relay-clone svc/web-service 3000:3000"
echo "   kubectl port-forward -n relay-clone svc/api-python-service 8000:8000"
echo "   kubectl logs -n relay-clone -l app=api-python -f"
echo "   kubectl logs -n relay-clone -l app=worker-python -f"
echo ""
echo "🛑 To delete deployment:"
echo "   helm uninstall relay-clone -n relay-clone"
