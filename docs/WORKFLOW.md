# Development Workflow

## Local Development

### Prerequisites
- Hugo Extended v0.100+
- Node.js v16+
- Git

### Setup
```bash
# Clone repository
git clone <repository-url>
cd hairathome

# Install dependencies
npm install

# Start development server
npm run serve
```

### Development Commands
```bash
# Start development server with drafts
npm run serve

# Start production server (no drafts)
npm run serve:production

# Build for production
npm run build

# Clean build artifacts
npm run clean
```

## Content Management

### Adding New Services
1. Create new markdown file: `content/services/new-service.md`
2. Add front matter:
```yaml
---
title: "Service Name"
icon: "fas fa-icon"
price: "$XX - $XX"
duration: "X minutes"
description: "Brief description"
slug: "service-slug"
---
```
3. Write detailed service description
4. Add image to gallery if needed

### Updating Gallery
1. Create new markdown file: `content/gallery/gallery-item.md`
2. Add front matter:
```yaml
---
title: "Gallery Item Title"
description: "Description of the style"
image: "https://example.com/image.jpg"
date: 2025-01-01T00:00:00-06:00
---
```
3. Optimize image for web (max 1200px width)

### Creating New Pages
1. Create markdown file in `content/`
2. Add appropriate front matter
3. Create layout template in `themes/hairathome/layouts/` if needed

## Performance Optimization

### Image Optimization
```bash
# Optimize all images
npm run optimize:images

# Manual optimization guidelines
- Max width: 1200px for gallery images
- Max width: 800px for service images
- Use WebP format with fallbacks
- Compress to <200KB per image
```

### CSS Optimization
- Critical CSS is inlined in baseof.html
- Non-critical CSS loaded asynchronously
- Mobile-first approach with progressive enhancement

### JavaScript Optimization
- Scripts loaded with `defer` attribute
- Minimal JavaScript for core functionality
- No external dependencies except icons

## Testing

### Performance Testing
```bash
# Run performance tests
npm run test:performance

# Run Lighthouse CI
npm run test

# Manual Lighthouse test
lighthouse http://localhost:1313 --output=json --output-path=lighthouse.json
```

### Accessibility Testing
```bash
# Install axe-core
npm install -g axe-core

# Run accessibility tests
axe http://localhost:1313
```

## Deployment

### Pre-deployment Checklist
- [ ] All content reviewed and approved
- [ ] Images optimized and compressed
- [ ] Links tested and working
- [ ] Forms tested and functional
- [ ] Performance tests passed
- [ ] Accessibility tests passed

### Deployment Process
```bash
# Build production site
npm run build

# Deploy to staging (for testing)
./scripts/deploy-staging.sh

# Deploy to production
./scripts/deploy.sh

# Run post-deployment tests
npm run test:post-deployment
```

### Environment Variables
Create `.env` file for deployment:
```bash
REMOTE_HOST="your-server.com"
REMOTE_USER="username"
REMOTE_PATH="/var/www/hairathome.ca"
```

## Monitoring

### Performance Monitoring
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse CI

### Uptime Monitoring
- UptimeRobot
- Pingdom
- StatusCake

### Analytics
- Google Analytics 4
- Google Search Console
- Hotjar (for heatmaps)

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear Hugo cache
rm -rf resources/

# Clear Node modules
rm -rf node_modules package-lock.json
npm install

# Check Hugo version
hugo version
```

#### Performance Issues
```bash
# Check image sizes
find public -name "*.jpg" -o -name "*.png" | xargs ls -lh

# Check CSS size
du -h public/css/style.css

# Check HTML size
du -h public/index.html
```

#### Deployment Issues
```bash
# Check SSH connection
ssh username@server.com

# Check file permissions
ssh username@server.com "ls -la /var/www/hairathome.ca"

# Check web server status
ssh username@server.com "sudo systemctl status nginx"
```

## Security

### Regular Updates
- Update Hugo: `npm update hugo-extended`
- Update Node packages: `npm update`
- Update server packages regularly

### Security Headers
Ensure server has these headers:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000

### SSL/TLS
- Use HTTPS only
- Implement HSTS
- Keep certificates updated

## Backup Strategy

### Content Backup
```bash
# Backup content directory
tar -czf content-backup-$(date +%Y%m%d).tar.gz content/

# Backup to cloud storage
aws s3 sync content/ s3://backup-bucket/hairathome-content/
```

### Database Backup
(If using CMS or database)
```bash
# Backup database
mysqldump -u username -p database_name > backup.sql
```

## Team Collaboration

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-service

# Commit changes
git add .
git commit -m "Add new hair coloring service"

# Push and create PR
git push origin feature/new-service
```

### Code Review Checklist
- [ ] Content accuracy
- [ ] SEO optimization
- [ ] Performance impact
- [ ] Mobile responsiveness
- [ ] Accessibility compliance
- [ ] Security considerations