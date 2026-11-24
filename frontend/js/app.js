// All content is dynamic: this file only renders what the Node API returns.
// Edit content in backend/data.json — no HTML changes needed.
async function api(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('API error: ' + path);
  return res.json();
}
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function renderProfile(p) {
  document.querySelectorAll('[data-profile="name"]').forEach((el) => (el.textContent = p.name));
  document.querySelectorAll('[data-profile="title"]').forEach((el) => (el.textContent = p.title));
  document.querySelectorAll('[data-profile="bio"]').forEach((el) => (el.textContent = p.bio));
  document.querySelectorAll('[data-profile="location"]').forEach((el) => (el.textContent = p.location));
  document.querySelectorAll('[data-profile="availability"]').forEach((el) => (el.textContent = p.availability));
  const github = $('#github-link'); if (github && p.socials?.github) github.href = p.socials.github;
  const linkedin = $('#linkedin-link'); if (linkedin && p.socials?.linkedin) linkedin.href = p.socials.linkedin;
  const mail = $('#email-link'); if (mail && p.email) { mail.href = 'mailto:' + p.email; mail.textContent = p.email; }
  const stats = $('#stats');
  if (stats && p.stats) stats.innerHTML = p.stats.map((s) => `<div class="card stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('');
}

function projectCard(p) {
  return `<article class="card">
    <div class="meta"><span>${esc(p.category)}</span><span>${esc(p.year || '')}</span></div>
    <h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>
    <div class="tags">${(p.tech || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    ${p.github ? `<p style="margin-top:14px"><a href="${esc(p.github)}" target="_blank" rel="noopener">View on GitHub →</a></p>` : ''}
  </article>`;
}

async function initHome() {
  try {
    const [profile, skills, projects] = await Promise.all([
      api('/api/profile'), api('/api/skills'), api('/api/projects?featured=true'),
    ]);
    renderProfile(profile);
    const skillsEl = $('#skills');
    if (skillsEl) skillsEl.innerHTML = skills.map((s) => `<div class="card"><b>${esc(s.name)}</b><span style="color:var(--muted);font-size:13px"> · ${esc(s.category)}</span><div class="skill-bar"><i style="width:${s.level}%"></i></div></div>`).join('');
    const feat = $('#featured-projects');
    if (feat) feat.innerHTML = projects.map(projectCard).join('');
  } catch (e) { console.error(e); }
}

async function initProjects() {
  try {
    const [profile, all] = await Promise.all([api('/api/profile'), api('/api/projects')]);
    renderProfile(profile);
    const cats = ['All', ...new Set(all.map((p) => p.category))];
    const filters = $('#filters');
    const list = $('#project-list');
    const render = (cat) => {
      list.innerHTML = all.filter((p) => cat === 'All' || p.category === cat).map(projectCard).join('');
      filters.querySelectorAll('.filter').forEach((b) => b.classList.toggle('active', b.dataset.cat === cat));
    };
    filters.innerHTML = cats.map((c) => `<button class="filter ${c === 'All' ? 'active' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
    filters.addEventListener('click', (e) => { if (e.target.dataset.cat) render(e.target.dataset.cat); });
    render('All');
  } catch (e) { console.error(e); }
}

async function initContact() {
  try { renderProfile(await api('/api/profile')); } catch (e) { console.error(e); }
  const form = $('#contact-form'); if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const notice = $('#notice'); notice.className = 'notice'; notice.textContent = 'Sending…';
    const payload = { name: form.name.value, email: form.email.value, message: form.message.value };
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      notice.className = 'notice ok'; notice.textContent = 'Message sent — thanks! I will get back to you soon.';
      form.reset();
    } catch (err) { notice.className = 'notice err'; notice.textContent = err.message; }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'home') initHome();
  if (page === 'projects') initProjects();
  if (page === 'contact') initContact();
});
