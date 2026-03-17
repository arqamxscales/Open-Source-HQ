# ChaosCap Railway Configuration Guide

Complete settings and configuration for deploying ChaosCap on Railway.

## Table of Contents
1. [Environment Variables](#environment-variables)
2. [Build Settings](#build-settings)
3. [Runtime Configuration](#runtime-configuration)
4. [Health Checks](#health-checks)
5. [Domain Setup](#domain-setup)
6. [Performance Tuning](#performance-tuning)
7. [Monitoring & Logs](#monitoring--logs)

---

## Environment Variables

### Required Variables (Set in Railway Dashboard)

```env
# Application Environment
NODE_ENV=production
PORT=3000

# Build Configuration
NPM_FLAGS=--legacy-peer-deps
NODE_PRODUCTION_BEHAVIOR=true
```

### Optional Variables (Add as needed)

```env
# Next.js Configuration
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_TELEMETRY_DISABLED=1

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=your-ga-id

# Authentication (If using NextAuth.js)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com

# Database (If using database)
DATABASE_URL=postgresql://user:password@host:port/dbname

# API Keys (If using external services)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### How to Set Environment Variables in Railway

1. **Via Railway Dashboard:**
   - Go to your project → Settings → Variables
   - Click "Add Variable"
   - Enter KEY and VALUE
   - Click Save

2. **Via Railway CLI:**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=3000
   railway variables set NEXT_PUBLIC_API_URL=https://your-api.com
   ```

3. **Via .env.local file (Development only):**
   ```bash
   # Create .env.local in project root
   NODE_ENV=development
   ```

---

## Build Settings

### Build Configuration (railway.json)

The `railway.json` file controls how Railway builds and deploys your app:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "dockerfile",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyMaxRetries": 5,
    "restartPolicyWindowMs": 600000,
    "healthcheckPath": "/",
    "healthcheckTimeout": 30
  }
}
```

### Dockerfile Configuration

Key optimizations already included:

- **Multi-stage build** - Reduces image size
- **Alpine Linux base** - Lightweight OS
- **Non-root user** - Security best practice
- **Production dependencies only** - Excludes dev packages
- **Standalone output** - Optimized Next.js build

Current Dockerfile features:
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
- Installs build dependencies
- Compiles TypeScript/Next.js
- Creates optimized bundle

# Stage 2: Runtime
FROM node:18-alpine
- Runs production-only image
- Non-root user execution
- Minimal file size
```

---

## Runtime Configuration

### Node.js Version

**Current:** Node 18 Alpine (specified in Dockerfile)

**To change version:**

1. Edit Dockerfile:
   ```dockerfile
   FROM node:20-alpine AS builder  # Change 18 to 20
   ```

2. Update package.json engines:
   ```json
   "engines": {
     "node": ">=20.0.0",
     "npm": ">=9.0.0"
   }
   ```

### Memory & CPU

Railway auto-scales, but you can set preferences:

1. Go to Railway Dashboard → Settings → Resources
2. Set Memory and CPU limits:
   - **Minimum:** 512MB, 0.25 CPU
   - **Recommended:** 1GB, 0.5 CPU
   - **For high traffic:** 2GB+, 1+ CPU

### Concurrency

Railway handles concurrency automatically. Control via:

1. **max_concurrent_requests** in railway.json (if supported)
2. **Server-side** in Next.js configuration

---

## Health Checks

### Current Health Check Configuration

```json
{
  "healthcheckPath": "/",
  "healthcheckTimeout": 30
}
```

### What This Does

- **healthcheckPath:** "/" 
  - Railway checks if `/` responds successfully
  - Should return 200 status code
  - Runs every 30 seconds

- **healthcheckTimeout:** 30 seconds
  - Maximum time to wait for response
  - If exceeded, Railway considers it failed

### Custom Health Check

To add a custom health endpoint, modify `src/app/health/route.ts`:

```typescript
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
```

Update railway.json:
```json
{
  "healthcheckPath": "/health"
}
```

### Restart Policy

```json
{
  "restartPolicyMaxRetries": 5,
  "restartPolicyWindowMs": 600000
}
```

- **maxRetries:** 5 - Restart max 5 times
- **windowMs:** 600000 (10 minutes) - Before cooldown

---

## Domain Setup

### Default Railway Domain

1. Deploy your application
2. Go to Railway Dashboard → Deployments → Open
3. You'll get: `https://chaoscap-production.railway.app`

### Custom Domain

**Add Custom Domain:**

1. Railway Dashboard → Settings → Domains
2. Click "Add Domain"
3. Enter your domain: `chaoscap.com` or `app.yourdomain.com`
4. Railway provides CNAME record

**Configure DNS:**

For `app.yourdomain.com`:

| Type  | Name  | Value (From Railway) |
|-------|-------|----------------------|
| CNAME | app   | (Railway CNAME)      |

Then wait 15-30 minutes for DNS propagation.

**Verify:**
```bash
nslookup app.yourdomain.com
# Should resolve to Railway IP
```

### HTTPS/SSL

- **Automatic:** Railway provides free SSL/TLS
- **Auto-renews:** Certificates renew automatically
- **Always on:** HTTPS is enabled by default

---

## Performance Tuning

### Next.js Production Optimizations

Already enabled in `next.config.js`:

```javascript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,           // SWC minification for speed
  output: 'standalone',      // Optimized for containers
};
```

### Image Optimization

Add to `next.config.js` for better image performance:

```javascript
const nextConfig = {
  images: {
    domains: ['cdn.example.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### Caching Headers

In `src/app/layout.tsx`:

```typescript
export const metadata = {
  title: 'ChaosCap',
  description: 'ChaosCap Application',
};

export const revalidate = 3600; // Revalidate every hour
```

### Build Size Optimization

```bash
# Analyze build size
npm run build

# Check bundle size
npm install --save-dev @next/bundle-analyzer
```

---

## Monitoring & Logs

### View Logs

**Via Railway CLI:**
```bash
railway logs --follow
```

**Via Railway Dashboard:**
1. Go to Deployments
2. Click on active deployment
3. View logs in real-time

### Log Levels

Railway captures:
- **STDOUT** - Application logs
- **STDERR** - Error logs
- **Build logs** - Docker build output

### Example: Add Custom Logging

In `src/app/page.tsx`:

```typescript
export default function Home() {
  console.log('[INFO] Home page rendered at:', new Date().toISOString());
  
  return (
    <main>
      <h1>Welcome to ChaosCap</h1>
    </main>
  );
}
```

View in Railway logs:
```
[INFO] Home page rendered at: 2026-03-05T10:30:00Z
```

### Monitoring Tools

**Integrate with Sentry (Error Tracking):**

1. Create Sentry account: https://sentry.io
2. Create new Next.js project
3. Add DSN to environment variables:
   ```env
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
   ```

---

## Database Connection (If Needed)

### PostgreSQL on Railway

1. **Add PostgreSQL Service:**
   - Railway Dashboard → New Service → PostgreSQL
   
2. **Get Connection String:**
   - Railway provides DATABASE_URL automatically
   - Add to your environment

3. **Example .env:**
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```

### Prisma ORM Setup (Optional)

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

---

## Advanced Settings

### Environment-Specific Configs

**Production (railway.json):**
```json
{
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyMaxRetries": 5
  }
}
```

**Staging (optional):**
```json
{
  "deploy": {
    "startCommand": "npm run dev",
    "restartPolicyMaxRetries": 3
  }
}
```

### Deployment Hooks

**Pre-deployment:**
```bash
# Add to package.json scripts
"prebuild": "npm run lint"
```

**Post-deployment:**
Use Railway's webhooks to notify services:
- Slack notifications
- GitHub status updates
- Email alerts

### Regional Deployment

Railway automatically chooses closest region, but you can specify:

1. Dashboard → Settings → Region
2. Select from available regions
3. Auto-failover to nearest region

---

## Deployment Checklist

Before deploying, verify:

- [ ] NODE_ENV=production set
- [ ] NEXT_PUBLIC_* variables for public keys
- [ ] All secrets in environment (not in code)
- [ ] Database URL configured (if needed)
- [ ] Custom domain DNS records added
- [ ] Health check endpoint working
- [ ] Logs streaming properly
- [ ] Memory/CPU limits appropriate

---

## Troubleshooting Railway Issues

### Build Fails

```bash
# Check build logs
railway logs --follow
```

Common causes:
- Missing dependencies (add to package.json)
- TypeScript errors (fix before pushing)
- Env variables not set (add in Railway)

### App Won't Start

Check:
1. Logs: `railway logs --follow`
2. PORT env var: Should be `process.env.PORT || 3000`
3. No hardcoded ports in code

### Slow Performance

Optimization steps:
1. Check memory usage: Railway Dashboard → Metrics
2. Increase resources: Settings → Resources
3. Enable caching: Add revalidate to routes
4. Optimize images: Use Next.js Image component

### Connection Errors

Check:
1. Database URL format
2. Firewall rules
3. Network availability
4. SSL certificate valid

---

## Quick Commands Reference

```bash
# Login
railway login

# View project
railway open

# View logs
railway logs --follow

# Set variables
railway variables set KEY=value

# View variables
railway variables

# Redeploy
railway redeploy

# View deployments
railway deployments

# Check status
railway status
```

---

## Resources

- Railway Docs: https://docs.railway.app
- Next.js Docs: https://nextjs.org/docs
- Docker Docs: https://docs.docker.com
- Railway Support: support@railway.app
- Discord: https://discord.gg/railway

---

**Last Updated:** March 5, 2026
**ChaosCap Version:** 1.0.0
**Railway Configuration:** Production Ready ✅
