# SMARTSTAY CHUKA Web App

A React web application for browsing hostels and managing subscriptions with M-Pesa integration.

## Quick Start

```bash
npm install
npm start
```

Runs at `http://localhost:3000`

## Project Structure

```
web/
├── src/
│   ├── components/
│   │   └── Navbar.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── Payment.js
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── Auth.css
│   │   ├── Home.css
│   │   ├── Payment.css
│   │   └── Navbar.css
│   ├── App.js
│   ├── index.js
│   └── index.css
├── public/
│   └── index.html
└── package.json
```

## Pages

### Login (`/login`)
- User authentication with email and password
- Redirect to home if already logged in
- Link to register page

### Register (`/register`)
- New user registration
- Captures first name, last name, email, phone number, password
- Auto-redirects to payment after registration
- Link to login page

### Home (`/`)
- Displays all available hostels (only for subscribed users)
- Shows hostel details: name, location, distance, phone, amenities
- Beautiful card-based layout
- Prompts non-subscribed users to subscribe
- Protected route

### Payment (`/payment`)
- M-Pesa subscription payment for KES 253
- Phone number input for M-Pesa
- Instructions on how payment works
- Subscription duration: 30 days
- Protected route

## Services

### API Service (`src/services/api.js`)

**Auth Service:**
- `register(data)` - Register new user
- `login(data)` - User login
- `logout()` - Clear local storage

**Hostel Service:**
- `getAllHostels()` - Get all hostels
- `getHostelById(id)` - Get hostel details
- `createHostel(data)` - Create hostel
- `updateHostel(id, data)` - Update hostel
- `addReview(id, data)` - Add review

**Payment Service:**
- `initiateMpesaPayment(data)` - Start M-Pesa payment
- `getPaymentHistory()` - Get user's payments

**User Service:**
- `getProfile()` - Get user profile

## Components

### Navbar
- Logo and app title
- User welcome message
- Subscription status badge
- Logout button
- Responsive design

## Styling

Modern gradient design with:
- Purple theme (#667eea, #764ba2)
- Responsive grid layout
- Smooth transitions and hover effects
- Mobile-friendly cards
- Clean typography

## Features

✅ **User Authentication**
- Secure JWT token storage
- Auto-logout on token expiration
- Protected routes

✅ **Hostel Browsing**
- Grid display of hostels
- Detailed hostel information
- Amenities tags
- Ratings and reviews

✅ **Subscription Management**
- M-Pesa integration
- 30-day subscriptions
- KES 253 fixed price
- Payment history

✅ **Responsive Design**
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly UI

## API Integration

Backend URL: `http://localhost:5000/api`

All authenticated requests automatically include JWT token from localStorage.

## Local Storage

**token** - JWT authentication token  
**user** - User object with subscription info

## Protected Routes

Routes require authentication:
- `/` - Home (also requires subscription)
- `/payment` - Payment page
- `/users/profile` - User profile

Public routes:
- `/login` - Login page
- `/register` - Registration page

## Environment Variables

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Scripts

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests
npm test

# Eject configuration (careful!)
npm eject
```

## Dependencies

- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Client-side routing
- **axios** - HTTP client
- **react-toastify** - Notifications

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

1. Start backend server
2. Run `npm install`
3. Run `npm start`
4. Open browser to `localhost:3000`

## Deployment

### Vercel
```bash
npm run build
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=build
```

### GitHub Pages
```bash
npm run build
gh-pages -d build
```

## Troubleshooting

**Connection refused to backend?**
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in .env

**Login not working?**
- Verify backend is responding
- Check browser console for errors
- Ensure MongoDB is connected

**Payment STK not showing?**
- Verify M-Pesa credentials in backend
- Check phone number format (254XXXXXXXXXX)
- Check browser console and backend logs

## Notes

- Token is stored in localStorage for persistence
- Session survives page refresh
- Token is sent in Authorization header for all API calls
- Error messages are user-friendly
- Loading states prevent duplicate submissions

---

**Version:** 1.0.0  
**Last Updated:** January 2026
