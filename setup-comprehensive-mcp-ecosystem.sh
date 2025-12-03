#!/bin/bash

# Comprehensive MCP Ecosystem Setup Script
# This script configures the full MCP ecosystem including vibe-llm as the router/broker

set -e  # Exit on any error

echo "Setting up comprehensive MCP ecosystem..."

# Install vibe-llm as the core router/broker
echo "Installing vibe-llm as the MCP router/broker..."
cd ~/projects/vibe-llm
pip install -r requirements.txt

# Create a systemd service for vibe-llm
cat <<EOF | sudo tee /etc/systemd/system/vibe-llm.service
[Unit]
Description=Vibe-LLM AI Router and MCP Broker
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/projects/vibe-llm
ExecStart=/usr/bin/python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start vibe-llm service
sudo systemctl daemon-reload
sudo systemctl enable vibe-llm
sudo systemctl start vibe-llm

echo "Vibe-LLM MCP router/broker installed and running!"

# Create deployment script for k8s when cluster is available
cat << 'EOF' > /root/projects/hairathome/deploy-full-mcp-ecosystem.sh
#!/bin/bash

# Deployment script for full MCP ecosystem to k3s cluster
# This will deploy all MCP services when k3s cluster is properly running

echo "Checking k3s cluster status..."

# Wait a bit for cluster to potentially become available
sleep 30

if kubectl get nodes &> /dev/null; then
    echo "k3s cluster is accessible. Deploying full MCP ecosystem..."
    
    # Create namespace
    kubectl create namespace mcp-system --dry-run=client -o yaml | kubectl apply -f -

    # Deploy vibe-llm as the main router/broker
    cat << YAMLEOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vibe-llm-mcp-router
  namespace: mcp-system
  labels:
    app: vibe-llm-mcp-router
spec:
  replicas: 1
  selector:
    matchLabels:
      app: vibe-llm-mcp-router
  template:
    metadata:
      labels:
        app: vibe-llm-mcp-router
    spec:
      containers:
      - name: vibe-llm
        image: python:3.11-slim
        command: ["/bin/sh", "-c"]
        args:
          - |
            apt-get update && apt-get install -y git && 
            git clone https://github.com/reverb256/vibe-llm.git /app &&
            cd /app &&
            pip install -r requirements.txt &&
            python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
---
apiVersion: v1
kind: Service
metadata:
  name: vibe-llm-mcp-router-svc
  namespace: mcp-system
spec:
  selector:
    app: vibe-llm-mcp-router
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
  type: ClusterIP
YAMLEOF

    # Deploy other MCP services
    # claude-flow MCP service
    cat << YAMLEOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: claude-flow-mcp
  namespace: mcp-system
  labels:
    app: claude-flow-mcp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: claude-flow-mcp
  template:
    metadata:
      labels:
        app: claude-flow-mcp
    spec:
      containers:
      - name: claude-flow-mcp
        image: node:18-alpine
        command: ["/bin/sh", "-c"]
        args:
          - |
            npm install -g claude-flow@alpha &&
            npx claude-flow@alpha mcp start
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: claude-flow-mcp-svc
  namespace: mcp-system
spec:
  selector:
    app: claude-flow-mcp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: ClusterIP
YAMLEOF

    echo "Full MCP ecosystem deployed to k3s cluster!"
    kubectl get deployments -n mcp-system
    kubectl get services -n mcp-system

else
    echo "k3s cluster is not accessible. Deploying MCP services as systemd services instead..."
    
    # Ensure other MCP services are also running as systemd services
    # ruv-swarm service
    cat << YAMLEOF | sudo tee /etc/systemd/system/ruv-swarm-mcp.service
[Unit]
Description=Ruv-Swarm MCP Service
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/npx ruv-swarm@latest mcp start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
YAMLEOF

    # flow-nexus service
    cat << YAMLEOF | sudo tee /etc/systemd/system/flow-nexus-mcp.service
[Unit]
Description=Flow-Nexus MCP Service
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/npx flow-nexus@latest mcp start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
YAMLEOF

    # Reload systemd and start services
    sudo systemctl daemon-reload
    sudo systemctl enable ruv-swarm-mcp
    sudo systemctl start ruv-swarm-mcp
    sudo systemctl enable flow-nexus-mcp
    sudo systemctl start flow-nexus-mcp

    echo "MCP ecosystem running as systemd services!"
fi
EOF

chmod +x /root/projects/hairathome/deploy-full-mcp-ecosystem.sh

# Run the deployment script
/root/projects/hairathome/deploy-full-mcp-ecosystem.sh &

echo "Comprehensive MCP ecosystem setup initiated!"
echo "Services running:"
echo "- vibe-llm (on port 8000) - MCP router/broker"
echo "- claude-flow MCP server"
echo "- ruv-swarm MCP server" 
echo "- flow-nexus MCP server"
echo ""
echo "To check status: systemctl status vibe-llm ruv-swarm-mcp flow-nexus-mcp"
echo "To view logs: journalctl -u vibe-llm -f"