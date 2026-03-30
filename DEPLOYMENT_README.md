# 🚀 Deployment Documentation

Welcome! This folder contains everything you need to deploy your Employee Management System.

## 📚 Documentation Files

| File | Purpose | When to Use |
|------|---------|-------------|
| **QUICK_DEPLOY.md** | 3-step deployment guide | Start here! Quick deployment |
| **DEPLOYMENT.md** | Detailed deployment guide | Need more details or troubleshooting |
| **PRE_DEPLOY_CHECKLIST.md** | Pre-deployment checklist | Before you start deploying |
| **ENV_SETUP.md** | Environment variables guide | Setting up env vars |
| **deploy.sh** / **deploy.bat** | Deployment helper scripts | Automate pre-deployment checks |

## 🎯 Quick Start (3 Steps)

### 1️⃣ Prepare
```bash
# Run the deployment helper (Mac/Linux)
./deploy.sh

# Or on Windows
deploy.bat
```

### 2️⃣ Deploy Backend
- Go to https://dashboard.render.com
- Create new Web Service
- Connect your GitHub repo
- Use settings from `QUICK_DEPLOY.md`
- Copy your backend URL

### 3️⃣ Deploy Frontend
- Go to https://vercel.com/new
- Import your GitHub repo
- Set root directory to `frontend`
- Add environment variable: `VITE_API_BASE_URL` = your backend URL
- Deploy!

## 📋 Configuration Files

### `vercel.json`
Configures Vercel deployment for the frontend:
- Build command
- Output directory
- SPA routing

### `render.yaml`
Blueprint for Render deployment (optional):
- Service configuration
- Build and start commands
- Environment variables

### `frontend/.env.example`
Template for environment variables:
- Copy to `.env.production`
- Update with your backend URL

## 🔧 What Gets Deployed

### Frontend (Vercel)
- React + Vite application
- Static files from `frontend/dist`
- Environment: `VITE_API_BASE_URL`

### Backend (Render)
- FastAPI application
- Python 3.11
- SQLite database (upgradeable to PostgreSQL)
- Auto-scaling on free tier

## 🌐 Architecture

```
User Browser
    ↓
Vercel (Frontend)
    ↓ API Calls
Render (Backend)
    ↓
SQLite/PostgreSQL
```

## ⚡ Deployment Features

### Automatic Deployments
- Push to `main` branch → Auto-deploy on both platforms
- Preview deployments on Vercel for PRs
- Zero-downtime deployments

### Free Tier Limits
- **Vercel**: Unlimited bandwidth, 100GB/month
- **Render**: 750 hours/month, sleeps after 15min inactivity

### Production Upgrades
- Vercel Pro: $20/month (custom domains, analytics)
- Render Starter: $7/month (no sleep, more resources)
- PostgreSQL: $7/month (persistent database)

## 🐛 Common Issues

### "Cannot connect to backend"
→ Check `VITE_API_BASE_URL` in Vercel environment variables

### "Backend is slow to respond"
→ Free tier sleeps after inactivity (~30s to wake up)

### "Database resets on deployment"
→ SQLite resets on each deploy. Upgrade to PostgreSQL.

### "CORS errors"
→ Update `allow_origins` in `backend/main.py` with your Vercel URL

## 📖 Detailed Guides

Need more help? Check these files:

1. **First time deploying?** → `QUICK_DEPLOY.md`
2. **Want detailed steps?** → `DEPLOYMENT.md`
3. **Environment variables?** → `ENV_SETUP.md`
4. **Pre-flight checks?** → `PRE_DEPLOY_CHECKLIST.md`

## 🆘 Support

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Vite Docs: https://vitejs.dev/guide/
- FastAPI Docs: https://fastapi.tiangolo.com/

## ✅ Success Checklist

After deployment, verify:
- [ ] Frontend loads at Vercel URL
- [ ] Can login to the application
- [ ] Employee list loads
- [ ] Can create/edit employees
- [ ] Chat functionality works
- [ ] No console errors

## 🎉 You're Ready!

Follow `QUICK_DEPLOY.md` to get started. Good luck! 🚀

---

**Estimated deployment time:** 15 minutes
**Difficulty:** Beginner-friendly
**Cost:** Free tier available on both platforms
