export type Expert = {
  id: string
  title: string
  description: string
  image: string
  link: string
  createdAt: string
}

export type ExpertInput = {
  title: string
  description: string
  image: string
  link: string
}

async function parseJson(response: Response) {
  const type = response.headers.get('content-type') || ''
  if (!type.includes('application/json')) {
    throw new Error('offline')
  }
  const data = (await response.json()) as { experts?: Expert[]; expert?: Expert; error?: string; ok?: boolean }
  return data
}

export async function fetchExperts(): Promise<Expert[]> {
  try {
    const live = await fetch('/api/experts', { credentials: 'include' })
    if (live.ok && (live.headers.get('content-type') || '').includes('application/json')) {
      const data = await parseJson(live)
      return data.experts ?? []
    }
  } catch {
    /* fall through to the static file used on GitHub Pages */
  }

  const fileUrl = `${import.meta.env.BASE_URL}experts.json`
  const fallback = await fetch(fileUrl)
  if (!fallback.ok) return []
  const data = (await fallback.json()) as { experts?: Expert[] }
  return data.experts ?? []
}

export async function fetchSession() {
  const response = await fetch('/api/session', { credentials: 'include' })
  const data = await parseJson(response)
  return Boolean(data.ok)
}

export async function loginAdmin(username: string, password: string) {
  const response = await fetch('/api/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) {
    throw new Error('invalid_credentials')
  }
}

export async function logoutAdmin() {
  await fetch('/api/logout', { method: 'POST', credentials: 'include' })
}

export async function createExpert(input: ExpertInput) {
  const response = await fetch('/api/experts', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await parseJson(response)
  if (!response.ok || !data.expert) {
    throw new Error(data.error || 'save_failed')
  }
  return data.expert
}

export async function updateExpert(id: string, input: ExpertInput) {
  const response = await fetch(`/api/experts/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await parseJson(response)
  if (!response.ok || !data.expert) {
    throw new Error(data.error || 'save_failed')
  }
  return data.expert
}

export async function deleteExpert(id: string) {
  const response = await fetch(`/api/experts/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error('delete_failed')
  }
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('invalid_image'))
      return
    }
    if (file.size > 900_000) {
      reject(new Error('image_too_large'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('invalid_image'))
    reader.readAsDataURL(file)
  })
}
