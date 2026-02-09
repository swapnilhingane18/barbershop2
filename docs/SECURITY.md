# Security Checklist

## Pre-Deployment Security Review

### ✅ Environment Variables

- [x] `.env` files are in `.gitignore`
- [x] No `.env` files committed to repository
- [x] Environment variables documented in README files
- [x] Production environment variables set in deployment platform (not in code)

**Verification:**
```bash
# Check .gitignore
cat .gitignore | grep .env

# Check git history for .env files
git log --all --full-history -- "*/.env"

# Should return no results
```

### ✅ No Secrets in Code

- [x] No API keys hardcoded
- [x] No database passwords in code
- [x] No JWT secrets in code
- [x] All sensitive values use environment variables

**Files Checked:**
- `backend/src/main/resources/application.properties`
- `backend/src/main/resources/application.yml`
- `frontend/src/**/*.ts`
- `frontend/src/**/*.tsx`

**Verification:**
```bash
# Search for potential secrets
grep -r "password\s*=" backend/src/
grep -r "secret\s*=" backend/src/
grep -r "api_key" frontend/src/
```

### ✅ CORS Configuration

**Current (Development):**
```java
// WebConfig.java
allowedOrigins("http://localhost:5173")
```

**Required for Production:**
```java
// WebConfig.java
allowedOrigins(
    "https://your-production-url.com",
    "http://localhost:5173"  // Keep for local dev
)
```

**Action Items:**
- [ ] Update `WebConfig.java` before deploying backend
- [ ] Use environment variable for allowed origins
- [ ] Remove wildcard `*` if present
- [ ] Test CORS in production environment

**Recommended Implementation:**
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

Then set environment variable:
```
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173
```

### ✅ WebSocket Security

**Current (Development):**
- Uses `ws://` (unencrypted)
- No authentication
- Open to all origins

**Required for Production:**

1. **Use WSS (WebSocket Secure)**
   ```env
   # Frontend .env
   VITE_WS_URL=wss://your-backend-url.com/ws
   ```

2. **Restrict Origins**
   ```java
   // WebSocketConfig.java
   @Override
   public void registerStompEndpoints(StompEndpointRegistry registry) {
       registry.addEndpoint("/ws")
               .setAllowedOrigins("https://your-frontend.vercel.app")
               .withSockJS();
   }
   ```

3. **Add Authentication (Future)**
   - Implement JWT validation before WebSocket handshake
   - Subscribe to user-specific topics only
   - Validate permissions for each message

**Action Items:**
- [ ] Update WebSocket URL to use `wss://` in production
- [ ] Restrict allowed origins in `WebSocketConfig.java`
- [ ] Plan authentication implementation

### ✅ HTTPS Enforcement

**Requirements:**
- [ ] Backend must use HTTPS in production
- [ ] Frontend must use HTTPS in production
- [ ] WebSocket must use WSS in production

**Verification:**
```bash
# Test HTTPS redirect
curl -I http://your-backend-url.com
# Should return 301 redirect to https://

# Test WebSocket upgrade
curl -i -N -H "Connection: Upgrade" \
     -H "Upgrade: websocket" \
     wss://your-backend-url.com/ws
```

**Platforms with Auto-HTTPS:**
- Vercel (frontend)
- Heroku (backend)
- Railway (backend)
- AWS Elastic Beanstalk (backend)

### ✅ Error Messages

**Current Implementation:**
- User-friendly error messages in UI
- Detailed errors logged to console (development only)
- No stack traces exposed to users

**Verification:**
```bash
# Check error handling
grep -r "console.error" frontend/src/
# All should be for debugging only

# Check backend error responses
# Should not expose internal details
```

**Production Checklist:**
- [ ] Remove or disable debug logging in production
- [ ] Ensure error responses don't expose:
  - Stack traces
  - Database structure
  - Internal paths
  - Dependency versions

### ✅ Input Validation

**Frontend Validation:**
- [x] Name: 2-50 characters, trimmed
- [x] Phone: 10 digits, numeric only
- [x] All inputs sanitized before API calls

**Backend Validation:**
- [x] `@Valid` annotations on request bodies
- [x] `@NotNull`, `@NotBlank` on required fields
- [x] Custom validation for business logic

**Verification:**
```bash
# Check frontend validation
grep -r "validateInputs" frontend/src/pages/

# Check backend validation
grep -r "@Valid" backend/src/
grep -r "@NotNull" backend/src/
```

### ✅ Database Security

**Current (Development):**
- H2 in-memory database
- No password
- Console accessible at `/h2-console`

