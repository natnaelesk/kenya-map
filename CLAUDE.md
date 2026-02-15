# CLAUDE.md

## Repository: county — Wajir County Transparency Platform

A full-stack web application for tracking public funds usage in Wajir County, Kenya. Enables citizens to monitor government spending shilling by shilling, compare elected officials across election cycles, review expenditures, and visualize projects on interactive maps.

## Project Overview

**Stack:**
- **Backend:** Python 3.11 + Django 5.2 + Django REST Framework
- **Frontend:** React 19 + Vite + Recharts + Leaflet
- **Database:** SQLite (dev) / PostgreSQL on Supabase (production)

**Key Features:**
- Fund tracking by ward, sector, year, and fund source (County, NG-CDF, KURA, KeRRA)
- Governor comparison across 3 election cycles (2013-2017, 2017-2022, 2022-Present)
- MP performance comparison with deep-dive profiles (weddings attended, constituency visits)
- Mega dam project tracking
- Citizen reviews on expenditures over KES 1M
- Leaflet map visualization of ward spending and project locations

## Development Setup

### Prerequisites

- Python 3.11+
- Node.js 22+
- Git

### Getting Started

```bash
# Clone and enter
git clone <repo-url>
cd county

# Backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data          # Populate with Wajir County data
python manage.py runserver           # http://localhost:8000

# Frontend (in a separate terminal)
cd frontend
npm install
npm run dev                          # http://localhost:5173
```

### Environment Variables (Production)

```bash
# Backend (.env)
DJANGO_SECRET_KEY=<your-secret>
DJANGO_DEBUG=False
DB_ENGINE=django.db.backends.postgresql
DB_NAME=<supabase-db>
DB_USER=<supabase-user>
DB_PASSWORD=<supabase-password>
DB_HOST=<supabase-host>
DB_PORT=5432

# Frontend (.env)
VITE_API_URL=https://your-api-domain.com/api
```

## Project Structure

```
county/
├── CLAUDE.md               # This file
├── .gitignore
├── requirements.txt         # Python dependencies
├── manage.py                # Django management
├── backend/                 # Django project config
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── core/                    # Core app: wards, sectors, election cycles
│   ├── models.py            # ElectionCycle, SubCounty, Ward, Sector
│   ├── serializers.py
│   ├── views.py             # dashboard_summary endpoint
│   ├── urls.py
│   └── management/commands/seed_data.py
├── funds/                   # Fund tracking app
│   ├── models.py            # FundSource, Budget, Project, Expenditure, MegaDamProject
│   ├── serializers.py
│   ├── views.py             # ward_spending, yearly_spending, fund_source_summary
│   └── urls.py
├── officials/               # Governors and MPs app
│   ├── models.py            # Governor, MemberOfParliament, MPActivity, GovernorPerformanceMetric
│   ├── serializers.py
│   ├── views.py             # governor_comparison, mp_comparison, mp_deep_dive
│   └── urls.py
├── citizens/                # Citizen engagement app
│   ├── models.py            # CitizenReview, ImpactReport
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
└── frontend/                # React + Vite frontend
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── api/client.js    # Axios API client
        ├── components/      # Navbar, Footer, KESFormat, StatusBadge
        └── pages/           # Dashboard, Funds, Projects, Governors, MPs,
                             # MegaDams, MapView, Reviews, ProjectDetail, MPDetail
```

## Build & Test Commands

```bash
# Backend
python manage.py runserver              # Dev server on :8000
python manage.py migrate                # Apply migrations
python manage.py makemigrations         # Generate new migrations
python manage.py seed_data              # Seed Wajir County data
python manage.py createsuperuser        # Admin access at /admin/

# Frontend
cd frontend
npm run dev                             # Vite dev server on :5173
npm run build                           # Production build to dist/
npm run preview                         # Preview production build
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/dashboard/` | GET | High-level stats |
| `/api/election-cycles/` | GET | Election cycles list |
| `/api/sub-counties/` | GET | Constituencies |
| `/api/wards/` | GET | Wards (filterable by sub_county) |
| `/api/sectors/` | GET | Spending sectors |
| `/api/funds/budgets/` | GET | Budget records (filterable) |
| `/api/funds/projects/` | GET | Projects (filterable by ward, sector, status, cycle) |
| `/api/funds/expenditures/` | GET | Expenditures (flagged >1M auto) |
| `/api/funds/mega-dams/` | GET | Mega dam projects |
| `/api/funds/ward-spending/` | GET | Ward-level spending summary |
| `/api/funds/yearly-spending/` | GET | Year-by-year trends |
| `/api/funds/fund-source-summary/` | GET | NGCDF, KURA, KeRRA breakdown |
| `/api/officials/governors/` | GET | Governors |
| `/api/officials/governor-comparison/` | GET | Governor comparison with metrics |
| `/api/officials/mps/` | GET | MPs (filterable) |
| `/api/officials/mp-comparison/` | GET | MP comparison grouped by constituency |
| `/api/officials/mp-deep-dive/<id>/` | GET | MP deep dive with activity breakdown |
| `/api/citizens/reviews/` | GET/POST | Citizen reviews |
| `/api/citizens/impact-reports/` | GET/POST | Project impact reports |

## Code Conventions

- **Python:** Follow PEP 8; use Django conventions for models/views/serializers
- **JavaScript/React:** Functional components with hooks; named exports for pages
- **Models:** Each Django app owns its domain models; cross-app imports use absolute paths
- **Serializers:** Include computed/annotated fields (e.g., `absorption_rate`, `weddings_attended`)
- **Currency:** All monetary values in KES (Kenya Shillings), stored as `DecimalField(max_digits=15, decimal_places=2)`
- **Naming:** snake_case for Python, camelCase for JS variables, PascalCase for React components

## Key Architectural Decisions

1. **4 Django apps** (core, funds, officials, citizens) — separation of concerns by domain
2. **Expenditures >1M KES auto-flagged** for citizen review via model `save()` override
3. **Election cycles as FK** — all data tied to election cycles for cross-cycle comparison
4. **Leaflet CircleMarkers** for map — sized by budget allocation for wards, colored by status for projects
5. **Read-only ViewSets** for government data; write-enabled for citizen reviews/impact reports
6. **SQLite for dev** with env-var-based Postgres config for Supabase production

## Git Workflow

- Branch names should be descriptive of the change
- Write clear, concise commit messages focused on "why" over "what"
- Keep commits atomic — one logical change per commit

## AI Assistant Guidelines

- Read existing code before proposing changes
- Do not over-engineer — keep solutions minimal and focused
- Do not add features, refactoring, or improvements beyond what is requested
- Avoid introducing security vulnerabilities (OWASP top 10)
- Prefer editing existing files over creating new ones
- Run `npm run build` (frontend) and `python manage.py check` (backend) before considering work complete
- Monetary amounts must always use `DecimalField`, never `FloatField`
- All new API endpoints must be added to the table above
