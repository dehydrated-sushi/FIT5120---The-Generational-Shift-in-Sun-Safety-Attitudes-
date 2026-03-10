# CLAUDE.md

## Project
Sun safety web app for young Australians aged 15-25 in Victoria.
Countering the TikTok tanning trend with real-time UV data and education.

## Tech Stack
- Frontend: React (Vite) → Vercel
- Backend: Flask (Python) → Render
- Database: PostgreSQL (Neon.tech)
- UV API: OpenWeatherMap
- Charts: Recharts
- Auth: JWT

## Must Have Features
1. US1.1 — Real-time UV alerts by location
2. US2.1 — Skin cancer data visualisations
3. US3.3 — Clothing recommendations by UV index

## Key Docs
- Tech stack details → docs/tech-stack-decision.md
- Data sources → docs/data-sources.md
- Database schema → docs/database-schema.md (in progress)
- API endpoints → docs/api-endpoints.md (in progress)
- UI guidelines → docs/ui-guidelines.md (in progress)

## Folder Rules
- API calls → frontend/src/services/ only
- Business logic → frontend/src/hooks/
- Global state → frontend/src/context/
- Constants → frontend/src/constants/
- Flask routes → backend/app/routes/
- Business logic → backend/app/services/

## Standards
- JSDoc on every JS function
- Docstrings on every Python function
- No hardcoded values — use constants/
- No API keys in code — use .env

## Git
- main → production
- develop → working branch
- feature/xxx → one per feature
- Always branch from develop

## Team
| Name | Role |
|---|---|
| Saubhagya Das | Project Lead & Full Stack |
| Xueer Yao | Full Stack Developer |
| Shimin Cai | Business Analyst & UI |
| Zedongwang | Data Engineer & Backend |
| Arshdeep Sokhal | Data Analyst & Backend |