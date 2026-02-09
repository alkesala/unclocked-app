# Docker Deployment Guide

This guide explains how to deploy the Unclocked application using Docker and Docker Compose.

## Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **External MongoDB** instance (MongoDB Atlas, self-hosted, or any MongoDB provider)

### Verify Installation

```bash
docker --version
docker compose version
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Host Machine                         │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Docker Network (app-network)          │ │
│  │                                                    │ │
│  │   ┌──────────────┐         ┌──────────────────┐   │ │
│  │   │   Frontend   │         │     Backend      │   │ │
│  │   │   (nginx)    │────────▶│   (Node.js)      │   │ │
│  │   │   Port 80    │  /api/  │   Port 3001      │   │ │
│  │   └──────────────┘         └────────┬─────────┘   │ │
│  │          │                          │             │ │
│  └──────────┼──────────────────────────┼─────────────┘ │
│             │                          │               │
│        Port 80:80                      │               │
│        (exposed)              (internal only)          │
│                                        │               │
└─────────────────────────────────────────┼───────────────┘
                                         │
                                         ▼
                              ┌──────────────────┐
                              │  External MongoDB │
                              │   (e.g., Atlas)   │
                              └──────────────────┘
```

**Key points:**
- Frontend serves the React SPA via nginx on port 80
- Backend API runs on port 3001 (internal only, not exposed to host)
- Nginx proxies `/api/` requests to the backend container
- MongoDB is external and must be accessible from the Docker network

## Quick Start

### 1. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.production.example .env

# Edit with your actual values
nano .env   # or use any text editor
```

### 2. Build and Start

```bash
# Build images and start containers
docker compose up -d --build

# Verify containers are running
docker compose ps
```

### 3. Access the Application

Open your browser and navigate to: `http://localhost`

## Configuration

### Environment Variables

Edit the `.env` file in the project root with your configuration:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/unclocked` |
| `JWT_SECRET` | Yes | Secret key for JWT tokens (use a strong random string) | `your-256-bit-secret` |
| `JWT_EXPIRES_IN` | No | JWT token expiration time | `7d` (default) |
| `PORT` | No | Backend server port | `3001` (default) |
| `NODE_ENV` | No | Node environment | `production` |
| `FRONTEND_URL` | No | Frontend URL for CORS | `http://localhost` |

### Generating a Secure JWT Secret

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### MongoDB Connection String Examples

**MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/unclocked?retryWrites=true&w=majority
```

**Self-hosted MongoDB:**
```
MONGODB_URI=mongodb://username:password@your-server.com:27017/unclocked?authSource=admin
```

**Local MongoDB (for development):**
```
MONGODB_URI=mongodb://host.docker.internal:27017/unclocked
```
> Note: Use `host.docker.internal` to connect to MongoDB running on the host machine.

## Common Operations

### Building and Starting

```bash
# Build and start in detached mode
docker compose up -d --build

# Start without rebuilding (uses cached images)
docker compose up -d

# Build only (without starting)
docker compose build
```

### Viewing Logs

```bash
# View all logs
docker compose logs

# View logs for a specific service
docker compose logs frontend
docker compose logs backend

# Follow logs in real-time
docker compose logs -f

# View last 100 lines
docker compose logs --tail=100
```

### Checking Status

```bash
# List running containers
docker compose ps

# Check container health
docker inspect --format='{{.State.Health.Status}}' unclocked-app-backend-1
docker inspect --format='{{.State.Health.Status}}' unclocked-app-frontend-1
```

### Stopping and Removing

```bash
# Stop containers (preserves images)
docker compose down

# Stop and remove volumes
docker compose down -v

# Stop, remove containers, and remove images
docker compose down --rmi all
```

### Restarting Services

```bash
# Restart all services
docker compose restart

# Restart a specific service
docker compose restart backend
docker compose restart frontend
```

### Rebuilding After Code Changes

```bash
# Rebuild and restart a specific service
docker compose up -d --build backend

