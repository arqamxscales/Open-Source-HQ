# Railway Settings Quick Reference

## ⚡ Quick Setup (5 minutes)

### Step 1: Environment Variables
**Add in Railway Dashboard → Variables:**

```
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://your-api.com (optional)
NEXTAUTH_SECRET=your-secret (if using auth)
DATABASE_URL=your-db-url (if using database)
```

### Step 2: Verify Settings
✅ Build Command: `npm install && npm run build`
✅ Start Command: `npm start`
✅ Health Check: Path `/` with 30s timeout
✅ Restart Policy: 5 retries every 10 minutes

### Step 3: Deploy
- Push to GitHub
- Railway auto-deploys
- Check logs: `railway logs --follow`

---

## 📋 Complete Settings Checklist

### Build Configuration
- [x] Dockerfile: Multi-stage build
- [x] Docker base: Node 18 Alpine
- [x] Build command: `npm install && npm run build`
- [x] Production mode: Yes
- [x] .dockerignore: Configured

### Runtime Configuration
- [x] Start command: `npm start`
- [x] Node version: 18+
- [x] Memory: Auto (starts 512MB)
- [x] CPU: Auto (starts 0.25)
- [x] Non-root user: nextjs

### Environment
- [x] NODE_ENV: production
- [x] PORT: 3000 (Railway assigns dynamically)
- [x] NEXT_TELEMETRY_DISABLED: 1 (recommended)

### Health & Reliability
- [x] Health check: Enabled (/)
- [x] Health timeout: 30 seconds
- [x] Max retries: 5
- [x] Restart window: 10 minutes

### Security
- [x] SSL/TLS: Auto-enabled
- [x] HTTPS: Forced
- [x] Non-root execution: Yes
- [x] Secrets: Not in code
- [x] .env vars: In Railway dashboard only

### Performance
- [x] SWC minify: Enabled
- [x] Standalone build: Enabled
- [x] Image optimization: Available
- [x] Caching: Available per route

### Monitoring
- [x] Logs: Real-time streaming
- [x] Metrics: Available
- [x] Alerts: Configurable
- [x] Status page: Available

---

## 🔧 Custom Settings (Optional)

### Increase Memory/CPU
```
Settings → Resources
Set to: 1GB RAM, 0.5 CPU (or higher)
```

### Add Custom Domain
```
Settings → Domains → Add Domain
Add DNS CNAME record
Wait 15-30 minutes for propagation
```

### Database Integration
```
New Service → PostgreSQL (or MySQL)
Railway auto-provides DATABASE_URL
Update app to use database
```

### Slack Notifications
```
Integrations → Slack
Get deployed? → Notify in Slack
```

### GitHub Status Updates
```
Integrations → GitHub
Railway updates PR status
Shows deploy preview link
```

---

## 📊 Monitoring Commands

```bash
# View live logs
railway logs --follow

# View environment variables
railway variables

# Check deployment status
railway status

# View all deployments
railway deployments

# Open Railway dashboard
railway open

# View metrics
railway metrics (if available)
```

---

## 🚀 Environment-Specific Variables

### Production (Current)
```
NODE_ENV=production
API_URL=https://api.chaoscap.com
LOG_LEVEL=info
```

### Staging (if needed)
```
NODE_ENV=staging
API_URL=https://staging-api.chaoscap.com
LOG_LEVEL=debug
```

### Development (local)
```
NODE_ENV=development
API_URL=http://localhost:3001
LOG_LEVEL=debug
```

---

## 🔐 Secrets Management

**DO NOT** add to code:
```javascript
// ❌ BAD
const apiKey = "sk_live_123456";

// ✅ GOOD
const apiKey = process.env.STRIPE_SECRET_KEY;
```

**Add Secrets in Railway:**
1. Dashboard → Variables
2. Add SECRET variable
3. Reference: `process.env.SECRET_NAME`
4. Railway encrypts at rest

---

## 📈 Performance Tuning

### Enable Caching
```typescript
// In src/app/layout.tsx
export const revalidate = 3600; // 1 hour
```

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority
/>
```

### Database Connection Pooling
```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require&pool_size=20
```

---

## 🔍 Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| App won't start | Check logs: `railway logs` |
| 502 Bad Gateway | Verify PORT env var set |
| Slow deployment | Clear cache: Settings → Clear Build Cache |
| Out of memory | Increase resources: Settings → Resources |
| Database timeout | Check DATABASE_URL in Variables |
| SSL certificate error | Delete and redeploy domain |
| Build fails | Run `npm run build` locally to test |

---

## ✅ Pre-Deployment Checklist

- [ ] All environment variables set in Railway
- [ ] Ran `npm run build` locally - no errors
- [ ] Ran `npm start` locally - works on PORT 3000
- [ ] Pushed code to GitHub (main branch)
- [ ] GitHub connected to Railway
- [ ] Health check path `/` returns 200
- [ ] No hardcoded API URLs or secrets
- [ ] `railway.json` configured correctly
- [ ] `Dockerfile` builds locally
- [ ] `.dockerignore` excludes large files

---

## 🚀 Deploy Commands

```bash
# First time setup
railway init

# Set variables
railway variables set NODE_ENV=production
railway variables set DATABASE_URL=your-url

# Deploy
railway up

# View live
railway open

# Watch logs
railway logs --follow
```

---

## 📞 Support

- **Docs:** https://docs.railway.app
- **Discord:** https://discord.gg/railway
- **Email:** support@railway.app
- **Status:** https://status.railway.app

---

**Version:** 1.0.0 | **Updated:** March 5, 2026 | **Status:** ✅ Ready to Deploy
