#!/bin/bash

# Playwright Testing Setup Script for Hair At Home
# Configures testing environment with MCP integration for k3s clusters

set -e

echo "🚀 Setting up Playwright testing for Hair At Home..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install

# Install Playwright dependencies (for Linux)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Installing Playwright system dependencies..."
    sudo npx playwright install-deps
fi

# Check MCP integration
if command -v npx &> /dev/null && npx claude-flow@alpha --version &> /dev/null; then
    echo "✅ MCP (claude-flow) is available"
    
    # Initialize MCP hooks
    echo "🔧 Initializing MCP hooks..."
    npx claude-flow@alpha hooks pre-task --description "Playwright testing setup" || echo "⚠️ MCP hooks initialization failed"
else
    echo "⚠️ MCP (claude-flow) not found. MCP integration will be disabled."
    echo "   To enable MCP integration, run: claude mcp add claude-flow npx claude-flow@alpha mcp start"
fi

# Create test results directory
mkdir -p test-results
mkdir -p playwright-report

# Set permissions for test scripts
chmod +x tests/mcp-runner.js

# Verify installation
echo "🧪 Verifying installation..."
npx playwright --version
npm run lint --if-present

# Run a quick test to verify setup
echo "🔍 Running quick verification test..."
npx playwright test basic-functionality.spec.js --reporter=list || echo "⚠️ Quick test failed - check configuration"

echo "✅ Playwright testing setup completed!"
echo ""
echo "📋 Available commands:"
echo "   npm test              - Run all tests"
echo "   npm run test:headed    - Run tests with visible browser"
echo "   npm run test:ui        - Run tests with UI mode"
echo "   npm run test:debug     - Run tests in debug mode"
echo "   npm run test:mcp       - Run MCP-enhanced tests"
echo "   npm run test:report    - View test report"
echo "   npm run lint           - Run linting"
echo ""
echo "🐳 For k3s/Docker environments:"
echo "   npx playwright test --config=playwright.k3s.config.js"
echo ""
echo "🤖 MCP Integration:"
echo "   export MCP_ENABLED=true"
echo "   npm run test:mcp"