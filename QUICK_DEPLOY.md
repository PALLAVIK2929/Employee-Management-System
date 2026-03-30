# Quick Deployment Steps

## 🚀 Deploy in 3 Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy Backend on Render
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Use these settings:
   - **Name**: `ems-backend`
   - **Runtime**: Python 3
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click "Create Web Service"
6. **Copy your backend URL** (e.g., `https://ems-backend-xxxx.onrender.com`)

### Step 3: Deploy Frontend on Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
4. Add Environment Variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: Your Render backend URL from Step 2
5. Click "Deploy"

## ✅ Done!

Your app will be live at:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://ems-backend-xxxx.onrender.com`

## 🔧 Post-Deployment

Update CORS in `backend/main.py`:
```python
allow_origins=[
    "https://your-project.vercel.app",  # Your Vercel URL
    "http://localhost:5173",
]
```

Then push the changes:
```bash
git add backend/main.py
git commit -m "Update CORS"
git push origin main
```

Render will auto-redeploy!

## 📝 Notes

- Free tier on Render may spin down after inactivity (takes ~30s to wake up)
- SQLite database resets on each Render deployment
- For production, upgrade to PostgreSQL on Render
- Both platforms support automatic deployments on git push

## 🆘 Troubleshooting

**Frontend can't connect to backend?**
- Check `VITE_API_BASE_URL` in Vercel environment variables
- Verify backend is running on Render
- Check CORS settings

**Backend not starting?**
- Check Render logs
- Verify `requirements.txt` has all dependencies
- Ensure start command is correct

Need help? Check `DEPLOYMENT.md` for detailed instructions.
