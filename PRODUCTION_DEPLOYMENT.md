# SMARTSTAY CHUKA - Complete Deployment Guide

## 📱 App Overview
- **Web App**: React frontend on port 3000
- **Backend API**: Node.js/Express on port 5001
- **Database**: MongoDB Atlas (cloud)
- **Authentication**: JWT tokens
- **Payment**: M-Pesa integration (KES 263/month)

---

## 🔐 Admin Features
- **URL**: `http://localhost:3000/admin/login`
- **Credentials**:
  - Email: `admin@smartstay.com`
  - Password: `admin123`
- **Features**:
  - ➕ Add new hostels
  - 📥 Import hostels (JSON format)
  - ✏️ Edit hostel details
  - 🗑️ Delete hostels
  - 📊 View all hostels

---

## 👤 User Features
- **Register**: Create new account
- **Login**: Access with email/password
- **Browse**: View all nearby hostels after subscription
- **Pay**: M-Pesa payment (KES 263 for 30 days)
- **Details**: See hostel info, rooms, amenities, caretaker contact

---

## 🚀 Local Development

### Prerequisites
- Node.js v24+ (already installed)
- npm (comes with Node)

### Start Servers
```bash
# Terminal 1 - Backend
cd backend
node test-server.js

# Terminal 2 - Frontend  
cd web
npm start
```

### Access App
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **API Health**: http://localhost:5001/api/health

---

## 📦 Production Build

### Build Web App
```bash
cd web
npm run build
```

This creates `web/build/` folder with production-ready files.

---

## 🌐 Deploy to Production

### Option 1: Railway (Backend) + Vercel (Frontend) ⭐ RECOMMENDED

#### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "SMARTSTAY CHUKA - Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smartstay-chuka.git
git push -u origin main
```

#### Step 2: Deploy Backend (Railway)
1. Visit https://railway.app
2. Sign up with GitHub
3. Create "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `smartstay-chuka` repository
6. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://jeanjudy663_db_user:AS2Mst5xQS7bXVtZ@cluster0.ag43qkt.mongodb.net/?appName=Cluster0
   JWT_SECRET=smartstay_chuka_secret_key_12345
   NODE_ENV=production
   PORT=5001
   ```
7. Railway will deploy automatically
8. Copy the Railway URL (e.g., `https://smartstay-chuka-backend.railway.app`)

#### Step 3: Update MongoDB Whitelist
1. Go to https://cloud.mongodb.com
2. Click "Network Access" → "IP Whitelist"
3. Click "Add IP Address"
4. Enter: `0.0.0.0/0` (allow all IPs)
5. Click "Confirm"

#### Step 4: Deploy Frontend (Vercel)
1. Visit https://vercel.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Set Project Settings:
   - **Framework**: Create React App
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://YOUR_RAILWAY_URL/api
   ```
7. Click "Deploy"
8. Vercel will automatically deploy

#### Step 5: Test Production Deployment
- **Frontend**: https://your-vercel-domain.vercel.app
- **Admin Login**: https://your-vercel-domain.vercel.app/admin/login
- **Backend API**: https://your-railway-domain.railway.app/api/health

---

### Option 2: Heroku (Full Stack)

#### Prerequisites
- Heroku account (https://heroku.com)
- Heroku CLI installed

#### Deploy
```bash
# Login to Heroku
heroku login

# Create app
heroku create smartstay-chuka

# Add MongoDB
heroku addons:create mongolab

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

---

## 📋 Hostel Data Import

### JSON Format for Bulk Import
```json
[
  {
    "name": "Hostel Name",
    "description": "Description",
    "location": "Location near campus",
    "distance": "0.5 km",
    "phoneNumber": "0712345678",
    "caretaker": "Caretaker Name",
    "caretakerPhone": "0723456789",
    "image": "https://image-url.com/hostel.jpg",
    "amenities": ["WiFi", "Security", "Hot Water"],
    "roomTypes": [
      {"type": "Single Room", "image": "https://..."},
      {"type": "Dorm (4-bed)", "image": "https://..."}
    ]
  }
]
```

### How to Import
1. Login to Admin Dashboard
2. Click "📥 Import Hostels"
3. Paste JSON array
4. Click "Import"

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Hostels (Requires Auth)
- `GET /api/hostels` - Get all hostels
- `GET /api/hostels/:id` - Get specific hostel
- `POST /api/hostels` - Add new hostel (admin)
- `PUT /api/hostels/:id` - Update hostel (admin)
- `DELETE /api/hostels/:id` - Delete hostel (admin)
- `POST /api/hostels/import` - Import multiple hostels (admin)

### Payments
- `POST /api/payments/initiate` - Start M-Pesa payment
- `POST /api/payments/mock/confirm` - Confirm mock payment
- `GET /api/payments/history` - Payment history

---

## 🔍 Troubleshooting

### Issue: MongoDB Connection Error
**Solution**: Add IP `0.0.0.0/0` to MongoDB Atlas Network Access

### Issue: Frontend can't reach backend
**Solution**: Update `REACT_APP_API_URL` in Vercel environment variables

### Issue: Admin login not working
**Solution**: Use credentials:
- Email: `admin@smartstay.com`
- Password: `admin123`

### Issue: Port already in use
**Solution**: Kill existing process
```bash
Get-Process node | Stop-Process -Force
```

---

## 📞 Support Contacts

For hostels around Chuka University, contact:
- Hilltop Hostel: 0712345678
- Campus View Hostel: 0734567890

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Vercel
- [ ] MongoDB whitelist updated (0.0.0.0/0)
- [ ] Environment variables configured
- [ ] Admin login tested
- [ ] User registration tested
- [ ] Payment flow tested
- [ ] Hostels display correctly
- [ ] M-Pesa credentials configured (optional)

---

## 🎉 Success!

Your SMARTSTAY CHUKA app is now live and ready for users!

**Production URLs:**
- Frontend: https://your-vercel-domain.vercel.app
- Backend API: https://your-railway-domain.railway.app
- Admin Dashboard: https://your-vercel-domain.vercel.app/admin/login
