"""Authentication routes for team login."""

from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate a team member with shared credentials.

    Expects JSON body:
        {"username": "...", "password": "..."}

    Returns:
        200 with {"token": "<jwt>"} on success.
        400 if username or password is missing.
        401 if credentials are invalid.
    """
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    team_username = current_app.config["TEAM_USERNAME"]
    team_password = current_app.config["TEAM_PASSWORD"]

    if username != team_username or password != team_password:
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=username)
    return jsonify({"token": token})
