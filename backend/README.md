# SMARTSTAY CHUKA Backend API

Node.js and Express backend with MongoDB, M-Pesa integration, and JWT authentication.

## Quick Start

```bash
npm install
cp .env.example .env
# Configure .env with your MongoDB and M-Pesa credentials
npm run dev
```

Server runs on `http://localhost:5000`

## Project Structure

```
backend/
├── models/
│   ├── User.js
│   ├── Hostel.js
│   └── Payment.js
├── controllers/
│   ├── authController.js
│   ├── hostelController.js
│   └── paymentController.js
├── routes/
│   ├── auth.js
│   ├── hostels.js
│   ├── payments.js
│   ├── subscriptions.js
│   └── users.js
├── middleware/
│   └── auth.js
├── utils/
│   └── mpesaService.js
├── server.js
├── package.json
└── .env.example
```

## API Routes

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login

### Hostel Routes (`/api/hostels`)
- `GET /` - Get all verified hostels
- `GET /:id` - Get hostel details
- `POST /` - Create hostel (auth required)
- `PUT /:id` - Update hostel (auth + owner)
- `POST /:id/review` - Add review (auth required)

### Payment Routes (`/api/payments`)
- `POST /initiate` - Initiate M-Pesa payment (auth required)
- `POST /callback` - M-Pesa callback (webhook)
- `GET /history` - Payment history (auth required)

### User Routes (`/api/users`)
- `GET /profile` - Get user profile (auth required)

### Subscription Routes (`/api/subscriptions`)
- `GET /status` - Get subscription status (auth required)

## Database Models

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  phoneNumber: String (unique),
  password: String (hashed),
  isSubscribed: Boolean,
  subscriptionExpiryDate: Date,
  createdAt: Date
}
```

### Hostel Model
```javascript
{
  name: String,
  description: String,
  location: String,
  distance: String,
  phoneNumber: String,
  email: String,
  roomTypes: [{type, price, capacity, available}],
  amenities: [String],
  images: [String],
  rating: Number,
  reviews: [{userId, userName, rating, comment, createdAt}],
  owner: ObjectId (ref: User),
  verified: Boolean,
  createdAt: Date
}
```

### Payment Model
```javascript
{
  userId: ObjectId (ref: User),
  phoneNumber: String,
  amount: Number (default: 253),
  status: String (pending|completed|failed),
  mpesaReceiptNumber: String,
  transactionId: String,
  createdAt: Date,
  completedAt: Date
}
```

## M-Pesa Integration

The `mpesaService` handles M-Pesa communication:

1. **Generate Access Token** - OAuth token for M-Pesa API
2. **Initiate STK Push** - Send payment prompt to user's phone
3. **Validate Callback** - Verify payment completion

### Payment Flow

```
User → Frontend
Frontend → Backend (/api/payments/initiate)
Backend → M-Pesa (Generate Token)
Backend → M-Pesa (STK Push)
M-Pesa → User Phone (Prompt)
User → M-Pesa (Enter PIN)
M-Pesa → Backend (Callback)
Backend → Database (Update Payment & User)
Backend → Frontend (Success)
```

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/smartstay-chuka

# JWT
JWT_SECRET=your_jwt_secret_key_here

# M-Pesa Sandbox
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=171414
MPESA_PASSKEY=your_passkey

# Subscription
SUBSCRIPTION_FEE=253
CALLBACK_URL=http://localhost:5000/api/payments/callback
```

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **axios** - HTTP client for M-Pesa API
- **cors** - Cross-origin requests
- **express-validator** - Input validation
- **dotenv** - Environment variables

## Development

```bash
# Install dependencies
npm install

# Run development server with auto-reload
npm run dev

# Run production server
npm start
```

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "254712345678",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get all hostels
curl http://localhost:5000/api/hostels

# Initiate payment (with token)
curl -X POST http://localhost:5000/api/payments/initiate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "254712345678"}'
```

## Error Handling

All endpoints return JSON responses with appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token expiration (30 days)
- Input validation on all routes
- CORS protection
- Environment variables for secrets
- Protected routes with authentication middleware

## Notes

- All passwords are hashed before storage
- Tokens expire after 30 days
- M-Pesa integration uses sandbox for testing
- Database uses MongoDB connection string in .env
- All payment callbacks are logged for debugging

---

**Version:** 1.0.0  
**Last Updated:** January 2026
