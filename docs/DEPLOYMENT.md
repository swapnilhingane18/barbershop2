# Deployment Guide

This guide covers deploying the Barbershop Queue & Slot Management System to production.

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier works)
- GitHub repository with your code
- Backend deployed and accessible via HTTPS

### Step 1: Prepare for Deployment

1. **Verify Build Works Locally**
```bash
cd frontend
npm run build
npm run preview
```

2. **Check `.gitignore`**
Ensure `.env` is gitignored:
```
# .gitignore
.env
.env.local
.env.production
```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add the following:

```
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_WS_URL=https://your-backend-url.com/ws
```

6. Click "Deploy"

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? barbershop-frontend
# - Directory? ./
# - Override settings? N

# Add environment variables
vercel env add VITE_API_BASE_URL
# Enter: https://your-backend-url.com/api

vercel env add VITE_WS_URL
# Enter: https://your-backend-url.com/ws

# Deploy to production
vercel --prod
```

### Step 3: Verify Deployment

1. Open the Vercel URL (e.g., `https://barbershop-frontend.vercel.app`)
2. Check browser console for errors
3. Test customer registration
4. Test joining queue
5. Verify WebSocket connection in DevTools → Network → WS

---

## Backend Deployment

### Requirements

- Java 17+ runtime
- PostgreSQL database (or H2 for testing)
- HTTPS enabled
- WebSocket support

### Recommended Platforms

- **Heroku** (easy, free tier available)
- **Railway** (modern, good free tier)
- **AWS Elastic Beanstalk** (scalable)
- **Google Cloud Run** (serverless)

### Environment Variables for Backend

```
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/database
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password

# CORS (CRITICAL)
ALLOWED_ORIGINS=https://barbershop-frontend.vercel.app

# Server
SERVER_PORT=8080
```

---

## CORS Configuration

### Development CORS (Current)

```java
// WebConfig.java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
}
```

### Production CORS (Required)

**⚠️ CRITICAL:** Update `WebConfig.java` before deploying backend:

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins(
                "https://barbershop-frontend.vercel.app",  // Your Vercel URL
                "http://localhost:5173"  // Keep for local dev
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
}
```

**Best Practice:** Use environment variable:

```java
@Value("${allowed.origins}")
private String allowedOrigins;

@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins(allowedOrigins.split(","))
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
}
```

Then set `ALLOWED_ORIGINS=https://barbershop-frontend.vercel.app,http://localhost:5173`

---

## HTTPS Requirement

### Why HTTPS is Required

- **WebSocket Security:** WSS (WebSocket Secure) required in production
- **Browser Security:** Modern browsers block mixed content (HTTPS page → HTTP API)
- **Data Protection:** Customer data transmitted securely

### Frontend Changes for HTTPS

**No code changes needed!** Just update environment variables:

```env
# Production .env (set in Vercel)
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_WS_URL=wss://your-backend-url.com/ws
```

Note: `wss://` instead of `ws://` for secure WebSocket

### Backend HTTPS Setup

Most platforms (Heroku, Railway, Vercel) provide HTTPS automatically.

If self-hosting, configure SSL certificate:
```yaml
# application.yml
server:
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: your-password
    key-store-type: PKCS12
```

---

## WebSocket Security Notes

### Development (Current)

- Uses `ws://` (unencrypted)
- Allowed origins: `http://localhost:5173`
- No authentication

### Production (Required)

1. **Use WSS (WebSocket Secure)**
   - Update `VITE_WS_URL` to `wss://your-backend-url.com/ws`

2. **Restrict Origins**
   - Only allow production frontend URL
   - Remove `localhost` from allowed origins in production

3. **Add Authentication (Future)**
   - Implement JWT or session-based auth
   - Validate user before WebSocket connection
   - See "Future Enhancements" section

---

## Environment Variables Checklist

### Frontend (Vercel)

- [ ] `VITE_API_BASE_URL` - Backend API URL (HTTPS)
- [ ] `VITE_WS_URL` - WebSocket URL (WSS)

### Backend (Your Platform)

