"""
FIT5120 Sun Safety App
Flask application factory
"""

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
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Config
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-jwt-key")
    app.config["DATABASE_URL"] = os.getenv("DATABASE_URL")

    # Extensions
    #CORS(app, origins=os.getenv("FRONTEND_URL", "http://localhost:5173"))
    CORS(
    app,
    resources={r"/api/*": {"origins": [
        "http://localhost:5173",
        "https://fit5120-the-generational-shift-in-sun-fti-projects-7b0d342c.vercel.app"
    ]}}
)
    jwt.init_app(app)
    limiter.init_app(app)

    # Register blueprints
    from app.routes.uv_routes import uv_bp
    from app.routes.cancer_routes import cancer_bp
    from app.routes.clothing_routes import clothing_bp
    from app.routes.auth_routes import auth_bp

    app.register_blueprint(uv_bp, url_prefix="/api/uv")
    app.register_blueprint(cancer_bp, url_prefix="/api/cancer")
    app.register_blueprint(clothing_bp, url_prefix="/api/clothing")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    @app.route("/api/health")
    def health():
        """Health check endpoint."""
        return {"status": "ok", "message": "Sun Safety API is running"}

    return app
