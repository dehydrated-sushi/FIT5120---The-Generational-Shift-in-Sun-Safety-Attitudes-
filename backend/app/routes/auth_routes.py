"""Authentication routes"""
from flask import Blueprint

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/")
def auth():
    """Auth - placeholder"""
    return {"message": "Auth route working"}