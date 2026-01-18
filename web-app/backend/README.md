# Backend

Run locally:

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. npm install
3. npm run dev

Seed data:
- `npm run seed` will create a demo user (demo@example.com / password) and sample translations.

Routes:
- POST /api/auth/signup
- POST /api/auth/signin
- POST /api/translate
- GET/POST/DELETE /api/library
- GET /api/stats
