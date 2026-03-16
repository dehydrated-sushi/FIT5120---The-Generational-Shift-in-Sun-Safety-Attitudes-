from flask import Blueprint, jsonify, request
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

    lat = request.args.get("lat", str(MELBOURNE_LAT))
    lon = request.args.get("lon", str(MELBOURNE_LON))

    try:
        # Current UV (OpenWeather UVI endpoint) -- UVI is treated as "current now"
        uvi_url = f"https://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={api_key}"
        uvi_resp = requests.get(uvi_url, timeout=15)
        uvi_resp.raise_for_status()
        uvi_data = uvi_resp.json()
        current_uv = round(uvi_data.get("value", 0))

        # Forecast data (weather) -- we will use this for temp + condition + forecast slots
        forecast_url = (
            f"https://api.openweathermap.org/data/2.5/forecast"
            f"?lat={lat}&lon={lon}&units=metric&cnt=8&appid={api_key}"
        )
        forecast_resp = requests.get(forecast_url, timeout=15)
        forecast_resp.raise_for_status()
        forecast_data = forecast_resp.json()
        forecast_list = forecast_data.get("list", [])

        # Build the response
        now_melbourne = datetime.now(MELBOURNE_TZ)
        current_time_iso = now_melbourne.isoformat()

        current_temp = None
        current_weather = None
        if forecast_list:
            first = forecast_list[0]
            current_temp = first.get("main", {}).get("temp")
            current_weather = first.get("weather", [{}])[0].get("description")

        current_details = uv_details(current_uv)

        current = {
            "time": current_time_iso,
            "uv": current_uv,
            "uv_estimated": False,
            "level": current_details["level"],
            "color": current_details["color"],
            "warning_sign": current_details["warning_sign"],
            "warning_message": current_details["warning_message"],
            "clothing": current_details["recommended_clothing"],
            "weather": current_weather,
            "temp": current_temp,
        }

        forecast = [
            {
                "time": datetime.fromtimestamp(f["dt"], MELBOURNE_TZ).strftime("%I:%M %p"),
                "temp": f.get("main", {}).get("temp"),
                "weather": f.get("weather", [{}])[0].get("description"),
            }
            for f in forecast_list
        ]

        return jsonify({
            "city": forecast_data.get("city", {}).get("name", "Melbourne"),
            "timezone": "Australia/Melbourne",
            "current": current,
            "forecast": forecast,
        })
    except requests.RequestException as e:
        return jsonify({"error": "External API request failed", "details": str(e)}), 502
    except Exception as e:
        return jsonify({"error": "Server error", "details": str(e)}), 500
