from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
import os

load_dotenv()

limiter = Limiter(key_func=get_remote_address)
jwt = JWTManager()


def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-jwt-key")
    app.config["DATABASE_URL"] = os.getenv("DATABASE_URL")
    app.config["OPENWEATHER_API_KEY"] = os.getenv("OPENWEATHER_API_KEY")
    app.config["TEAM_USERNAME"] = os.getenv("TEAM_USERNAME", "")
    app.config["TEAM_PASSWORD"] = os.getenv("TEAM_PASSWORD", "")

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5173",
                    frontend_url,
                ]
            }
        }
    )

    jwt.init_app(app)
    limiter.init_app(app)

    from app.routes.uv_routes import uv_bp
    from app.routes.cancer_routes import cancer_bp
    from app.routes.clothing_routes import clothing_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.location_routes import location_bp

    app.register_blueprint(uv_bp, url_prefix="/api/uv")
    app.register_blueprint(cancer_bp, url_prefix="/api/cancer")
    app.register_blueprint(clothing_bp, url_prefix="/api/clothing")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(location_bp, url_prefix="/api/locations")

    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "Sun Safety API is running"}

    return app
