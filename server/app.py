import os
import re
import logging
from datetime import timedelta
from flask import Flask, make_response, jsonify, request
from flask_restful import Resource, Api
from flask_compress import Compress
from models import db, Matatu, Matatu_route, Route, Sacco, User
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
from config import Config
from email_validator import validate_email, EmailNotValidError

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
api = Api(app)
Compress(app)
CORS(app, origins=[app.config['FRONTEND_URL'], "http://localhost:5173"])
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# JWT error handlers
@jwt.invalid_token_loader
def invalid_token_callback(error):
    logger.warning(f"Invalid token: {error}")
    return make_response({"error": "Invalid token"}, 422)

@jwt.unauthorized_loader
def unauthorized_callback(error):
    logger.warning(f"Unauthorized access: {error}")
    return make_response({"error": "Missing authorization header"}, 401)

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    logger.info("Expired token used")
    return make_response({"error": "Token has expired"}, 401)

# Global error handlers
@app.errorhandler(404)
def not_found(error):
    return make_response({"error": "Resource not found"}, 404)

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    db.session.rollback()
    return make_response({"error": "Internal server error"}, 500)

@app.errorhandler(Exception)
def handle_exception(error):
    logger.error(f"Unhandled exception: {error}")
    db.session.rollback()
    return make_response({"error": "An unexpected error occurred"}, 500)

# Validation helpers
def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r"[0-9]", password):
        return False, "Password must contain at least one number"
    return True, None

def validate_plate_number(plate_number):
    """Validate Kenyan plate number format"""
    pattern = r"^K[A-Z]{2}\s?\d{3}[A-Z]$"
    if not re.match(pattern, plate_number.upper()):
        return False, "Invalid plate number format (e.g., KDA 123A)"
    return True, None

# Health check endpoint
@app.route('/health')
def health():
    try:
        # Check database connection
        db.session.execute('SELECT 1')
        return {"status": "healthy", "database": "connected"}, 200
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "unhealthy", "database": "disconnected"}, 503

# Welcome endpoint
class Welcome(Resource):
    def get(self):
        return {"message": "Matatu Link API", "version": "1.0"}

api.add_resource(Welcome, "/")

# All saccos endpoint with pagination
class All_saccos(Resource):
    def get(self):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 50, type=int)
            
            saccos_query = Sacco.query.paginate(page=page, per_page=per_page, error_out=False)
            saccos = [sacco.to_dict(rules=("-matatus", "-routes")) for sacco in saccos_query.items]
            
            return make_response(jsonify({
                "saccos": saccos,
                "total": saccos_query.total,
                "pages": saccos_query.pages,
                "current_page": page
            }), 200)
        except Exception as e:
            logger.error(f"Error fetching saccos: {e}")
            return make_response({"error": "Failed to fetch saccos"}, 500)
    
    def post(self):
        try:
            data = request.get_json()
            if not data:
                return make_response({"error": "No data provided"}, 400)
            
            # Validation
            if not data.get("name") or len(data["name"]) > 50:
                return make_response({"error": "Invalid sacco name"}, 400)
            if not data.get("reg_number") or len(data["reg_number"]) > 20:
                return make_response({"error": "Invalid registration number"}, 400)
            
            new_sacco = Sacco(
                name=data["name"],
                reg_number=data["reg_number"],
                admin_id=data.get("admin_id")
            )
            db.session.add(new_sacco)
            db.session.commit()
            
            logger.info(f"Sacco created: {new_sacco.name}")
            return make_response({"msg": "Sacco created successfully", "sacco": new_sacco.to_dict()}, 201)
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating sacco: {e}")
            return make_response({"error": "Failed to create sacco"}, 500)

api.add_resource(All_saccos, "/saccos")

