#!/bin/bash

# Hair@Home - MCP Integration Script
# This script provides integration with the external MCP tools for visual enhancement

# Base URL for the MCP gateway
MCP_GATEWAY_URL="http://localhost:8080"
HAIRATHOME_URL="http://localhost:1313/hairathome"

echo "🚀 Starting Hair@Home Visual Enhancement Process"
echo "MCP Gateway: $MCP_GATEWAY_URL"
echo "Hair@Home: $HAIRATHOME_URL"
echo

# Function to run visual comparison
run_visual_test() {
    echo "🔍 Running visual comparison with reference sites..."
    
    # Compare with top beauty industry sites
    for reference in "https://snapps.ai" "https://fresha.com" "https://booksy.com"; do
        echo "Comparing with $reference..."
        curl -X POST $MCP_GATEWAY_URL/visual-test \
            -H "Content-Type: application/json" \
            -d "{
                \"url\": \"$HAIRATHOME_URL\",
                \"reference\": \"$reference\",
                \"device\": \"mobile\",
                \"viewport\": \"375x812\"
            }"
        echo
        echo "---"
        echo
    done
}

# Function to analyze project files
analyze_project() {
    echo "📊 Analyzing project structure..."
    curl -X POST $MCP_GATEWAY_URL/mcp/filesystem \
        -H "Content-Type: application/json" \
        -d "{
            \"method\": \"list_directory\",
            \"params\": {
                \"path\": \"/mnt/sentry-nfs/projects/hairathome\"
            }
        }"
    echo
    echo "---"
    echo
}

# Function to read specific files
read_file() {
    local file_path=$1
    echo "📖 Reading file: $file_path"
    curl -X POST $MCP_GATEWAY_URL/mcp/filesystem \
        -H "Content-Type: application/json" \
        -d "{
            \"method\": \"read_file\",
            \"params\": {
                \"path\": \"$file_path\"
            }
        }"
    echo
    echo "---"
    echo
}

# Main workflow
echo "Starting MCP-enhanced visual design workflow for Hair@Home..."
echo

run_visual_test
analyze_project
read_file "/mnt/sentry-nfs/projects/hairathome/README.md"
read_file "/mnt/sentry-nfs/projects/hairathome/styles.css"

echo "✅ Visual enhancement workflow completed"
echo "Next steps: Use insights from MCP analysis to improve design"
