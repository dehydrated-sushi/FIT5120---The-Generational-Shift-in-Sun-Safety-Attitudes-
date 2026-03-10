-- FIT5120 Sun Safety App
-- Database Schema
-- Generated from AIHW 2025 data exploration

CREATE TABLE cancer_incidence (
    id SERIAL PRIMARY KEY,
    data_type VARCHAR(20),
    cancer_site VARCHAR(100),
    year INT,
    sex VARCHAR(10),
    age_group VARCHAR(10),
    count INT,
    age_specific_rate DECIMAL(8,2),
    asr_2001 DECIMAL(8,2),
    icd10_code VARCHAR(10)
);

CREATE TABLE cancer_mortality (
    id SERIAL PRIMARY KEY,
    data_type VARCHAR(20),
    cancer_site VARCHAR(100),
    year INT,
    sex VARCHAR(10),
    age_group VARCHAR(10),
    count INT,
    age_specific_rate DECIMAL(8,2),
    asr_2001 DECIMAL(8,2),
    icd10_code VARCHAR(10)
);

CREATE TABLE cancer_by_state (
    id SERIAL PRIMARY KEY,
    data_type VARCHAR(20),
    cancer_site VARCHAR(100),
    year INT,
    sex VARCHAR(10),
    state VARCHAR(50),
    count INT,
    crude_rate DECIMAL(8,2),
    asr_2001 DECIMAL(8,2),
    icd10_code VARCHAR(10)
);

CREATE TABLE uv_historical (
    id SERIAL PRIMARY KEY,
    datetime TIMESTAMP,
    lat DECIMAL(9,6),
    lon DECIMAL(9,6),
    uv_index DECIMAL(5,2)
);

CREATE TABLE uv_realtime_cache (
    id SERIAL PRIMARY KEY,
    lat DECIMAL(9,6),
    lon DECIMAL(9,6),
    location_name VARCHAR(100),
    uv_index DECIMAL(5,2),
    recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE clothing_rules (
    id SERIAL PRIMARY KEY,
    uv_min INT,
    uv_max INT,
    item_name VARCHAR(100),
    material VARCHAR(100),
    coverage_level VARCHAR(50),
    description TEXT
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    postcode VARCHAR(10),
    suburb VARCHAR(100),
    state VARCHAR(50),
    lat DECIMAL(9,6),
    lon DECIMAL(9,6)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_cancer_incidence_site ON cancer_incidence(cancer_site);
CREATE INDEX idx_cancer_incidence_year ON cancer_incidence(year);
CREATE INDEX idx_cancer_mortality_site ON cancer_mortality(cancer_site);
CREATE INDEX idx_cancer_by_state_state ON cancer_by_state(state);
CREATE INDEX idx_uv_historical_datetime ON uv_historical(datetime);
CREATE INDEX idx_uv_cache_location ON uv_realtime_cache(lat, lon);
CREATE INDEX idx_locations_postcode ON locations(postcode);