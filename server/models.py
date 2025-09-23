from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

db= SQLAlchemy()

class Sacco(db.Model, SerializerMixin):
    pass
 