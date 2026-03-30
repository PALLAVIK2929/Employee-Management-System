# Deployment Guide

This guide will help you deploy the Employee Management System with:
- Frontend on Vercel
- Backend on Render

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)
- Git repository with your code pushed to GitHub

## Step 1: Deploy Backend on Render

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Go to Render Dashboard**:
   - Visit https://dashboard.render.com
   - Click "New +" and select "Web Service"

3. **Connect your repository**:
   - Connect your GitHub account
   - Select your repository
   - Click "Connect"

4. **Configure the service**:
   - Name: `ems-backend` (or your preferred name)
   - Region: Choose closest to your users
   - Branch: `main`
   - Root Directory: Leave empty
   - Runtime: `Python 3`
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variables** (if needed):
   - Click "Advanced" and add any required environment variables
   - For now, the default SQLite database will work

6. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)
   - Copy your backend URL (e.g., `https://ems-backend-xxxx.onrender.com`)

## Step 2: Deploy Frontend on Vercel

1. **Update Frontend Environment Variable**:
   - Create a `.env.production` file in the `frontend` directory:
   ```bash
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```
   Replace `your-backend-url.onrender.com` with your actual Render backend URL

2. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Click "Add New..." and select "Project"

3. **Import your repository**:
   - Connect your GitHub account
   - Select your repository
   - Click "Import"

4. **Configure the project**:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com`
   - Make sure to use your actual Render backend URL

6. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete (2-5 minutes)
   - Your frontend will be live at `https://your-project.vercel.app`

## Step 3: Update Backend CORS Settings

After deployment, you need to update the backend to allow requests from your Vercel domain:

1. Edit `backend/main.py` and update the CORS origins:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "https://your-project.vercel.app",
           "http://localhost:5173",  # Keep for local development
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. Commit and push the changes:
   ```bash
   git add backend/main.py
   git commit -m "Update CORS for production"
   git push origin main
   ```

3. Render will automatically redeploy with the new settings

## Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Try logging in with your credentials
3. Test the main features:
   - Employee management
   - Department management
   - Chat functionality
   - Onboarding plans

## Troubleshooting

### Frontend can't connect to backend
- Verify the `VITE_API_BASE_URL` environment variable in Vercel
- Check that the backend is running on Render
- Verify CORS settings in `backend/main.py`

### Backend errors on Render
- Check the logs in Render dashboard
- Verify all dependencies are in `requirements.txt`
- Ensure the start command is correct

### Database issues
- The SQLite database will reset on each Render deployment
- For production, consider upgrading to PostgreSQL on Render

## Upgrading to PostgreSQL (Recommended for Production)

1. In Render dashboard, create a new PostgreSQL database
2. Copy the Internal Database URL
3. Update backend environment variables:
   - Add `DATABASE_URL` with the PostgreSQL URL
4. Update `backend/database.py` to use the PostgreSQL URL
5. Redeploy the backend

## Continuous Deployment

Both Vercel and Render support automatic deployments:
- Push to your `main` branch to trigger automatic deployments
- Vercel will rebuild the frontend
- Render will rebuild the backend

## Custom Domains (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render:
1. Go to Service Settings → Custom Domain
2. Add your custom domain
3. Update DNS records as instructed

## Support

If you encounter issues:
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
