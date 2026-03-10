"""Cancer data routes"""
from flask import Blueprint

cancer_bp = Blueprint("cancer", __name__)


@cancer_bp.route("/")
def get_cancer():
    """Get cancer data - placeholder"""
    return {"message": "Cancer route working"}