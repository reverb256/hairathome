#!/bin/bash

# Performance Test Script for Hair At Home Hugo Site
echo "🚀 Starting Performance Tests for Hair At Home Site..."

# Build the site
echo "📦 Building Hugo site..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Check file sizes
echo "📊 Analyzing file sizes..."
echo "CSS file size: $(du -h public/css/style.css | cut -f1)"
echo "JS file size: $(du -h public/js/main.js | cut -f1)"
echo "HTML homepage size: $(du -h public/index.html | cut -f1)"

# Count total files
echo "📁 Total files generated: $(find public -type f | wc -l)"

# Check for critical CSS inlining
echo "🔍 Checking for critical CSS..."
if grep -q "Critical above-the-fold styles" public/index.html; then
    echo "✅ Critical CSS inlined"
else
    echo "⚠️  Critical CSS not found"
fi

# Check for lazy loading
echo "🖼️  Checking for lazy loading..."
if grep -q "loading=\"lazy\"" public/index.html; then
    echo "✅ Lazy loading implemented"
else
    echo "⚠️  Lazy loading not found"
fi

# Check for structured data
echo "📋 Checking for structured data..."
if grep -q "application/ld+json" public/index.html; then
    echo "✅ Structured data implemented"
else
    echo "⚠️  Structured data not found"
fi

# Check for service worker
echo "🔧 Checking for service worker..."
if [ -f "public/sw.js" ]; then
    echo "✅ Service worker available"
else
    echo "⚠️  Service worker not found"
fi

# Check for manifest
echo "📱 Checking for PWA manifest..."
if [ -f "public/manifest.json" ]; then
    echo "✅ PWA manifest available"
else
    echo "⚠️  PWA manifest not found"
fi

# Start server for Lighthouse testing
echo "🌐 Starting server for Lighthouse testing..."
npm run serve:production &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Run Lighthouse test if available
if command -v lighthouse &> /dev/null; then
    echo "🔦 Running Lighthouse performance test..."
    lighthouse http://localhost:1313 --output=json --output-path=./lighthouse-results.json --chrome-flags='--headless' --quiet
    
    # Extract performance score
    if [ -f "lighthouse-results.json" ]; then
        PERFORMANCE_SCORE=$(cat lighthouse-results.json | jq '.categories.performance.score * 100')
        echo "📈 Lighthouse Performance Score: ${PERFORMANCE_SCORE}%"
        
        if (( $(echo "$PERFORMANCE_SCORE >= 90" | bc -l) )); then
            echo "🎉 Excellent performance!"
        elif (( $(echo "$PERFORMANCE_SCORE >= 75" | bc -l) )); then
            echo "👍 Good performance"
        else
            echo "⚠️  Performance needs improvement"
        fi
    fi
else
    echo "⚠️  Lighthouse not available. Install with: npm install -g lighthouse"
fi

# Kill server
kill $SERVER_PID 2>/dev/null

echo "✅ Performance testing complete!"
echo "📂 Site built in 'public' directory"
echo "🚀 Ready for deployment!"