# Rebuild everything
docker compose up -d --build
```

## Health Checks

Both services include health checks that Docker uses to monitor container health:

- **Frontend**: Checks if nginx responds on port 80
- **Backend**: Checks if the API health endpoint responds at `/api/v1/health`

View health status:
```bash
docker compose ps
```

Healthy containers show `(healthy)` in the STATUS column.

## Troubleshooting

### Container Won't Start

1. **Check logs for errors:**
   ```bash
   docker compose logs backend
   docker compose logs frontend
   ```

2. **Verify environment variables:**
   ```bash
   docker compose config
   ```

3. **Check if ports are already in use:**
   ```bash
   # Linux/macOS
   lsof -i :80

   # Windows
   netstat -ano | findstr :80
   ```

### Cannot Connect to MongoDB

1. **Verify MongoDB URI is correct** in `.env`

2. **Check if MongoDB allows connections from Docker:**
   - For MongoDB Atlas: Ensure your IP is whitelisted (or use `0.0.0.0/0` for development)
   - For self-hosted: Ensure firewall allows connections from Docker network

3. **Test connection from backend container:**
   ```bash
   docker compose exec backend sh
   # Inside container:
   wget -qO- http://localhost:3001/api/v1/health
   ```

### Frontend Shows Blank Page

1. **Check browser console** for JavaScript errors

2. **Verify nginx is serving files:**
   ```bash
   docker compose exec frontend ls -la /usr/share/nginx/html
   ```

3. **Check nginx logs:**
   ```bash
   docker compose logs frontend
   ```

### API Requests Failing (502 Bad Gateway)

1. **Check if backend is running:**
   ```bash
   docker compose ps backend
   ```

2. **Verify backend health:**
   ```bash
   docker compose logs backend
   ```

3. **Test internal connectivity:**
   ```bash
   docker compose exec frontend wget -qO- http://backend:3001/api/v1/health
   ```

### Build Fails

1. **Clear Docker cache and rebuild:**
   ```bash
   docker compose build --no-cache
   ```

2. **Check available disk space:**
   ```bash
   docker system df
   ```

3. **Prune unused Docker resources:**
   ```bash
   docker system prune -a
   ```

## Production Considerations

### Using a Reverse Proxy (Recommended)

For production, place the application behind a reverse proxy like Traefik or nginx-proxy for:
- SSL/TLS termination
- Multiple domain support
- Load balancing

Example with custom port:
```yaml
# docker-compose.override.yml
services:
  frontend:
    ports:
      - "8080:80"  # Use port 8080 instead of 80
```

### SSL/HTTPS

For HTTPS support, you have several options:

1. **Use a reverse proxy** (Traefik, nginx-proxy) with Let's Encrypt
2. **Modify nginx.conf** to include SSL certificates
3. **Use a cloud load balancer** (AWS ALB, Cloudflare, etc.)

### Resource Limits

Add resource limits in `docker-compose.override.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Logging in Production

Configure log rotation to prevent disk space issues:

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## File Structure Reference

```
unclocked-app/
├── .env                      # Environment variables (create from .env.production.example)
├── .env.production.example   # Example environment file
├── docker-compose.yml        # Docker Compose configuration
├── DOCKER.md                 # This documentation
├── backend/
│   ├── Dockerfile           # Backend build instructions
│   └── .dockerignore        # Files excluded from backend build
├── frontend/
│   ├── Dockerfile           # Frontend build instructions
│   ├── .dockerignore        # Files excluded from frontend build
│   └── nginx.conf           # Nginx configuration for serving frontend
└── shared/                   # Shared TypeScript types (built during Docker build)
```

## Support

If you encounter issues not covered in this guide:

1. Check the container logs: `docker compose logs`
2. Verify your `.env` configuration
3. Ensure MongoDB is accessible from the Docker network
4. Review the Troubleshooting section above
