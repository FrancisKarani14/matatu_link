from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey

db = SQLAlchemy()


class Sacco(db.Model, SerializerMixin):
    __tablename__ = "saccos"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    reg_number = db.Column(db.String(10), nullable=False)

    matatus = relationship("Matatu", back_populates="sacco")
    routes = relationship("Route", back_populates="sacco")

    # Break circular serialization
    serialize_rules = ("-matatus.sacco", "-routes.sacco")


class Matatu(db.Model, SerializerMixin):
    __tablename__ = "matatus"
    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(20), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    sacco_id = db.Column(db.Integer, db.ForeignKey("saccos.id"))

    sacco = relationship("Sacco", back_populates="matatus")
    routes = relationship("Route", secondary="matatu_route",
                          back_populates="matatus")

    # Break loops
    serialize_rules = ("-sacco.matatus", "-routes.matatus")


class Route(db.Model, SerializerMixin):
    __tablename__ = "routes"
    id = db.Column(db.Integer, primary_key=True)
    start = db.Column(db.String(20), nullable=False)
    end = db.Column(db.String(20), nullable=False)
    sacco_id = db.Column(db.Integer, db.ForeignKey("saccos.id"))

    sacco = relationship("Sacco", back_populates="routes")
    matatus = relationship(
        "Matatu", secondary="matatu_route", back_populates="routes")

    # Break loops
    serialize_rules = ("-sacco.routes", "-matatus.routes")


class Matatu_route(db.Model, SerializerMixin):
    __tablename__ = "matatu_route"
    id = db.Column(db.Integer, primary_key=True)
    matatu_id = db.Column(db.Integer, db.ForeignKey("matatus.id"))
    route_id = db.Column(db.Integer, db.ForeignKey("routes.id"))
    fare = db.Column(db.Integer, nullable=False)

    matatu = relationship("Matatu")
    route = relationship("Route")

    # Break loops
    serialize_rules = ("-matatu.routes", "-route.matatus")
