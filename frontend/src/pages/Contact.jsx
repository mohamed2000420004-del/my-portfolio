import { useState } from 'react'
import { sendContact, useProfile } from '../api.js'

export default function Contact() {
  const { profile } = useProfile()
  const [form, setForm] = useState({ email: '', message: '', name: '' })
  const [notice, setNotice] = useState(null)
  if (!profile) return <main className="container"><p className="loading">Loading…</p></main>

  async function onSubmit(e) {
    e.preventDefault()
    setNotice({ kind: '', text: 'Sending…' })
    try {
      await sendContact(form)
      setNotice({ kind: 'ok', text: 'Message sent — thanks! I will get back to you soon.' })
      setForm({ email: '', message: '', name: '' })
    } catch (err) {
      setNotice({ kind: 'err', text: err.message })
    }
  }
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <main className="container">
      <section>
        <h2>Contact me</h2>
        <p className="sub">Send a message — it&apos;s saved by the Node backend via <code>POST /api/contact</code>. Or reach me on GitHub.</p>
        <div className="card" style={{ marginBottom: 20 }}>
          <b>{profile.name}</b> · {profile.location}<br />
          {profile.availability}<br />
          <a href={profile.socials?.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          {profile.email ? <> · <a href={`mailto:${profile.email}`}>Email</a></> : null}
        </div>
        <form onSubmit={onSubmit}>
          <label>Name<input required value={form.name} onChange={set('name')} placeholder="Your name" /></label>
          <label>Email<input required type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" /></label>
          <label>Message<textarea required minLength={10} value={form.message} onChange={set('message')} placeholder="Hi, I have a project…" /></label>
          <button className="btn primary" type="submit">Send message</button>
          {notice ? <div className={`notice ${notice.kind}`}>{notice.text}</div> : null}
        </form>
      </section>
    </main>
  )
}
