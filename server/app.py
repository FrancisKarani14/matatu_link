from flask import Flask, make_response, jsonify, request
from flask_restful import Resource, Api
from models import db, Matatu, Matatu_route, Route, Sacco, User
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
api = Api(app)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///matatu.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your-secret-key-change-in-production"
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# welcome endpoint
class Welcome(Resource):
    def get(self):
        return "Hello"


api.add_resource(Welcome, "/")

# All saccos endpoint
class All_saccos(Resource):
    @jwt_required()
    def get(self):
        saccos = [sacco.to_dict(rules=("-matatus", "-routes"))
                  for sacco in Sacco.query.all()]
        return make_response(jsonify(saccos), 200)
    
    @jwt_required()
    def post(self):
        data = request.get_json()
        new_sacco = Sacco(
            name=data["name"],
            reg_number=data["reg_number"],
            admin_id=data.get("admin_id")
        )
        db.session.add(new_sacco)
        db.session.commit()
        return make_response({"msg": "Sacco created successfully", "sacco": new_sacco.to_dict()}, 201)


api.add_resource(All_saccos, "/saccos")

# Single sacco operations
class Sacco_operations(Resource):
    @jwt_required()
    def get(self, sacco_id):
        sacco = Sacco.query.get_or_404(sacco_id)
        return make_response(jsonify(sacco.to_dict()), 200)
    
    @jwt_required()
    def put(self, sacco_id):
        sacco = Sacco.query.get_or_404(sacco_id)
        data = request.get_json()
        sacco.name = data.get("name", sacco.name)
        sacco.reg_number = data.get("reg_number", sacco.reg_number)
        db.session.commit()
        return make_response({"msg": "Sacco updated successfully", "sacco": sacco.to_dict()}, 200)
    
    @jwt_required()
    def delete(self, sacco_id):
        sacco = Sacco.query.get_or_404(sacco_id)
        db.session.delete(sacco)
        db.session.commit()
        return make_response({"msg": "Sacco deleted successfully"}, 200)

api.add_resource(Sacco_operations, "/saccos/<int:sacco_id>")

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
    @jwt_required()
    def get(self):
        matatus = [matatu.to_dict(rules=("-sacco", "-matatu_routes"))
                   for matatu in Matatu.query.all()]
        return make_response(jsonify(matatus), 200)
    
    @jwt_required()
    def post(self):
        data = request.get_json()
        new_matatu = Matatu(
            plate_number=data["plate_number"],
            capacity=data["capacity"],
            sacco_id=data["sacco_id"]
        )
        db.session.add(new_matatu)
        db.session.commit()
        return make_response({"msg": "Matatu created successfully", "matatu": new_matatu.to_dict()}, 201)


api.add_resource(All_matatus, "/matatus")

# Single matatu operations
class Matatu_operations(Resource):
    @jwt_required()
    def put(self, matatu_id):
        matatu = Matatu.query.get_or_404(matatu_id)
        data = request.get_json()
        matatu.plate_number = data.get("plate_number", matatu.plate_number)
        matatu.capacity = data.get("capacity", matatu.capacity)
        db.session.commit()
        return make_response({"msg": "Matatu updated successfully", "matatu": matatu.to_dict()}, 200)
    
    @jwt_required()
    def delete(self, matatu_id):
        matatu = Matatu.query.get_or_404(matatu_id)
        db.session.delete(matatu)
        db.session.commit()
        return make_response({"msg": "Matatu deleted successfully"}, 200)

api.add_resource(Matatu_operations, "/matatus/<int:matatu_id>")

# all routes endpoint
class All_routes(Resource):
    @jwt_required()
    def get(self):
        routes = [route.to_dict() for route in Route.query.all()]
        return make_response(jsonify(routes), 200)
    
    @jwt_required()
    def post(self):
        data = request.get_json()
        new_route = Route(
            start=data["start"],
            end=data["end"],
            sacco_id=data["sacco_id"]
        )
        db.session.add(new_route)
        db.session.commit()
        return make_response({"msg": "Route created successfully", "route": new_route.to_dict()}, 201)


api.add_resource(All_routes, "/routes")

# Single route operations
class Route_operations(Resource):
    @jwt_required()
    def put(self, route_id):
        route = Route.query.get_or_404(route_id)
        data = request.get_json()
        route.start = data.get("start", route.start)
        route.end = data.get("end", route.end)
        db.session.commit()
        return make_response({"msg": "Route updated successfully", "route": route.to_dict()}, 200)
    
    @jwt_required()
    def delete(self, route_id):
        route = Route.query.get_or_404(route_id)
        db.session.delete(route)
        db.session.commit()
        return make_response({"msg": "Route deleted successfully"}, 200)

api.add_resource(Route_operations, "/routes/<int:route_id>")

# all matatu_routes endpoint
class All_Matatu_Routes(Resource):
    @jwt_required()
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
    
    @jwt_required()
    def post(self):
        data = request.get_json()
        new_mr = Matatu_route(
            matatu_id=data["matatu_id"],
            route_id=data["route_id"],
            fare=data["fare"]
        )
        db.session.add(new_mr)
        db.session.commit()
        return make_response({"msg": "Matatu route created successfully"}, 201)


api.add_resource(All_Matatu_Routes, "/matatu_routes")

# Single matatu_route operations
class Matatu_route_operations(Resource):
    @jwt_required()
    def delete(self, mr_id):
        mr = Matatu_route.query.get_or_404(mr_id)
        db.session.delete(mr)
        db.session.commit()
        return make_response({"msg": "Matatu route deleted successfully"}, 200)

api.add_resource(Matatu_route_operations, "/matatu_routes/<int:mr_id>")

# Register endpoint
class Register(Resource):
    def post(self):
        data = request.get_json()
        
        if User.query.filter_by(email=data["email"]).first():
            return make_response({"error": "Email already exists"}, 400)
        
        user = User(
            full_name=data["full_name"],
            email=data["email"]
        )
        user.set_password(data["password"])
        
        db.session.add(user)
        db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        
        return make_response({
            "msg": "User registered successfully",
            "access_token": access_token,
            "user": user.to_dict()
        }, 201)

api.add_resource(Register, "/register")

# Login endpoint
class Login(Resource):
    def post(self):
        data = request.get_json()
        
        user = User.query.filter_by(email=data["email"]).first()
        
        if not user or not user.check_password(data["password"]):
            return make_response({"error": "Invalid email or password"}, 401)
        
        access_token = create_access_token(identity=user.id)
        
        return make_response({
            "msg": "Login successful",
            "access_token": access_token,
            "user": user.to_dict()
        }, 200)

api.add_resource(Login, "/login")

# All users endpoint
class All_users(Resource):
    @jwt_required()
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(jsonify(users), 200)

api.add_resource(All_users, "/users")

# Update user role endpoint
class Update_user_role(Resource):
    @jwt_required()
    def patch(self, user_id):
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        user.role = data.get("role", user.role)
        db.session.commit()
        return make_response({"msg": "User role updated", "user": user.to_dict()}, 200)

api.add_resource(Update_user_role, "/users/<int:user_id>")


# class DebugSaccos(Resource):
#     def get(self):
#         saccos = Sacco.query.all()
#         return [{"id": s.id, "name": s.name} for s in saccos]


# api.add_resource(DebugSaccos, "/debug_saccos")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
