from app import app, db
from models import Sacco, Matatu, Route, Matatu_route

with app.app_context():
    # db.drop_all()
    db.create_all()

    s1 = Sacco(name="City Riders", reg_number="CR123")
    s2 = Sacco(name="Highway Express", reg_number="HX456")
    s3 = Sacco(name="Metro Movers", reg_number="MM789")
    s4 = Sacco(name="Safari Lines", reg_number="SL321")

    m1 = Matatu(plate_number="KDA 123A", capacity=14, sacco=s1)
    m2 = Matatu(plate_number="KDB 456B", capacity=33, sacco=s1)
    m3 = Matatu(plate_number="KDC 789C", capacity=14, sacco=s2)
    m4 = Matatu(plate_number="KDD 101D", capacity=33, sacco=s2)
    m5 = Matatu(plate_number="KDE 202E", capacity=14, sacco=s3)
    m6 = Matatu(plate_number="KDF 303F", capacity=33, sacco=s3)
    m7 = Matatu(plate_number="KDG 404G", capacity=14, sacco=s4)
    m8 = Matatu(plate_number="KDH 505H", capacity=33, sacco=s4)

    r1 = Route(start="Nairobi", end="Thika", sacco=s1)
    r2 = Route(start="Nairobi", end="Kikuyu", sacco=s1)
    r3 = Route(start="Nairobi", end="Machakos", sacco=s2)
    r4 = Route(start="Nairobi", end="Kitengela", sacco=s2)
    r5 = Route(start="Nairobi", end="Juja", sacco=s3)
    r6 = Route(start="Nairobi", end="Ngong", sacco=s3)
    r7 = Route(start="Nairobi", end="Naivasha", sacco=s4)
    r8 = Route(start="Nairobi", end="Narok", sacco=s4)

    mr1 = Matatu_route(matatu=m1, route=r1, fare=100)
    mr2 = Matatu_route(matatu=m2, route=r2, fare=80)
    mr3 = Matatu_route(matatu=m3, route=r3, fare=150)
    mr4 = Matatu_route(matatu=m4, route=r4, fare=120)
    mr5 = Matatu_route(matatu=m1, route=r2, fare=90)
    mr6 = Matatu_route(matatu=m5, route=r5, fare=70)
    mr7 = Matatu_route(matatu=m6, route=r6, fare=100)
    mr8 = Matatu_route(matatu=m7, route=r7, fare=200)
    mr9 = Matatu_route(matatu=m8, route=r8, fare=250)
    mr10 = Matatu_route(matatu=m5, route=r6, fare=95)
    mr11 = Matatu_route(matatu=m7, route=r8, fare=220)

    db.session.add_all([
        s1, s2, s3, s4,
        m1, m2, m3, m4, m5, m6, m7, m8,
        r1, r2, r3, r4, r5, r6, r7, r8,
        mr1, mr2, mr3, mr4, mr5, mr6, mr7, mr8, mr9, mr10, mr11
    ])
    db.session.commit()

    print("✅ Database seeded successfully with more saccos, matatus & routes!")
