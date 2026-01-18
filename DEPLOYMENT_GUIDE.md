# SMARTSTAY CHUKA - Deployment Guide

## Option 1: Deploy with Vercel (Recommended - Free & Easy)

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)

### Steps:

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smartstay-chuka.git
git push -u origin main
```

2. **Deploy Backend (Express API)**
- Go to https://railway.app
- Sign up with GitHub
- Create new project → "Deploy from GitHub"
- Select your smartstay-chuka repo
- Set Environment Variables:
  - `MONGODB_URI` = Your MongoDB Atlas connection string
  - `JWT_SECRET` = Your secret key
  - `NODE_ENV` = production
  - `PORT` = 5001 (or let Railway assign)

3. **Deploy Frontend (React)**
- Go to https://vercel.com
- Click "New Project"
- Import your GitHub repo
- Set build settings:
  - Framework: Next.js / Create React App
  - Build Command: `npm run build`
  - Output Directory: `web/build`
- Set Environment Variables:
  - `REACT_APP_API_URL` = Your Railway backend URL

---

## Option 2: Deploy with Railway (Backend) + Netlify (Frontend)

### Backend on Railway:
1. Visit https://railway.app
2. Create new project from GitHub repo
3. Add PostgreSQL/MongoDB addon
4. Set environment variables
5. Deploy

### Frontend on Netlify:
1. Visit https://netlify.com
2. Connect GitHub repo
3. Set build command: `cd web && npm run build`
4. Set publish directory: `web/build`

---

## Option 3: Manual Deployment (VPS/Heroku)

### Using Heroku:
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create smartstay-chuka

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

---

## Environment Variables Needed

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secret_key
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
SUBSCRIPTION_FEE=263
NODE_ENV=production
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-deployed-backend.com/api
```

---

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Deploy backend API
- [ ] Deploy frontend app
- [ ] Update MongoDB IP whitelist to `0.0.0.0/0`
- [ ] Configure M-Pesa credentials
- [ ] Test login flow
- [ ] Test payment flow
- [ ] Monitor logs

---

## Useful Links

- Railway: https://railway.app
- Vercel: https://vercel.com
- Netlify: https://netlify.com
- Heroku: https://heroku.com
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
