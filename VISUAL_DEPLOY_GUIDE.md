# 🎨 Visual Deployment Guide

A step-by-step visual guide to deploying your Employee Management System.

## 📊 Deployment Flow

```
┌─────────────────┐
│  Your Computer  │
│   (Local Dev)   │
└────────┬────────┘
         │ git push
         ▼
┌─────────────────┐
│     GitHub      │
│  (Repository)   │
└────┬───────┬────┘
     │       │
     │       └──────────────┐
     │                      │
     ▼                      ▼
┌─────────────┐      ┌─────────────┐
│   Render    │      │   Vercel    │
│  (Backend)  │◄─────┤ (Frontend)  │
└─────────────┘ API  └─────────────┘
     │               
     ▼               
┌─────────────┐
│   SQLite    │
│ (Database)  │
└─────────────┘
```

## 🔢 Step-by-Step Process

### Step 1: Prepare Your Code
```
┌──────────────────────────────────┐
│ 1. Check all files are committed │
│ 2. Push to GitHub                │
│ 3. Verify repo is accessible     │
└──────────────────────────────────┘
         │
         ▼
    ✅ Ready!
```

**Commands:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

### Step 2: Deploy Backend on Render
```
┌─────────────────────────────────────┐
│ Render Dashboard                    │
├─────────────────────────────────────┤
│ 1. Click "New +" → "Web Service"   │
│ 2. Connect GitHub                   │
│ 3. Select your repository           │
│ 4. Configure settings:              │
│    • Name: ems-backend              │
│    • Runtime: Python 3              │
│    • Build: cd backend && pip...    │
│    • Start: cd backend && uvicorn...│
│ 5. Click "Create Web Service"      │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ ⏳ Building... (5-10 minutes)       │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ ✅ Backend Live!                    │
│ URL: https://ems-backend-xxx.       │
│      onrender.com                   │
└─────────────────────────────────────┘
```

**Important:** Copy this URL! You'll need it for the frontend.

---

### Step 3: Deploy Frontend on Vercel
```
┌─────────────────────────────────────┐
│ Vercel Dashboard                    │
├─────────────────────────────────────┤
│ 1. Click "Add New..." → "Project"  │
│ 2. Import from GitHub               │
│ 3. Select your repository           │
│ 4. Configure:                       │
│    • Framework: Vite                │
│    • Root Directory: frontend       │
│    • Build Command: npm run build   │
│ 5. Add Environment Variable:        │
│    VITE_API_BASE_URL =              │
│    https://ems-backend-xxx.         │
│    onrender.com                     │
│ 6. Click "Deploy"                   │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ ⏳ Building... (2-5 minutes)        │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ ✅ Frontend Live!                   │
│ URL: https://your-project.          │
│      vercel.app                     │
└─────────────────────────────────────┘
```

---

### Step 4: Update CORS Settings
```
┌─────────────────────────────────────┐
│ Update backend/main.py              │
├─────────────────────────────────────┤
│ allow_origins=[                     │
│   "https://your-project.vercel.app",│
│   "http://localhost:5173",          │
│ ]                                   │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ git add backend/main.py             │
│ git commit -m "Update CORS"         │
│ git push origin main                │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ ✅ Render auto-redeploys            │
└─────────────────────────────────────┘
```

---

## 🎯 Configuration Checklist

### Render Settings
```
┌─────────────────────────────────────┐
│ Setting          │ Value            │
├──────────────────┼──────────────────┤
│ Name             │ ems-backend      │
│ Runtime          │ Python 3         │
│ Build Command    │ cd backend &&    │
│                  │ pip install -r   │
│                  │ requirements.txt │
│ Start Command    │ cd backend &&    │
│                  │ uvicorn main:app │
│                  │ --host 0.0.0.0   │
│                  │ --port $PORT     │
└─────────────────────────────────────┘
```

