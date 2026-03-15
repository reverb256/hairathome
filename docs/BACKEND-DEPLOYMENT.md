# Hair@Home Backend Deployment Guide

## Quick Start (Development)

```bash
cd backend
npm install
npm run dev
```

Server runs on http://localhost:3000

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
INTERAC_EMAIL=payments@hairathome.ca
INTERAC_SECURITY_QUESTION=Hair@Home Service Date
BUSINESS_EMAIL=info@hairathome.ca
PORT=3000
NODE_ENV=production
```

## Production Deployment

### Option 1: Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create hairathome-backend

# Set environment variables
heroku config:set INTERAC_EMAIL=payments@hairathome.ca
heroku config:set INTERAC_SECURITY_QUESTION="Hair@Home Service Date"
heroku config:set BUSINESS_EMAIL=info@hairathome.ca
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Scale up
heroku ps:scale web=1

# View logs
heroku logs --tail
```

### Option 2: VPS with PM2

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone and setup
git clone https://github.com/hairathome/hairathome.ca.git
cd hairathome.ca/backend
npm install

# Configure environment
cp .env.example .env
nano .env  # Edit with your values

# Start with PM2
pm2 start server.js --name hairathome-backend
pm2 startup
pm2 save

# Monitor
pm2 monit
pm2 logs hairathome-backend
```

### Option 3: Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t hairathome-backend .
docker run -p 3000:3000 --env-file .env hairathome-backend
```

## Nginx Configuration (VPS)

Create `/etc/nginx/sites-available/hairathome-backend`:

```nginx
server {
    listen 80;
    server_name api.hairathome.ca;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # CORS headers
        proxy_set_header Access-Control-Allow-Origin *;
        proxy_set_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        proxy_set_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/hairathome-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.hairathome.ca

# Auto-renewal (configured automatically)
sudo certbot renew --dry-run
```

## Database Setup (Optional - Future Enhancement)

Currently using in-memory storage. For production, add database:

### PostgreSQL Setup

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE hairathome;
CREATE USER hairathome_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hairathome TO hairathome_user;
\q
```

Update `server.js` to use PostgreSQL:
```javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
```

## Monitoring

### Health Check
```bash
curl https://api.hairathome.ca/api/health
```

### PM2 Monitoring
```bash
pm2 monit
pm2 logs hairathome-backend --lines 100
```

### Heroku Monitoring
```bash
heroku logs --tail --app hairathome-backend
heroku metrics --app hairathome-backend
```

## Backup Strategy

### Database Backup (if implemented)
```bash
# PostgreSQL backup
pg_dump hairathome > backup_$(date +%Y%m%d).sql

# Automated with cron
0 2 * * * pg_dump hairathome > /backups/hairathome_$(date +\%Y\%m\%d).sql
```

### File Backup
```bash
# Backup entire backend
tar -czf backend_backup_$(date +%Y%m%d).tar.gz /path/to/hairathome/backend
```

## Scaling

### Horizontal Scaling (PM2 Cluster Mode)
```bash
pm2 start server.js -i max --name hairathome-backend-cluster
```

### Load Balancing (Nginx)
```nginx
upstream hairathome_backend {
    least_conn;
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    location / {
        proxy_pass http://hairathome_backend;
    }
}
```

## Security Hardening

### Firewall (UFW)
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Fail2Ban
```bash
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Security Headers (Already Implemented via Helmet.js)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

## Troubleshooting

### Port Already in Use
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Permission Issues
```bash
sudo chown -R $USER:$USER /path/to/hairathome/backend
```

### Nginx 502 Bad Gateway
```bash
# Check if backend is running
pm2 status

# Check nginx error log
sudo tail -f /var/log/nginx/error.log
```

## Cost Estimation

### Heroku
- **Eco Dyno:** $5/month
- **Basic Dyno:** $7/month
- **Standard Dyno:** $25/month

### DigitalOcean (Basic VPS)
- **2GB RAM, 1 CPU:** $24/month
- **4GB RAM, 2 CPUs:** $48/month

### AWS EC2 (t3.medium)
- **On-Demand:** ~$30/month
- **Reserved (1 year):** ~$20/month

### Estimated Monthly Costs
- **Small scale (100 bookings/month):** $5-24/month
- **Medium scale (500 bookings/month):** $24-48/month
- **Large scale (1000+ bookings/month):** $48-100+/month

## Support

For deployment issues:
- Check logs: `pm2 logs hairathome-backend`
- Test health endpoint: `/api/health`
- Review environment variables: `pm2 env 0`
