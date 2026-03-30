# 🔧 Deployment Troubleshooting Guide

Common issues and their solutions when deploying to Vercel and Render.

## 🚨 Frontend Issues (Vercel)

### Issue 1: "Failed to fetch" or Network Error

**Symptoms:**
- Frontend loads but can't connect to backend
- Console shows: `Failed to fetch` or `Network Error`

**Solutions:**

1. **Check Environment Variable**
   ```bash
   # In Vercel Dashboard → Settings → Environment Variables
   # Verify: VITE_API_BASE_URL = https://your-backend.onrender.com
   ```
   - Must be the exact Render URL
   - No trailing slash
   - Must start with `https://`

2. **Redeploy After Adding Env Var**
   - Environment variables require a redeploy
   - Go to Deployments → Click "..." → Redeploy

3. **Check Backend is Running**
   - Visit your Render backend URL directly
   - Should see: `{"message": "Welcome to the Employee Management System API"}`

---

### Issue 2: CORS Error

**Symptoms:**
- Console shows: `Access to fetch blocked by CORS policy`
- Backend is running but frontend can't access it

**Solution:**

Update `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-project.vercel.app",  # Your actual Vercel URL
        "https://*.vercel.app",  # All Vercel preview deployments
        "http://localhost:5173",  # Local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then:
```bash
git add backend/main.py
git commit -m "Fix CORS"
git push origin main
```

---

### Issue 3: 404 on Page Refresh

**Symptoms:**
- App works when navigating from home
- Refreshing on a route shows 404

**Solution:**

Verify `vercel.json` has rewrites:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This is already configured in your project.

---

### Issue 4: Build Fails on Vercel

**Symptoms:**
- Deployment fails during build
- Error: `Command "npm run build" exited with 1`

**Solutions:**

1. **Check Build Locally**
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   Fix any errors shown

2. **Check Node Version**
   - Vercel uses Node 18 by default
   - Add to `package.json` if needed:
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

3. **Check Dependencies**
   ```bash
   cd frontend
   npm install
   # Fix any peer dependency warnings
   ```

---

## 🚨 Backend Issues (Render)

### Issue 1: Build Failed

**Symptoms:**
- Render shows "Build failed"
- Deployment never completes

**Solutions:**

1. **Check Build Command**
   ```
   cd backend && pip install -r requirements.txt
   ```
   - Must include `cd backend`
   - Check `requirements.txt` exists

2. **Check Python Version**
   - Render uses Python 3.7 by default
   - Add environment variable: `PYTHON_VERSION = 3.11.0`

3. **Check Requirements File**
   ```bash
   cd backend
   cat requirements.txt
   # Verify all packages are listed
   ```

---

### Issue 2: Deploy Succeeded but App Crashes

**Symptoms:**
- Build succeeds
- App shows "Service Unavailable"
- Logs show errors

**Solutions:**

1. **Check Start Command**
   ```
   cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
   - Must include `cd backend`
   - Must use `$PORT` (Render provides this)
   - Must bind to `0.0.0.0`

2. **Check Logs**
   - Go to Render Dashboard → Your Service → Logs
   - Look for Python errors
   - Common issues:
     - Missing dependencies
     - Import errors
     - Database connection issues

3. **Test Locally**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

---

### Issue 3: Backend is Very Slow

**Symptoms:**
- First request takes 30+ seconds
- Subsequent requests are fast
- Happens after inactivity

**Explanation:**
- Free tier spins down after 15 minutes of inactivity
- Takes ~30 seconds to wake up

**Solutions:**

1. **Upgrade to Paid Tier** ($7/month)
   - No spin down
   - Always available

2. **Use Keep-Alive Service**
   - Services like UptimeRobot ping your backend
   - Keeps it awake (but uses your free hours)

3. **Accept the Limitation**
   - Free tier is fine for demos/testing
   - First request is slow, then fast

---

### Issue 4: Database Resets on Deploy

**Symptoms:**
- Data disappears after redeployment
- Have to recreate users/data

**Explanation:**
- SQLite file is not persistent on Render
- Each deploy creates a fresh container

**Solutions:**

1. **Upgrade to PostgreSQL** (Recommended)
   - Create PostgreSQL database in Render
   - Update `DATABASE_URL` environment variable
   - Update `backend/database.py`:
   ```python
   from sqlalchemy.ext.asyncio import create_async_engine
   
   DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
   
   # For PostgreSQL, replace postgresql:// with postgresql+asyncpg://
   if DATABASE_URL.startswith("postgresql://"):
       DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
   
   engine = create_async_engine(DATABASE_URL)
   ```

