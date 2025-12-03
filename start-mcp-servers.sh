#!/bin/bash

# Script to start MCP servers and connect them to k3s cluster across all 3 nodes

set -e  # Exit on any error

echo "Starting MCP servers and connecting to k3s cluster..."

# Function to start claude-flow MCP server
start_claude_flow_mcp() {
    echo "Starting claude-flow MCP server..."
    npx claude-flow@alpha mcp start &
    CLAUDE_FLOW_PID=$!
    echo "claude-flow MCP server started with PID: $CLAUDE_FLOW_PID"
}

# Function to start ruv-swarm MCP server
start_ruv_swarm_mcp() {
    echo "Starting ruv-swarm MCP server..."
    npx ruv-swarm@latest mcp start &
    RUV_SWARM_PID=$!
    echo "ruv-swarm MCP server started with PID: $RUV_SWARM_PID"
}

# Function to start flow-nexus MCP server
start_flow_nexus_mcp() {
    echo "Starting flow-nexus MCP server..."
    npx flow-nexus@latest mcp start &
    FLOW_NEXUS_PID=$!
    echo "flow-nexus MCP server started with PID: $FLOW_NEXUS_PID"
}

# Start all MCP servers
start_claude_flow_mcp
sleep 2
start_ruv_swarm_mcp
sleep 2
start_flow_nexus_mcp

echo "All MCP servers started."

# Wait for all background processes
wait

echo "MCP servers are running."