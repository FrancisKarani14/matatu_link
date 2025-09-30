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

# DATABASE_URL = os.getenv("DATABASE_URL")
# if not DATABASE_URL:
#     raise RuntimeError(
#         "DATABASE_URL environment variable not set! Deployment will fail.")

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
# logger.info(f"Database URL: {DATABASE_URL}")

app = Flask(__name__, static_folder="./client/dist", static_url_path="/")
api = Api(app)
CORS(app)


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///matatu.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
db.init_app(app)
migrate = Migrate(app, db)

# handle uncaught exceptions globally
@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.errorhandler(404)
def not_found(err):
    return app.send_static_file("index.html")

# @app.errorhandler(Exception)
# def handle_all_exceptions(e):
#     logger.exception("Unhandled exception occurred")
#     return {"error": str(e)}, 500

# Health check endpoint


@app.route("/health")
def health():
    return {"status": "ok"}, 200

# welcome endpoint
class Welcome(Resource):
    def get(self):
        return "Hello"


api.add_resource(Welcome, "/")

# All saccos endpoint
class All_saccos(Resource):
    def get(self):
        saccos = [sacco.to_dict(rules=("-matatus", "-routes"))
                  for sacco in Sacco.query.all()]
        return make_response(jsonify(saccos), 200)


api.add_resource(All_saccos, "/saccos")

# all matatus in a sacco
class All_matatus_in_sacco(Resource):
    def get(self, sacco_id):
        sacco = Sacco.query.get_or_404(sacco_id)
        matatus = [matatu.to_dict(rules=("-sacco", "-matatu_routes"))
                   for matatu in sacco.matatus]
        return make_response(jsonify(matatus), 200)


api.add_resource(All_matatus_in_sacco, "/saccos/<int:sacco_id>/matatus")

# all routes in a sacco
class All_Routes_in_sacco(Resource):
    def get(self, sacco_id):
        sacco = Sacco.query.get_or_404(sacco_id)
        routes_in_sacco = [route.to_dict(
            rules=("-sacco_id",)) for route in sacco.routes]
        return make_response(jsonify(routes_in_sacco), 200)


api.add_resource(All_Routes_in_sacco, "/saccos/<int:sacco_id>/routes")

# add a matatu to a sacco
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

# update a matatu in a sacco
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

# delete a matatu in a sacco
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

# all matatus endpoint
class All_matatus(Resource):
    def get(self):
        matatus = [matatu.to_dict(rules=("-sacco", "-matatu_routes"))
                   for matatu in Matatu.query.all()]
        return make_response(jsonify(matatus), 200)


api.add_resource(All_matatus, "/matatus")

# all routes endpoint
class All_routes(Resource):
    def get(self):
        routes = [route.to_dict() for route in Route.query.all()]
        return make_response(jsonify(routes), 200)


api.add_resource(All_routes, "/routes")

# all matatu_routes endpoint
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


# class DebugSaccos(Resource):
#     def get(self):
#         saccos = Sacco.query.all()
#         return [{"id": s.id, "name": s.name} for s in saccos]


# api.add_resource(DebugSaccos, "/debug_saccos")


if __name__ == "__main__":
    app.run(debug=False, port=5001)
