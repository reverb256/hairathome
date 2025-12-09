# AstralDev Platform - Comprehensive Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Services and Components](#services-and-components)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Operation](#operation)
7. [Development Workflow](#development-workflow)
8. [Monitoring and Observability](#monitoring-and-observability)
9. [Security](#security)
10. [Troubleshooting](#troubleshooting)

## Overview

AstralDev is a next-generation development automation platform that combines the power of Kubernetes, Model Context Protocol (MCP) services, and AI-assisted development tools. It provides a comprehensive solution for modern software development teams seeking to streamline their infrastructure, deployment, and development processes.

### Key Features
- **MCP-Native Architecture**: Built from the ground up for Model Context Protocol integration
- **AI-Assisted Development**: Leverages AI services for code completion, review, and suggestions
- **Multi-Node Kubernetes**: High-availability cluster architecture with nexus, forge, and sentry nodes
- **Automated Workflows**: End-to-end automation for development, testing, and deployment
- **Cross-Platform Support**: Compatible with various operating systems and development environments

### Benefits
- **Developer Productivity**: Accelerate development cycles with automated tooling
- **Infrastructure Efficiency**: Streamlined Kubernetes-native infrastructure management
- **AI Integration**: Smart assistance for coding, debugging, and optimization
- **High Availability**: Multi-node architecture ensures service reliability
- **Scalability**: Horizontal scaling capabilities for growing teams

## Architecture

### Cluster Topology
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     nexus       │    │     forge       │    │     sentry      │
│  (Control Plane)│    │   (Compute)     │    │ (Storage/Monitor)│
│                 │    │                 │    │                 │
│ • API Server    │    │ • Workloads     │    │ • Persistent    │
│ • etcd          │    │ • Services      │    │   Storage       │
│ • Scheduler     │    │ • Jobs          │    │ • Monitoring    │
│ • Controller Mgr│    │ • Pods          │    │ • Logging       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Service Architecture
- **Control Plane** (nexus): Manages cluster state, API requests, and scheduling
- **Compute Plane** (forge): Runs application workloads and services
- **Storage/Telemetry** (sentry): Handles data persistence and monitoring

## Services and Components

### Core MCP Services

#### 1. MCP Gateway
- **Purpose**: Central service routing and coordination
- **Location**: `mcp-tools` namespace
- **Ports**: 8080 (internal), 30080 (NodePort)
- **Responsibilities**:
  - API gateway functionality
  - Service discovery
  - Request routing
  - Authentication and authorization

#### 2. Playwright MCP Service
- **Purpose**: Browser automation and UI testing
- **Location**: `mcp-tools` namespace
- **Ports**: 3000 (internal), 30031 (NodePort)
- **Responsibilities**:
  - Automated browser testing
  - UI interaction simulation
  - Visual regression testing
  - Cross-browser compatibility testing

#### 3. Filesystem MCP Service
- **Purpose**: Persistent storage and file operations
- **Location**: `mcp-tools` namespace
- **Ports**: 3000 (internal), 30030 (NodePort)
- **Responsibilities**:
  - File storage operations
  - Volume management
  - Backup and recovery
  - File synchronization

#### 4. Package Installer MCP
- **Purpose**: Dependency management and installation
- **Location**: `mcp-tools` namespace
- **Ports**: 3000 (internal), 30511 (NodePort)
- **Responsibilities**:
  - Package dependency resolution
  - Security scanning
  - Installation automation
  - Version management

#### 5. GitHub Spark Equivalent
- **Purpose**: AI-powered code assistance
- **Location**: `mcp-tools` namespace
- **Ports**: 3000 (internal), 30509 (NodePort)
- **Responsibilities**:
  - Code completion and suggestions
  - Code review and analysis
  - Bug detection and fixing
  - Documentation generation

#### 6. Ansible MCP Service
- **Purpose**: Infrastructure automation and configuration
- **Location**: `mcp-tools` namespace
- **Ports**: 3000 (internal), 30502 (NodePort)
- **Responsibilities**:
  - Infrastructure provisioning
  - Configuration management
  - Server orchestration
  - Deployment automation

#### 7. Ghostwriter MCP
- **Purpose**: AI-powered content generation
- **Location**: `mcp-tools` namespace
- **Ports**: 3000 (internal), 30510 (NodePort)
- **Responsibilities**:
  - Documentation generation
  - Code documentation
  - Content creation
  - Technical writing assistance

### Supporting Services
- **Prometheus**: Monitoring and metrics collection
- **Grafana**: Visualization and dashboards
- **QDrant**: Vector database for AI embeddings
- **Proxmox MCP**: Infrastructure management

## Installation

### Prerequisites
- Linux-based system
- k3s or Kubernetes cluster
- Docker or containerd
- Minimum 8GB RAM and 50GB storage
- Internet connectivity for dependencies

### Quick Installation
```bash
# 1. Deploy AstralDev platform
kubectl apply -f https://raw.githubusercontent.com/reverb256/astraldev/main/deploy/platform.yaml

# 2. Verify installation
kubectl get pods -A | grep astral

# 3. Access services via NodePorts or LoadBalancer
kubectl get services -A
```

### Manual Installation
```bash
# 1. Clone repository
git clone https://github.com/reverb256/astraldev.git
cd astraldev

# 2. Apply manifests
kubectl apply -f manifests/namespace.yaml
kubectl apply -f manifests/storage.yaml
kubectl apply -f manifests/core-services.yaml
kubectl apply -f manifests/mcp-services.yaml

# 3. Wait for services to be ready
kubectl wait --for=condition=ready pod -l app -n astraldev --timeout=300s
```

## Configuration

### Global Configuration
Global settings are managed through ConfigMaps in the `astraldev` namespace:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: astraldev-config
  namespace: astraldev
data:
  cluster-name: "astral-cluster"
  region: "us-central1"
  timezone: "America/Winnipeg"
  log-level: "info"
  debug-mode: "false"
```

### Service-Specific Configuration
Each MCP service has its own configuration:

#### MCP Gateway Configuration
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mcp-gateway-config
data:
  rate-limit: "1000"
  timeout: "30s"
  max-body-size: "10MB"
  cors-enabled: "true"
```

#### Playwright Configuration
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: playwright-mcp-config
data:
  headless: "true"
  timeout: "30000"
  screenshot-quality: "95"
  video-recording: "true"
```

## Operation

### Service Management
```bash
# Check service status
kubectl get pods -n astraldev -o wide

# Scale services
kubectl scale deployment <service-name> -n astraldev --replicas=3

# Add new replicas for high availability
kubectl get deployments -n astraldev
```

### Health Checks
```bash
# Check cluster health
kubectl get nodes
kubectl get cs # component status

# Check AstralDev services
kubectl get pods -n astraldev -o wide
kubectl describe pods -n astraldev

# Check service endpoints
kubectl get endpoints -n astraldev
```

### Logging and Monitoring
```bash
# View service logs
kubectl logs -n astraldev <pod-name>

# View service logs with follow
kubectl logs -f -n astraldev <pod-name>

# Check resource usage
kubectl top nodes
kubectl top pods -n astraldev
```

## Development Workflow

### Local Development
1. Set up local development environment
2. Configure MCP connection to cluster
3. Develop and test locally
4. Deploy to cluster for integration testing

### CI/CD Integration
AstralDev supports various CI/CD tools:
- GitHub Actions
- GitLab CI
- Jenkins
- ArgoCD
- Tekton

### Code Review Process
1. AI-assisted code analysis via GitHub Spark equivalent
2. Automated testing with Playwright MCP
3. Security scanning
4. Manual review process
5. Automated deployment

## Monitoring and Observability

### Built-in Monitoring
- **Prometheus**: Metrics collection and storage
- **Grafana**: Dashboards and visualization
- **AlertManager**: Alerting and notification
- **Loki**: Log aggregation and search

### Custom Dashboards
1. Service health dashboard
2. Performance metrics
3. Resource utilization
4. API response times
5. Error rates and trends

### Alerting
Critical alerts are configured for:
- Service downtime
- Resource exhaustion
- Security incidents
- Performance degradation

## Security

### Network Security
- **Network Policies**: Restrict traffic between namespaces
- **TLS/SSL**: End-to-end encryption
- **Authentication**: JWT-based authentication
- **Authorization**: RBAC for service access

### Pod Security
- **Security Contexts**: Privilege restrictions
- **Resource Limits**: Prevent resource exhaustion
- **Read-Only Root Filesystem**: For critical services
- **Non-Root Users**: Running containers as non-root

### Data Protection
- **Encryption at Rest**: Encrypted persistent volumes
- **Encryption in Transit**: TLS for all communications
- **Backup Strategy**: Automated backup and recovery
- **Access Control**: Fine-grained permissions

## Troubleshooting

### Common Issues

#### Service Not Starting
1. Check pod status:
   ```bash
   kubectl describe pod <pod-name> -n astraldev
   ```
2. Check logs:
   ```bash
   kubectl logs <pod-name> -n astraldev
   ```
3. Verify resources:
   ```bash
   kubectl get events -n astraldev
   ```

#### High Resource Usage
1. Check resource usage:
   ```bash
   kubectl top pods -n astraldev
   ```
2. Adjust resource limits:
   ```bash
   kubectl patch deployment <name> -p '{"spec":{"template":{"spec":{"containers":[{"name":"<container>","resources":{"limits":{"cpu":"500m","memory":"512Mi"},"requests":{"cpu":"100m","memory":"128Mi"}}]}}}}'
   ```

#### Network Connectivity Issues
1. Check network policies
2. Verify service endpoints:
   ```bash
   kubectl get endpoints <service-name> -n astraldev
   ```
3. Test connectivity:
   ```bash
   kubectl exec <pod-name> -n astraldev -- nslookup <service-name>
   ```

### Debugging Tools
- `kubectl debug` for debugging running pods
- `kubectl exec` for interactive access
- `kubectl port-forward` for local access to services
- `kubectl logs` for viewing service logs

## Future Development

### Planned Enhancements
- **Reverb-OS Integration**: Universal blue distro compatibility
- **uCore Migration**: Transition from Proxmox to uCore container runtime
- **Advanced AI Features**: Enhanced natural language processing
- **Multi-Cluster Support**: Federated cluster management
- **Enhanced Security**: Advanced threat detection

### Community Contributions
- Open source development model
- Contribution guidelines available in repo
- Regular community meetings
- Issue tracking and roadmap

## Support

### Documentation
- Comprehensive API documentation
- Configuration guides
- Troubleshooting guides
- Best practices

### Community
- GitHub Discussions
- Discord channel
- Monthly community calls
- Blog posts and tutorials

---
*Version: 1.0.0*
*Last Updated: December 2025*
*License: MIT*