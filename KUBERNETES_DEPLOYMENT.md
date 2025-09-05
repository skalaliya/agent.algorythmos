# Kubernetes Deployment Guide

This guide covers deploying Relay Clone to Kubernetes, providing better scalability, high availability, and production-ready features compared to Docker Compose.

## 🏗️ Architecture Overview

### Kubernetes Components

- **Namespace**: `relay-clone` - Isolates all resources
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
helm upgrade --install relay-clone ./k8s/helm/relay-clone \
    --namespace relay-clone \
    --create-namespace \
    --set secrets.openaiApiKey="your-key" \
    --set secrets.anthropicApiKey="your-key" \
    --set secrets.smtpUsername="your-email" \
    --set secrets.smtpPassword="your-password"
```

## 📋 Manual Deployment Steps

### 1. Create Namespace

```bash
kubectl create namespace relay-clone
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
kubectl wait --for=condition=available --timeout=300s deployment/postgres -n relay-clone
kubectl wait --for=condition=available --timeout=300s deployment/redis -n relay-clone
```

### 4. Deploy Applications

```bash
# Deploy API, Worker, and Web
kubectl apply -f k8s/manifests/api-python.yaml
kubectl apply -f k8s/manifests/worker-python.yaml
kubectl apply -f k8s/manifests/web.yaml

# Wait for deployments
kubectl wait --for=condition=available --timeout=300s deployment/api-python -n relay-clone
kubectl wait --for=condition=available --timeout=300s deployment/worker-python -n relay-clone
kubectl wait --for=condition=available --timeout=300s deployment/web -n relay-clone
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
kubectl port-forward -n relay-clone svc/web-service 3000:3000

# Access API directly
kubectl port-forward -n relay-clone svc/api-python-service 8000:8000

# Access API documentation
kubectl port-forward -n relay-clone svc/api-python-service 8000:8000
# Then visit: http://localhost:8000/docs
```

### 2. Ingress (Production)

With ingress configured, access via:
- Web: `http://relay-clone.local`
- API: `http://api.relay-clone.local`
- API Docs: `http://api.relay-clone.local/docs`

### 3. LoadBalancer Service

```bash
# Expose API via LoadBalancer
kubectl expose deployment api-python -n relay-clone --type=LoadBalancer --port=8000
```

## 📊 Monitoring and Logs

### View Logs

```bash
# API logs
kubectl logs -n relay-clone -l app=api-python -f

# Worker logs
kubectl logs -n relay-clone -l app=worker-python -f

# Web logs
kubectl logs -n relay-clone -l app=web -f

# All logs
kubectl logs -n relay-clone --all-containers=true -f
```

### Monitor Resources

```bash
# Pod status
kubectl get pods -n relay-clone

# Service status
kubectl get services -n relay-clone

# Resource usage
kubectl top pods -n relay-clone
kubectl top nodes
```

### Health Checks

```bash
# Check API health
kubectl exec -n relay-clone deployment/api-python -- curl http://localhost:8000/health

# Check database connectivity
kubectl exec -n relay-clone deployment/postgres -- pg_isready -U postgres
```

## 🔄 Updates and Rollbacks

### Update Deployment

```bash
# Update with new image
kubectl set image deployment/api-python api-python=relay-clone-api:v2.0 -n relay-clone

# Or using Helm
helm upgrade relay-clone ./k8s/helm/relay-clone -n relay-clone
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/api-python -n relay-clone

# Or using Helm
helm rollback relay-clone 1 -n relay-clone
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
  name: relay-clone-netpol
  namespace: relay-clone
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: relay-clone
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: relay-clone
```

### 3. RBAC

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: relay-clone
  name: relay-clone-role
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps", "secrets"]
  verbs: ["get", "list", "watch"]
```

## 🚨 Troubleshooting

### Common Issues

1. **Pod CrashLoopBackOff**
   ```bash
   kubectl describe pod <pod-name> -n relay-clone
   kubectl logs <pod-name> -n relay-clone --previous
   ```

2. **Service Not Accessible**
   ```bash
   kubectl get endpoints -n relay-clone
   kubectl describe service <service-name> -n relay-clone
   ```

3. **Database Connection Issues**
   ```bash
   kubectl exec -n relay-clone deployment/postgres -- psql -U postgres -d relayclone -c "SELECT 1;"
   ```

4. **Redis Connection Issues**
   ```bash
   kubectl exec -n relay-clone deployment/redis -- redis-cli ping
   ```

### Debug Commands

```bash
# Get all resources
kubectl get all -n relay-clone

# Describe problematic resource
kubectl describe <resource-type> <resource-name> -n relay-clone

# Check events
kubectl get events -n relay-clone --sort-by='.lastTimestamp'

# Access pod shell
kubectl exec -it <pod-name> -n relay-clone -- /bin/bash
```

## 🧹 Cleanup

### Remove Deployment

```bash
# Using Helm
helm uninstall relay-clone -n relay-clone

# Using kubectl
kubectl delete namespace relay-clone

# Remove Kind cluster
kind delete cluster --name relay-clone
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
