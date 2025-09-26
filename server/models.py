from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

db = SQLAlchemy()


class Sacco(db.Model, SerializerMixin):
    __tablename__ = "saccos"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    reg_number = db.Column(db.String(10), nullable=False)

    matatus = relationship("Matatu", back_populates="sacco")
    routes = relationship("Route", back_populates="sacco")

    # Break circular serialization

    serialize_rules = ("-matatus.sacco", "-routes.sacco", "-matatus", "-routes")


class Matatu_route(db.Model, SerializerMixin):
    __tablename__ = "matatu_route"
    id = db.Column(db.Integer, primary_key=True)
    matatu_id = db.Column(db.Integer, db.ForeignKey("matatus.id"))
    route_id = db.Column(db.Integer, db.ForeignKey("routes.id"))
    fare = db.Column(db.Integer, nullable=False)

    #  back_populates
    matatu = relationship("Matatu", back_populates="matatu_routes")
    route = relationship("Route", back_populates="matatu_routes")

    serialize_rules = ("-matatu.matatu_routes", "-route.matatu_routes", "-matatu.sacco", "-route.sacco")


class Matatu(db.Model, SerializerMixin):
    __tablename__ = "matatus"
    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(20), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    sacco_id = db.Column(db.Integer, db.ForeignKey("saccos.id"))

    sacco = relationship("Sacco", back_populates="matatus")
    matatu_routes = relationship("Matatu_route", back_populates="matatu")

    # association proxy → gives you matatu.routes directly
    # routes = association_proxy("matatu_routes", "route")

    serialize_rules = ("-sacco.matatus", "-matatu_routes.matatu")


class Route(db.Model, SerializerMixin):
    __tablename__ = "routes"
    id = db.Column(db.Integer, primary_key=True)
    start = db.Column(db.String(20), nullable=False)
    end = db.Column(db.String(20), nullable=False)
    sacco_id = db.Column(db.Integer, db.ForeignKey("saccos.id"))

    sacco = relationship("Sacco", back_populates="routes")
    matatu_routes = relationship("Matatu_route", back_populates="route")

    # association proxy → gives you route.matatus directly
    # matatus = association_proxy("matatu_routes", "matatu")

    serialize_rules = ("-sacco", "-matatu_routes" )



