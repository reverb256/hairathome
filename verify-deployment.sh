#!/bin/bash

# Simple deployment verification script
echo "🚀 Starting deployment verification..."

# Build the site
echo "📦 Building Hugo site..."
hugo --minify --destination docs

if [ $? -ne 0 ]; then
    echo "❌ Hugo build failed"
    exit 1
fi

# Check if essential files exist
echo "🔍 Checking essential files..."

essential_files=(
    "docs/index.html"
    "docs/css/style.css"
    "docs/js/main.js"
    "docs/images/hero-beauty-stylist.svg"
)

for file in "${essential_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing essential file: $file"
        exit 1
    fi
done

# Check if HTML contains expected content
echo "📄 Verifying HTML content..."
if ! grep -q "Hair@Home" docs/index.html; then
    echo "❌ HTML missing expected content"
    exit 1
fi

if ! grep -q "Winnipeg Mobile Hair Stylist" docs/index.html; then
    echo "❌ HTML missing expected title"
    exit 1
fi

# Check if URLs are correctly formed
echo "🔗 Verifying URLs..."
if grep -q "localhost:1313/hairathome" docs/index.html; then
    echo "❌ HTML contains localhost URLs"
    exit 1
fi

if ! grep -q "https://reverb256.github.io/hairathome" docs/index.html; then
    echo "❌ HTML missing correct base URLs"
    exit 1
fi

echo "✅ All verification checks passed!"
echo "🎉 Site is ready for deployment!"

exit 0