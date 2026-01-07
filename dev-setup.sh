#!/bin/bash

# Hair@Home Development Setup Script
# Sets up the complete development environment using Nix

set -e

echo "🚀 Setting up Hair@Home development environment..."

# Check if Nix is installed
if ! command -v nix &> /dev/null; then
    echo "❌ Nix is not installed. Please install Nix first:"
    echo "   sh <(curl -L https://nixos.org/nix/install)"
    exit 1
fi

# Enable flakes if not already enabled
if ! grep -q "experimental-features.*flakes" ~/.config/nix/nix.conf 2>/dev/null; then
    echo "🔧 Enabling Nix flakes..."
    mkdir -p ~/.config/nix
    echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
fi

# Enter the development shell
echo "📦 Entering Nix development shell..."
echo "This will install all dependencies in an isolated environment."
echo ""

# Use nix develop to enter the shell
nix develop

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📋 Available commands:"
echo "  hugo                  - Hugo static site generator"
echo "  npm run serve         - Start development server"
echo "  npm run build         - Build for production"
echo "  npm run test          - Run all tests"
echo "  lighthouse            - Performance testing"
echo "  npx playwright test   - End-to-end testing"
echo ""
echo "📁 Project structure:"
echo "  content/    - Hugo content files"
echo "  static/     - Static assets (CSS, JS, images)"
echo "  themes/     - Hugo theme"
echo "  tests/      - Playwright tests"
echo ""
echo "🎯 Performance targets:"
echo "  - FCP: <1.5s"
echo "  - LCP: <2.5s"
echo "  - TTI: <3.5s"
echo "  - CLS: <0.1"
echo ""
echo "💡 Tip: Run 'npm run serve' to start the development server!"