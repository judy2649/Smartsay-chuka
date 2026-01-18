# SMARTSTAY CHUKA - Complete Setup Guide

This guide covers setup for both the web and Flutter mobile applications.

---

## 📁 PROJECT STRUCTURE

```
SMARTSTAY CHUKA/
├── backend/                    # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── server.js
│   ├── package.json
│   └── .env
├── web/                        # React web application
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── mobile/                     # Flutter mobile app
    ├── lib/
    │   ├── screens/
    │   ├── services/
    │   ├── models/
    │   ├── utils/
    │   └── main.dart
    ├── pubspec.yaml
    ├── SRS.md
    └── README.md
```

---

## 🚀 QUICK START

### Backend Setup
```bash
cd backend
npm install
# Edit .env with MongoDB URI and M-Pesa credentials
npm run dev
# Server runs on http://localhost:5000
```

### Web Setup
```bash
cd web
npm install
npm start
# App runs on http://localhost:3000
```

### Mobile Setup (Flutter)
```bash
cd mobile
flutter pub get
# Configure Firebase in lib/firebase_options.dart
# Configure M-Pesa in lib/services/mpesa_service.dart
flutter run
```

---

## 🔐 CREDENTIALS

### Demo Admin Account (Web)
- **Email:** `admin@smartstay.com`
- **Password:** `admin123`
- **Access:** Full admin dashboard with hostel management

### Demo User Account (Web/Mobile)
- **Email:** `test@smartstay.com`
- **Password:** `password123`
- **Access:** Browse hostels after subscription

### Test M-Pesa
- **Short Code:** 174379 (Sandbox)
- **Account Number:** 0794173314
- **Amount:** KES 253 (Monthly) or KES 650 (Quarterly)

---

## 📋 FEATURES BY PLATFORM

### Web Application (React)
✅ User registration and login  
✅ Hostel discovery and browsing  
✅ Admin dashboard for hostel management  
✅ Subscription checkout  
✅ Mock payment processing  
✅ Responsive design with purple theme  
✅ Hostel bulk import via JSON  

### Mobile Application (Flutter)
✅ Firebase authentication  
✅ Real-time hostel listings  
✅ M-Pesa payment integration  
✅ Subscription management  
✅ PDF hostel profile downloads  
✅ Admin hostel CRUD operations  
✅ Material Design 3 UI  
✅ Offline support with caching  

### Backend (Node.js/Express)
✅ User authentication with JWT  
✅ Hostel management APIs  
✅ M-Pesa callback handling  
✅ Subscription validation  
✅ Admin role-based access control  
✅ Firestore + MongoDB integration support  

---

## 🔧 CONFIGURATION CHECKLIST

### Firebase Setup (Mobile)
- [ ] Create Firebase project at console.firebase.google.com
- [ ] Enable Authentication (Email/Password)
- [ ] Create Firestore database
- [ ] Enable Storage
- [ ] Download google-services.json (Android)
- [ ] Download GoogleService-Info.plist (iOS)
- [ ] Update `firebase_options.dart` with credentials

### M-Pesa Setup
- [ ] Register at https://developer.safaricom.co.ke
- [ ] Get Consumer Key & Consumer Secret
- [ ] Update `lib/services/mpesa_service.dart`
- [ ] Update `backend/.env` with M-Pesa config

### Environment Variables

**backend/.env:**
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartstay
JWT_SECRET=your_secret_key
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=174379
SUBSCRIPTION_FEE=253
```

---

## 📱 SCREENS & WORKFLOWS

### Web App Workflow
1. **Splash/Home** → Register or Login
2. **Login** → Dashboard (if subscribed) or Payment
3. **Payment** → Mock M-Pesa flow
4. **Home** → Browse 6 mock hostels with details
5. **Admin Login** → Manage hostels, import bulk data

### Mobile App Workflow
1. **Splash** → Auto-detect login status
2. **Login/Register** → Firebase Auth
3. **Home** → Check subscription status
4. **Subscription** → Select plan + M-Pesa payment
5. **Hostels** → Browse Firestore hostels
6. **Details** → Download PDF profile

---

## 💾 DATABASE SCHEMA

### Firestore Collections (Mobile)
```javascript
users/ {
  uid → { email, firstName, lastName, isSubscribed, ... }
}

hostels/ {
  docId → { name, location, amenities[], roomTypes[], ... }
}

subscriptions/ {
  docId → { userId, plan, amount, startDate, endDate, ... }
}

payments/ {
  docId → { userId, transactionId, status, mpesaReceipt, ... }
}
```

### MongoDB Collections (Backend)
```javascript
users → { email, firstName, lastName, isSubscribed, isAdmin }
hostels → { name, location, amenities, roomTypes, verified }
payments → { userId, amount, status, mpesaReceiptNumber }
subscriptions → { userId, plan, status, expiryDate }
```

---

## 🧪 TESTING CREDENTIALS

| Platform | Email | Password | Role |
|----------|-------|----------|------|
| Web | admin@smartstay.com | admin123 | Admin |
| Web | test@smartstay.com | password123 | User |
| Mobile | Any Firebase email | Any password | User |

---

## 🐛 TROUBLESHOOTING

### Web App Not Loading
```bash
# Kill port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows

# Restart
cd web && npm start
```

### Backend Not Responding
```bash
# Check if MongoDB is reachable
ping mo.fwuaggk.mongodb.net

# Kill and restart
npm run dev
```

### Flutter Build Issues
```bash
flutter clean
flutter pub get
flutter run
```

### Firebase Connection Error
- Verify API credentials in firebase_options.dart
- Check Firestore security rules
- Ensure app ID matches Firebase config

---

## 📚 DOCUMENTATION

- **Web SRS:** `/web/README.md`
- **Mobile SRS:** `/mobile/SRS.md`
- **Mobile Setup:** `/mobile/README.md`
- **Architecture:** `/ARCHITECTURE_GUIDE.md`

---

## 🚢 DEPLOYMENT

### Web (React)
```bash
cd web
npm run build
# Deploy to Vercel, Netlify, or your server
```

### Mobile (Flutter)
```bash
# Android APK
flutter build apk --release

# iOS IPA
flutter build ipa --release

# Upload to Google Play & App Store
```

### Backend (Node.js)
```bash
# Deploy to Heroku, Railway, or your server
git push heroku main
```

---

## 🔄 RUNNING BOTH SERVERS

**Open two terminals:**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Web
cd web
npm start
```

Both will run in parallel:
- Backend: http://localhost:5000
- Web: http://localhost:3000

---

## 📞 SUPPORT

For issues:
1. Check error logs in console
2. Review SRS.md for requirements
3. Verify all credentials are correct
4. Ensure network connectivity

---

**Last Updated:** January 2026  
**Version:** 1.0.0
