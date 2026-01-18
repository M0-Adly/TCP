# Frontend

Run locally:

1. cd frontend
2. npm install
3. npm run dev (opens at http://localhost:3000 and proxies /api to http://localhost:4000)

Build for production:
1. npm run build
2. Serve `dist/` with any static server (e.g., `npx serve -s dist`)

Deploy:
- Vercel: connect the repo and set build command `npm run build` and output directory `dist`.
- A GitHub Action is included to optionally deploy on push if `VERCEL_*` secrets are set.

Notes:
- Uses Chakra UI and Vite + TypeScript
- Ensure backend is running on port 4000 (or set correct API url in production)

