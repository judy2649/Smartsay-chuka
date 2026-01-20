# 🚀 SMARTSTAY CHUKA - Glitch Deployment Blueprint

## Quick Start (3 Steps)

### Step 1: Import to Glitch
```
1. Go to https://glitch.com
2. Click "New Project" → "Import from GitHub"
3. Paste: https://github.com/judy2649/Smartsay-chuka
4. Wait for import to complete ✅
```

### Step 2: Configure Environment
1. Click **.env** file
2. Add these variables:
```
MONGODB_URI=mongodb+srv://jeanjudy663_db_user:AS2Mst5xQS7bXVtZ@cluster0.ag43qkt.mongodb.net/smartstay
JWT_SECRET=smartstay_chuka_secret_key_12345
MPESA_CONSUMER_KEY=W1t82CvAoTMUAtYNAZNGs0GAR2k2coVyT8HETzQtITVqpWmM
MPESA_CONSUMER_SECRET=QbPw1qmM4tz19JCJwaHwVE7julAUFTSb5ZJBI4Rh8TSGIxJ4auz65erPHZosIQHS
MPESA_SHORTCODE=174379
MPESA_PASSKEY=test_passkey
MPESA_ACCOUNT=0794173314
NODE_ENV=production
SUBSCRIPTION_FEE=263
PORT=3000
```

### Step 3: Deploy
1. Glitch auto-deploys when you import
2. Your URL: `https://your-project-name.glitch.me` ✅
3. Test: `https://your-project-name.glitch.me/api/health`

---

## File Structure (After Import)
```
smartstay-chuka/
├── backend/
│   ├── test-server.js (main server)
│   ├── package.json (dependencies)
│   └── .env (environment variables)
├── web/
│   └── (React frontend - deploy to Vercel)
└── .glitchrc (Glitch configuration)
```

---

## Glitch Features
- ✅ Auto-deploys from GitHub
- ✅ Free hosting
- ✅ Always-on server (no sleep)
- ✅ Real-time code editor
- ✅ Built-in terminal
- ✅ Logs viewer

---

## After Backend is Live
1. Copy your Glitch URL: `https://your-project-name.glitch.me`
2. Go to **[vercel.com](https://vercel.com)**
3. Deploy frontend (web folder)
4. Add env variable: `REACT_APP_API_URL=https://your-project-name.glitch.me`
5. Done! 🎉

---

## Testing Endpoints
```bash
# Health check
curl https://your-project-name.glitch.me/api/health

# Get hostels
curl https://your-project-name.glitch.me/api/hostels

# Register user
curl -X POST https://your-project-name.glitch.me/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

---

## Troubleshooting

**Issue**: Project not starting
- **Fix**: Check `.env` file has all variables
- **Fix**: Open Glitch console (Tools → Logs) to see errors

**Issue**: Port conflicts
- **Fix**: Don't change PORT in .env, Glitch manages it

**Issue**: Dependencies not installing
- **Fix**: Delete `node_modules`, Glitch will reinstall

---

## API Endpoints Ready
- POST `/api/auth/register` - Create account
- POST `/api/auth/login` - Login
- GET `/api/hostels` - List hostels
- POST `/api/hostels` - Add hostel (admin)
- PUT `/api/hostels/:id` - Edit hostel
- DELETE `/api/hostels/:id` - Delete hostel
- POST `/api/payments/initiate` - Start payment
- POST `/api/payments/mock/confirm` - Mock payment
- GET `/api/payments/history` - Payment history

---

**You're ready to deploy!** 🚀
