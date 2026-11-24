import { useEffect, useState } from 'react'

async function get(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error('API error: ' + path)
  return res.json()
}

function useApi(path) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    let alive = true
    get(path)
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e))
    return () => { alive = false }
  }, [path])
  return { data, error }
}

export function useProfile() {
  const { data } = useApi('/api/profile')
  return { profile: data }
}

export function useSkills() {
  const { data } = useApi('/api/skills')
  return { skills: data || [] }
}

export function useProjects(query = '') {
  const { data } = useApi('/api/projects' + query)
  return { projects: data || [] }
}

export async function sendContact(payload) {
  const res = await fetch('/api/contact', {
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to send')
  return data
}
