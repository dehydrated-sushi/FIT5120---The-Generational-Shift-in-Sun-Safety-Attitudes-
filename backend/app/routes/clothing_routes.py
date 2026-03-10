"""Clothing recommendation routes"""
from flask import Blueprint

clothing_bp = Blueprint("clothing", __name__)


@clothing_bp.route("/")
def get_clothing():
    """Get clothing recommendations - placeholder"""
    return {"message": "Clothing route working"}