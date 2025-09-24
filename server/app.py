from flask import Flask, make_response, jsonify, request
from flask_restful import Resource, Api
from models import db, Matatu, Matatu_route, Route, Sacco
from flask_migrate import Migrate
from flask_cors import CORS


app = Flask(__name__)
api = Api(app)
CORS(app)
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


class Updates_matatu(Resource):
    def put(self, sacco_id, id):
        sacco = Sacco.query.get_or_404(sacco_id)
        matatu = Matatu.query.get_or_404(id)

        # ensure the matatu belongs to this sacco
        if matatu.sacco_id != sacco.id:
            return make_response(
                {"error": "Matatu does not belong to this sacco"}, 400
            )

        data = request.get_json()

        # update fields
        matatu.plate_number = data.get("plate_number", matatu.plate_number)
        matatu.capacity = data.get("capacity", matatu.capacity)

        # commit changes
        db.session.commit()

        return make_response(
            {"msg": "Matatu updated successfully", "matatu": matatu.to_dict()}, 200
        )


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




        
if __name__ == "__main__":
    app.run(debug=True)

