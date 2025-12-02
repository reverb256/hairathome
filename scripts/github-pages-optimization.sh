#!/bin/bash

# GitHub Pages Optimization Script for Hair At Home
echo "🚀 Optimizing Hair At Home for GitHub Pages..."

# Build the site
echo "📦 Building Hugo site..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Optimize images
echo "🖼️ Optimizing images..."
find public -name '*.jpg' -o -name '*.png' -o -name '*.webp' | head -5 | while read file; do
    echo "Processing: $file"
    # Basic compression using available tools
    if command -v convert &> /dev/null; then
        convert "$file" -quality 85 -strip "$file.tmp" && mv "$file.tmp" "$file"
    fi
done

# Minify CSS further
echo "🎨 Optimizing CSS..."
if command -v cleancss &> /dev/null; then
    cleancss -o public/css/style.css.tmp public/css/style.css && mv public/css/style.css.tmp public/css/style.css
fi

# Minify JS further
echo "⚡ Optimizing JavaScript..."
if command -v terser &> /dev/null; then
    terser public/js/main.js -o public/js/main.js.tmp -c -m && mv public/js/main.js.tmp public/js/main.js
fi

# Add compression headers file for GitHub Pages
echo "🗜️ Creating .htaccess for compression..."
cat > public/.htaccess << 'EOF'
# Compress HTML, CSS, JavaScript, Text, XML and fonts
AddOutputFilterByType DEFLATE application/javascript
AddOutputFilterByType DEFLATE application/rss+xml
AddOutputFilterByType DEFLATE application/vnd.ms-fontobject
AddOutputFilterByType DEFLATE application/x-font
AddOutputFilterByType DEFLATE application/x-font-opentype
AddOutputFilterByType DEFLATE application/x-font-otf
AddOutputFilterByType DEFLATE application/x-font-truetype
AddOutputFilterByType DEFLATE application/x-font-ttf
AddOutputFilterByType DEFLATE application/x-javascript
AddOutputFilterByType DEFLATE application/xhtml+xml
AddOutputFilterByType DEFLATE application/xml
AddOutputFilterByType DEFLATE font/opentype
AddOutputFilterByType DEFLATE font/otf
AddOutputFilterByType DEFLATE font/ttf
AddOutputFilterByType DEFLATE image/svg+xml
AddOutputFilterByType DEFLATE image/x-icon
AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE text/html
AddOutputFilterByType DEFLATE text/javascript
AddOutputFilterByType DEFLATE text/plain
AddOutputFilterByType DEFLATE text/xml

# Expires headers
<FilesMatch "\.(css|flv|gif|ico|jpg|jpeg|js|png|pdf|swf|svg|woff|woff2)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>

<FilesMatch "\.(html)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</FilesMatch>
EOF

# Create GitHub Actions workflow for automated deployment
echo "🔄 Creating GitHub Actions workflow..."
mkdir -p .github/workflows

cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
      with:
        submodules: recursive
        
    - name: Setup Hugo
      uses: peaceiris/actions-hugo@v3
      with:
        hugo-version: 'latest'
        extended: true
        
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build site
      run: npm run build
      
    - name: Optimize assets
      run: |
        # Install optimization tools
        npm install -g terser clean-css-cli
        
        # Optimize CSS
        cleancss -o public/css/style.css public/css/style.css
        
        # Optimize JS
        terser public/js/main.js -o public/js/main.js -c -m
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./public
        
    - name: Run Lighthouse CI
      uses: treosh/lighthouse-ci-action@v10
      if: github.ref == 'refs/heads/main'
      with:
        configPath: './lighthouserc.js'
        uploadArtifacts: true
        temporaryPublicStorage: true
EOF

# Performance analysis
echo "📊 Performance Analysis:"
echo "Site size: $(du -sh public/ | cut -f1)"
echo "CSS size: $(du -h public/css/style.css | cut -f1)"
echo "JS size: $(du -h public/js/main.js | cut -f1)"
echo "HTML pages: $(find public -name '*.html' | wc -l)"
echo "Total files: $(find public -type f | wc -l)"

# Check for optimization opportunities
echo "🔍 Optimization Analysis:"

# Check if critical CSS is inlined
if grep -q "Critical above-the-fold styles" public/index.html; then
    echo "✅ Critical CSS inlined"
else
    echo "⚠️  Consider inlining critical CSS"
fi

# Check for lazy loading
LAZY_COUNT=$(grep -r 'loading="lazy"' public/ | wc -l)
if [ $LAZY_COUNT -gt 0 ]; then
    echo "✅ Lazy loading implemented ($LAZY_COUNT images)"
else
    echo "⚠️  Consider adding lazy loading"
fi

# Check for structured data
if grep -q "application/ld+json" public/index.html; then
    echo "✅ Structured data implemented"
else
    echo "⚠️  Consider adding structured data"
fi

# Check for service worker
if [ -f "public/sw.js" ]; then
    echo "✅ Service worker available"
else
    echo "⚠️  Consider adding service worker"
fi

# Check for PWA manifest
if [ -f "public/manifest.json" ]; then
    echo "✅ PWA manifest available"
else
    echo "⚠️  Consider adding PWA manifest"
fi

echo "✅ GitHub Pages optimization complete!"
echo "📂 Site ready for deployment in 'public' directory"
echo "🚀 Commit and push to trigger GitHub Actions deployment"