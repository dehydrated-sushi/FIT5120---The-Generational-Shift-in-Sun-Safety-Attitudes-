from flask import Blueprint, jsonify, request, current_app
import psycopg2
import re

location_bp = Blueprint("locations", __name__)


@location_bp.route("/", methods=["GET"])
def get_locations_by_postcode():
    """Return all matching suburbs for a given Australian postcode.

    Query params:
        postcode (str): A 4-digit Australian postcode (required).

    Returns:
        JSON with postcode and a matches array of suburb/state/lat/lon objects.
        Returns 400 if postcode is missing or not exactly 4 digits.
    """
    postcode = request.args.get("postcode", "").strip()

    if not postcode or not re.fullmatch(r"\d{4}", postcode):
        return jsonify({"error": "postcode is required and must be exactly 4 digits"}), 400

    database_url = current_app.config["DATABASE_URL"]
    if not database_url:
        return jsonify({"error": "DATABASE_URL not configured"}), 500

    conn = psycopg2.connect(database_url)
    cur = conn.cursor()

    try:
        cur.execute(
            "SELECT suburb, state, lat, lon FROM locations WHERE postcode = %s ORDER BY suburb",
            (postcode,),
        )
        rows = cur.fetchall()
    finally:
        cur.close()
        conn.close()

    matches = [
        {"suburb": r[0], "state": r[1], "lat": float(r[2]), "lon": float(r[3])}
        for r in rows
    ]

    return jsonify({"postcode": postcode, "matches": matches})
