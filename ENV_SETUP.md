# Environment Variables Setup

## Frontend Environment Variables (Vercel)

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com` | Your Render backend URL |

### How to add in Vercel:
1. Go to your project in Vercel
2. Click "Settings" tab
3. Click "Environment Variables" in sidebar
4. Add the variable name and value
5. Select "Production", "Preview", and "Development"
6. Click "Save"
7. Redeploy your project

## Backend Environment Variables (Render)

Optional variables you can add in Render Dashboard → Service → Environment:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `PYTHON_VERSION` | `3.11.0` | Python version (auto-detected) |
| `DATABASE_URL` | `sqlite:///./test.db` | Database connection (default) |

### For PostgreSQL (Recommended for Production):
1. Create a PostgreSQL database in Render
2. Copy the "Internal Database URL"
3. Add as `DATABASE_URL` environment variable
4. Update `backend/database.py` to use PostgreSQL

## Local Development

### Frontend (.env.local):
Create `frontend/.env.local`:
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### Backend (.env):
Create `backend/.env` (if needed):
```
DATABASE_URL=sqlite:///./test.db
```

## Verification

After setting environment variables:

### Check Frontend:
```bash
cd frontend
npm run build
# Should build without errors
```

### Check Backend:
```bash
cd backend
python -c "import os; print(os.getenv('DATABASE_URL', 'Using default'))"
```

## Troubleshooting

### Frontend can't find API:
- Verify `VITE_API_BASE_URL` is set in Vercel
- Check it matches your Render backend URL exactly
- Ensure no trailing slash in the URL
- Redeploy after changing environment variables

### Backend database issues:
- SQLite is default and works out of the box
- For production, use PostgreSQL
- Check `DATABASE_URL` format is correct

## Security Notes

- Never commit `.env` files to git
- Use different values for development and production
- Rotate secrets regularly
- Use Render's environment groups for shared configs

## Quick Reference

**Frontend needs:**
- `VITE_API_BASE_URL` → Your backend URL

**Backend needs:**
- Nothing required for basic deployment
- `DATABASE_URL` for custom database

That's it! Simple and secure. 🔒
