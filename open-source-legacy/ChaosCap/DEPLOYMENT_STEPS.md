# ChaosCap Deployment to Railway - Step by Step Guide

## Prerequisites

✅ **Complete** - Your project is now ready for deployment with:
- Next.js 14 application structure
- Docker configuration optimized for Railway
- Environment variable setup
- Deployment scripts and verification

## Step 1: Prepare Your GitHub Repository

```bash
# Navigate to project directory
cd /Users/prom1/Desktop/ChaosCap

# Configure git (if not already done)
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: ChaosCap with Railway configuration"

# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/arqamxjay/ChaosCap.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Create Railway Project

**Via Railway Dashboard:**

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account
5. Select the ChaosCap repository
6. Select the `main` branch

**Via Railway CLI:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to project
cd /Users/prom1/Desktop/ChaosCap

# Initialize Railway project
railway init
```

## Step 3: Configure Environment Variables

1. **In Railway Dashboard:**
   - Go to your project
   - Click "Variables"
   - Add variables from `.env.example`:

   ```
   NODE_ENV=production
   ```

   Add any additional variables your app needs:
   - DATABASE_URL (if using database)
   - API_BASE_URL
   - NEXTAUTH_SECRET (if using NextAuth.js)
   - STRIPE_PUBLIC_KEY / STRIPE_SECRET_KEY (if using Stripe)

2. **Via CLI:**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set DATABASE_URL="your-db-url"
   ```

## Step 4: Deploy

**Option A: Automatic (GitHub Connected)**
- Just push code to main branch
- Railway automatically builds and deploys
- No additional commands needed

**Option B: Manual via CLI**
```bash
cd /Users/prom1/Desktop/ChaosCap
railway up
```

## Step 5: Verify Deployment

### Check Build Status
```bash
railway logs
```

### Get Application URL
```bash
railway open
```

### View Deployment Details
```bash
railway status
```

## Expected Build Output

Your logs should show:
```
Building image...
✓ Build completed
Installing dependencies...
npm install
...
Building application...
npm run build
...
Starting application...
npm start
Server listening on port 3000
```

## Post-Deployment Steps

### 1. Add Custom Domain (Optional)
1. Go to Railway dashboard → Settings → Domains
2. Click "Add"
3. Enter your domain
4. Update your DNS provider with the CNAME record provided

### 2. Set Up Automatic Deployments
- Already configured if connected via GitHub
- Each push to `main` triggers automatic deployment

### 3. Monitor Application
```bash
# View live logs
railway logs --follow

# View environment
railway variables

# View metrics
railway open (opens dashboard)
```

## Troubleshooting Deployment Error

If you get "There was an error deploying from source":

### Check 1: Verify Project Structure
```bash
bash scripts/verify-deployment.sh
```

### Check 2: Test Build Locally
```bash
npm install
npm run build
npm start
```
Should run on http://localhost:3000

### Check 3: Review Railway Logs
```bash
railway logs --follow
```
Look for error messages

### Check 4: Verify Dockerfile
```bash
docker build -t chaoscap .
docker run -p 3000:3000 chaoscap
```

### Check 5: Common Issues

| Error | Solution |
|-------|----------|
| `npm ERR!` in logs | Run `npm install` locally to verify package.json |
| `Cannot find module` | Missing dependency, add to package.json |
| `Port already in use` | App not listening on PORT env var |
| `Build timeout` | Too many/large dependencies, optimize build |
| `Connection refused` | App not starting, check logs with `railway logs` |

## Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] Railway project created
- [ ] GitHub connected to Railway
- [ ] Environment variables configured
- [ ] Deployment triggered (automatic or manual)
- [ ] Build logs show success
- [ ] Application is running (check via Railway URL)
- [ ] Pages load without errors

## Quick Commands Reference

```bash
# Login to Railway
railway login

# Initialize Railway project
railway init

# Set environment variables
railway variables set KEY=value

# View live logs
railway logs --follow

# Open application in browser
railway open

# Get deployment status
railway status

# View all variables
railway variables

# Trigger redeployment
railway redeploy
```

## Need Help?

1. **Check logs:** `railway logs --follow`
2. **Review** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. **Verify:** `bash scripts/verify-deployment.sh`
4. **Contact:** support@railway.app or Discord: https://discord.gg/railway

---

**Next Steps:** Push your code and watch the deployment happen automatically! 🚀
