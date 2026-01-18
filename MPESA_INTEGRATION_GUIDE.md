# SMARTSTAY CHUKA - M-Pesa Integration Guide

This guide helps you set up M-Pesa integration for the SMARTSTAY CHUKA app.

## Prerequisites

- Safaricom Developer Account
- Business Account with Safaricom
- Access to M-Pesa API credentials

## Getting M-Pesa Credentials

### 1. Register on Developer Portal
1. Go to [Safaricom Developer Portal](https://developer.safaricom.co.ke)
2. Sign up for a free account
3. Verify your email

### 2. Create an App
1. Log in to your account
2. Go to "My Apps" section
3. Click "Create New App"
4. Fill in app name: "SMARTSTAY CHUKA"
5. Click "Create"

### 3. Get Your Credentials
In your app dashboard, you'll find:
- **Consumer Key**
- **Consumer Secret**
- **Short Code** (for Customer Pay Bill Online)
- **Pass Key** (provided by Safaricom)

## Environment Configuration

### Backend .env File

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartstay-chuka
JWT_SECRET=your_jwt_secret_key_here

# M-Pesa Credentials (from Developer Portal)
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=171414
MPESA_PASSKEY=your_pass_key_here

# Subscription
SUBSCRIPTION_FEE=253
CALLBACK_URL=http://localhost:5000/api/payments/callback

NODE_ENV=development
```

## Testing M-Pesa Integration

### Using Sandbox Environment

1. **Test Phone Numbers**
   - Format: 254712345678 (Safaricom format)
   - Prefix must be 254 (Kenya country code)

2. **Testing Payment Flow**
   ```bash
   # Register a test user
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Test",
       "lastName": "User",
       "email": "test@smartstay.com",
       "phoneNumber": "254712345678",
       "password": "test123"
     }'

   # Get the token from response and use it for payment
   ```

3. **Initiate Payment**
   ```bash
   curl -X POST http://localhost:5000/api/payments/initiate \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber": "254712345678"}'
   ```

## Webhook Configuration

### M-Pesa Callback Setup

1. Log in to Developer Portal
2. Go to your app settings
3. Set OAuth Redirect URL:
   ```
   http://localhost:5000/api/payments/callback
   ```

### For Production

Replace with your production URL:
```
https://yourdomain.com/api/payments/callback
```

## Payment Flow Diagram

```
┌─────────────┐
│   User      │
│   App       │
└──────┬──────┘
       │
       │ 1. Enter phone & click Pay
       ▼
┌─────────────────────────┐
│   Backend               │
│   /payments/initiate    │
└──────┬──────────────────┘
       │
       │ 2. Get Access Token
       ▼
┌─────────────────────────┐
│   M-Pesa OAuth          │
│   /oauth/v1/generate    │
└──────┬──────────────────┘
       │
       │ 3. STK Push Request
       ▼
┌─────────────────────────┐
│   M-Pesa STK Push       │
│   /mpesa/stkpush/v1     │
└──────┬──────────────────┘
       │
       │ 4. Prompt on Phone
       ▼
┌─────────────┐
│   User      │
│   M-Pesa    │
│   PIN       │
└──────┬──────┘
       │
       │ 5. Callback Response
       ▼
┌─────────────────────────┐
│   Backend Webhook       │
│   /payments/callback    │
└──────┬──────────────────┘
       │
       │ 6. Update User
       ▼
┌─────────────────────────┐
│   Database              │
│   Set isSubscribed=true │
└─────────────────────────┘
```

## API Endpoints Used

### Safaricom Sandbox
- Auth: `https://sandbox.safaricom.co.ke/oauth/v1/generate`
- STK Push: `https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`

### Safaricom Production
- Auth: `https://api.safaricom.co.ke/oauth/v1/generate`
- STK Push: `https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest`

## Important Notes

### Development
- Use sandbox credentials
- Test with sandbox phone numbers
- Check backend logs for debugging
- Test with actual M-Pesa account if possible

### Security
- **Never commit .env file** with real credentials
- Use `.env.example` for template
- Rotate credentials periodically
- Don't share credentials via email

### Common Issues

**Issue: OAuth Failed**
- Solution: Check Consumer Key/Secret
- Solution: Ensure internet connection
- Solution: Verify app is active in Developer Portal

**Issue: STK Push Not Appearing**
- Solution: Check phone number format (254712345678)
- Solution: Verify phone has M-Pesa account
- Solution: Check backend logs for errors
- Solution: Wait 30 seconds for prompt

**Issue: Callback Not Received**
- Solution: Verify callback URL in settings
- Solution: Check firewall/NAT settings
- Solution: Use ngrok for local testing: `ngrok http 5000`
- Solution: Update CALLBACK_URL in .env

**Issue: Payment Shows Pending**
- Solution: Wait for callback (can take minutes)
- Solution: Check phone for M-Pesa message
- Solution: Verify phone number correctness
- Solution: Try again with different amount

## Deployment Checklist

Before going to production:

- [ ] Update API URLs to production endpoints
- [ ] Change credentials to production M-Pesa account
- [ ] Update callback URL to production domain
- [ ] Configure HTTPS/SSL certificate
- [ ] Set up database backups
- [ ] Enable error logging
- [ ] Set NODE_ENV=production
- [ ] Test payment flow end-to-end
- [ ] Set up monitoring and alerts
- [ ] Create admin dashboard for payments
- [ ] Test with real M-Pesa users

## Support

For M-Pesa API support:
- Visit: https://developer.safaricom.co.ke
- Email: APIconsultant@safaricom.co.ke
- Documentation: https://safaricom.co.ke/business/mpesa

---

**Last Updated:** January 2026
