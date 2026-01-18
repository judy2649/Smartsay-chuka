#!/bin/bash

echo "🚀 SMARTSTAY CHUKA Deployment Setup"
echo "===================================="
echo ""

# Step 1: Initialize Git
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial SMARTSTAY CHUKA commit"
else
    echo "✅ Git repository already initialized"
fi

echo ""
echo "📋 Next Steps for Deployment:"
echo ""
echo "1️⃣  Create GitHub Repository:"
echo "   - Go to https://github.com/new"
echo "   - Create repo: smartstay-chuka"
echo "   - Then run:"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/smartstay-chuka.git"
echo "   git push -u origin main"
echo ""
echo "2️⃣  Deploy Backend with Railway:"
echo "   - Visit: https://railway.app"
echo "   - Sign in with GitHub"
echo "   - Create New Project > Deploy from GitHub"
echo "   - Select smartstay-chuka repo"
echo "   - Add these environment variables:"
echo "     MONGODB_URI=mongodb+srv://jeanjudy663_db_user:AS2Mst5xQS7bXVtZ@cluster0.ag43qkt.mongodb.net"
echo "     JWT_SECRET=smartstay_chuka_secret_key_12345"
echo "     NODE_ENV=production"
echo ""
echo "3️⃣  Deploy Frontend with Vercel:"
echo "   - Visit: https://vercel.com"
echo "   - Click 'New Project'"
echo "   - Import GitHub repo"
echo "   - Set Root Directory: web"
echo "   - Add REACT_APP_API_URL=<your-railway-backend-url>/api"
echo ""
echo "4️⃣  Update MongoDB Whitelist:"
echo "   - Go to MongoDB Atlas"
echo "   - Network Access > IP Whitelist"
echo "   - Add: 0.0.0.0/0"
echo ""
echo "✨ Done! Your app will be live in 5-10 minutes"
