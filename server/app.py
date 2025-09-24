from flask import Flask, make_response, jsonify, request
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

class All_matatus_in_sacco(Resource):
    def get(self, sacco_id):
        sacco=Sacco.query.get_or_404(sacco_id)
        matatus=[matatu.to_dict() for matatu in sacco.matatus]
        response=make_response(
            jsonify(matatus),
            200

        )
        return response
api.add_resource(All_matatus_in_sacco, "/saccos/<int:sacco_id>/matatus")

# view routes of a sacco


class All_Routes_in_sacco(Resource):
    def get(self, sacco_id):
        sacco = Sacco.query.get_or_404(sacco_id)
        routes_in_sacco = [route.to_dict() for route in sacco.routes]
        response = make_response(
            jsonify(routes_in_sacco),
            200

        )

        return response


api.add_resource(All_Routes_in_sacco, "/saccos/<int:sacco_id>/routes")

# end point for adding a matatu
class Adds_a_matatu_to_sacco(Resource):
    def post(self, sacco_id):
        sacco = Sacco.query.get_or_404(sacco_id)
        data=request.get_json()

        new_matatu= Matatu(
            plate_number=data["plate_number"],
            capacity=data["capacity"],
            sacco_id=sacco.id
        )
        db.session.add(new_matatu)
        db.session.commit()
        return make_response({"msg":"matatu added succesfully"}, 201)


api.add_resource(Adds_a_matatu_to_sacco, "/saccos/<int:sacco_id>/matatus/add")

        
if __name__ == "__main__":
    app.run(debug=True)

