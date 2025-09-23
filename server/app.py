from flask import Flask
from flask_restful import Resource, Api
from models import db, Matatu, Matatu_route, Route, Sacco
from flask_migrate import Migrate 


app=Flask(__name__)
api=Api(app)

app.config["SQLALCHEMY_DATABASE_URI"]="sqlite:///matatu.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
db.init_app(app)
migrate=Migrate(app, db)

class Welcome(Resource):
     def get(self):
          return "Hello"
api.add_resource(Welcome,"/")

if __name__ == "__main__":
     app.run(debug=True)
     