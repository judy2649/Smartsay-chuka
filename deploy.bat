@echo off
color 0A
title SMARTSTAY CHUKA - Deployment Setup

echo.
echo ==================================================
echo   SMARTSTAY CHUKA - Deployment Setup
echo ==================================================
echo.

REM Check if Git is initialized
if not exist ".git" (
    echo [1/4] Initializing Git repository...
    git init
    git add .
    git commit -m "Initial SMARTSTAY CHUKA commit"
    echo.
    echo [✓] Git initialized successfully
) else (
    echo [✓] Git repository already initialized
)

echo.
echo ==================================================
echo   DEPLOYMENT STEPS
echo ==================================================
echo.
echo [Step 1] Create GitHub Repository
echo   - Go to: https://github.com/new
echo   - Create repo: smartstay-chuka
echo   - Then run these commands:
echo.
echo   git branch -M main
echo   git remote add origin https://github.com/YOUR_USERNAME/smartstay-chuka.git
echo   git push -u origin main
echo.
echo [Step 2] Deploy Backend with Railway
echo   - Visit: https://railway.app
echo   - Sign in with GitHub
echo   - Create New Project from smartstay-chuka repo
echo   - Set environment variables:
echo     * MONGODB_URI=mongodb+srv://jeanjudy663_db_user:...
echo     * JWT_SECRET=smartstay_chuka_secret_key_12345
echo     * NODE_ENV=production
echo.
echo [Step 3] Deploy Frontend with Vercel
echo   - Visit: https://vercel.com
echo   - Import smartstay-chuka repo from GitHub
echo   - Set Root Directory: web
echo   - Set environment: REACT_APP_API_URL=YOUR_RAILWAY_URL/api
echo.
echo [Step 4] Update MongoDB Whitelist
echo   - Go to: https://cloud.mongodb.com
echo   - Network Access ^> IP Whitelist
echo   - Add IP: 0.0.0.0/0
echo.
echo ==================================================
echo   ✅ Your app will be live in 5-10 minutes!
echo ==================================================
echo.
pause
