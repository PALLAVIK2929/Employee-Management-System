#!/bin/bash

# Deployment Helper Script
# This script helps prepare your project for deployment

echo "🚀 Employee Management System - Deployment Helper"
echo "=================================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not initialized"
    echo "Run: git init"
    exit 1
fi

echo "✅ Git repository found"

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No git remote 'origin' found"
    echo "Add your GitHub repo: git remote add origin <your-repo-url>"
    echo ""
else
    echo "✅ Git remote configured"
fi

# Check backend files
echo ""
echo "Checking backend files..."
if [ ! -f backend/requirements.txt ]; then
    echo "❌ backend/requirements.txt not found"
    exit 1
fi
echo "✅ Backend requirements.txt found"

if [ ! -f backend/main.py ]; then
    echo "❌ backend/main.py not found"
    exit 1
fi
echo "✅ Backend main.py found"

# Check frontend files
echo ""
echo "Checking frontend files..."
if [ ! -f frontend/package.json ]; then
    echo "❌ frontend/package.json not found"
    exit 1
fi
echo "✅ Frontend package.json found"

# Check deployment config files
echo ""
echo "Checking deployment configuration..."
if [ ! -f vercel.json ]; then
    echo "❌ vercel.json not found"
    exit 1
fi
echo "✅ vercel.json found"

if [ ! -f render.yaml ]; then
    echo "⚠️  render.yaml not found (optional)"
else
    echo "✅ render.yaml found"
fi

# Offer to commit and push
echo ""
echo "=================================================="
echo "✅ All checks passed! Ready for deployment."
echo ""
echo "Next steps:"
echo "1. Commit your changes: git add . && git commit -m 'Ready for deployment'"
echo "2. Push to GitHub: git push origin main"
echo "3. Follow the steps in QUICK_DEPLOY.md"
echo ""
read -p "Do you want to commit and push now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Committing changes..."
    git add .
    git commit -m "Ready for deployment - $(date +%Y-%m-%d)"
    
    echo "Pushing to GitHub..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo ""
        echo "Now deploy:"
        echo "1. Backend on Render: https://dashboard.render.com"
        echo "2. Frontend on Vercel: https://vercel.com/new"
        echo ""
        echo "See QUICK_DEPLOY.md for detailed steps."
    else
        echo "❌ Push failed. Please check your git configuration."
    fi
else
    echo "Skipped. You can manually run:"
    echo "  git add ."
    echo "  git commit -m 'Ready for deployment'"
    echo "  git push origin main"
fi

echo ""
echo "📖 For detailed instructions, see:"
echo "   - QUICK_DEPLOY.md (quick start)"
echo "   - DEPLOYMENT.md (detailed guide)"
echo "   - PRE_DEPLOY_CHECKLIST.md (checklist)"
