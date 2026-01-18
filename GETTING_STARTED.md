# SMARTSTAY CHUKA - Getting Started Guide

## Overview

SMARTSTAY CHUKA is a full-stack application for browsing hostels around Chuka University and managing subscriptions via M-Pesa.

## Quick Setup (5 minutes)

### 1. Clone and Install

```bash
# Backend
cd backend
npm install

# Web
cd ../web
npm install

# Mobile
cd ../mobile
npm install
```

### 2. Configure Backend

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartstay-chuka
JWT_SECRET=your_secret_key
MPESA_CONSUMER_KEY=test_key
MPESA_CONSUMER_SECRET=test_secret
MPESA_SHORTCODE=171414
MPESA_PASSKEY=test_passkey
SUBSCRIPTION_FEE=253
NODE_ENV=development
```

### 3. Start Everything

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Web:**
```bash
cd web
npm start
# Runs on http://localhost:3000
```

**Terminal 3 - Mobile (optional):**
```bash
cd mobile
npm start
# Follow prompts to run on Android/iOS
```

## Project Overview

| Component | Technology | Port | Purpose |
|-----------|-----------|------|---------|
| **Backend** | Node.js + Express | 5000 | REST API |
| **Web** | React | 3000 | Web browser app |
| **Mobile** | React Native | N/A | iOS/Android app |
| **Database** | MongoDB | 27017 | Data storage |

## Key Features

### 🔐 Authentication
- User registration and login
- JWT token-based security
- Password hashing

### 🏨 Hostel Browsing
- View all available hostels
- See detailed information
- Leave reviews and ratings

### 💳 M-Pesa Payments
- Subscribe for KES 253
- 30-day subscription period
- Secure payment processing

### 📱 Multi-Platform
- Web app (React)
- Mobile app (React Native)
- Same backend for both

## User Flow

```
1. Register/Login
   ↓
2. Check Subscription Status
   ↓
3. If Not Subscribed → Pay KES 253
   ↓
4. View All Hostels
   ↓
5. Leave Reviews
```

## File Structure

```
SMARTSTAY CHUKA/
├── backend/
│   ├── models/       (Database schemas)
│   ├── controllers/  (Business logic)
│   ├── routes/       (API endpoints)
│   ├── middleware/   (Auth, validation)
│   ├── utils/        (M-Pesa service)
│   └── server.js     (Entry point)
├── web/
│   ├── src/
│   │   ├── pages/        (Login, Home, Payment)
│   │   ├── components/   (Navbar)
│   │   ├── services/     (API calls)
│   │   ├── styles/       (CSS files)
│   │   └── App.js        (Main component)
│   └── public/           (HTML file)
├── mobile/
│   ├── src/
│   │   ├── screens/      (UI screens)
│   │   ├── services/     (API calls)
│   │   ├── navigation/   (React Navigation)
│   │   └── App.js        (Entry point)
│   └── package.json
└── README.md
```

## Important Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Data
- `GET /api/hostels` - Get all hostels
- `GET /api/hostels/:id` - Get hostel details

### Payments
- `POST /api/payments/initiate` - Start M-Pesa payment
- `GET /api/payments/history` - View payment history

## Testing the App

### 1. Register New User
```
Name: Test User
Email: test@smartstay.com
Phone: 254712345678
Password: test123
```

### 2. Check Subscription Prompt
You'll see "Unlock SMARTSTAY CHUKA" message

### 3. Initiate Payment
Enter phone number and click "Pay with M-Pesa"

### 4. View Hostels
After payment, see all available hostels

## Database Setup

If using MongoDB Atlas (Cloud):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in .env

If using Local MongoDB:
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/smartstay-chuka`

## M-Pesa Setup

For production M-Pesa integration:
1. Register at https://developer.safaricom.co.ke
2. Create app and get credentials
3. Update .env with real credentials
4. See [MPESA_INTEGRATION_GUIDE.md](./MPESA_INTEGRATION_GUIDE.md)

## Common Commands

```bash
# Backend
cd backend
npm run dev        # Start development server
npm start          # Start production server

# Web
cd web
npm start          # Start development server
npm build          # Build for production
npm test           # Run tests

# Mobile
cd mobile
npm run android    # Run on Android
npm run ios        # Run on iOS
npm start          # Start development server
```

## Troubleshooting

### Backend not starting?
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process using port 5000
kill -9 <PID>
```

### MongoDB connection error?
```bash
# Verify MongoDB is running
mongosh

# Or check connection string in .env
MONGODB_URI=mongodb://localhost:27017/smartstay-chuka
```

### Web app not loading?
- Clear browser cache (Ctrl+F5)
- Check if backend is running (http://localhost:5000/api/health)
- Check browser console for errors

### M-Pesa payment not working?
- Verify credentials in .env
- Check backend logs: `npm run dev`
- Ensure phone number format: 254XXXXXXXXXX
- See MPESA_INTEGRATION_GUIDE.md

## Next Steps

1. **Configure M-Pesa** - Follow MPESA_INTEGRATION_GUIDE.md
2. **Add Hostels** - Create hostel data in database
3. **Customize UI** - Update colors and branding
4. **Deploy** - See deployment sections in component READMEs
5. **Monitor** - Set up error logging and analytics

## Documentation

- [Backend README](./backend/README.md) - API details
- [Web README](./web/README.md) - Frontend setup
- [Mobile README](./mobile/README.md) - App setup
- [M-Pesa Guide](./MPESA_INTEGRATION_GUIDE.md) - Payment integration

## Support

For issues or questions:
1. Check component READMEs
2. Review error logs
3. Check API responses
4. Verify credentials are correct

## License

MIT - Free to use and modify

---

**Version:** 1.0.0  
**Created:** January 2026
