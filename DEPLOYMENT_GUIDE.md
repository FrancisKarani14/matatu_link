# Deployment Guide for Render

## Prerequisites
- GitHub account with repository
- Render account (https://render.com)

## Step 1: Prepare Repository
1. Commit all changes to GitHub
2. Ensure all files are in the `server/` directory

## Step 2: Create PostgreSQL Database on Render
1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Name: `matatu-link-db`
4. Select free tier
5. Click "Create Database"
6. Copy the "Internal Database URL" (starts with `postgresql://`)

## Step 3: Create Web Service on Render
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `matatu-link-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: Free

## Step 4: Set Environment Variables
In Render dashboard, go to "Environment" tab and add:

```
FLASK_ENV=production
SECRET_KEY=<generate-random-32-char-string>
JWT_SECRET_KEY=<generate-random-32-char-string>
DATABASE_URL=<paste-internal-database-url-from-step-2>
FRONTEND_URL=https://matatu-link.vercel.app
```

**Generate secrets in Python:**
```python
import secrets
print(secrets.token_hex(32))
```

## Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your API will be available at: `https://matatu-link-api.onrender.com`

## Step 6: Update Frontend
Update the frontend `config.js`:
```javascript
export const API_BASE_URL = "https://matatu-link-api.onrender.com";
```

## Step 7: Initialize Database
1. Go to Render dashboard → your web service
2. Click "Shell" tab
3. Run:
```bash
python seed.py
```

## Step 8: Test Deployment
Test these endpoints:
- Health check: `https://matatu-link-api.onrender.com/health`
- API root: `https://matatu-link-api.onrender.com/`
- Saccos: `https://matatu-link-api.onrender.com/saccos`

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify `requirements.txt` has all dependencies
- Ensure `build.sh` is executable

### Database Connection Fails
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL database is running
- Ensure URL starts with `postgresql://` not `postgres://`

### CORS Errors
- Verify `FRONTEND_URL` matches your Vercel domain exactly
- Check browser console for specific CORS error

### 500 Errors
- Check application logs in Render dashboard
- Verify all environment variables are set
- Check database migrations ran successfully

## Monitoring
- View logs: Render Dashboard → Logs tab
- Check metrics: Render Dashboard → Metrics tab
- Set up alerts: Render Dashboard → Settings → Notifications

## Scaling
- Free tier: 512 MB RAM, sleeps after 15 min inactivity
- Upgrade to paid tier for:
  - No sleep
  - More RAM/CPU
  - Custom domains
  - Better performance

## Maintenance
- Database backups: Automatic on Render
- Update dependencies: Push to GitHub, auto-deploys
- Monitor errors: Check logs regularly
