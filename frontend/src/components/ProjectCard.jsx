export default function ProjectCard({ project }) {
  return (
    <article className="card">
      <div className="meta"><span>{project.category}</span><span>{project.year}</span></div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="tags">{(project.tech || []).map((t) => <span key={t} className="tag">{t}</span>)}</div>
      {project.github ? <p style={{ marginTop: 14 }}><a href={project.github} target="_blank" rel="noopener noreferrer">View on GitHub →</a></p> : null}
    </article>
  )
}
