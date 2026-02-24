# Super Admin Credentials

## Default Login Credentials

**Email:** `superadmin@matatulink.com`  
**Password:** `Admin@123`

⚠️ **IMPORTANT SECURITY NOTES:**

1. These credentials are automatically created during deployment
2. **Change the password immediately after first login**
3. Never share these credentials
4. Use a strong, unique password after changing

## How It Works

1. When you deploy to Render, the `build.sh` script runs
2. It executes `python seed.py` which:
   - Creates all database tables
   - Checks if super admin exists
   - Creates super admin if it doesn't exist
   - Skips creation if it already exists (safe for redeployments)

## Changing the Password

After first login:
1. Go to Super Admin Dashboard
2. Navigate to Settings (when implemented)
3. Change password to a strong one

OR manually update in database:
```python
from app import app, db
from models import User

with app.app_context():
    admin = User.query.filter_by(email="superadmin@matatulink.com").first()
    admin.set_password("YourNewStrongPassword123!")
    db.session.commit()
```

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one number
- Example: `Admin@123` (meets all requirements)

## Testing Locally

To test the super admin creation locally:
```bash
cd server
python seed.py
```

## Redeployment

The seed script is safe to run multiple times:
- It checks if super admin exists
- Only creates if missing
- Won't duplicate or overwrite existing admin
