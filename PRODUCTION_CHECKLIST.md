# Production Deployment Checklist for Render

## 🔒 Security Improvements

### 1. Environment Variables
- [ ] Move `JWT_SECRET_KEY` to environment variable
- [ ] Generate strong random secret key (use `secrets.token_hex(32)`)
- [ ] Add `DATABASE_URL` environment variable for PostgreSQL
- [ ] Add `FLASK_ENV=production`
- [ ] Never commit `.env` file to git

### 2. CORS Configuration
- [ ] Replace `CORS(app)` with specific origins
- [ ] Only allow your frontend domain
```python
CORS(app, origins=["https://your-frontend-domain.com"])
```

### 3. JWT Security
- [ ] Add JWT token expiration time
```python
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
```
- [ ] Implement refresh tokens for better security
- [ ] Add JWT blacklist for logout functionality

### 4. Input Validation
- [ ] Add validation for all POST/PUT requests
- [ ] Validate email format in registration
- [ ] Validate plate number format
- [ ] Add length limits for string fields
- [ ] Sanitize user inputs to prevent SQL injection

### 5. Password Security
- [ ] Add password strength requirements (min 8 chars, uppercase, numbers)
- [ ] Add rate limiting on login endpoint to prevent brute force

---

## 🗄️ Database Improvements

### 1. Switch to PostgreSQL
- [ ] Install `psycopg2-binary`
- [ ] Update `SQLALCHEMY_DATABASE_URI` to use PostgreSQL
```python
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
```

### 2. Database Indexes
- [ ] Add index on `User.email` for faster lookups
- [ ] Add index on `Sacco.admin_id`
- [ ] Add composite index on `Matatu_route(matatu_id, route_id)`

### 3. Cascade Deletes
- [ ] Add `ondelete="CASCADE"` to foreign keys
- [ ] Ensure deleting sacco deletes all matatus and routes

---

## ⚡ Performance Optimizations

### 1. Query Optimization
- [ ] Use `lazy='select'` or `lazy='joined'` appropriately
- [ ] Avoid N+1 queries - use `joinedload()` for relationships
- [ ] Add pagination to list endpoints (saccos, matatus, routes)
```python
page = request.args.get('page', 1, type=int)
per_page = request.args.get('per_page', 20, type=int)
saccos = Sacco.query.paginate(page=page, per_page=per_page)
```

### 2. Caching
- [ ] Add Flask-Caching for frequently accessed data
- [ ] Cache public endpoints (saccos, routes, matatus) for 5 minutes
- [ ] Invalidate cache on POST/PUT/DELETE operations

### 3. Response Compression
- [ ] Add Flask-Compress to compress responses
```python
from flask_compress import Compress
Compress(app)
```

---

## 📝 Error Handling & Logging

### 1. Error Handlers
- [ ] Add global error handler for 500 errors
- [ ] Add handler for 404 errors
- [ ] Return consistent error format
```python
@app.errorhandler(500)
def internal_error(error):
    return {"error": "Internal server error"}, 500
```

### 2. Logging
- [ ] Add logging for all errors
- [ ] Log failed login attempts
- [ ] Log database errors
- [ ] Use production logging service (e.g., Sentry)

### 3. Request Validation
- [ ] Add try-except blocks for all database operations
- [ ] Validate JSON payload exists before accessing
- [ ] Return meaningful error messages

---

## 🚀 Deployment Configuration

### 1. Gunicorn Setup
- [ ] Add `gunicorn` to requirements
- [ ] Create `Procfile` for Render:
```
web: gunicorn app:app
```
- [ ] Configure workers: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`

### 2. Requirements.txt
- [ ] Generate fresh requirements.txt
```bash
pip freeze > requirements.txt
```
- [ ] Include:
  - Flask
  - Flask-RESTful
  - Flask-SQLAlchemy
  - Flask-Migrate
  - Flask-CORS
  - Flask-JWT-Extended
  - psycopg2-binary
  - gunicorn
  - python-dotenv

### 3. Runtime Configuration
- [ ] Create `runtime.txt` with Python version:
```
python-3.13.0
```

### 4. Database Migrations
- [ ] Run migrations on Render:
```bash
flask db upgrade
```
- [ ] Add migration command to Render build script

---

## 🔐 Authentication & Authorization

### 1. Role-Based Access Control
- [ ] Re-add JWT protection to sensitive endpoints:
  - POST/PUT/DELETE for saccos, matatus, routes
  - User role updates (super_admin only)
- [ ] Verify user owns resource before update/delete
- [ ] Add middleware to check admin owns sacco

### 2. Token Management
- [ ] Store tokens securely (httpOnly cookies in production)
- [ ] Implement token refresh mechanism
- [ ] Add logout endpoint that blacklists tokens

---

## 📊 Monitoring & Health Checks

### 1. Health Check Endpoint
- [ ] Add `/health` endpoint for Render monitoring
```python
@app.route('/health')
def health():
    return {"status": "healthy"}, 200
```

### 2. Database Connection Pool
- [ ] Configure SQLAlchemy pool size
```python
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_size": 10,
    "pool_recycle": 3600,
}
```

---

## 🧪 Testing Before Deployment

### 1. Manual Testing
- [ ] Test all CRUD operations
- [ ] Test authentication flow
- [ ] Test role-based access
- [ ] Test error scenarios

### 2. Load Testing
- [ ] Test with multiple concurrent users
- [ ] Verify database connection handling
- [ ] Check response times

---

## 📦 Final Steps

### 1. Code Cleanup
- [ ] Remove debug print statements
- [ ] Remove commented code
- [ ] Set `debug=False` in production
- [ ] Remove development-only endpoints

### 2. Documentation
- [ ] Update README with production setup
- [ ] Document API endpoints
- [ ] Add environment variables documentation

### 3. Render Configuration
- [ ] Set environment variables in Render dashboard
- [ ] Configure PostgreSQL database
- [ ] Set up automatic deployments from GitHub
- [ ] Configure custom domain (if applicable)

---

## 🔄 Post-Deployment

### 1. Monitoring
- [ ] Monitor error logs
- [ ] Check database performance
- [ ] Monitor API response times
- [ ] Set up alerts for errors

### 2. Backup Strategy
- [ ] Enable automatic database backups on Render
- [ ] Test database restore process

### 3. Scaling
- [ ] Monitor resource usage
- [ ] Upgrade Render plan if needed
- [ ] Consider adding Redis for caching

---

## Priority Order

**High Priority (Must Do):**
1. Environment variables for secrets
2. PostgreSQL migration
3. Gunicorn setup
4. Input validation
5. Error handling
6. CORS configuration

**Medium Priority (Should Do):**
1. JWT expiration & refresh
2. Query optimization & pagination
3. Database indexes
4. Logging setup
5. Health check endpoint

**Low Priority (Nice to Have):**
1. Caching
2. Response compression
3. Advanced monitoring
4. Load testing
