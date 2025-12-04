#!/bin/bash

# Playwright Testing Setup Script for Hair@Home
# Configures testing environment for containerized clusters

set -e

echo "🚀 Setting up Playwright testing for Hair@Home..."

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

# Check extended testing setup
if [ -f "tests/runner.js" ]; then
    echo "✅ Extended test runner is available"
else
    echo "ℹ️  Extended test runner not found. Standard testing will be used."
fi

# Create test results directory
mkdir -p test-results
mkdir -p playwright-report

# Set permissions for test scripts
chmod +x tests/runner.js

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
echo "   npm run test:extended  - Run extended tests"
echo "   npm run test:report    - View test report"
echo "   npm run lint           - Run linting"
echo ""
echo "🐳 For Container environments:"
echo "   npx playwright test --config=playwright.container.config.js"
echo ""
echo "🤖 Extended Testing:"
echo "   export EXTENDED_TESTS=true"
echo "   npm run test:extended"