# 🔒 Security Requirements for Production Websites

This document outlines all security measures required for a production website, focusing on web application security best practices.

## 📋 Security Checklist

### ✅ HTTPS & SSL
- [ ] SSL certificate installed (Let's Encrypt recommended for cost)
- [ ] HSTS header configured (min 1 year)
- [ ] HTTP to HTTPS redirects configured
- [ ] SSL certificate auto-renewal setup
- [ ] Mixed content (HTTP resources on HTTPS pages) eliminated

### ✅ Authentication & Authorization
- [ ] Strong password policies (12+ chars, complexity requirements)
- [ ] Multi-factor authentication (MFA) available
- [ ] Secure password hashing (bcrypt, scrypt, or argon2)
- [ ] JWT tokens with appropriate expiration times
- [ ] Refresh token rotation implemented
- [ ] Account lockout after failed attempts
- [ ] Secure logout (token invalidation)

### ✅ Input Validation & Sanitization
- [ ] All user inputs validated server-side
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization, CSP headers)
- [ ] CSRF protection implemented
- [ ] File upload validation (type, size, content)
- [ ] Rate limiting on all endpoints

### ✅ Security Headers
- [ ] Content Security Policy (CSP) configured
- [ ] X-Frame-Options set to DENY or SAMEORIGIN
- [ ] X-Content-Type-Options set to nosniff
- [ ] Referrer-Policy configured appropriately
- [ ] Permissions-Policy for browser features
- [ ] Strict-Transport-Security (HSTS)

### ✅ Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] Data in transit encrypted (TLS 1.3)
- [ ] Personal data minimization
- [ ] Secure deletion of user data
- [ ] Data backup encryption
- [ ] Database connection encryption

### ✅ Session Management
- [ ] Secure session cookies (HttpOnly, Secure, SameSite)
- [ ] Session timeout configuration
- [ ] Concurrent session limits
- [ ] Session invalidation on logout
- [ ] Session fixation protection

### ✅ API Security
- [ ] API rate limiting implemented
- [ ] API authentication required
- [ ] Input validation on all endpoints
- [ ] Proper error handling (no sensitive data leakage)
- [ ] API versioning strategy
- [ ] Request size limits

### ✅ Third-Party Dependencies
- [ ] Regular dependency vulnerability scanning
- [ ] Dependency update automation
- [ ] Only trusted packages used
- [ ] License compliance checking
- [ ] Sub-dependency vulnerability monitoring

### ✅ Infrastructure Security
- [ ] Web Application Firewall (WAF) configured
- [ ] DDoS protection in place
- [ ] Server hardening (minimal services, updates)
- [ ] Network segmentation
- [ ] Intrusion detection systems
- [ ] Regular security audits

## 🚨 Common Security Vulnerabilities & Fixes

### OWASP Top 10 Prevention

#### 1. Broken Access Control
```javascript
// ❌ Bad: No authorization check
app.get('/api/admin/users', (req, res) => {
  // Returns all users without checking permissions
});

// ✅ Good: Proper authorization
app.get('/api/admin/users', authenticateToken, requireRole('ADMIN'), (req, res) => {
  // Only admins can access
});
```

#### 2. Cryptographic Failures
```javascript
// ❌ Bad: Weak encryption
const hash = crypto.createHash('md5').update(password).digest('hex');

// ✅ Good: Strong password hashing
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash(password, 12);
```

#### 3. Injection
```javascript
// ❌ Bad: SQL injection vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Good: Parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
const user = await db.query(query, [email]);
```

#### 4. Insecure Design
- Implement secure by design principles
- Threat modeling during development
- Security requirements in user stories

#### 5. Security Misconfiguration
```javascript
// ✅ Production configuration
const config = {
  env: 'production',
  debug: false,
  session: {
    secret: process.env.SESSION_SECRET,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'strict'
    }
  }
};
```

#### 6. Vulnerable Components
```json
// package.json audit
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "security": "npm audit --audit-level high"
  }
}
```

#### 7. Identification & Authentication Failures
```javascript
// ✅ Proper authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

#### 8. Software & Data Integrity Failures
- Verify integrity of third-party dependencies
- Use signed packages
- Implement CI/CD security checks

#### 9. Security Logging & Monitoring
```javascript
// ✅ Comprehensive logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'security.log', level: 'warn' }),
    new winston.transports.Console()
  ]
});

// Log security events
logger.warn('Failed login attempt', {
  ip: req.ip,
  email: req.body.email,
  timestamp: new Date().toISOString()
});
```

#### 10. Server-Side Request Forgery (SSRF)
```javascript
// ❌ Bad: Allows internal network access
const axios = require('axios');
const response = await axios.get(userProvidedUrl);

// ✅ Good: URL validation and restrictions
const validateUrl = (url) => {
  const allowedHosts = ['api.example.com', 'cdn.example.com'];
  const urlObj = new URL(url);
  return allowedHosts.includes(urlObj.hostname);
};

if (!validateUrl(userProvidedUrl)) {
  throw new Error('Invalid URL');
}
```

## 🔧 Security Headers Implementation

### Express.js Security Headers
```javascript
const helmet = require('helmet');
const express = require('express');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "api.example.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Apache/Nginx Security Headers
```nginx
# nginx.conf
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
```

## 🛡️ Security Monitoring & Alerting

### Log Analysis
```javascript
// Security event monitoring
const securityEvents = [
  'failed_login',
  'password_reset',
  'account_locked',
  'suspicious_activity',
  'admin_action'
];

// Log security events
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    // Log security-relevant requests
    if (req.path.includes('/auth') || req.path.includes('/admin')) {
      logger.info('Security event', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        statusCode: res.statusCode,
        timestamp: new Date().toISOString()
      });
    }
    originalSend.call(this, data);
  };
  next();
});
```

### Intrusion Detection
- Monitor for unusual patterns
- Alert on multiple failed login attempts
- Track suspicious IP addresses
- Monitor for SQL injection attempts

## 📊 Security Audit Checklist

### Pre-Launch Security Audit
- [ ] Penetration testing completed
- [ ] Code security review
- [ ] Dependency vulnerability scan
- [ ] Configuration review
- [ ] Access control verification

### Ongoing Security Monitoring
- [ ] Regular vulnerability scans
- [ ] Security patch management
- [ ] Log review process
- [ ] Incident response plan
- [ ] Security training for team

## 🔗 Additional Resources

- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [SANS Security Policy Templates](https://www.sans.org/information-security-policy/)
- [Mozilla SSL Configuration Generator](https://mozilla.github.io/server-side-tls/ssl-config-generator/)

---

**Remember**: Security is an ongoing process, not a one-time implementation. Regular updates, monitoring, and audits are essential for maintaining a secure website.