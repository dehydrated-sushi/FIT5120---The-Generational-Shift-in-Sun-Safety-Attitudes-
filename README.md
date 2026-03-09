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

FIT5120-Sun-Safety/
├── frontend/          ← React app
│   ├── src/
│   │   ├── components/   ← reusable UI pieces
│   │   ├── pages/        ← each screen/page
│   │   ├── services/     ← API call functions
│   │   └── assets/       ← images, icons
│   ├── public/
│   └── package.json
│
├── backend/           ← Flask app
│   ├── app/
│   │   ├── routes/       ← API endpoints
│   │   ├── models/       ← database models
│   │   ├── services/     ← business logic
│   │   └── data/         ← AIHW CSV files
│   ├── tests/            ← unit tests
│   ├── requirements.txt  ← Python dependencies
│   └── run.py            ← entry point
│
├── .gitignore
├── README.md
└── docker-compose.yml

---

## Academic Project
This project was developed as part of FIT5120 
Industry Experience Studio at Monash University, 2026. 
Not licensed for commercial use.
---
```