# Single sacco operations
class Sacco_operations(Resource):
    def get(self, sacco_id):
        try:
            sacco = Sacco.query.get_or_404(sacco_id)
            return make_response(jsonify(sacco.to_dict()), 200)
        except Exception as e:
            logger.error(f"Error fetching sacco {sacco_id}: {e}")
            return make_response({"error": "Sacco not found"}, 404)
    
    def put(self, sacco_id):
        try:
            sacco = Sacco.query.get_or_404(sacco_id)
            data = request.get_json()
            
            if data.get("name"):
                sacco.name = data["name"]
            if data.get("reg_number"):
                sacco.reg_number = data["reg_number"]
            
            db.session.commit()
            logger.info(f"Sacco updated: {sacco.id}")
            return make_response({"msg": "Sacco updated successfully", "sacco": sacco.to_dict()}, 200)
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating sacco {sacco_id}: {e}")
            return make_response({"error": "Failed to update sacco"}, 500)
    
    def delete(self, sacco_id):
        try:
            sacco = Sacco.query.get_or_404(sacco_id)
            db.session.delete(sacco)
            db.session.commit()
            logger.info(f"Sacco deleted: {sacco_id}")
            return make_response({"msg": "Sacco deleted successfully"}, 200)
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error deleting sacco {sacco_id}: {e}")
            return make_response({"error": "Failed to delete sacco"}, 500)

api.add_resource(Sacco_operations, "/saccos/<int:sacco_id>")

# All matatus in a sacco
class All_matatus_in_sacco(Resource):
    def get(self, sacco_id):
        try:
            sacco = Sacco.query.get_or_404(sacco_id)
            matatus = [matatu.to_dict(rules=("-sacco", "-matatu_routes")) for matatu in sacco.matatus]
            return make_response(jsonify(matatus), 200)
        except Exception as e:
            logger.error(f"Error fetching matatus for sacco {sacco_id}: {e}")
            return make_response({"error": "Failed to fetch matatus"}, 500)

api.add_resource(All_matatus_in_sacco, "/saccos/<int:sacco_id>/matatus")

# All routes in a sacco
class All_Routes_in_sacco(Resource):
    def get(self, sacco_id):
        try:
            sacco = Sacco.query.get_or_404(sacco_id)
            routes = [route.to_dict(rules=("-sacco_id",)) for route in sacco.routes]
            return make_response(jsonify(routes), 200)
        except Exception as e:
            logger.error(f"Error fetching routes for sacco {sacco_id}: {e}")
            return make_response({"error": "Failed to fetch routes"}, 500)

api.add_resource(All_Routes_in_sacco, "/saccos/<int:sacco_id>/routes")

# All matatus endpoint with pagination
class All_matatus(Resource):
    def get(self):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 50, type=int)
            
            matatus_query = Matatu.query.paginate(page=page, per_page=per_page, error_out=False)
            matatus = [matatu.to_dict(rules=("-sacco", "-matatu_routes")) for matatu in matatus_query.items]
            
            return make_response(jsonify({
                "matatus": matatus,
                "total": matatus_query.total,
                "pages": matatus_query.pages,
                "current_page": page
            }), 200)
        except Exception as e:
            logger.error(f"Error fetching matatus: {e}")
            return make_response({"error": "Failed to fetch matatus"}, 500)
    
    def post(self):
        try:
            data = request.get_json()
            if not data:
                return make_response({"error": "No data provided"}, 400)
            
            # Validation
            plate_number = data.get("plate_number", "").strip()
            valid, error_msg = validate_plate_number(plate_number)
            if not valid:
                return make_response({"error": error_msg}, 400)
            
            capacity = data.get("capacity")
            if not capacity or not isinstance(capacity, int) or capacity < 1 or capacity > 100:
                return make_response({"error": "Invalid capacity (1-100)"}, 400)
            
            new_matatu = Matatu(
                plate_number=plate_number.upper(),
                capacity=capacity,
                sacco_id=data["sacco_id"]
            )
            db.session.add(new_matatu)
            db.session.commit()
            
            logger.info(f"Matatu created: {new_matatu.plate_number}")
            return make_response({"msg": "Matatu created successfully", "matatu": new_matatu.to_dict()}, 201)
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating matatu: {e}")
            return make_response({"error": "Failed to create matatu"}, 500)

api.add_resource(All_matatus, "/matatus")

