# Pre-Deployment Checklist ✓

Before deploying, make sure you have:

## ✅ Prerequisites
- [ ] GitHub account created
- [ ] Vercel account created (https://vercel.com)
- [ ] Render account created (https://render.com)
- [ ] Code pushed to GitHub repository

## ✅ Backend Ready
- [ ] `backend/requirements.txt` exists and is complete
- [ ] `backend/main.py` has proper startup configuration
- [ ] Database initialization works correctly
- [ ] All routes are properly configured

## ✅ Frontend Ready
- [ ] `frontend/package.json` has all dependencies
- [ ] Build command works locally: `cd frontend && npm run build`
- [ ] API calls use `VITE_API_BASE_URL` environment variable
- [ ] No hardcoded localhost URLs in the code

## ✅ Configuration Files
- [ ] `vercel.json` exists in root directory
- [ ] `render.yaml` exists in root directory (optional, for Blueprint)
- [ ] `frontend/.env.example` exists as template

## 🧪 Test Locally First

Run these commands to verify everything works:

### Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Visit http://localhost:8000 - should see welcome message

### Frontend:
```bash
cd frontend
npm install
npm run build
npm run preview
```
Visit http://localhost:4173 - should see the app

## 🚀 Ready to Deploy?

If all checks pass, follow the steps in `QUICK_DEPLOY.md`

## 📋 What You'll Need During Deployment

1. **Your GitHub repository URL**
2. **Backend URL from Render** (you'll get this after backend deployment)
3. **Update this URL in Vercel** as `VITE_API_BASE_URL` environment variable

## ⏱️ Estimated Time
- Backend deployment: 5-10 minutes
- Frontend deployment: 2-5 minutes
- Total: ~15 minutes

Good luck! 🎉
