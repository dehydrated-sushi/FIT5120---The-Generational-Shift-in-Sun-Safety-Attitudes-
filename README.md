# The Generational Shift in Sun-Safety Attitudes
### FIT5120 — Onboarding Iteration

A web application helping young Australians aged 15–25 
understand UV risks and adopt sun-safe behaviours.

---

##  Documentation
| Document | Link |
|---|---|
| Analysis & Design Report | [View](#) |
| Tech Stack Decision | [View](#) |
| Data Sources | [View](#) |
| Leankit Board | [View](#) |
| Project Governance | [View](#) |

---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Flask (Python) |
| Database | PostgreSQL |
| UV API | OpenWeatherMap |
| Charts | Recharts |
| Hosting | Vercel + Render |

---

## Features (Onboarding Iteration)
- Real-time UV level alerts by location
- Skin cancer data visualisations
- Clothing recommendations by UV index

---

##  Team
| Name | Role |
|---|---|
| Xueer Yao | Business Analyst & UI Developer |
| Saubhagya Das | Data Analyst & Front end Developer |
| Shimin Cai | Project Manager & UI Developer |
| Zedongwang | Data Engineer |
| Arshdeep Sokhal | Data Analyst & Backend Developer  |

---

## Getting Started
(Setup instructions will be added when build begins)

---

##  Project Structure

```
FIT5120-Sun-Safety/
├── frontend/                    ← React app
│   ├── src/
│   │   ├── components/          ← reusable UI pieces
│   │   │   ├── UVAlert/
│   │   │   ├── Charts/
│   │   │   └── ClothingCard/
│   │   ├── pages/               ← each screen
│   │   │   ├── Home/
│   │   │   ├── UVTracker/
│   │   │   ├── Awareness/
│   │   │   └── Prevention/
│   │   ├── services/            ← API call functions
│   │   │   ├── uvService.js
│   │   │   └── dataService.js
│   │   ├── hooks/               ← custom React hooks
│   │   ├── context/             ← global state
│   │   ├── utils/               ← helper functions
│   │   ├── assets/              ← images, icons
│   │   └── styles/              ← global CSS
│   ├── public/
│   ├── .env.example             ← environment variables template
│   └── package.json
│
├── backend/                     ← Flask app
│   ├── app/
│   │   ├── routes/              ← API endpoints
│   │   │   ├── uv_routes.py
│   │   │   ├── cancer_routes.py
│   │   │   └── clothing_routes.py
│   │   ├── models/              ← database models
│   │   │   ├── uv_reading.py
│   │   │   └── cancer_data.py
│   │   ├── services/            ← business logic
│   │   │   ├── uv_service.py
│   │   │   └── clothing_service.py
│   │   ├── data/                ← AIHW CSV files
│   │   └── __init__.py
│   ├── database/
│   │   ├── migrations/          ← database version control
│   │   ├── seeds/               ← initial data scripts
│   │   │   └── import_aihw.py   ← imports CSV to PostgreSQL
│   │   └── schema.sql           ← table definitions
│   ├── tests/
│   │   ├── test_uv_routes.py
│   │   ├── test_cancer_routes.py
│   │   └── test_clothing_routes.py
│   ├── config.py                ← app configuration
│   ├── requirements.txt         ← Python dependencies
│   └── run.py                   ← entry point
│
├── docs/                        ← project documentation
│   ├── analysis-design-report.pdf
│   ├── tech-stack-decision.md
│   ├── data-sources.md
│   └── diagrams/
│       └── tech-stack-diagram.png
│
├── .github/
│   └── workflows/               ← CI/CD automation
│       └── deploy.yml
│
├── .gitignore
├── .env.example                 ← environment variables template
├── README.md
└── docker-compose.yml
```

---

## Academic Project
This project was developed as part of FIT5120 
Industry Experience Studio at Monash University, 2026. 
Not licensed for commercial use.
---
```
