"""
Run the Flask development server
"""

import os

from app import create_app

app = create_app()

if __name__ == "__main__":
    # Avoid conflicts with macOS AirPlay Receiver or other software that binds port 5000.
    port = int(os.getenv("PORT", "5002"))
    app.run(debug=True, port=port)