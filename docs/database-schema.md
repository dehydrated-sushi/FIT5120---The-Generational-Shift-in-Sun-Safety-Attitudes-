# Database Schema

## Tables

### cancer_incidence
Source: AIHW Book 1a
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| data_type | VARCHAR(20) | 'Actual' or 'Projected' |
| cancer_site | VARCHAR(100) | e.g. 'Melanoma of the skin' |
| year | INT | 1982–2025 |
| sex | VARCHAR(10) | 'Males', 'Females', 'Persons' |
| age_group | VARCHAR(10) | e.g. '00-04', '15-19' |
| count | INT | number of cases |
| age_specific_rate | DECIMAL(8,2) | per 100,000 |
| asr_2001 | DECIMAL(8,2) | age-standardised rate |
| icd10_code | VARCHAR(10) | e.g. 'C43' |

### cancer_mortality
Source: AIHW Book 2a
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| data_type | VARCHAR(20) | 'Actual' or 'Projected' |
| cancer_site | VARCHAR(100) | |
| year | INT | 1971–2025 |
| sex | VARCHAR(10) | |
| age_group | VARCHAR(10) | |
| count | INT | |
| age_specific_rate | DECIMAL(8,2) | |
| asr_2001 | DECIMAL(8,2) | |
| icd10_code | VARCHAR(10) | |

### cancer_by_state
Source: AIHW Book 7
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| data_type | VARCHAR(20) | 'Incidence' or 'Mortality' |
| cancer_site | VARCHAR(100) | |
| year | INT | 1982–2022 |
| sex | VARCHAR(10) | |
| state | VARCHAR(50) | e.g. 'Victoria' |
| count | INT | |
| crude_rate | DECIMAL(8,2) | |
| asr_2001 | DECIMAL(8,2) | |
| icd10_code | VARCHAR(10) | |

### uv_historical
Source: ARPANSA Melbourne CSV 2020–2024
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| datetime | TIMESTAMP | 1-minute resolution |
| lat | DECIMAL(9,6) | -37.73 (Melbourne) |
| lon | DECIMAL(9,6) | 145.10 (Melbourne) |
| uv_index | DECIMAL(5,2) | |

### uv_realtime_cache
Source: OpenWeatherMap API
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| lat | DECIMAL(9,6) | |
| lon | DECIMAL(9,6) | |
| location_name | VARCHAR(100) | |
| uv_index | DECIMAL(5,2) | |
| recorded_at | TIMESTAMP | |

### clothing_rules
Source: Manually seeded
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| uv_min | INT | UV range start |
| uv_max | INT | UV range end |
| item_name | VARCHAR(100) | e.g. 'Wide brim hat' |
| material | VARCHAR(100) | e.g. 'UPF 50+ fabric' |
| coverage_level | VARCHAR(50) | e.g. 'Full', 'Partial' |
| description | TEXT | |

### locations
Source: australian-postcodes.sql
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| postcode | VARCHAR(10) | |
| suburb | VARCHAR(100) | |
| state | VARCHAR(50) | |
| lat | DECIMAL(9,6) | |
| lon | DECIMAL(9,6) | |

### users
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| email | VARCHAR(255) UNIQUE | |
| password_hash | VARCHAR(255) | bcrypt hashed |
| created_at | TIMESTAMP | DEFAULT NOW() |