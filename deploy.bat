@echo off
REM Deployment Helper Script for Windows
REM This script helps prepare your project for deployment

echo.
echo 🚀 Employee Management System - Deployment Helper
echo ==================================================
echo.

REM Check if git is initialized
if not exist .git (
    echo ❌ Git repository not initialized
    echo Run: git init
    exit /b 1
)

echo ✅ Git repository found

REM Check if remote is set
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ⚠️  No git remote 'origin' found
    echo Add your GitHub repo: git remote add origin ^<your-repo-url^>
    echo.
) else (
    echo ✅ Git remote configured
)

REM Check backend files
echo.
echo Checking backend files...
if not exist backend\requirements.txt (
    echo ❌ backend\requirements.txt not found
    exit /b 1
)
echo ✅ Backend requirements.txt found

if not exist backend\main.py (
    echo ❌ backend\main.py not found
    exit /b 1
)
echo ✅ Backend main.py found

REM Check frontend files
echo.
echo Checking frontend files...
if not exist frontend\package.json (
    echo ❌ frontend\package.json not found
    exit /b 1
)
echo ✅ Frontend package.json found

REM Check deployment config files
echo.
echo Checking deployment configuration...
if not exist vercel.json (
    echo ❌ vercel.json not found
    exit /b 1
)
echo ✅ vercel.json found

if not exist render.yaml (
    echo ⚠️  render.yaml not found (optional)
) else (
    echo ✅ render.yaml found
)

REM Offer to commit and push
echo.
echo ==================================================
echo ✅ All checks passed! Ready for deployment.
echo.
echo Next steps:
echo 1. Commit your changes: git add . ^&^& git commit -m "Ready for deployment"
echo 2. Push to GitHub: git push origin main
echo 3. Follow the steps in QUICK_DEPLOY.md
echo.
set /p REPLY="Do you want to commit and push now? (y/n) "

if /i "%REPLY%"=="y" (
    echo Committing changes...
    git add .
    git commit -m "Ready for deployment"
    
    echo Pushing to GitHub...
    git push origin main
    
    if errorlevel 0 (
        echo.
        echo ✅ Successfully pushed to GitHub!
        echo.
        echo Now deploy:
        echo 1. Backend on Render: https://dashboard.render.com
        echo 2. Frontend on Vercel: https://vercel.com/new
        echo.
        echo See QUICK_DEPLOY.md for detailed steps.
    ) else (
        echo ❌ Push failed. Please check your git configuration.
    )
) else (
    echo Skipped. You can manually run:
    echo   git add .
    echo   git commit -m "Ready for deployment"
    echo   git push origin main
)

echo.
echo 📖 For detailed instructions, see:
echo    - QUICK_DEPLOY.md (quick start)
echo    - DEPLOYMENT.md (detailed guide)
echo    - PRE_DEPLOY_CHECKLIST.md (checklist)
echo.
pause
