from flask import Flask, make_response, jsonify, request
from flask_restful import Resource, Api
from models import db, Matatu, Matatu_route, Route, Sacco
from flask_migrate import Migrate
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging

# print("DATABASE_URL:", os.getenv("DATABASE_URL"))

load_dotenv()
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
api = Api(app)
CORS(app, origins=["https://matatu-link.vercel.app/"])

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable not set! Deployment will fail without it."
    )
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "NajmaKarani")
db.init_app(app)
migrate = Migrate(app, db)


class Welcome(Resource):
    def get(self):
        return "Hello"


api.add_resource(Welcome, "/")


class All_saccos(Resource):
    def get(self):
        saccos = [sacco.to_dict(rules=("-matatus", "-routes"))
                  for sacco in Sacco.query.all()]
        return make_response(jsonify(saccos), 200)


api.add_resource(All_saccos, "/saccos")


class All_matatus_in_sacco(Resource):
    def get(self, sacco_id):
        sacco = Sacco.query.get_or_404(sacco_id)
        matatus = [matatu.to_dict(rules=("-sacco", "-matatu_routes"))
                   for matatu in sacco.matatus]
        return make_response(jsonify(matatus), 200)


api.add_resource(All_matatus_in_sacco, "/saccos/<int:sacco_id>/matatus")


class All_Routes_in_sacco(Resource):
    def get(self, sacco_id):
        sacco = Sacco.query.get_or_404(sacco_id)
        routes_in_sacco = [route.to_dict(
            rules=("-sacco_id",)) for route in sacco.routes]
        return make_response(jsonify(routes_in_sacco), 200)


api.add_resource(All_Routes_in_sacco, "/saccos/<int:sacco_id>/routes")


class Adds_a_matatu_to_sacco(Resource):
    def post(self, sacco_id):
        sacco = Sacco.query.get_or_404(sacco_id)
        data = request.get_json()
        new_matatu = Matatu(
            plate_number=data["plate_number"],
            capacity=data["capacity"],
            sacco_id=sacco.id
        )
        db.session.add(new_matatu)
        db.session.commit()
        return make_response({"msg": "Matatu added successfully"}, 201)


api.add_resource(Adds_a_matatu_to_sacco, "/saccos/<int:sacco_id>/matatus/add")


class Updates_matatu(Resource):
    def put(self, sacco_id, id):
        sacco = Sacco.query.get_or_404(sacco_id)
        matatu = Matatu.query.get_or_404(id)
        if matatu.sacco_id != sacco.id:
            return make_response({"error": "Matatu does not belong to this sacco"}, 400)
        data = request.get_json()
        matatu.plate_number = data.get("plate_number", matatu.plate_number)
        matatu.capacity = data.get("capacity", matatu.capacity)
        db.session.commit()
        return make_response({"msg": "Matatu updated successfully", "matatu": matatu.to_dict()}, 200)


api.add_resource(Updates_matatu, "/saccos/<int:sacco_id>/matatus/<int:id>")


class Deletes_matatu(Resource):
    def delete(self, sacco_id, id):
        sacco = Sacco.query.get_or_404(sacco_id)
        matatu = Matatu.query.get_or_404(id)
        if matatu.sacco_id != sacco.id:
            return make_response({"error": "Matatu does not belong to this sacco"}, 400)
        db.session.delete(matatu)
        db.session.commit()
        return make_response({"msg": "Matatu deleted successfully"}, 200)


api.add_resource(
    Deletes_matatu, "/saccos/<int:sacco_id>/matatus/<int:id>/delete")


class All_matatus(Resource):
    def get(self):
        matatus = [matatu.to_dict(rules=("-sacco", "-matatu_routes"))
                   for matatu in Matatu.query.all()]
        return make_response(jsonify(matatus), 200)


api.add_resource(All_matatus, "/matatus")


class All_routes(Resource):
    def get(self):
        routes = [route.to_dict() for route in Route.query.all()]
        return make_response(jsonify(routes), 200)


api.add_resource(All_routes, "/routes")


class All_Matatu_Routes(Resource):
    def get(self):
        routes = [{
            "id": mr.id,
            "fare": mr.fare,
            "matatu": {
                "id": mr.matatu.id,
                "plate_number": mr.matatu.plate_number,
                "capacity": mr.matatu.capacity
            },
            "route": {
                "id": mr.route.id,
                "start": mr.route.start,
                "end": mr.route.end
            }
        } for mr in Matatu_route.query.all()]
        return make_response(jsonify(routes), 200)


api.add_resource(All_Matatu_Routes, "/matatu_routes")

if __name__ == "__main__":
    app.run(debug=os.getenv("DEBUG", "False") == "True")
