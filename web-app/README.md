# Translator Web App — Monorepo

Contents:
- `frontend/` — React + TypeScript (Vite + Chakra UI)
- `backend/` — Node.js + Express + TypeScript (MongoDB via Mongoose)

Quick start (local):
1. Start MongoDB locally or set `MONGO_URI` in `web-app/backend/.env`.
2. Backend: cd `web-app/backend` && npm install && npm run dev
3. Frontend: cd `web-app/frontend` && npm install && npm run dev

Seed demo data:
- cd web-app/backend && npm run seed
  - demo user: email `demo@example.com` password `password`

Docker (build images):
- Frontend: `docker build -t translator-frontend -f web-app/frontend/Dockerfile .`
- Backend: `docker build -t translator-backend -f web-app/backend/Dockerfile .`

Use docker-compose (optional):
- cd web-app && docker-compose up --build

CI: GitHub Actions workflow added at `.github/workflows/ci.yml` (builds both frontend and backend)

See `frontend/README.md` and `backend/README.md` for additional details and deploy notes.
