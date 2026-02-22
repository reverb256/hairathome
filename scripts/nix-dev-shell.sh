#!/usr/bin/env bash
# NixOS Development Shell for Hair@Home
# Provides all necessary tools for Hugo site development

echo "🚀 Hair@Home NixOS Development Environment"
echo "============================================"
echo ""

# Start nix-shell with required packages
nix-shell -p \
    hugo \
    git \
    nodePackages.tailwindcss \
    nodePackages.postcss \
    nodePackages.postcss-cli \
    imagemagick \
    ffmpeg \
    jpegoptim \
    optipng \
    bash --run "
    echo '✅ Development environment loaded!'
    echo ''
    echo 'Available commands:'
    echo '  hugo serve       - Start development server'
    echo '  hugo build       - Build production site'
    echo '  npm run serve    - Start dev server with CSS build'
    echo '  npm run build    - Build production site with CSS'
    echo '  bash scripts/optimize-images.sh - Optimize images to WebP'
    echo ''
    echo 'Starting Hugo development server on http://localhost:1313 ...'
    echo ''
    exec hugo serve
"
