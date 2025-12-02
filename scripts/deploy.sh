#!/bin/bash

# Deployment Script for Hair At Home Hugo Site
echo "🚀 Deploying Hair At Home Hugo Site..."

# Configuration
REMOTE_HOST="your-server.com"
REMOTE_USER="username"
REMOTE_PATH="/var/www/hairathome.ca"
BACKUP_DIR="/var/www/backups/hairathome"

# Build the site
echo "📦 Building production site..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Deployment aborted."
    exit 1
fi

echo "✅ Build successful!"

# Create backup on remote server
echo "💾 Creating backup on remote server..."
ssh $REMOTE_USER@$REMOTE_HOST "mkdir -p $BACKUP_DIR && cp -r $REMOTE_PATH $BACKUP_DIR/$(date +%Y%m%d_%H%M%S) 2>/dev/null || echo 'No existing site to backup'"

# Deploy to production
echo "📤 Uploading files to production..."
rsync -avz --delete public/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/

# Set correct permissions
echo "🔐 Setting file permissions..."
ssh $REMOTE_USER@$REMOTE_HOST "chown -R www-data:www-data $REMOTE_PATH && chmod -R 755 $REMOTE_PATH"

# Restart web server if needed
echo "🔄 Restarting web server..."
ssh $REMOTE_USER@$REMOTE_HOST "sudo systemctl reload nginx || sudo systemctl reload apache2 || echo 'Web server reload not needed'"

# Verify deployment
echo "🔍 Verifying deployment..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://hairathome.ca)
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Deployment successful! Site is live at https://hairathome.ca"
else
    echo "⚠️  Deployment completed but site returned HTTP $HTTP_STATUS"
fi

echo "🎉 Deployment complete!"

# Optional: Run performance test after deployment
read -p "Run post-deployment performance test? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔦 Running post-deployment performance test..."
    lighthouse https://hairathome.ca --output=json --output-path=./post-deployment-lighthouse.json --chrome-flags='--headless' --quiet
    
    if [ -f "post-deployment-lighthouse.json" ]; then
        PERFORMANCE_SCORE=$(cat post-deployment-lighthouse.json | jq '.categories.performance.score * 100')
        echo "📈 Post-deployment Lighthouse Performance Score: ${PERFORMANCE_SCORE}%"
    fi
fi