2. **Use External Database**
   - Supabase (free tier)
   - PlanetScale (free tier)
   - Railway (free tier)

---

## 🚨 General Issues

### Issue 1: Changes Not Showing Up

**Symptoms:**
- Made changes but don't see them
- Old version still showing

**Solutions:**

1. **Check Git Push**
   ```bash
   git status
   git log --oneline -5
   # Verify latest commit is pushed
   ```

2. **Check Deployment Status**
   - Vercel: Check Deployments tab
   - Render: Check Events tab
   - Wait for deployment to complete

3. **Clear Browser Cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or open in incognito mode

---

### Issue 2: Environment Variables Not Working

**Symptoms:**
- App can't find environment variables
- Using default values

**Solutions:**

1. **Frontend (Vercel)**
   - Must start with `VITE_`
   - Must redeploy after adding
   - Check in Settings → Environment Variables

2. **Backend (Render)**
   - Check in Dashboard → Environment
   - Restart service after adding
   - Use `os.getenv()` in Python

3. **Local Development**
   - Frontend: Create `frontend/.env.local`
   - Backend: Create `backend/.env`
   - Don't commit these files!

---

### Issue 3: Can't Login After Deployment

**Symptoms:**
- Login page loads
- Credentials don't work
- "Invalid credentials" error

**Solutions:**

1. **Database is Empty**
   - SQLite resets on each deploy
   - Need to create users again
   - Or upgrade to PostgreSQL

2. **Check Backend Logs**
   - Render Dashboard → Logs
   - Look for authentication errors

3. **Test Backend Directly**
   ```bash
   curl -X POST https://your-backend.onrender.com/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=admin&password=admin&grant_type=password"
   ```

---

## 🔍 Debugging Tools

### Check Backend Health
```bash
# Should return welcome message
curl https://your-backend.onrender.com/

# Check specific endpoint
curl https://your-backend.onrender.com/employees/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Frontend Build
```bash
cd frontend
npm run build
npm run preview
# Visit http://localhost:4173
```

### Check Environment Variables
```bash
# Frontend (in browser console)
console.log(import.meta.env.VITE_API_BASE_URL)

# Backend (in Render shell)
echo $DATABASE_URL
```

### View Logs
- **Vercel**: Dashboard → Deployments → Click deployment → View Function Logs
- **Render**: Dashboard → Your Service → Logs tab

---

## 📞 Getting Help

### Before Asking for Help

Gather this information:
1. Exact error message
2. Browser console logs (F12)
3. Backend logs from Render
4. Steps to reproduce
5. What you've already tried

### Where to Get Help

1. **Check Documentation**
   - DEPLOYMENT.md
   - ENV_SETUP.md
   - This file

2. **Platform Documentation**
   - Vercel: https://vercel.com/docs
   - Render: https://render.com/docs

3. **Community**
   - Vercel Discord
   - Render Community Forum
   - Stack Overflow

---

## ✅ Health Check Checklist

Use this to verify everything is working:

### Backend Health
- [ ] Backend URL loads welcome message
- [ ] `/employees/` endpoint responds (with auth)
- [ ] No errors in Render logs
- [ ] Response time is reasonable

### Frontend Health
- [ ] Frontend URL loads login page
- [ ] No console errors (F12)
- [ ] Can navigate between pages
- [ ] Assets load correctly

### Integration Health
- [ ] Can login successfully
- [ ] Can fetch employee list
- [ ] Can create/edit/delete employees
- [ ] Chat functionality works
- [ ] No CORS errors

### Performance Health
- [ ] Page loads in < 3 seconds
- [ ] API responses in < 2 seconds
- [ ] No memory leaks
- [ ] No excessive API calls

---

## 🎯 Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| CORS error | Update `allow_origins` in `backend/main.py` |
| Can't connect | Check `VITE_API_BASE_URL` in Vercel |
| Build fails | Run `npm run build` locally first |
| Slow backend | Free tier spins down, upgrade or wait |
| Data lost | Use PostgreSQL instead of SQLite |
| 404 on refresh | Check `vercel.json` has rewrites |
| Env vars not working | Redeploy after adding them |

---

## 🚀 Still Stuck?

1. Check `DEPLOYMENT.md` for detailed steps
2. Review `ENV_SETUP.md` for configuration
3. Run `./deploy.sh` to verify setup
4. Check platform status pages:
   - https://www.vercel-status.com/
   - https://status.render.com/

Remember: Most issues are configuration-related. Double-check your environment variables and CORS settings!

Good luck! 🍀
