# SMARTSTAY CHUKA - Full Stack Application

A comprehensive hostel booking and subscription platform for students around Chuka University. Users can browse hostel information, manage subscriptions via M-Pesa, and leave reviews.

## 📁 Project Structure

```
SMARTSTAY CHUKA/
├── backend/              # Node.js + Express backend API
├── web/                  # React web application
├── mobile/               # React Native mobile app
└── README.md
```

## 🚀 Features

### Core Features
- **User Authentication**: Registration and login with JWT
- **Hostel Listings**: Browse all hostels with details and amenities
- **M-Pesa Integration**: Subscribe for KES 253 for 30 days
- **Subscription Management**: Track subscription status and renewal
- **Reviews & Ratings**: Leave reviews on hostels
- **Cross-Platform**: Web and mobile app support

### Technology Stack

**Backend:**
- Node.js + Express
- MongoDB for database
- M-Pesa API integration
- JWT authentication
- RESTful API

**Web Frontend:**
- React 18
- React Router for navigation
- Axios for API calls
- CSS styling

**Mobile App:**
- React Native
- React Navigation
- AsyncStorage for local storage
- M-Pesa integration

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud)
- M-Pesa API credentials
- npm or yarn

## 🔧 Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

**Configure .env file with:**
```
MONGODB_URI=mongodb://localhost:27017/smartstay-chuka
JWT_SECRET=your_secret_key
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
```

Start backend:
```bash
npm run dev
```

### 2. Web App Setup

```bash
cd web
npm install
```

Start development server:
```bash
npm start
```

Access at: `http://localhost:3000`

### 3. Mobile App Setup

```bash
cd mobile
npm install
```

For Android:
```bash
npm run android
```

For iOS:
```bash
npm run ios
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Hostels
- `GET /api/hostels` - Get all hostels
- `GET /api/hostels/:id` - Get hostel details
- `POST /api/hostels` - Create hostel (authenticated)
- `PUT /api/hostels/:id` - Update hostel (authenticated)
- `POST /api/hostels/:id/review` - Add review (authenticated)

### Payments
- `POST /api/payments/initiate` - Initiate M-Pesa payment
- `POST /api/payments/callback` - M-Pesa callback
- `GET /api/payments/history` - Get payment history (authenticated)

### Users
- `GET /api/users/profile` - Get user profile (authenticated)

## 💳 M-Pesa Integration

### How Payment Works
1. User enters M-Pesa phone number
2. Backend initiates STK push request
3. M-Pesa prompt appears on user's phone
4. User enters PIN to authorize
5. Callback updates user subscription status
6. User gains access to all hostel listings

### Setting Up M-Pesa
1. Register on [Safaricom Developer](https://developer.safaricom.co.ke)
2. Get Consumer Key, Consumer Secret
3. Get Short Code and Passkey
4. Configure in backend `.env` file

## 🔐 Security

- Password hashing with bcryptjs
- JWT token-based authentication
- Environment variables for sensitive data
- CORS enabled for frontend access
- Input validation on all routes

## 📂 Database Schema

**User:**
- firstName, lastName, email, phoneNumber
- password (hashed)
- isSubscribed, subscriptionExpiryDate

**Hostel:**
- name, description, location, distance
- phoneNumber, email
- roomTypes (Single, Double, Triple, Dormitory)
- amenities, images
- rating, reviews
- owner (ref), verified

**Payment:**
- userId, phoneNumber, amount
- status (pending, completed, failed)
- mpesaReceiptNumber, transactionId
- timestamps

## 🧪 Testing

### Test Login
```
Email: test@example.com
Password: password123
```

### Test M-Pesa Payment
Phone: 254712345678 (Sandbox)

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartstay-chuka
JWT_SECRET=your_secret_key
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=171414
MPESA_PASSKEY=your_passkey
SUBSCRIPTION_FEE=253
NODE_ENV=development
```

### Web (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend (Heroku/Railway)
```bash
git push heroku main
```

### Web App (Vercel/Netlify)
```bash
npm run build
# Deploy build folder
```

### Mobile (App Store/Play Store)
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

## 📞 Support & Contact

For issues or feature requests, contact the development team.

## 📄 License

MIT License - Free to use and modify

---

**Last Updated:** January 2026
**Version:** 1.0.0
