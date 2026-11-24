const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const MESSAGES_FILE = path.join(__dirname, 'data', 'messages.json');

app.use(cors());
app.use(express.json());

// Serve the React frontend: the Vite build output (frontend/dist) when built,
// otherwise the frontend source folder (dev fallback).
const FRONTEND_DIR = fs.existsSync(path.join(__dirname, '..', 'frontend', 'dist'))
  ? path.join(__dirname, '..', 'frontend', 'dist')
  : path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// --- API: everything the frontend shows comes from here ---
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.get('/api/profile', (req, res) => {
  const { profile } = loadData();
  res.json(profile);
});

app.get('/api/skills', (req, res) => {
  const { skills } = loadData();
  const { category } = req.query;
  res.json(category ? skills.filter((s) => s.category === category) : skills);
});

app.get('/api/projects', (req, res) => {
  const { projects } = loadData();
  const { category, featured } = req.query;
  let out = projects;
  if (category) out = out.filter((p) => p.category === category);
  if (featured === 'true') out = out.filter((p) => p.featured);
  res.json(out);
});

app.get('/api/projects/:id', (req, res) => {
  const { projects } = loadData();
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// Contact form: validated + stored on the server (data/messages.json)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (String(message).trim().length < 10) {
    return res.status(400).json({ error: 'Message is too short (min 10 characters)' });
  }

  const entry = {
    id: Date.now().toString(36),
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
  };
  fs.mkdirSync(path.dirname(MESSAGES_FILE), { recursive: true });
  const existing = fs.existsSync(MESSAGES_FILE)
    ? JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'))
    : [];
  existing.push(entry);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(existing, null, 2));
  res.status(201).json({ ok: true, id: entry.id });
});

// Simple read-back of received messages (protect this in production)
app.get('/api/messages', (req, res) => {
  if (!fs.existsSync(MESSAGES_FILE)) return res.json([]);
  res.json(JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8')));
});

// SPA fallback: unknown non-API routes (/, /projects, /contact) go to React.
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/profile`);
});