# Single matatu operations
class Matatu_operations(Resource):
    def put(self, matatu_id):
        try:
            matatu = Matatu.query.get_or_404(matatu_id)
            data = request.get_json()
            
            if data.get("plate_number"):
                valid, error_msg = validate_plate_number(data["plate_number"])
                if not valid:
                    return make_response({"error": error_msg}, 400)
                matatu.plate_number = data["plate_number"].upper()
            
            if data.get("capacity"):
                matatu.capacity = data["capacity"]
            
            db.session.commit()
            logger.info(f"Matatu updated: {matatu.id}")
            return make_response({"msg": "Matatu updated successfully", "matatu": matatu.to_dict()}, 200)
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating matatu {matatu_id}: {e}")
            return make_response({"error": "Failed to update matatu"}, 500)
    
    def delete(self, matatu_id):
        try:
            matatu = Matatu.query.get_or_404(matatu_id)
            db.session.delete(matatu)
            db.session.commit()
            logger.info(f"Matatu deleted: {matatu_id}")
            return make_response({"msg": "Matatu deleted successfully"}, 200)
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error deleting matatu {matatu_id}: {e}")
            return make_response({"error": "Failed to delete matatu"}, 500)

api.add_resource(Matatu_operations, "/matatus/<int:matatu_id>")

# All routes endpoint with pagination
class All_routes(Resource):
    def get(self):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 50, type=int)
            
            routes_query = Route.query.paginate(page=page, per_page=per_page, error_out=False)
            routes = [route.to_dict() for route in routes_query.items]
            
            return make_response(jsonify({
                "routes": routes,
                "total": routes_query.total,
                "pages": routes_query.pages,
                "current_page": page
            }), 200)
        except Exception as e:
            logger.error(f"Error fetching routes: {e}")
            return make_response({"error": "Failed to fetch routes"}, 500)
    
    def post(self):
        try:
            data = request.get_json()
            if not data:
                return make_response({"error": "No data provided"}, 400)
            
            # Validation
            if not data.get("start") or len(data["start"]) > 50:
                return make_response({"error": "Invalid start location"}, 400)
            if not data.get("end") or len(data["end"]) > 50:
                return make_response({"error": "Invalid end location"}, 400)
            
            new_route = Route(
                start=data["start"],
                end=data["end"],
                sacco_id=data["sacco_id"]
            )
            db.session.add(new_route)
            db.session.commit()
            
            logger.info(f"Route created: {new_route.start} -> {new_route.end}")
            return make_response({"msg": "Route created successfully", "route": new_route.to_dict()}, 201)
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating route: {e}")
            return make_response({"error": "Failed to create route"}, 500)

api.add_resource(All_routes, "/routes")

# Single route operations
class Route_operations(Resource):
    def put(self, route_id):
        try:
            route = Route.query.get_or_404(route_id)
            data = request.get_json()
            
            if data.get("start"):
                route.start = data["start"]
            if data.get("end"):
                route.end = data["end"]
            
            db.session.commit()
            logger.info(f"Route updated: {route.id}")
            return make_response({"msg": "Route updated successfully", "route": route.to_dict()}, 200)
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating route {route_id}: {e}")
            return make_response({"error": "Failed to update route"}, 500)
    
    def delete(self, route_id):
        try:
            route = Route.query.get_or_404(route_id)
            db.session.delete(route)
            db.session.commit()
            logger.info(f"Route deleted: {route_id}")
            return make_response({"msg": "Route deleted successfully"}, 200)
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error deleting route {route_id}: {e}")
            return make_response({"error": "Failed to delete route"}, 500)

api.add_resource(Route_operations, "/routes/<int:route_id>")

# All matatu_routes endpoint
class All_Matatu_Routes(Resource):
    def get(self):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 50, type=int)
            
            mr_query = Matatu_route.query.paginate(page=page, per_page=per_page, error_out=False)
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
            } for mr in mr_query.items]
            
            return make_response(jsonify({
                "matatu_routes": routes,
                "total": mr_query.total,
                "pages": mr_query.pages,
                "current_page": page
            }), 200)
        except Exception as e:
            logger.error(f"Error fetching matatu routes: {e}")
            return make_response({"error": "Failed to fetch matatu routes"}, 500)
    
    def post(self):
        try:
            data = request.get_json()
            if not data:
                return make_response({"error": "No data provided"}, 400)
            
            # Validation
            if not data.get("fare") or not isinstance(data["fare"], int) or data["fare"] < 0:
                return make_response({"error": "Invalid fare amount"}, 400)
            
            new_mr = Matatu_route(
                matatu_id=data["matatu_id"],
                route_id=data["route_id"],
                fare=data["fare"]
            )
            db.session.add(new_mr)
            db.session.commit()
            
            logger.info(f"Matatu route created: {new_mr.id}")
            return make_response({"msg": "Matatu route created successfully"}, 201)
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating matatu route: {e}")
            return make_response({"error": "Failed to create matatu route"}, 500)

