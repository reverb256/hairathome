# Hair@Home Payment Processing Documentation

## Overview
Hair@Home supports two Canadian payment methods:
1. **Interac e-Transfer** - Direct bank-to-bank transfer via email
2. **Cash** - Payment on service day

## Architecture

### Frontend Components
- **Booking Form** (`themes/hairathome/layouts/booking/single.html`)
  - Collects customer information and payment method selection
  - Validates required fields before submission
- **JavaScript** (`static/js/main.js`)
  - Handles form submission
  - Displays payment confirmation modal
  - Shows Interac e-Transfer or cash instructions

### Backend Components
- **Express Server** (`backend/server.js`)
  - Receives booking requests via `/api/book`
  - Validates form data
  - Generates booking IDs
  - Returns payment instructions
- **Rate Limiting**
  - 10 requests per 15 minutes per IP
  - Prevents spam and abuse

## Payment Methods

### Interac e-Transfer

**How it works:**
1. Customer submits booking form and selects "Interac e-Transfer"
2. Customer receives Interac e-Transfer instructions in confirmation modal
3. Customer sends e-Transfer to business email
4. Business receives notification and confirms appointment

**Configuration (`.env`):**
```bash
INTERAC_EMAIL=payments@hairathome.ca
INTERAC_SECURITY_QUESTION=Hair@Home Service Date
```

**Security Question/Answer:**
- **Question:** "Hair@Home Service Date"
- **Answer:** The appointment date in YYYY-MM-DD format
- **Why this works:** Only the business and customer know the date, providing secure verification

**Customer Instructions Shown:**
```
Please complete your booking by sending an Interac e-Transfer to: payments@hairathome.ca

Security Question: Hair@Home Service Date
Security Answer: The date of your appointment (format: YYYY-MM-DD)

Once we receive your e-Transfer, we'll confirm your appointment within 24 hours.
```

### Cash Payment

**How it works:**
1. Customer submits booking form and selects "Cash"
2. Customer receives confirmation to pay on service day
3. Stylist collects payment during appointment

**Customer Instructions Shown:**
```
You'll pay cash directly to the stylist on the day of your appointment.
Please have exact change ready when possible.
```

## API Endpoints

### POST /api/book

**Request:**
```json
{
  "name": "John Doe",
  "phone": "(204) 555-1234",
  "email": "john@example.com",
  "service": "Haircut & Style - $35",
  "date": "2024-02-15",
  "time": "morning",
  "location": "123 Main St, Winnipeg, MB",
  "notes": "Prefer buzz cut",
  "paymentMethod": "interac"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Booking request received!",
  "bookingId": "HA1XYZAB",
  "paymentInstructions": "Please complete your booking by..."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "All required fields must be filled"
}
```

### GET /api/health

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-02-15T10:30:00.000Z"
}
```

## Security Features

### Rate Limiting
- 10 booking requests per 15 minutes per IP address
- Prevents spam booking attempts
- Configurable in `server.js`

### Helmet.js
- HTTP header security
- Content Security Policy (disabled for Hugo compatibility)
- XSS protection

### Input Validation
- All required fields validated server-side
- Phone number format validation
- Email format validation
- Service validation against available services

## Deployment Options

### Option 1: Heroku (Easiest)

1. Create Heroku app:
```bash
heroku create hairathome-backend
```

2. Set environment variables:
```bash
heroku config:set INTERAC_EMAIL=payments@hairathome.ca
heroku config:set INTERAC_SECURITY_QUESTION="Hair@Home Service Date"
heroku config:set BUSINESS_EMAIL=info@hairathome.ca
```

3. Deploy:
```bash
git push heroku main
```

4. Update Hugo config to point to Heroku URL

### Option 2: VPS (DigitalOcean, Linode, AWS)

1. Install Node.js 18+
2. Clone repository
3. Install dependencies:
```bash
cd backend
npm install
```

4. Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your values
```

5. Start server with PM2:
```bash
npm install -g pm2
pm2 start server.js --name hairathome-backend
pm2 startup
pm2 save
```

6. Configure nginx reverse proxy:
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
    }
}
```

7. Enable SSL with Let's Encrypt:
```bash
sudo certbot --nginx -d api.hairathome.ca
```

### Option 3: Serverless (AWS Lambda, Vercel Functions)

Convert backend to serverless function for automatic scaling and pay-per-use pricing.

## Testing

### Local Testing

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Start server:
```bash
npm run dev
```

4. Test booking:
```bash
curl -X POST http://localhost:3000/api/book \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "2045551234",
    "email": "test@example.com",
    "service": "Haircut & Style - $35",
    "date": "2024-02-15",
    "time": "morning",
    "location": "123 Test St",
    "paymentMethod": "interac"
  }'
```

### Production Testing

1. Deploy to production
2. Test booking form on live site
3. Verify payment instructions appear correctly
4. Test both Interac e-Transfer and cash options
5. Verify booking IDs are unique

## Monitoring

### Server Health
```bash
curl https://api.hairathome.ca/api/health
```

### Logs
```bash
# PM2
pm2 logs hairathome-backend

# Heroku
heroku logs --tail
```

## Troubleshooting

### Issue: Form not submitting
**Solution:** Check browser console for errors, verify API endpoint is accessible

### Issue: Rate limit errors
**Solution:** Wait 15 minutes or adjust rate limiting in `server.js`

### Issue: Payment instructions not showing
**Solution:** Verify backend response includes `paymentInstructions` field

### Issue: Interac e-Transfer not received
**Solution:** Check email spam folder, verify correct email address in `.env`

## Cost Analysis

### Interac e-Transfer Costs
- **Per transaction:** $0-$1.50 (varies by bank)
- **Monthly fees:** Usually free with most Canadian bank accounts
- **No merchant account required**

### Cash Payment Costs
- **No transaction fees**
- **No equipment costs**
- **Need cash handling procedures**

## Compliance

### Canadian Payment Regulations
- **Interac e-Transfer:** Regulated by Canadian Payments Association
- **Cash:** Legal tender, no restrictions
- **No PCI compliance required** (no credit card processing)

### Privacy
- **PII:** Name, phone, email, address
- **Storage:** Currently logs to console (implement database for production)
- **Retention:** Keep records for 7 years (Canadian tax law)

## Future Enhancements

### Phase 2 Improvements
- [ ] Add database (PostgreSQL/MongoDB) for booking storage
- [ ] Implement email notifications (nodemailer)
- [ ] Add SMS confirmations (Twilio)
- [ ] Admin dashboard for booking management
- [ ] Automated payment reminders

### Phase 3 Enhancements
- [ ] Credit card processing (Stripe/Square)
- [ ] PayPal integration
- [ ] Customer accounts and history
- [ ] Online scheduling calendar
- [ ] Review and rating system

## Support

For issues or questions:
- **Email:** info@hairathome.ca
- **Phone:** (204) 555-0123
- **GitHub:** https://github.com/hairathome/hairathome.ca/issues

---

**Last Updated:** February 2026
**Version:** 1.0.0
