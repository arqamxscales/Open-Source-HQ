# Railway Dashboard Setup Guide

Step-by-step guide to configure ChaosCap on Railway dashboard.

## Phase 1: Project Creation (5 minutes)

### 1.1 Create Railway Account
- Visit: https://railway.app
- Click "Sign Up"
- Connect GitHub account
- Authorize Railway access

### 1.2 Create New Project
1. Go to Dashboard
2. Click "+ New Project"
3. Select "Deploy from GitHub"
4. Find your repository: `arqamxjay/ChaosCap`
5. Click "Deploy"
6. Railway starts building automatically

### 1.3 Monitor Initial Build
1. Railway Dashboard → Deployments
2. Watch build progress
3. Expected time: 3-5 minutes
4. Look for: ✅ "Build successful"

**What happens:**
- GitHub connected
- Dockerfile read
- Dependencies installed (npm install)
- Application built (npm run build)
- Docker image created
- Container deployed

---

## Phase 2: Environment Configuration (2 minutes)

### 2.1 Access Variables Settings
1. Go to your project
2. Click "Settings"
3. Scroll to "Variables"
4. Click "New Variable"

### 2.2 Add Required Variables

**Variable 1: NODE_ENV**
```
KEY:   NODE_ENV
VALUE: production
```
Click "Add"

**Variable 2: PORT** (Optional, Railway handles this)
```
KEY:   PORT
VALUE: 3000
```
Click "Add"

**Variable 3: NEXT_TELEMETRY (Recommended)**
```
KEY:   NEXT_TELEMETRY_DISABLED
VALUE: 1
```
Click "Add"

### 2.3 View All Variables
- Settings → Variables
- Should see:
  - NODE_ENV=production
  - PORT=3000
  - NEXT_TELEMETRY_DISABLED=1

---

## Phase 3: Verify Deployment (5 minutes)

### 3.1 Check Deployment Status
1. Dashboard → Deployments
2. Click latest deployment
3. View logs for errors
4. Look for: `Server running on port 3000`

### 3.2 Get Application URL
1. Click "Deployments"
2. Click "Open" button
3. Or find URL in deployment details
4. Format: `https://chaoscap-[id].railway.app`

### 3.3 Test Application
1. Open the URL provided
2. Should see: "Welcome to ChaosCap"
3. If error: Check logs in deployment panel

### 3.4 View Real-time Logs
1. Deployments → Active deployment
2. Scroll to "Logs" section
3. See application output in real-time
4. Search for errors: `ERROR` or `error`

---

## Phase 4: Advanced Settings (10 minutes)

### 4.1 Resource Configuration (Optional)
1. Settings → Resources
2. Set Memory: 512MB (starter) to 1GB+ (production)
3. Set CPU: 0.25 (starter) to 0.5+ (production)
4. Click "Save"

**Recommendation:**
- Start: 512MB RAM, 0.25 CPU
- Monitor usage in Metrics
- Scale up if needed

### 4.2 Health Checks
1. Settings → Health Checks
2. Path: `/` (or `/health` if custom)
3. Timeout: 30 seconds
4. Check interval: 30 seconds
5. Status: ✅ Should be "Healthy"

### 4.3 Restart Policy
1. Settings → Restart Policy
2. Max Retries: 5
3. Window: 600000ms (10 minutes)
4. This prevents infinite restart loops

### 4.4 Build Configuration
1. Settings → Build
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Builder: Docker (Dockerfile)
5. These are auto-detected from railway.json

---

## Phase 5: Domain Configuration (15 minutes)

### 5.1 Add Default Domain
1. Settings → Domains
2. Click "Generate Domain"
3. Railway creates: `chaoscap-prod.railway.app`
4. This is immediately available
5. HTTPS auto-enabled ✅

### 5.2 Add Custom Domain (Optional)
**Example:** `chaoscap.com`

1. Settings → Domains
2. Click "Add Custom Domain"
3. Enter domain: `chaoscap.com` or `app.yourdomain.com`
4. Railway shows CNAME record
5. Go to your DNS provider (Namecheap, GoDaddy, etc.)

**DNS Setup Example (Namecheap):**

1. Namecheap Dashboard → Domain List
2. Click your domain → Manage
3. Advanced DNS
4. Add/Edit CNAME Record:
   ```
   Host:  app (for app.yourdomain.com)
   Type:  CNAME
   Value: [Railway CNAME]
   TTL:   3600
   ```
5. Save
6. Wait 15-30 minutes for propagation

**Verify DNS:**
```bash
nslookup app.yourdomain.com
# Should show Railway IP
```

### 5.3 SSL Certificate
- Railway auto-provisions Let's Encrypt SSL
- HTTPS enabled by default
- Auto-renews every 90 days ✅
- No manual configuration needed

---

## Phase 6: Monitoring & Maintenance (Ongoing)

### 6.1 View Metrics
1. Dashboard → Metrics tab
2. See real-time data:
   - CPU usage
   - Memory usage
   - Network I/O
   - Requests per second

### 6.2 Check Logs
1. Dashboard → Logs tab
2. Filter by level: INFO, ERROR, WARN
3. Search for specific text
4. Export logs: Click download icon

### 6.3 Manage Deployments
1. Dashboard → Deployments
2. See all deployments
3. Revert to previous: Click "Rollback"
4. Delete old: Click "Delete"

### 6.4 Enable Notifications (Optional)
1. Settings → Notifications
2. Add Email or Slack
3. Alerts for:
   - Build success/failure
   - Deployment updates
   - Health check failures
   - Resource alerts

