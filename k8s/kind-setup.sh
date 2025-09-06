#!/bin/bash

# Setup script for local Kubernetes development with Kind
set -e

echo "🔧 Setting up local Kubernetes cluster with Kind..."

# Check if kind is installed
if ! command -v kind &> /dev/null; then
    echo "❌ kind is not installed. Installing kind..."
    
    # Detect OS and install kind
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install kind
        else
            echo "Please install Homebrew first, then run: brew install kind"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
        chmod +x ./kind
        sudo mv ./kind /usr/local/bin/kind
    else
        echo "❌ Unsupported OS. Please install kind manually."
        exit 1
    fi
fi

# Create kind cluster
echo "🏗️  Creating Kind cluster..."
kind create cluster --name algorythmos-ai-agents --config - <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
  - containerPort: 3000
    hostPort: 3000
    protocol: TCP
  - containerPort: 8000
    hostPort: 8000
    protocol: TCP
- role: worker
- role: worker
EOF

# Install NGINX Ingress Controller
echo "🌐 Installing NGINX Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# Wait for ingress controller to be ready
echo "⏳ Waiting for ingress controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

# Install Helm if not present
if ! command -v helm &> /dev/null; then
    echo "📦 Installing Helm..."
    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
fi

# Add Helm repositories
echo "📚 Adding Helm repositories..."
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

echo "✅ Kind cluster setup completed!"
echo ""
echo "🔧 Cluster info:"
kubectl cluster-info --context kind-algorythmos-ai-agents
echo ""
echo "📊 Node status:"
kubectl get nodes
echo ""
echo "🌐 Ingress controller status:"
kubectl get pods -n ingress-nginx
echo ""
echo "🚀 Ready to deploy Algorythmos AI Agents!"
echo "   Run: ./k8s/deploy.sh"
echo ""
echo "🛑 To delete cluster:"
echo "   kind delete cluster --name algorythmos-ai-agents"
