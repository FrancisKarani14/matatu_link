from app import app, db
from models import Sacco, Matatu, Route, Matatu_route

with app.app_context():
    # Clear existing data
    db.drop_all()
    db.create_all()

    # --- Saccos ---
    s1 = Sacco(name="City Riders", reg_number="CR123")
    s2 = Sacco(name="Highway Express", reg_number="HX456")

    # --- Matatus ---
    m1 = Matatu(plate_number="KDA 123A", capacity=14, sacco=s1)
    m2 = Matatu(plate_number="KDB 456B", capacity=33, sacco=s1)
    m3 = Matatu(plate_number="KDC 789C", capacity=14, sacco=s2)
    m4 = Matatu(plate_number="KDD 101D", capacity=33, sacco=s2)

    # --- Routes ---
    r1 = Route(start="Nairobi", end="Thika", sacco=s1)
    r2 = Route(start="Nairobi", end="Kikuyu", sacco=s1)
    r3 = Route(start="Nairobi", end="Machakos", sacco=s2)
    r4 = Route(start="Nairobi", end="Kitengela", sacco=s2)

    # --- Matatu-Route (fares) ---
    mr1 = Matatu_route(matatu=m1, route=r1, fare=100)
    mr2 = Matatu_route(matatu=m2, route=r2, fare=80)
    mr3 = Matatu_route(matatu=m3, route=r3, fare=150)
    mr4 = Matatu_route(matatu=m4, route=r4, fare=120)
    mr5 = Matatu_route(matatu=m1, route=r2, fare=90)   # matatu can have multiple routes

    # Add all to session
    db.session.add_all([s1, s2, m1, m2, m3, m4, r1, r2, r3, r4, mr1, mr2, mr3, mr4, mr5])
    db.session.commit()

    print("✅ Database seeded successfully!")