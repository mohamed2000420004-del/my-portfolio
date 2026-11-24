# Dynamic Portfolio — 3 Pages + Node Backend

A modern, dark, responsive portfolio with **zero hardcoded content in the frontend**.
Everything (profile, skills, projects) is served by a Node/Express API.

## Pages
| Page | File | Data source |
|---|---|---|
| Home | `frontend/index.html` | `GET /api/profile`, `/api/skills`, `/api/projects?featured=true` |
| Projects | `frontend/projects.html` | `GET /api/projects` (with category filter) |
| Contact | `frontend/contact.html` | `POST /api/contact` |

## Run locally
```bash
cd backend
npm install
npm start
# open http://localhost:3000
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
- Backend + frontend together: deploy `backend/` to Render / Railway / Fly.io
  (it serves the static frontend itself). Set `PORT` from the host.
- Frontend only (GitHub Pages / Netlify): deploy `frontend/` and point the
  `fetch()` calls in `frontend/js/app.js` at your hosted API URL.

## Stack
Node.js 20+, Express, vanilla JS, no build step.