api.add_resource(All_Matatu_Routes, "/matatu_routes")

# Single matatu_route operations
class Matatu_route_operations(Resource):
    def delete(self, mr_id):
        try:
            mr = Matatu_route.query.get_or_404(mr_id)
            db.session.delete(mr)
            db.session.commit()
            logger.info(f"Matatu route deleted: {mr_id}")
            return make_response({"msg": "Matatu route deleted successfully"}, 200)
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error deleting matatu route {mr_id}: {e}")
            return make_response({"error": "Failed to delete matatu route"}, 500)

api.add_resource(Matatu_route_operations, "/matatu_routes/<int:mr_id>")

# Register endpoint
class Register(Resource):
    def post(self):
        try:
            data = request.get_json()
            if not data:
                return make_response({"error": "No data provided"}, 400)
            
            # Email validation
            try:
                email_info = validate_email(data["email"], check_deliverability=False)
                email = email_info.normalized
            except EmailNotValidError as e:
                return make_response({"error": str(e)}, 400)
            
            # Check if email exists
            if User.query.filter_by(email=email).first():
                return make_response({"error": "Email already exists"}, 400)
            
            # Password validation
            valid, error_msg = validate_password(data["password"])
            if not valid:
                return make_response({"error": error_msg}, 400)
            
            # Name validation
            if not data.get("full_name") or len(data["full_name"]) > 100:
                return make_response({"error": "Invalid full name"}, 400)
            
            user = User(
                full_name=data["full_name"],
                email=email
            )
            user.set_password(data["password"])
            
            db.session.add(user)
            db.session.commit()
            
            access_token = create_access_token(identity=user.id)
            
            logger.info(f"User registered: {user.email}")
            return make_response({
                "msg": "User registered successfully",
                "access_token": access_token,
                "user": user.to_dict()
            }, 201)
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error registering user: {e}")
            return make_response({"error": "Failed to register user"}, 500)

api.add_resource(Register, "/register")

# Login endpoint
class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            if not data:
                return make_response({"error": "No data provided"}, 400)
            
            user = User.query.filter_by(email=data["email"]).first()
            
            if not user or not user.check_password(data["password"]):
                logger.warning(f"Failed login attempt for: {data.get('email')}")
                return make_response({"error": "Invalid email or password"}, 401)
            
            access_token = create_access_token(identity=user.id)
            
            logger.info(f"User logged in: {user.email}")
            return make_response({
                "msg": "Login successful",
                "access_token": access_token,
                "user": user.to_dict()
            }, 200)
        except Exception as e:
            logger.error(f"Error during login: {e}")
            return make_response({"error": "Login failed"}, 500)

api.add_resource(Login, "/login")

# All users endpoint
class All_users(Resource):
    def get(self):
        try:
            users = [user.to_dict() for user in User.query.all()]
            return make_response(jsonify(users), 200)
        except Exception as e:
            logger.error(f"Error fetching users: {e}")
            return make_response({"error": "Failed to fetch users"}, 500)

api.add_resource(All_users, "/users")

# Update user role endpoint
class Update_user_role(Resource):
    def patch(self, user_id):
        try:
            user = User.query.get_or_404(user_id)
            data = request.get_json()
            
            role = data.get("role")
            if role not in ["user", "admin", "super_admin"]:
                return make_response({"error": "Invalid role"}, 400)
            
            user.role = role
            db.session.commit()
            
            logger.info(f"User role updated: {user.email} -> {role}")
            return make_response({"msg": "User role updated", "user": user.to_dict()}, 200)
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating user role {user_id}: {e}")
            return make_response({"error": "Failed to update user role"}, 500)

api.add_resource(Update_user_role, "/users/<int:user_id>")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV") != "production"
    app.run(host="0.0.0.0", port=port, debug=debug)
