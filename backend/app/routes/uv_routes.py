from flask import Blueprint, jsonify
import os
import requests
from datetime import datetime
from zoneinfo import ZoneInfo

uv_bp = Blueprint("uv", __name__)

MELBOURNE_LAT = -37.8136
MELBOURNE_LON = 144.9631
MELBOURNE_TZ = ZoneInfo("Australia/Melbourne")


def uv_details(uv):
    if uv <= 2:
        return {
            "level": "Low",
            "color": "green",
            "warning_sign": "☀️",
            "warning_message": "Minimal danger from sun exposure",
            "recommended_clothing": [
                "T-shirt",
                "Shorts",
                "Cap optional",
                "Sunglasses optional"
            ]
        }
    elif uv <= 5:
        return {
            "level": "Moderate",
            "color": "yellow",
            "warning_sign": "🧴",
            "warning_message": "Protection needed if outside for long",
            "recommended_clothing": [
                "T-shirt",
                "Hat or cap",
                "Sunglasses",
                "Breathable clothes",
                "Sunscreen"
            ]
        }
    elif uv <= 7:
        return {
            "level": "High",
            "color": "orange",
            "warning_sign": "⚠️",
            "warning_message": "Skin can burn without protection",
            "recommended_clothing": [
                "Long-sleeve shirt",
                "Wide-brim hat",
                "UV sunglasses",
                "Covered shoulders",
                "SPF50+ sunscreen"
            ]
        }
    elif uv <= 10:
        return {
            "level": "Very High",
            "color": "red",
            "warning_sign": "🧢",
            "warning_message": "Very high danger. Skin damage can happen quickly",
            "recommended_clothing": [
                "Long sleeves",
                "Collared shirt",
                "Wide-brim hat",
                "Sunglasses",
                "More skin coverage",
                "SPF50+ sunscreen"
            ]
        }
    else:
        return {
            "level": "Extreme",
            "color": "purple",
            "warning_sign": "🚫",
            "warning_message": "Extreme UV. Avoid direct sun if possible",
            "recommended_clothing": [
                "Full-coverage clothing",
                "Long sleeves",
                "Long pants",
                "Wide-brim hat",
                "UV sunglasses",
                "SPF50+ sunscreen",
                "Stay in shade"
            ]
        }


@uv_bp.route("/", methods=["GET"])

def get_uv_forecast():
    api_key = os.getenv("OPENWEATHER_API_KEY")

    if not api_key:
        return jsonify({"error": "Missing OPENWEATHER_API_KEY in backend/.env"}), 500

    url = "https://api.openweathermap.org/data/3.0/onecall"
    params = {
        "lat": MELBOURNE_LAT,
        "lon": MELBOURNE_LON,
        "appid": api_key,
        "units": "metric",
        "exclude": "current,minutely,daily,alerts"
    }

    try:
        response = requests.get(url, params=params, timeout=15)
        data = response.json()

        if response.status_code != 200:
            return jsonify({
                "error": "OpenWeather request failed",
                "status_code": response.status_code,
                "openweather_response": data
            }), 500

        hourly_data = []

        for h in data.get("hourly", [])[:10]:
            uv = h.get("uvi", 0)
            details = uv_details(uv)
            timestamp = datetime.fromtimestamp(h["dt"], MELBOURNE_TZ)

            hourly_data.append({
                "time": timestamp.strftime("%I:%M %p"),
                "temp": h.get("temp"),
                "uv": uv,
                "level": details["level"],
                "color": details["color"],
                "warning_sign": details["warning_sign"],
                "warning_message": details["warning_message"],
                "clothing": details["recommended_clothing"],
                "weather": h.get("weather", [{}])[0].get("description")
            })

        return jsonify({
            "city": "Melbourne",
            "timezone": "Australia/Melbourne",
            "uv_forecast": hourly_data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500