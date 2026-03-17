# Deployment Guide - Fraud Detection Dashboard

## 🚀 Production Deployment Options

### Option 1: Deploy to Render.com (Recommended - Free Tier)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/fraud-detection.git
git push -u origin main
```

2. **Create Render Account**:
   - Visit https://dashboard.render.com
   - Sign up with GitHub

3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - **Name**: fraud-detection-pk
     - **Environment**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
   - Click "Create Web Service"

4. **Access Your App**:
   - Visit: `https://fraud-detection-pk.onrender.com`

---

### Option 2: Deploy to Railway.app

1. **Create Railway Account**:
   - Visit https://railway.app
   - Sign in with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose this repository

3. **Configure**:
   - Railway auto-detects Python
   - Adds PORT environment variable
   - Deploy starts automatically

4. **Access Your App**:
   - View deployment URL in Railway dashboard

---

### Option 3: Deploy to AWS EC2

```bash
# 1. Launch EC2 Instance
# - Ubuntu 22.04 LTS
# - t3.micro (free tier eligible)
# - Security group: Allow HTTP (80), HTTPS (443), SSH (22)

# 2. SSH into instance
ssh -i your-key.pem ubuntu@your-public-ip

# 3. Update system
sudo apt update && sudo apt upgrade -y

# 4. Install dependencies
sudo apt install -y python3 python3-pip python3-venv git nginx

# 5. Clone repository
git clone https://github.com/yourusername/fraud-detection.git
cd fraud-detection

# 6. Setup Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# 7. Create systemd service
sudo nano /etc/systemd/system/fraud-detection.service
```

**Paste this into the service file**:
```ini
[Unit]
Description=Fraud Detection Dashboard
After=network.target

[Service]
Type=notify
User=ubuntu
WorkingDirectory=/home/ubuntu/fraud-detection
Environment="PATH=/home/ubuntu/fraud-detection/venv/bin"
ExecStart=/home/ubuntu/fraud-detection/venv/bin/gunicorn -w 4 -b 127.0.0.1:5001 app:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Continue setup**:
```bash
# 8. Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable fraud-detection
sudo systemctl start fraud-detection
sudo systemctl status fraud-detection

# 9. Configure Nginx as reverse proxy
sudo nano /etc/nginx/sites-available/fraud-detection
```

**Paste this Nginx config**:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # or IP address
    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Finish Nginx setup**:
```bash
# 10. Enable Nginx site
sudo ln -s /etc/nginx/sites-available/fraud-detection /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 11. Optional: Setup SSL with Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

**Access your app**: 
- Visit `http://your-public-ip` or your domain

---

### Option 4: Deploy with Docker

```bash
# 1. Build Docker image
docker build -t fraud-detection:latest .

# 2. Run container
docker run -d \
  -p 5001:5001 \
  --name fraud-detection-app \
  --restart always \
  fraud-detection:latest

# 3. View logs
docker logs -f fraud-detection-app

# 4. Stop container
docker stop fraud-detection-app
```

**Using Docker Compose**:
```bash
# 1. Start services
docker-compose up -d

# 2. View status
docker-compose ps

# 3. View logs
docker-compose logs -f

# 4. Stop services
docker-compose down
```

---

### Option 5: Deploy to Heroku

```bash
# 1. Install Heroku CLI
# macOS: brew tap heroku/brew && brew install heroku
# Linux/Windows: Visit https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Create app
heroku create fraud-detection-pk

# 4. Deploy
git push heroku main

# 5. View logs
heroku logs --tail

# 6. Open app
heroku open
```

---

## 📊 Monitoring & Maintenance

### Health Check
```bash
curl https://your-app.com/api/health
```

### View Logs
- Render: Dashboard → Logs
- Railway: Logs tab
- AWS/Nginx: `sudo tail -f /var/log/gunicorn/error.log`

### Update Application
```bash
# Pull latest code
git pull origin main

# Restart service
sudo systemctl restart fraud-detection

# Or with Docker
docker-compose pull
docker-compose up -d
```

---

## 🔒 Security Recommendations

1. **Use HTTPS**:
   - Let's Encrypt for free SSL certificates
   - Redirect HTTP to HTTPS

2. **Environment Variables**:
   - Use `.env` file (don't commit)
   - Never hardcode secrets

3. **CORS Settings**:
   - Restrict to your domain
   - Update in `app.py`

4. **Database**:
   - Upgrade from in-memory to PostgreSQL
   - Use managed database service

5. **Rate Limiting**:
   - Install Flask-Limiter
   - Prevent API abuse

Example CORS update:
```python
CORS(app, resources={r"/api/*": {"origins": "https://yourdomain.com"}})
```

---

## 📈 Scaling Recommendations

- **Low Traffic**: t3.micro (AWS) or free tier Render
- **Medium Traffic**: t3.small + load balancer
- **High Traffic**: Auto-scaling group + RDS database

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process: `lsof -i :5001 \| grep LISTEN \| awk '{print $2}' \| xargs kill -9` |
| Gunicorn not found | Install: `pip install gunicorn` |
| Database connection error | Check connection string in environment variables |
| High memory usage | Reduce worker count: `gunicorn -w 2` |
| Timeout errors | Increase timeout: `gunicorn --timeout 120` |

---

## 📞 Support

- GitHub Issues: Report bugs
- Email: support@frauddetection.pk
- Documentation: See README.md

---

**Last Updated**: March 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
