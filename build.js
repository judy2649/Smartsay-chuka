#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n🚀 SMARTSTAY CHUKA - Production Build Setup\n');
console.log('============================================\n');

// Check Node version
const nodeVersion = process.version;
console.log(`✅ Node.js ${nodeVersion}`);

// Build web app
console.log('\n📦 Building web app...');
const webDir = path.join(__dirname, 'web');
const buildExists = fs.existsSync(path.join(webDir, 'build'));

if (!buildExists) {
  console.log('   Running: npm run build...');
  const { execSync } = require('child_process');
  try {
    execSync('cd web && npm run build', { stdio: 'inherit' });
    console.log('✅ Web app built successfully!');
  } catch (err) {
    console.error('❌ Build failed');
    process.exit(1);
  }
} else {
  console.log('✅ Web app build already exists');
}

console.log('\n============================================');
console.log('\n📋 DEPLOYMENT CHECKLIST:\n');
console.log('1. ✅ Web app built (in ./web/build/)');
console.log('2. ⏳ Push to GitHub:');
console.log('   git add .');
console.log('   git commit -m "Production build"');
console.log('   git push origin main\n');
console.log('3. ⏳ Deploy Backend (Railway):');
console.log('   - Visit https://railway.app');
console.log('   - Create new project from GitHub');
console.log('   - Set env vars: MONGODB_URI, JWT_SECRET, NODE_ENV=production\n');
console.log('4. ⏳ Deploy Frontend (Vercel):');
console.log('   - Visit https://vercel.com');
console.log('   - Import from GitHub');
console.log('   - Set root directory: web\n');
console.log('5. ⏳ Admin Dashboard: /admin/login');
console.log('   - Email: admin@smartstay.com');
console.log('   - Password: admin123\n');
console.log('6. ⏳ User Login: /login');
console.log('   - Register or use test account\n');
console.log('============================================\n');
