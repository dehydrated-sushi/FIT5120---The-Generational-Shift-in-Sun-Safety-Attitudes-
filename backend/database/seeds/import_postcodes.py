"""
Import Australian postcodes from the raw SQL dump into the
PostgreSQL locations table.

Usage:
    cd backend
    python -m database.seeds.import_postcodes
"""

import os
import re
import sys
from pathlib import Path

import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# Resolve paths relative to the project root
SCRIPT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = SCRIPT_DIR.parent.parent
PROJECT_ROOT = BACKEND_DIR.parent
SQL_FILE = PROJECT_ROOT / "data" / "raw" / "australian-postcodes.sql"

load_dotenv(BACKEND_DIR / ".env")


def parse_inserts(sql_text):
    """Extract (postcode, suburb, state, lat, lon) tuples from INSERT statements."""
    rows = []
    pattern = re.compile(
        r"\('([^']*)',\s*'([^']*)',\s*'([^']*)',\s*([-\d.]+),\s*([-\d.]+)\)"
    )
    for match in pattern.finditer(sql_text):
        postcode, suburb, state, lat, lon = match.groups()
        rows.append((postcode, suburb, state, float(lat), float(lon)))
    return rows


def main():
    if not SQL_FILE.exists():
        print(f"ERROR: SQL file not found at {SQL_FILE}")
        sys.exit(1)

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL not set in backend/.env")
        sys.exit(1)

    print(f"Reading {SQL_FILE} ...")
    sql_text = SQL_FILE.read_text(encoding="utf-8")
    rows = parse_inserts(sql_text)
    print(f"Parsed {len(rows)} rows from SQL file.")

    if not rows:
        print("No rows found — nothing to insert.")
        sys.exit(1)

    conn = psycopg2.connect(database_url)
    cur = conn.cursor()

    try:
        cur.execute("DELETE FROM locations")
        execute_values(
            cur,
            "INSERT INTO locations (postcode, suburb, state, lat, lon) "
            "VALUES %s",
            rows,
            page_size=1000,
        )
        conn.commit()
        cur.execute("SELECT COUNT(*) FROM locations")
        count = cur.fetchone()[0]
        print(f"Done — {count} rows inserted into locations table.")
    except Exception as e:
        conn.rollback()
        print(f"ERROR: {e}")
        sys.exit(1)
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    main()
