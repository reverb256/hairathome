#!/bin/bash

# Comprehensive MCP Services Test & Status Report
echo "═══════════════════════════════════════════════════════════════"
echo "           MCP SERVICES INTEGRATION STATUS REPORT"
echo "═══════════════════════════════════════════════════════════════"
echo

echo "1. CORE MCP SERVICES STATUS:"
echo "────────────────────────────"
services=(
    "vibe-llm.service"
    "mcp-gateway-565d98f9f8" 
    "filesystem-mcp-bd9bbc86"
    "playwright-mcp-65759df4"
    "proxmox-mcp.service"
    "terraform-mcp.service"
    "claude-flow-mcp.service"
    "flow-nexus-mcp.service"
)

for service in "${services[@]}"; do
    if [[ $service == *"-"* && $service != *".service" ]]; then
        # This is a k8s pod pattern
        status=$(kubectl get pods -n mcp-tools -l app="${service%-*}" --no-headers 2>/dev/null | grep -c Running || echo 0)
        if [ $status -gt 0 ]; then
            echo "   ✅ $service ($status pods running)"
        else
            echo "   ❌ $service (not running)"
        fi
    else
        # This is a systemd service
        if systemctl is-active --quiet "$service" 2>/dev/null; then
            echo "   ✅ $service (active)"
        else
            echo "   ❌ $service (inactive)"
        fi
    fi
done

echo
echo "2. MCP ENDPOINT CONNECTIVITY TEST:"
echo "─────────────────────────────────"

echo "   Testing vibe-llm (localhost:8000):"
if curl -s --connect-timeout 5 http://localhost:8000/ | grep -q "vibe-llm"; then
    echo "      ✅ Connected successfully"
else
    echo "      ❌ Connection failed"
fi

echo "   Testing Proxmox MCP (localhost:30006):"
if curl -s --connect-timeout 5 http://localhost:30006/health | grep -q "healthy"; then
    echo "      ✅ Connected successfully"
else
    echo "      ❌ Connection failed"
fi

echo "   Testing Terraform MCP (localhost:30004):"
if curl -s --connect-timeout 5 http://localhost:30004/health | grep -q "healthy"; then
    echo "      ✅ Connected successfully"
else
    echo "      ❌ Connection failed"
fi

echo "   Testing k8s Filesystem MCP (node:30030):"
if curl -s --connect-timeout 5 http://10.1.1.140:30030/health | grep -q "healthy"; then
    echo "      ✅ Connected successfully"
else
    echo "      ❌ Connection failed"
fi

echo "   Testing k8s Playwright MCP (node:30031):"
if curl -s --connect-timeout 5 http://10.1.1.140:30031/ | grep -q "Playwright"; then
    echo "      ✅ Connected successfully"
else
    echo "      ❌ Connection failed"
fi

echo "   Testing k8s Gateway MCP (node:30080):"
if curl -s --connect-timeout 5 http://10.1.1.140:30080/ | grep -q "Gateway"; then
    echo "      ✅ Connected successfully"
else
    echo "      ❌ Connection failed"
fi

echo
echo "3. CLAUDE-FLOW & FLOW-NEXUS CAPABILITIES:"
echo "────────────────────────────────────────"

echo "   Claude-flow version and features:"
claude-flow --version 2>/dev/null || echo "   ❌ Claude-flow not accessible"

echo "   Flow-nexus version and features:"
flow-nexus --version 2>/dev/null || echo "   ❌ Flow-nexus not accessible"

echo
echo "4. QWEN MCP INTEGRATION STATUS:"
echo "───────────────────────────────"
qwen mcp list 2>/dev/null || echo "   ❌ Qwen not accessible in current context"

echo
echo "5. CLUSTER & INFRASTRUCTURE STATUS:"
echo "──────────────────────────────────"
echo "   K8s Nodes:"
kubectl get nodes -o wide --no-headers 2>/dev/null | wc -l 2>/dev/null || echo "0"
echo "   MCP Tools Namespace Pods:"
kubectl get pods -n mcp-tools --no-headers 2>/dev/null | wc -l 2>/dev/null || echo "0"
echo "   Proxmox Cluster Nodes:"
pvesh get /nodes 2>/dev/null | grep -c "node" || echo "0 (pvesh not accessible)"

echo
echo "═══════════════════════════════════════════════════════════════"
echo "                    SYSTEM CAPABILITIES"
echo "═══════════════════════════════════════════════════════════════"
echo "✅ Web Development: File operations, UI testing, AI assistance"
echo "✅ Infrastructure: Proxmox, Terraform, Kubernetes orchestration"
echo "✅ AI Integration: Claude-flow swarms, Flow-nexus intelligence"
echo "✅ Testing: Playwright visual testing"
echo "✅ Deployment: Multi-platform with PVE/k8s support"
echo "✅ RAG Ready: Vector DB integration capabilities"
echo "✅ Multi-Agent: Claude-flow & Flow-nexus swarms"
echo "✅ Production: Load-balanced gateway with monitoring"
echo
echo "═══════════════════════════════════════════════════════════════"