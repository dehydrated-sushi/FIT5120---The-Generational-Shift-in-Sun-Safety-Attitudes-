"""
Clothing recommendation routes.

Provides endpoints for retrieving clothing recommendations
based on UV index from the clothing_rules table.
"""

from flask import Blueprint, request, jsonify, current_app
import psycopg2
import psycopg2.extras

clothing_bp = Blueprint("clothing", __name__)


def _get_db_connection():
    """Create a database connection using DATABASE_URL from app config.

    Returns:
        psycopg2.connection: A PostgreSQL database connection.
    """
    return psycopg2.connect(current_app.config["DATABASE_URL"])


@clothing_bp.route("/")
def get_clothing():
    """Get clothing recommendations for a given UV index.

    Queries the clothing_rules table for rows where the provided
    uv_index falls within the [uv_min, uv_max] range.

    Query Parameters:
        uv_index (float): The current UV index value. Required.

    Returns:
        JSON response with a list of clothing recommendation objects,
        each containing id, uv_min, uv_max, item_name, material,
        coverage_level, and description.

    Status Codes:
        200: Recommendations returned successfully.
        400: Missing or invalid uv_index parameter.
        500: Database error.
    """
    uv_index_param = request.args.get("uv_index")

    if uv_index_param is None:
        return jsonify({"error": "uv_index query parameter is required"}), 400

    try:
        uv_index = float(uv_index_param)
    except (ValueError, TypeError):
        return jsonify({"error": "uv_index must be a valid number"}), 400

    try:
        conn = _get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cur.execute(
            """
            SELECT id, uv_min, uv_max, item_name, material,
                   coverage_level, description
            FROM clothing_rules
            WHERE uv_min <= %s AND uv_max >= %s
            ORDER BY item_name
            """,
            (uv_index, uv_index),
        )

        rows = cur.fetchall()
        cur.close()
        conn.close()

        return jsonify({"uv_index": uv_index, "recommendations": rows}), 200

    except psycopg2.Error as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500