---

## Phase 7: Integrations (Optional)

### 7.1 GitHub Integration
- Railway auto-syncs with GitHub
- Every push to main = auto-deploy
- Status checks in GitHub PRs
- Deploy previews for branches

### 7.2 Slack Integration
1. Settings → Integrations
2. Click "Slack"
3. Connect Slack workspace
4. Select channel
5. Choose notification types

### 7.3 Webhooks
1. Settings → Webhooks
2. Add webhook URL
3. Railway POSTs deployment events
4. Use for: Notifications, CI/CD, analytics

---

## Phase 8: Scaling & Performance

### 8.1 Auto-scaling
1. Settings → Auto Scaling
2. Enable: Yes
3. Min instances: 1
4. Max instances: 3-5
5. CPU threshold: 70%
6. Memory threshold: 80%

**How it works:**
- Low traffic: 1 instance
- High traffic: Scales to 5 instances
- Auto-scales down when traffic drops

### 8.2 Load Balancing
- Railway handles automatically
- Distributes requests across instances
- Session persistence: Enabled
- No configuration needed

### 8.3 Database Replication (If using PostgreSQL)
1. Add second PostgreSQL service
2. Configure replication
3. Enable backups
4. Set retention: 30 days

---

## Phase 9: Security Best Practices

### 9.1 Environment Variables
✅ All secrets in Variables section
✅ Never commit .env files
✅ Use NEXT_PUBLIC_ prefix only for public vars
✅ Rotate secrets periodically

### 9.2 Access Control
1. Settings → Members
2. Add team members
3. Set roles: Admin, Editor, Viewer
4. Remove access when needed

### 9.3 Audit Logs
1. Settings → Audit Logs
2. See who did what and when
3. Track deployments, changes, access

### 9.4 Network Security
- Railway handles DDoS protection
- Auto-enables HTTPS
- Firewall rules: Configure in integrations
- VPN: Available on paid plans

---

## Phase 10: Cost Optimization

### 10.1 Usage Dashboard
1. Account → Billing
2. See current usage:
   - Compute hours
   - Data transfer
   - Storage
   - Network

### 10.2 Cost-Saving Tips
- Use free tier for development
- Scale resources per demand
- Use caching to reduce compute
- Clean up old deployments
- Use Railway's free tier: $5/month credits

### 10.3 Set Budget Alerts
1. Account → Billing
2. Set budget limit
3. Get alerts when approaching limit
4. Prevents unexpected charges

---

## Troubleshooting Dashboard Issues

### Issue: Build Fails
**Solution:**
1. Check Deployments → Logs
2. Look for error message
3. Common causes:
   - Missing package in package.json
   - Syntax errors in code
   - Insufficient disk space
4. Fix locally first: `npm run build`
5. Push fix to GitHub
6. Railway redeploys automatically

### Issue: App Won't Start
**Solution:**
1. Check Logs for errors
2. Verify environment variables set
3. Ensure PORT uses `process.env.PORT`
4. Check health check: Should return 200
5. Review: Settings → Health Checks

### Issue: Deployment Stuck
**Solution:**
1. Check Deployments → Current
2. Wait 5-10 minutes (builds take time)
3. If still stuck: Kill deployment
4. Redeploy: Click "Redeploy"
5. Check logs for build errors

### Issue: Can't Access Application
**Solution:**
1. Verify deployment status: Green ✅
2. Check if domain accessible: Try in browser
3. Wait for DNS propagation: 15-30 minutes
4. Clear browser cache: Ctrl+Shift+Delete
5. Check SSL certificate: Should be valid

---

## Quick Reference: Dashboard Navigation

```
Dashboard
├── Overview
│   ├── Deployments (view all)
│   ├── Logs (real-time)
│   └── Metrics (usage stats)
├── Deployments
│   ├── View logs
│   ├── Redeploy
│   └── Rollback
└── Settings
    ├── Variables (environment)
    ├── Build (commands)
    ├── Resources (memory/CPU)
    ├── Domains (custom domain)
    ├── Health Checks
    ├── Integrations
    ├── Members (team access)
    ├── Webhooks
    └── Audit Logs
```

---

## Essential Commands to Remember

```bash
# Login
railway login

# Open dashboard in browser
railway open

# View project settings
railway list

# View logs
railway logs --follow

# Set environment variables
railway variables set KEY=value

# Check status
railway status

# Redeploy
railway redeploy

# View deployment history
railway deployments
```

---

## Common Dashboard Tasks

| Task | Steps |
|------|-------|
| Add env var | Settings → Variables → New Variable |
| View logs | Deployments → Logs (scroll down) |
| Custom domain | Settings → Domains → Add Custom Domain |
| Increase memory | Settings → Resources → Edit |
| Enable auto-deploy | Settings → GitHub integration (auto) |
| Rollback version | Deployments → Previous → Rollback |
| Add team member | Settings → Members → Add |
| Check cost | Account → Billing → Current usage |

---

## Next Steps

1. ✅ Create Railway account (done)
2. ✅ Deploy from GitHub (done)
3. ✅ Set environment variables (next)
4. ✅ Configure domain (optional)
5. ✅ Monitor in dashboard (ongoing)
6. ✅ Scale as needed (when traffic grows)

---

**📞 Support:** https://docs.railway.app | support@railway.app
**Dashboard:** https://railway.app/dashboard
**Status:** https://status.railway.app
