# Kubernetes Deployment Guide

This guide covers deploying Algorythmos AI Agents to Kubernetes, providing better scalability, high availability, and production-ready features compared to Docker Compose.

## 🏗️ Architecture Overview

### Kubernetes Components

- **Namespace**: `algorythmos-ai-agents` - Isolates all resources
- **ConfigMaps**: Configuration data (non-sensitive)
- **Secrets**: Sensitive data (API keys, passwords)
- **Deployments**: Application replicas with auto-scaling
- **Services**: Internal networking and load balancing
- **Ingress**: External access and SSL termination
- **PersistentVolumes**: Data persistence for PostgreSQL and Redis

### Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Ingress       │    │   Web (Next.js) │    │  API (FastAPI)  │
│   (NGINX)       │────│   (2 replicas)  │────│  (2 replicas)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐              │
                       │  Worker (Celery)│              │
                       │  (2 replicas)   │              │
                       └─────────────────┘              │
                                                        │
┌─────────────────┐    ┌─────────────────┐              │
│   PostgreSQL    │    │     Redis       │◄─────────────┘
│   (1 replica)   │    │   (1 replica)   │
└─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **kubectl**: Kubernetes command-line tool
- **Helm**: Package manager for Kubernetes
- **Docker**: For building images
- **Kind** (optional): For local development

### 1. Local Development Setup

```bash
# Setup local Kubernetes cluster with Kind
./k8s/kind-setup.sh

# Deploy the application
./k8s/deploy.sh
```

### 2. Production Deployment

```bash
# Configure your production cluster
kubectl config use-context your-production-cluster

# Deploy with Helm
helm upgrade --install algorythmos-ai-agents ./k8s/helm/algorythmos-ai-agents \
    --namespace algorythmos-ai-agents \
    --create-namespace \
    --set secrets.openaiApiKey="your-key" \
    --set secrets.anthropicApiKey="your-key" \
    --set secrets.smtpUsername="your-email" \
    --set secrets.smtpPassword="your-password"
```

## 📋 Manual Deployment Steps

### 1. Create Namespace

```bash
kubectl create namespace algorythmos-ai-agents
```

### 2. Apply ConfigMaps and Secrets

```bash
# Update secrets.yaml with your actual values (base64 encoded)
kubectl apply -f k8s/manifests/secrets.yaml
kubectl apply -f k8s/manifests/configmap.yaml
```

### 3. Deploy Infrastructure

```bash
# Deploy PostgreSQL and Redis
kubectl apply -f k8s/manifests/postgres.yaml
kubectl apply -f k8s/manifests/redis.yaml

# Wait for them to be ready
kubectl wait --for=condition=available --timeout=300s deployment/postgres -n algorythmos-ai-agents
kubectl wait --for=condition=available --timeout=300s deployment/redis -n algorythmos-ai-agents
```

### 4. Deploy Applications

```bash
# Deploy API, Worker, and Web
kubectl apply -f k8s/manifests/api-python.yaml
kubectl apply -f k8s/manifests/worker-python.yaml
kubectl apply -f k8s/manifests/web.yaml

# Wait for deployments
kubectl wait --for=condition=available --timeout=300s deployment/api-python -n algorythmos-ai-agents
kubectl wait --for=condition=available --timeout=300s deployment/worker-python -n algorythmos-ai-agents
kubectl wait --for=condition=available --timeout=300s deployment/web -n algorythmos-ai-agents
```

### 5. Configure Ingress

```bash
# Deploy ingress (requires ingress controller)
kubectl apply -f k8s/manifests/ingress.yaml
```

## 🔧 Configuration

### Environment Variables

The application uses ConfigMaps for non-sensitive configuration and Secrets for sensitive data.

#### ConfigMap Values
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `API_HOST/PORT`: API server configuration
- `SMTP_SERVER/PORT`: Email server settings

#### Secret Values
- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key
- `SMTP_USERNAME/PASSWORD`: Email credentials
- `LINKEDIN_ACCESS_TOKEN`: LinkedIn API token
- `POSTGRES_PASSWORD`: Database password

### Scaling Configuration

```yaml
# In values.yaml or via Helm
api:
  replicas: 3  # Scale API instances

worker:
  replicas: 5  # Scale worker instances

web:
  replicas: 2  # Scale web instances
```

### Resource Limits

Each service has configurable resource requests and limits:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

## 🌐 Access Methods

### 1. Port Forwarding (Development)

```bash
# Access web interface
kubectl port-forward -n algorythmos-ai-agents svc/web-service 3000:3000

# Access API directly
kubectl port-forward -n algorythmos-ai-agents svc/api-python-service 8000:8000

# Access API documentation
kubectl port-forward -n algorythmos-ai-agents svc/api-python-service 8000:8000
# Then visit: http://localhost:8000/docs
```