- [ ] `SPRING_DATASOURCE_URL` - Database connection
- [ ] `SPRING_DATASOURCE_USERNAME` - DB username
- [ ] `SPRING_DATASOURCE_PASSWORD` - DB password
- [ ] `ALLOWED_ORIGINS` - Frontend URL(s)
- [ ] `SERVER_PORT` - Port (usually 8080)

---

## Post-Deployment Verification

### 1. Frontend Checks

```bash
# Check build size
cd frontend
npm run build
# dist/ should be < 1MB

# Check for console errors
# Open production URL in browser
# Open DevTools → Console
# Should see no errors
```

### 2. Backend Checks

```bash
# Health check
curl https://your-backend-url.com/actuator/health

# API test
curl https://your-backend-url.com/api/queue/1

# CORS test
curl -H "Origin: https://barbershop-frontend.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://your-backend-url.com/api/queue/1
```

### 3. WebSocket Check

1. Open frontend in browser
2. Open DevTools → Network → WS tab
3. Join queue
4. Verify WebSocket connection shows "101 Switching Protocols"
5. Check messages are received

---

## Rollback Plan

### Frontend Rollback

**Vercel:**
1. Go to Vercel Dashboard
2. Select project
3. Go to "Deployments"
4. Find previous working deployment
5. Click "..." → "Promote to Production"

**CLI:**
```bash
vercel rollback
```

### Backend Rollback

Depends on your platform. Most have one-click rollback in dashboard.

---

## Monitoring & Logs

### Frontend (Vercel)

- **Logs:** Vercel Dashboard → Project → Logs
- **Analytics:** Vercel Dashboard → Project → Analytics
- **Errors:** Use browser DevTools → Console

### Backend

- **Application Logs:** Platform-specific (Heroku logs, Railway logs, etc.)
- **Database Logs:** Database provider dashboard
- **Health Checks:** `/actuator/health` endpoint

---

## Cost Estimates

### Free Tier (Recommended for MVP)

- **Frontend (Vercel):** Free
  - 100GB bandwidth/month
  - Unlimited deployments
  - Custom domain

- **Backend (Railway):** Free
  - $5 credit/month
  - 500 hours runtime
  - 1GB RAM

- **Database (Railway PostgreSQL):** Free
  - Included in Railway free tier
  - 1GB storage

**Total:** $0/month for MVP

### Paid Tier (Production)

- **Frontend (Vercel Pro):** $20/month
- **Backend (Railway Pro):** ~$10-20/month
- **Database (Managed PostgreSQL):** ~$15/month

**Total:** ~$45-55/month

---

## Troubleshooting

### "Failed to fetch" errors

**Cause:** CORS not configured or wrong API URL

**Fix:**
1. Check `VITE_API_BASE_URL` in Vercel environment variables
2. Verify backend CORS allows frontend URL
3. Check backend is running and accessible

### WebSocket connection fails

**Cause:** WSS not configured or wrong URL

**Fix:**
1. Check `VITE_WS_URL` uses `wss://` not `ws://`
2. Verify backend WebSocket endpoint is accessible
3. Check browser console for specific error

### "Mixed content" errors

**Cause:** HTTPS frontend trying to connect to HTTP backend

**Fix:**
- Backend MUST use HTTPS in production
- Update `VITE_API_BASE_URL` to use `https://`
- Update `VITE_WS_URL` to use `wss://`

---

## Future Enhancements

- [ ] Add authentication (JWT)
- [ ] Implement rate limiting
- [ ] Add monitoring (Sentry, LogRocket)
- [ ] Set up CI/CD pipeline
- [ ] Add automated tests in deployment
- [ ] Configure CDN for assets
- [ ] Add database backups
- [ ] Implement blue-green deployments

---

## Support

For deployment issues:
- Check Vercel documentation: https://vercel.com/docs
- Check backend platform documentation
- Review application logs
- Test locally first

---

## Security Checklist

Before deploying to production:

- [ ] `.env` files are gitignored
- [ ] No secrets in code
- [ ] CORS restricted to production URL only
- [ ] HTTPS enabled on backend
- [ ] WSS (secure WebSocket) configured
- [ ] Database credentials secured
- [ ] Environment variables set in platform (not in code)
- [ ] Error messages don't expose sensitive info
- [ ] Rate limiting considered (future)
- [ ] Authentication planned (future)
