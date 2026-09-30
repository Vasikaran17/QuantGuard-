# QuantGuard Production Deployment Manual
### Quantum-Inspired Cyber Threat Detection Console

QuantGuard is architected as a **unified single-port service**. The FastAPI backend serves both the REST API (`/api/*`) and the built React Single-Page Application (SPA) on a single port (`8000` or `$PORT`), eliminating CORS issues and reverse proxy complexities in cloud environments.

---

## 🚀 Option 1: Cloud Deployment (Render / Railway / Koyeb) — 3 Minutes

### A. Deploy on Render (Free Tier)
1. Push this repository to **GitHub**.
2. Go to [dashboard.render.com](https://dashboard.render.com) and click **"New +"** → **"Blueprint"** (or **"Web Service"**).
3. Connect your GitHub repository.
4. Render will automatically detect [`render.yaml`](./render.yaml) and configure:
   - **Environment:** `Python 3.11`
   - **Build Command:** `pip install -r backend/requirements.txt && python backend/seed_data.py`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **"Apply"** / **"Create Web Service"**.
6. Your live HTTPS URL will be available at `https://quantguard-console.onrender.com`.

---

### B. Deploy on Railway / Koyeb / Fly.io (Docker)
1. In your cloud provider dashboard, select **"Deploy from GitHub repo"**.
2. Select **Docker deployment** (it will automatically pick up [`Dockerfile`](./Dockerfile)).
3. The multi-stage Docker build will:
   - Build the React SPA bundle with Node 20
   - Package it into a lightweight Python 3.11 Linux container
   - Start the service dynamically on `$PORT`.
4. Done!

---

## 🐳 Option 2: VPS Deployment via Docker & Docker Compose (Recommended)
**Target OS:** Ubuntu 22.04 / 24.04 LTS, Debian 12, CentOS/RHEL, AWS EC2, DigitalOcean Droplet.

### 1. Install Docker & Docker Compose on your server
```bash
# Update and install Docker
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. Clone the Repository & Launch
```bash
git clone https://github.com/Vasikaran17/QuantGuard-.git
cd QuantGuard-

# Build and start container in detached background mode
docker compose up -d --build
```

### 3. Verify Container Status & Logs
```bash
# Check container health status
docker ps

# View live application logs
docker compose logs -f
```
> QuantGuard is now running live on `http://YOUR_SERVER_IP:8000`!

---

## 🖥️ Option 3: Native Linux Server Deployment (Systemd + Nginx + SSL)

If you prefer to run QuantGuard natively without Docker:

### 1. Prerequisites on Server
```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv nodejs npm nginx certbot python3-certbot-nginx
```

### 2. Build Frontend & Setup Backend
```bash
# Clone and enter project
git clone https://github.com/Vasikaran17/QuantGuard-.git /var/www/quantguard
cd /var/www/quantguard

# 1. Build React Frontend
cd frontend
npm install
npm run build
cd ..

# 2. Setup Python Virtual Environment
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed_data.py
deactivate
cd ..
```

### 3. Create Systemd Background Service
Create file `/etc/systemd/system/quantguard.service`:
```ini
[Unit]
Description=QuantGuard Quantum Digital Signature Defense Service
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/quantguard/backend
Environment="PATH=/var/www/quantguard/backend/venv/bin"
ExecStart=/var/www/quantguard/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 2
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo chown -R www-data:www-data /var/www/quantguard
sudo systemctl daemon-reload
sudo systemctl enable quantguard
sudo systemctl start quantguard
sudo systemctl status quantguard
```

### 4. Configure Nginx Reverse Proxy with HTTPS
Create `/etc/nginx/sites-available/quantguard`:
```nginx
server {
    server_name yourdomain.com; # Replace with your domain or server IP

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and activate SSL:
```bash
sudo ln -s /etc/nginx/sites-available/quantguard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Obtain free Let's Encrypt SSL certificate
sudo certbot --nginx -d yourdomain.com
```

---

## 🔒 Security Best Practices for Server Deployment

1. **Firewall (UFW):**
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 8000/tcp # (If accessing port 8000 directly without Nginx)
   sudo ufw enable
   ```

2. **Operator Credentials:**
   Default operator credentials:
   - **User ID:** `admin`
   - **Password:** `QuantGuard@2026`
   *(To change default credentials in production, update `backend/auth.py` or set JWT secrets via environment variables).*
