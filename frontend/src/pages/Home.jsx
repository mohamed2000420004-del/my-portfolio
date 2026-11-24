import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard.jsx'
import { useProfile, useProjects, useSkills } from '../api.js'

export default function Home() {
  const { profile } = useProfile()
  const { skills } = useSkills()
  const { projects } = useProjects('?featured=true')
  if (!profile) return <main className="container"><p className="loading">Loading…</p></main>
  return (
    <main className="container">
      <section className="hero">
        <span className="badge"><span className="dot" />{profile.availability}</span>
        <h1>Hi, I&apos;m <em>{profile.name}</em>.<br />{profile.title}</h1>
        <p className="lead">{profile.bio}</p>
        <div className="btns">
          <Link className="btn primary" to="/projects">View projects →</Link>
          <a className="btn" href={profile.socials?.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <Link className="btn" to="/contact">Contact me</Link>
        </div>
      </section>
      <section>
        <h2>At a glance</h2>
        <div className="grid grid-3">
          {(profile.stats || []).map((s) => <div key={s.label} className="card stat"><b>{s.value}</b><span>{s.label}</span></div>)}
        </div>
      </section>
      <section>
        <h2>Skills</h2>
        <p className="sub">Loaded live from the Node API — edit backend/data.json to update.</p>
        <div className="grid grid-3">
          {skills.map((s) => (
            <div key={s.name} className="card"><b>{s.name}</b><span style={{ color: 'var(--muted)', fontSize: 13 }}> · {s.category}</span><div className="skill-bar"><i style={{ width: `${s.level}%` }} /></div></div>
          ))}
        </div>
      </section>
      <section>
        <h2>Featured projects</h2>
        <p className="sub">A few things I&apos;m proud of.</p>
        <div className="grid grid-2">{projects.map((p) => <ProjectCard key={p.id} project={p} />)}</div>
        <div style={{ marginTop: 18 }}><Link className="btn" to="/projects">See all projects →</Link></div>
      </section>
    </main>
  )
}