### Vercel Settings
```
┌─────────────────────────────────────┐
│ Setting          │ Value            │
├──────────────────┼──────────────────┤
│ Framework        │ Vite             │
│ Root Directory   │ frontend         │
│ Build Command    │ npm run build    │
│ Output Directory │ dist             │
│ Install Command  │ npm install      │
│                  │                  │
│ Environment Variables:              │
│ VITE_API_BASE_URL = <backend-url>  │
└─────────────────────────────────────┘
```

---

## 🔄 Continuous Deployment

After initial setup, deployments are automatic:

```
┌──────────────┐
│ Make changes │
│ to your code │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  git push    │
└──────┬───────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│   Render     │  │   Vercel     │
│ Auto-deploys │  │ Auto-deploys │
└──────────────┘  └──────────────┘
       │                 │
       └────────┬────────┘
                ▼
         ✅ Live Updates!
```

---

## 📱 Testing Your Deployment

### 1. Check Backend
```
Visit: https://ems-backend-xxx.onrender.com
Expected: {"message": "Welcome to the Employee Management System API"}
```

### 2. Check Frontend
```
Visit: https://your-project.vercel.app
Expected: Login page loads
```

### 3. Test Login
```
1. Enter credentials
2. Click Login
3. Should redirect to dashboard
```

### 4. Test Features
```
✓ View employees
✓ Add employee
✓ Edit employee
✓ Delete employee
✓ Chat functionality
✓ Onboarding plans
```

---

## 🚨 Troubleshooting Visual Guide

### Problem: Frontend can't connect to backend
```
┌─────────────────┐
│ Check Browser   │
│ Console         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│ CORS Error?     │─Yes─→│ Update CORS in  │
│                 │      │ backend/main.py │
└────────┬────────┘      └─────────────────┘
         │ No
         ▼
┌─────────────────┐      ┌─────────────────┐
│ Network Error?  │─Yes─→│ Check           │
│                 │      │ VITE_API_BASE_  │
│                 │      │ URL in Vercel   │
└────────┬────────┘      └─────────────────┘
         │ No
         ▼
┌─────────────────┐
│ Check Render    │
│ logs for errors │
└─────────────────┘
```

### Problem: Backend is slow
```
┌─────────────────┐
│ Free tier       │
│ sleeps after    │
│ 15 min          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ First request   │
│ takes ~30s to   │
│ wake up         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Solution:       │
│ Upgrade to      │
│ paid tier or    │
│ use keep-alive  │
│ service         │
└─────────────────┘
```

---

## ⏱️ Timeline

```
┌─────────────────────────────────────┐
│ Task                    │ Time      │
├─────────────────────────┼───────────┤
│ Push to GitHub          │ 1 min     │
│ Deploy Backend (Render) │ 5-10 min  │
│ Deploy Frontend (Vercel)│ 2-5 min   │
│ Update CORS             │ 2 min     │
│ Test deployment         │ 3 min     │
├─────────────────────────┼───────────┤
│ TOTAL                   │ ~15-20min │
└─────────────────────────────────────┘
```

---

## 🎉 Success!

When everything works, you'll see:

```
┌─────────────────────────────────────┐
│                                     │
│     🎊 Deployment Successful! 🎊    │
│                                     │
│  Frontend: ✅ Live on Vercel        │
│  Backend:  ✅ Live on Render        │
│  Database: ✅ Connected             │
│  CORS:     ✅ Configured            │
│                                     │
│  Your app is now accessible to      │
│  users worldwide! 🌍                │
│                                     │
└─────────────────────────────────────┘
```

---

## 📚 Quick Reference

| Need Help With | See Document |
|----------------|--------------|
| Quick start | QUICK_DEPLOY.md |
| Detailed steps | DEPLOYMENT.md |
| Environment vars | ENV_SETUP.md |
| Pre-flight checks | PRE_DEPLOY_CHECKLIST.md |
| Overview | DEPLOYMENT_README.md |

---

**Happy Deploying! 🚀**
