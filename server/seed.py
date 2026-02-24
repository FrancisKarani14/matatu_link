from app import app, db
from models import User

with app.app_context():
    db.drop_all()
    db.create_all()

    super_admin = User(
        full_name="Super Admin",
        email="superadmin@matatulink.com",
        role="super_admin"
    )
    super_admin.set_password("admin123")

    db.session.add(super_admin)
    db.session.commit()

    print("✅ Database seeded successfully with super admin!")
    print("Email: superadmin@matatulink.com")
    print("Password: admin123")
