import { Link, NavLink } from 'react-router-dom'

export default function Navbar({ name }) {
  return (
    <header>
      <div className="container nav">
        <Link className="logo" to="/">{name || 'Portfolio'}<span>.</span></Link>
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </div>
    </header>
  )
}
