from app import app, db
from models import User
import os

with app.app_context():
    # Create tables if they don't exist
    db.create_all()
    
    # Check if super admin already exists
    super_admin = User.query.filter_by(email="superadmin@matatulink.com").first()
    
    if not super_admin:
        super_admin = User(
            full_name="Super Admin",
            email="superadmin@matatulink.com",
            role="super_admin"
        )
        super_admin.set_password("Admin@123")
        
        db.session.add(super_admin)
        db.session.commit()
        
        print("✅ Super admin created successfully!")
        print("Email: superadmin@matatulink.com")
        print("Password: Admin@123")
        print("⚠️  IMPORTANT: Change this password after first login!")
    else:
        print("✅ Super admin already exists")
        print("Email: superadmin@matatulink.com")
