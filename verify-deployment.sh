#!/bin/bash

# Simple deployment verification script
echo "🚀 Starting deployment verification..."

# Clean previous build to ensure fresh deployment
rm -rf docs/*

# Build the site
echo "📦 Building Hugo site..."
hugo --minify --destination docs

if [ $? -ne 0 ]; then
    echo "❌ Hugo build failed"
    exit 1
fi

# Essential files are now different due to CDN-based Tailwind CSS
# We're using Tailwind CSS via CDN, so we don't have local CSS/JS files
echo "🔍 Checking essential files..."

essential_files=(
    "docs/index.html"
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

# Check if URLs are correctly formed (should use relative URLs or proper base URL)
echo "🔗 Verifying URLs..."
if grep -q "localhost:1313/hairathome" docs/index.html; then
    echo "❌ HTML contains localhost URLs"
    exit 1
fi

if grep -q "http://localhost:1313/" docs/index.html; then
    echo "❌ HTML contains localhost references"
    exit 1
fi

echo "✅ All verification checks passed!"
echo "🎉 Site is ready for deployment!"

exit 0