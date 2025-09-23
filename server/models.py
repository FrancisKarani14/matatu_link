from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey

db= SQLAlchemy()

class Sacco(db.Model, SerializerMixin):
     __tablename__="saccos"
     id = db.Column(db.Integer, primary_key=True)
     name=db.Column(db.String(20), nullable=False)
     reg_number= db.Column(db.String(10), nullable=False)
# relationships
     matatu= relationship("Matatu", back_populates="sacco")
     route=relationship("Route", back_populates="sacco")

# serialize rules
serialize_rules=("-matatu.sacco, -route.sacco")
    
     




class Matatu(db.Model, SerializerMixin):
    __tablename__ = "matatus"
    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(20), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    sacco_id = db.Column(db.Integer, db.ForeignKey("saccos.id"))
    
    # relationships

    sacco=relationship("Sacco", back_populates="matatu")

    # serialize rules
    serialize_rules=("-sacco.matatu")
    



    


class Route(db.Model, SerializerMixin):
    __tablename__ = "routes"
    id = db.Column(db.Integer, primary_key=True)
    start = db.Column(db.String(20), nullable=False)
    end = db.Column(db.String(20), nullable=False)
    sacco_id = db.Column(db.Integer, db.ForeignKey("saccos.id"))
    

    # relationships
    sacco = relationship("Sacco", back_populates="route")
    # serialize rules
    serialize_rules=("-sacco.route")




 