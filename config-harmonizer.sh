#!/bin/bash
# Configuration Harmonization System
# Keeps all TUI agent configurations synchronized across the cluster

set -e

echo "🔄 Starting configuration harmonization..."

# Function to update Opencode configuration to use HTTP endpoints
update_opencode_config() {
    mkdir -p ~/.opencode
    cat > ~/.opencode/opencode.json << 'EOF_OPENCODE'
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "filesystem-mcp": {
      "type": "remote",
      "url": "http://10.1.1.140:30030",
      "enabled": true
    },
    "playwright-mcp": {
      "type": "remote",
      "url": "http://10.1.1.140:30031",
      "enabled": true
    },
    "mcp-gateway": {
      "type": "remote", 
      "url": "http://10.1.1.140:30080",
      "enabled": true
    },
    "vibe-llm": {
      "type": "remote",
      "url": "http://localhost:8000/v1",
      "enabled": true
    },
    "kubernetes": {
      "type": "remote",
      "url": "http://localhost:6443", 
      "enabled": true
    },
    "terraform-mcp": {
      "type": "remote",
      "url": "http://localhost:30004",
      "enabled": true
    },
    "proxmox-mcp": {
      "type": "remote",
      "url": "http://localhost:30006",
      "enabled": true
    },
    "claude-flow": {
      "type": "stdio",
      "command": ["npx", "claude-flow@alpha", "mcp", "start"],
      "enabled": true
    },
    "flow-nexus": {
      "type": "stdio",
      "command": ["npx", "flow-nexus@latest", "mcp", "start"], 
      "enabled": true
    }
  },
  "providers": {
    "primary": "vibe-llm",
    "fallback": "openrouter",
    "vibe-llm": {
      "endpoint": "http://localhost:8000/v1",
      "model": "openrouter/anthropic/claude-3.7-sonnet",
      "timeout": 300
    }
  }
}
EOF_OPENCODE
}

# Function to update Qwen configuration 
update_qwen_config() {
    mkdir -p ~/.qwen
    cat > ~/.qwen/settings.json << 'EOF_QWEN'
{
  "mcpServers": {
    "filesystem": {
      "httpUrl": "http://10.1.1.140:30030",
      "connectionType": "http",
      "enabled": true
    },
    "playwright": {
      "httpUrl": "http://10.1.1.140:30031",
      "connectionType": "http", 
      "enabled": true
    },
    "mcp-gateway": {
      "httpUrl": "http://10.1.1.140:30080",
      "connectionType": "http",
      "enabled": true
    },
    "vibe-llm": {
      "httpUrl": "http://localhost:8000/v1",
      "connectionType": "http",
      "enabled": true
    },
    "kubernetes": {
      "httpUrl": "http://localhost:6443",
      "connectionType": "http", 
      "enabled": true
    },
    "terraform": {
      "httpUrl": "http://localhost:30004",
      "connectionType": "http",
      "enabled": true
    },
    "proxmox": {
      "httpUrl": "http://localhost:30006", 
      "connectionType": "http",
      "enabled": true
    },
    "claude-flow": {
      "command": "npx claude-flow@alpha mcp start",
      "connectionType": "stdio",
      "enabled": true
    },
    "flow-nexus": {
      "command": "npx flow-nexus@latest mcp start",
      "connectionType": "stdio", 
      "enabled": true
    }
  },
  "$version": 2,
  "security": {
    "auth": {
      "selectedType": "qwen-oauth"
    }
  },
  "tools": {
    "approvalMode": "yolo"
  }
}
EOF_QWEN
}

# Update configurations
update_opencode_config
update_qwen_config

echo "✅ Configuration harmonization completed"
echo "📋 Updated configurations for TUI agents:"
echo "   - Opencode: HTTP MCP endpoints configured"
echo "   - Qwen: HTTP MCP endpoints configured"
echo "   - Claude-flow: Already working with vibe-llm"
echo "   - Crush: Already configured with vibe-llm"
echo "   - Goose: Already configured with vibe-llm"

echo "🔄 Configuration sync system operational"