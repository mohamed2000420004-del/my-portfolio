# Dynamic Portfolio — React + Vite Frontend, Node Backend

A modern, dark, responsive portfolio. The frontend is **React 18 + Vite**
with React Router (3 routes), and **zero hardcoded content** — everything
(profile, skills, projects) is served by a Node/Express API.

## Pages (React Router)
| Route | Page | Data source |
|---|---|---|
| `/` | Home | `GET /api/profile`, `/api/skills`, `/api/projects?featured=true` |
| `/projects` | Projects | `GET /api/projects` (with category filter) |
| `/contact` | Contact | `POST /api/contact` |

## Run locally
```bash
# 1. Backend (API + serves the built frontend) — http://localhost:3000
cd backend
npm install
npm start

# 2. Frontend dev server with hot reload + /api proxy — http://localhost:5173
cd frontend
npm install
npm run dev

# Build the frontend for production (output: frontend/dist/)
cd frontend
npm run build
```

## API
- `GET /api/health`
- `GET /api/profile`
- `GET /api/skills` — optional `?category=Frontend`
- `GET /api/projects` — optional `?category=Integration&featured=true`
- `GET /api/projects/:id`
- `POST /api/contact` — `{ name, email, message }`, validated, saved to `backend/data/messages.json`
- `GET /api/messages` — messages received via the form

## Update your content
Edit **one file**: `backend/data.json` — name, title, bio, stats, skills,
projects and social links. No frontend change needed, the pages re-render
from the API on next load.

## Deploy
- Backend + built frontend together: deploy `backend/` to Render / Railway /
  Fly.io (it serves `frontend/dist/` itself). Run `npm run build` in
  `frontend/` first, or add it as the build step. Set `PORT` from the host.
- Frontend only (Netlify / Vercel): deploy `frontend/` and point the
  `fetch()` calls in `frontend/src/api.js` at your hosted API URL.

## Stack
React 18, Vite 5, React Router 6, Node.js 20+, Express. No backend change
was needed for the React migration — the API contract is unchanged.