**Required for Production:**
- [ ] Use PostgreSQL or MySQL
- [ ] Strong database password
- [ ] Disable H2 console
- [ ] Use connection pooling
- [ ] Enable SSL for database connection

**Action Items:**
```yaml
# application-prod.yml
spring:
  h2:
    console:
      enabled: false  # CRITICAL: Disable in production
  
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
    hikari:
      maximum-pool-size: 10
```

### ✅ Dependency Security

**Action Items:**
- [ ] Run security audit before deployment
- [ ] Update dependencies with known vulnerabilities
- [ ] Enable Dependabot or similar

**Commands:**
```bash
# Frontend security audit
cd frontend
npm audit
npm audit fix

# Backend security check
cd backend
.\mvnw.cmd dependency-check:check
```

### ✅ Rate Limiting (Future)

**Not Implemented (MVP):**
- No rate limiting on API endpoints
- No protection against DDoS

**Future Implementation:**
```java
// Add Spring Security + Bucket4j
@RateLimiter(name = "api")
@GetMapping("/api/queue/{barberId}")
public ResponseEntity<?> getQueue(@PathVariable Long barberId) {
    // ...
}
```

**Recommended Limits:**
- API calls: 100 requests/minute per IP
- WebSocket connections: 5 per IP
- Queue joins: 10 per hour per customer

---

## Production Deployment Checklist

### Before Deploying Backend

- [ ] Update CORS to production URL
- [ ] Set `ALLOWED_ORIGINS` environment variable
- [ ] Disable H2 console
- [ ] Configure production database
- [ ] Set strong database password
- [ ] Enable HTTPS
- [ ] Update WebSocket allowed origins
- [ ] Remove debug logging
- [ ] Run security audit (`mvn dependency-check:check`)

### Before Deploying Frontend

- [ ] Set `VITE_API_BASE_URL` to production backend (HTTPS)
- [ ] Set `VITE_WS_URL` to production WebSocket (WSS)
- [ ] Verify `.env` is gitignored
- [ ] Run security audit (`npm audit`)
- [ ] Test build locally (`npm run build`)
- [ ] Verify no console errors in production build

### After Deployment

- [ ] Test HTTPS is enforced
- [ ] Test WebSocket connection (WSS)
- [ ] Test CORS from production frontend
- [ ] Verify error messages don't expose sensitive info
- [ ] Check application logs for errors
- [ ] Monitor for unusual activity

---

## Known Security Limitations (MVP)

### 1. No Authentication
**Risk:** Anyone can access any endpoint  
**Mitigation:** Planned for future  
**Impact:** High

### 2. Client-Side Customer ID
**Risk:** Customer ID can be manipulated  
**Mitigation:** Move to backend-generated secure tokens  
**Impact:** Medium

### 3. No Rate Limiting
**Risk:** API can be overwhelmed  
**Mitigation:** Add rate limiting in production  
**Impact:** Medium

### 4. No Data Encryption at Rest
**Risk:** Database data stored unencrypted  
**Mitigation:** Enable database encryption  
**Impact:** Low (no sensitive data in MVP)

### 5. No Audit Logging
**Risk:** No record of who did what  
**Mitigation:** Add audit trail for critical operations  
**Impact:** Low (MVP only)

---

## Security Roadmap

### Phase 1 (Immediate - Before Production)
- [ ] HTTPS enforcement
- [ ] CORS restriction
- [ ] WSS for WebSocket
- [ ] Disable H2 console
- [ ] Production database with password

### Phase 2 (Post-MVP)
- [ ] JWT authentication
- [ ] User roles (CUSTOMER, BARBER, ADMIN)
- [ ] Rate limiting
- [ ] Secure customer ID generation

### Phase 3 (Future)
- [ ] Two-factor authentication
- [ ] Audit logging
- [ ] Data encryption at rest
- [ ] Security headers (CSP, HSTS, etc.)
- [ ] Penetration testing

---

## Security Contacts

**For Security Issues:**
- Create a private GitHub issue
- Email: security@your-domain.com (if applicable)
- Do not disclose publicly until patched

**Response Time:**
- Critical: 24 hours
- High: 72 hours
- Medium: 1 week
- Low: 2 weeks

---

## Compliance Notes

**Current Status:**
- No PII (Personally Identifiable Information) stored
- No payment processing
- No GDPR requirements (MVP)
- No HIPAA requirements

**If Adding User Accounts:**
- [ ] Add privacy policy
- [ ] Add terms of service
- [ ] Implement data deletion
- [ ] Add consent mechanisms
- [ ] Consider GDPR compliance

---

## Last Updated

**Date:** 2026-02-09  
**Reviewed By:** Development Team  
**Next Review:** Before production deployment
