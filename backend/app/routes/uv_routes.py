from flask import Blueprint, jsonify, request
import os
import requests
from datetime import datetime
from zoneinfo import ZoneInfo

uv_bp = Blueprint("uv", __name__)

MELBOURNE_LAT = -37.8136
MELBOURNE_LON = 144.9631
DEFAULT_TZ = "Australia/Melbourne"
MELBOURNE_TZ = ZoneInfo(DEFAULT_TZ)


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


def get_location_timezone(timezone_name):
    try:
        return ZoneInfo(timezone_name)
    except Exception:
        return MELBOURNE_TZ


@uv_bp.route("/", methods=["GET"])
def get_uv_forecast():
    api_key = os.getenv("OPENWEATHER_API_KEY")
    onecall_api_key = os.getenv("OPENWEATHER_ONECALL_API_KEY")

    if not api_key:
        return jsonify({"error": "Missing OPENWEATHER_API_KEY in backend/.env"}), 500

    if not onecall_api_key:
        return jsonify({"error": "Missing OPENWEATHER_ONECALL_API_KEY in backend/.env"}), 500

    lat = request.args.get("lat", str(MELBOURNE_LAT))
    lon = request.args.get("lon", str(MELBOURNE_LON))

    try:
        # -----------------------------
        # Current UV from OpenWeather 3.0
        # -----------------------------
        onecall_url = (
            f"https://api.openweathermap.org/data/3.0/onecall"
            f"?lat={lat}&lon={lon}"
            f"&exclude=minutely,hourly,daily,alerts"
            f"&units=metric"
            f"&appid={onecall_api_key}"
        )

        onecall_resp = requests.get(onecall_url, timeout=15)
        onecall_resp.raise_for_status()
        onecall_data = onecall_resp.json()

        timezone_name = onecall_data.get("timezone", DEFAULT_TZ)
        location_tz = get_location_timezone(timezone_name)

        current_data = onecall_data.get("current", {})
        now_ts = current_data.get("dt", int(datetime.now().timestamp()))
        sunrise_ts = current_data.get("sunrise")
        sunset_ts = current_data.get("sunset")

        is_daytime = True
        if sunrise_ts and sunset_ts:
            is_daytime = sunrise_ts <= now_ts <= sunset_ts

        raw_uv = current_data.get("uvi", 0)
        current_uv = 0 if not is_daytime else round(raw_uv, 1)

        # -----------------------------
        # Current weather from old 2.5
        # -----------------------------
        weather_url = (
            f"https://api.openweathermap.org/data/2.5/weather"
            f"?lat={lat}&lon={lon}&units=metric&appid={api_key}"
        )
        weather_resp = requests.get(weather_url, timeout=15)
        weather_resp.raise_for_status()
        weather_data = weather_resp.json()

        current_temp = weather_data["main"]["temp"]
        current_weather = weather_data["weather"][0]["description"]

        # -----------------------------
        # Forecast from old 2.5
        # -----------------------------
        forecast_url = (
            f"https://api.openweathermap.org/data/2.5/forecast"
            f"?lat={lat}&lon={lon}&units=metric&cnt=8&appid={api_key}"
        )
        forecast_resp = requests.get(forecast_url, timeout=15)
        forecast_resp.raise_for_status()
        forecast_data = forecast_resp.json()
        forecast_list = forecast_data.get("list", [])

        current_time_iso = datetime.fromtimestamp(now_ts, location_tz).isoformat()

        current_details = uv_details(current_uv)

        current = {
            "time": current_time_iso,
            "uv": current_uv,
            "uv_raw": raw_uv,
            "uv_estimated": not is_daytime,
            "is_daytime": is_daytime,
            "level": current_details["level"],
            "color": current_details["color"],
            "warning_sign": current_details["warning_sign"],
            "warning_message": current_details["warning_message"],
            "clothing": current_details["recommended_clothing"],
            "weather": current_weather,
            "temp": current_temp,
        }

        if not is_daytime:
            current["uv_note"] = "Nighttime — no UV risk"

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
            "timezone": timezone_name,
            "current": current,
            "forecast": forecast,
        })

    except requests.RequestException as e:
        return jsonify({"error": "External API request failed", "details": str(e)}), 502
    except Exception as e:
        return jsonify({"error": "Server error", "details": str(e)}), 500