### 2. Ingress (Production)

With ingress configured, access via:
- Web: `http://algorythmos-ai-agents.local`
- API: `http://api.algorythmos-ai-agents.local`
- API Docs: `http://api.algorythmos-ai-agents.local/docs`

### 3. LoadBalancer Service

```bash
# Expose API via LoadBalancer
kubectl expose deployment api-python -n algorythmos-ai-agents --type=LoadBalancer --port=8000
```

## 📊 Monitoring and Logs

### View Logs

```bash
# API logs
kubectl logs -n algorythmos-ai-agents -l app=api-python -f

# Worker logs
kubectl logs -n algorythmos-ai-agents -l app=worker-python -f

# Web logs
kubectl logs -n algorythmos-ai-agents -l app=web -f

# All logs
kubectl logs -n algorythmos-ai-agents --all-containers=true -f
```

### Monitor Resources

```bash
# Pod status
kubectl get pods -n algorythmos-ai-agents

# Service status
kubectl get services -n algorythmos-ai-agents

# Resource usage
kubectl top pods -n algorythmos-ai-agents
kubectl top nodes
```

### Health Checks

```bash
# Check API health
kubectl exec -n algorythmos-ai-agents deployment/api-python -- curl http://localhost:8000/health

# Check database connectivity
kubectl exec -n algorythmos-ai-agents deployment/postgres -- pg_isready -U postgres
```

## 🔄 Updates and Rollbacks

### Update Deployment

```bash
# Update with new image
kubectl set image deployment/api-python api-python=algorythmos-ai-agents-api:v2.0 -n algorythmos-ai-agents

# Or using Helm
helm upgrade algorythmos-ai-agents ./k8s/helm/algorythmos-ai-agents -n algorythmos-ai-agents
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/api-python -n algorythmos-ai-agents

# Or using Helm
helm rollback algorythmos-ai-agents 1 -n algorythmos-ai-agents
```

## 🛡️ Security Considerations

### 1. Secrets Management

- Use external secret management (e.g., AWS Secrets Manager, HashiCorp Vault)
- Rotate secrets regularly
- Use least-privilege access

### 2. Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: algorythmos-ai-agents-netpol
  namespace: algorythmos-ai-agents
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: algorythmos-ai-agents
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: algorythmos-ai-agents
```

### 3. RBAC

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: algorythmos-ai-agents
  name: algorythmos-ai-agents-role
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps", "secrets"]
  verbs: ["get", "list", "watch"]
```

## 🚨 Troubleshooting

### Common Issues

1. **Pod CrashLoopBackOff**
   ```bash
   kubectl describe pod <pod-name> -n algorythmos-ai-agents
   kubectl logs <pod-name> -n algorythmos-ai-agents --previous
   ```

2. **Service Not Accessible**
   ```bash
   kubectl get endpoints -n algorythmos-ai-agents
   kubectl describe service <service-name> -n algorythmos-ai-agents
   ```

3. **Database Connection Issues**
   ```bash
   kubectl exec -n algorythmos-ai-agents deployment/postgres -- psql -U postgres -d algorythmos -c "SELECT 1;"
   ```

4. **Redis Connection Issues**
   ```bash
   kubectl exec -n algorythmos-ai-agents deployment/redis -- redis-cli ping
   ```

### Debug Commands

```bash
# Get all resources
kubectl get all -n algorythmos-ai-agents

# Describe problematic resource
kubectl describe <resource-type> <resource-name> -n algorythmos-ai-agents

# Check events
kubectl get events -n algorythmos-ai-agents --sort-by='.lastTimestamp'

# Access pod shell
kubectl exec -it <pod-name> -n algorythmos-ai-agents -- /bin/bash
```

## 🧹 Cleanup

### Remove Deployment

```bash
# Using Helm
helm uninstall algorythmos-ai-agents -n algorythmos-ai-agents

# Using kubectl
kubectl delete namespace algorythmos-ai-agents

# Remove Kind cluster
kind delete cluster --name algorythmos-ai-agents
```

## 📈 Production Recommendations

1. **Use External Databases**: Consider managed PostgreSQL and Redis services
2. **Implement Monitoring**: Use Prometheus and Grafana
3. **Set up Logging**: Use ELK stack or similar
4. **Configure Backup**: Regular database backups
5. **Use TLS**: Enable SSL/TLS for all communications
6. **Implement CI/CD**: Automated deployment pipelines
7. **Resource Quotas**: Set namespace resource limits
8. **Pod Disruption Budgets**: Ensure high availability

## 🔗 Useful Links

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [Kind Documentation](https://kind.sigs.k8s.io/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
