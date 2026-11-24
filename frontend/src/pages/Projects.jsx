import { useState } from 'react'
import ProjectCard from '../components/ProjectCard.jsx'
import { useProjects } from '../api.js'

export default function Projects() {
  const { projects } = useProjects()
  const [filter, setFilter] = useState('All')
  const categories = ['All', ...new Set(projects.map((p) => p.category))]
  const shown = filter === 'All' ? projects : projects.filter((p) => p.category === filter)
  return (
    <main className="container">
      <section>
        <h2>Projects</h2>
        <p className="sub">Every card below is rendered from <code>GET /api/projects</code>. Add a project in backend/data.json and it appears here automatically.</p>
        <div className="filters">
          {categories.map((c) => <button key={c} className={`filter ${c === filter ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>)}
        </div>
        <div className="grid grid-2">{shown.map((p) => <ProjectCard key={p.id} project={p} />)}</div>
      </section>
    </main>
  )
}
