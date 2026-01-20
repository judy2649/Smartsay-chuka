# 📱 SMARTSTAY CHUKA - Vercel Deployment Blueprint

## Deploy Frontend (Web App) to Vercel

### Step 1: Go to Vercel
```
1. Visit https://vercel.com
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel
```

### Step 2: Create New Project
1. Click **"New Project"**
2. Select your repo: **`judy2649/Smartsay-chuka`**
3. Click **"Import"**

### Step 3: Configure Project
- **Framework Preset**: React
- **Root Directory**: `web`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `build` (auto-detected)

### Step 4: Add Environment Variable
Click **"Environment Variables"**:
```
Key: REACT_APP_API_URL
Value: https://your-glitch-project.glitch.me
```

(Replace with your actual Glitch URL from backend deployment)

### Step 5: Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes ✅
3. You'll get a URL like: `https://smartstay-chuka.vercel.app`

---

## Frontend Features Deployed
- ✅ User Login/Register
- ✅ Browse Hostels
- ✅ View Hostel Details
- ✅ M-Pesa Payment Form
- ✅ Admin Dashboard
- ✅ Admin Login
- ✅ Hostel Management (Add/Edit/Delete)

---

## Your App URLs
```
Frontend (Web):  https://smartstay-chuka.vercel.app
Backend (API):   https://your-glitch-project.glitch.me
Admin Dashboard: https://smartstay-chuka.vercel.app/admin/login
```

---

## Test After Deployment
1. Open your Vercel URL
2. Try **Register** with email/password
3. Try **Login**
4. View hostels (after subscription)
5. Go to Admin: `/admin/login`
   - Email: `admin@smartstay.com`
   - Password: `admin123`

---

## Redeploy if Needed
1. Make changes to code
2. Push to GitHub: `git push origin main`
3. Vercel auto-redeploys ✅

---

**Your SMARTSTAY CHUKA app is now LIVE and FREE!** 🎉
