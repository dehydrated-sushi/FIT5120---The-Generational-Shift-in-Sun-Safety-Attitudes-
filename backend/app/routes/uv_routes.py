"""UV index routes"""
from flask import Blueprint

uv_bp = Blueprint("uv", __name__)


@uv_bp.route("/")
def get_uv():
    """Get UV index - placeholder"""
    return {"message": "UV route working"}