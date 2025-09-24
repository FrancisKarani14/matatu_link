from flask import Flask, make_response, jsonify
from flask_restful import Resource, Api
from models import db, Matatu, Matatu_route, Route, Sacco
from flask_migrate import Migrate


app = Flask(__name__)
api = Api(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///matatu.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
migrate = Migrate(app, db)


class Welcome(Resource):
    def get(self):
        return "Hello"
    


api.add_resource(Welcome, "/")


class All_saccos(Resource):
    def get(self):
        saccos=[sacco.to_dict() for sacco in Sacco.query.all()]
        response=make_response(
            jsonify(saccos),
            200
        )
        return response
    
api.add_resource(All_saccos, "/saccos")
        

if __name__ == "__main__":
    app.run(debug=True, port=5001)
