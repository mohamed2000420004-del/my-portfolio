import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Contact from './pages/Contact.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import { useProfile } from './api.js'

export default function App() {
  const { profile } = useProfile()
  return (
    <BrowserRouter>
      <Navbar name={profile?.name} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <footer>
        <div className="container footer-in">
          <span>© {profile?.name || 'Mohamed'} — {profile?.location || 'Egypt'}</span>
          <span>React + Vite · Content served from /api</span>
        </div>
      </footer>
    </BrowserRouter>
  )
}
