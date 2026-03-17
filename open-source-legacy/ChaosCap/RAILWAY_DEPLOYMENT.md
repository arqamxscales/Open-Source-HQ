# Railway Deployment Guide

This guide walks you through deploying your ChaosCap application to Railway.

## Prerequisites

- Node.js 18+ installed
- A Railway account (https://railway.app)
- Git repository initialized

## Setup Steps

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login to Railway

```bash
railway login
```

This will open your browser to authenticate with Railway.

### 3. Create a Railway Project

Option A - Using the Dashboard:
- Go to https://railway.app/dashboard
- Click "New Project" → "Deploy from GitHub"

Option B - Using CLI:
```bash
cd /path/to/ChaosCap
railway init
```

### 4. Configure Environment Variables

Set up your environment variables in Railway:

```bash
railway variables
```

Copy variables from `.env.example` and configure them in Railway dashboard or CLI:

```bash
railway variables set DATABASE_URL="your-db-url"
railway variables set API_BASE_URL="your-api-url"
```

### 5. Deploy

**Option 1: Using CLI**
```bash
npm run deploy:railway
```

**Option 2: Using Git Push (if connected to GitHub)**
Simply push to your connected repository branch.

## Environment Variables

The following environment variables should be configured in Railway:

### Required
- `NODE_ENV` - Set to `production` (auto-set)
- `PORT` - Dynamic port assignment (auto-set by Railway)

### Optional (update as needed)
- `DATABASE_URL` - Database connection string
- `API_BASE_URL` - Backend API URL
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `NEXTAUTH_URL` - NextAuth.js callback URL
- `STRIPE_PUBLIC_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key

## Monitoring Deployment

### View Logs
```bash
railway logs
```

### View Deployment Status
```bash
railway status
```

### View Network Information
```bash
railway open
```

## Troubleshooting

### Build Fails
1. Check the Dockerfile: `cat Dockerfile`
2. Verify package.json has correct scripts
3. Check build logs: `railway logs`

### Application Crashes
1. Review environment variables are set correctly
2. Check application logs for errors
3. Verify PORT environment variable is being used

### Port Issues
Railway dynamically assigns ports. Make sure your app uses:
```javascript
const PORT = process.env.PORT || 3000;
```

## Updating Deployments

After making changes:

```bash
git add .
git commit -m "Your message"
git push
```

Railway will automatically detect changes and redeploy if connected to GitHub.

## Custom Domain

To add a custom domain in Railway:
1. Go to your project settings
2. Under "Domains", add your custom domain
3. Update your DNS provider with Railway's provided CNAME record

## Need Help?

- Railway Docs: https://docs.railway.app
- Railway Support: support@railway.app
- Community: https://discord.gg/railway
