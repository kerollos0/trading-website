import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/Brand'
import { Button } from '../components/ui/button'
import { useApp } from '../context/AppProviders'
import {
  createExpert,
  deleteExpert,
  fetchExperts,
  fetchSession,
  fileToDataUrl,
  loginAdmin,
  logoutAdmin,
  updateExpert,
  type Expert,
  type ExpertInput,
} from '../lib/experts'

const emptyForm: ExpertInput = {
  title: '',
  description: '',
  link: '',
  image: '',
}

export function AdminPage() {
  const { copy, locale, setLocale, theme, toggleTheme } = useApp()
  const [ready, setReady] = useState(false)
  const [offline, setOffline] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [experts, setExperts] = useState<Expert[]>([])
  const [form, setForm] = useState<ExpertInput>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [saveError, setSaveError] = useState('')

  const adminCopy = copy.admin

  useEffect(() => {
    fetchSession()
      .then(async (ok) => {
        setAuthed(ok)
        if (ok) setExperts(await fetchExperts())
      })
      .catch(() => {
        setOffline(true)
      })
      .finally(() => setReady(true))
  }, [])

  async function onLogin(event: FormEvent) {
    event.preventDefault()
    setLoginError('')
    try {
      await loginAdmin(username, password)
      setAuthed(true)
      setExperts(await fetchExperts())
    } catch {
      setLoginError(adminCopy.error)
    }
  }

  async function onLogout() {
    await logoutAdmin()
    setAuthed(false)
    setForm(emptyForm)
    setEditingId(null)
  }

  async function onSave(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setSaveError('')
    try {
      if (editingId) {
        const expert = await updateExpert(editingId, form)
        setExperts((current) => current.map((item) => (item.id === expert.id ? expert : item)))
      } else {
        const expert = await createExpert(form)
        setExperts((current) => [expert, ...current])
      }
      setForm(emptyForm)
      setEditingId(null)
    } catch {
      setSaveError(adminCopy.saveError)
    } finally {
      setBusy(false)
    }
  }

  async function onImage(file?: File) {
    if (!file) return
    try {
      const image = await fileToDataUrl(file)
      setForm((current) => ({ ...current, image }))
    } catch {
      setSaveError(adminCopy.saveError)
    }
  }

  async function onDelete(id: string) {
    await deleteExpert(id)
    setExperts((current) => current.filter((item) => item.id !== id))
    if (editingId === id) {
      setForm(emptyForm)
      setEditingId(null)
    }
  }

  const heading = useMemo(
    () => (editingId ? adminCopy.edit : adminCopy.add),
    [adminCopy.add, adminCopy.edit, editingId],
  )

  if (!ready) {
    return <div className="min-h-svh bg-canvas" />
  }

  return (
    <div className="min-h-svh bg-canvas text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <Link to="/" className="text-sm text-muted hover:text-gold">
              {adminCopy.back}
            </Link>
            {authed ? (
              <Button variant="ghost" onClick={onLogout}>
                {adminCopy.logout}
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {offline ? (
          <p className="panel rounded-3xl p-6 text-muted">{adminCopy.offline}</p>
        ) : null}

        {!authed && !offline ? (
          <form onSubmit={onLogin} className="panel mx-auto max-w-md rounded-3xl p-8">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold">{adminCopy.kicker}</p>
            <h1 className="mt-2 text-3xl font-semibold">{adminCopy.loginTitle}</h1>
            <p className="mt-3 text-sm text-muted">{adminCopy.loginHint}</p>
            <label className="mt-8 block text-sm text-muted">
              {adminCopy.username}
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-line bg-canvas-2 px-4 py-3 text-ink outline-none focus:border-gold"
                autoComplete="username"
                dir="ltr"
              />
            </label>
            <label className="mt-4 block text-sm text-muted">
              {adminCopy.password}
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-line bg-canvas-2 px-4 py-3 text-ink outline-none focus:border-gold"
                autoComplete="current-password"
                dir="ltr"
              />
            </label>
            {loginError ? <p className="mt-4 text-sm text-down">{loginError}</p> : null}
            <Button className="mt-6 w-full" type="submit">
              {adminCopy.login}
            </Button>
          </form>
        ) : null}

        {authed ? (
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <form onSubmit={onSave} className="panel rounded-3xl p-6">
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold">{adminCopy.kicker}</p>
              <h1 className="mt-2 text-3xl font-semibold">{heading}</h1>
              <label className="mt-6 block text-sm text-muted">
                {adminCopy.fieldTitle}
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  className="bidi-auto mt-2 w-full rounded-2xl border border-line bg-canvas-2 px-4 py-3 text-ink outline-none focus:border-gold"
                  dir="auto"
                  required
                />
              </label>
              <label className="mt-4 block text-sm text-muted">
                {adminCopy.fieldDescription}
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  className="bidi-auto mt-2 min-h-32 w-full rounded-2xl border border-line bg-canvas-2 px-4 py-3 text-ink outline-none focus:border-gold"
                  dir="auto"
                  required
                />
              </label>
              <label className="mt-4 block text-sm text-muted">
                {adminCopy.fieldLink}
                <input
                  value={form.link}
                  onChange={(event) => setForm((current) => ({ ...current, link: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-line bg-canvas-2 px-4 py-3 text-ink outline-none focus:border-gold"
                  placeholder="https://"
                  dir="ltr"
                />
              </label>
              <div className="mt-4 text-sm text-muted">
                {adminCopy.fieldImage}
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-ink"
                  onChange={(event) => onImage(event.target.files?.[0])}
                />
                {form.image ? (
                  <div className="mt-3">
                    <img src={form.image} alt="" className="h-32 rounded-2xl object-cover" />
                    <button
                      type="button"
                      className="mt-2 text-down"
                      onClick={() => setForm((current) => ({ ...current, image: '' }))}
                    >
                      {adminCopy.removeImage}
                    </button>
                  </div>
                ) : null}
              </div>
              {saveError ? <p className="mt-4 text-sm text-down">{saveError}</p> : null}
              <div className="mt-6 flex gap-3">
                <Button type="submit" disabled={busy}>
                  {adminCopy.save}
                </Button>
                {editingId ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(null)
                      setForm(emptyForm)
                    }}
                  >
                    {adminCopy.cancel}
                  </Button>
                ) : null}
              </div>
            </form>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold">{adminCopy.title}</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
                    className="rounded-full border border-line px-3 py-1 text-xs"
                  >
                    {locale === 'ar' ? 'EN' : 'AR'}
                  </button>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="rounded-full border border-line px-3 py-1 text-xs"
                  >
                    {theme === 'dark' ? copy.theme.light : copy.theme.dark}
                  </button>
                </div>
              </div>
              {experts.length === 0 ? (
                <p className="panel rounded-3xl p-6 text-muted">{adminCopy.empty}</p>
              ) : (
                experts.map((expert) => (
                  <article key={expert.id} className="panel rounded-3xl p-5">
                    <div className="flex gap-4">
                      {expert.image ? (
                        <img
                          src={expert.image}
                          alt=""
                          className="size-20 shrink-0 rounded-2xl object-cover"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <h3 className="bidi-auto font-semibold" dir="auto">
                          {expert.title}
                        </h3>
                        <p className="bidi-auto mt-1 line-clamp-3 text-sm text-muted" dir="auto">
                          {expert.description}
                        </p>
                        <div className="mt-3 flex gap-3 text-sm">
                          <button
                            type="button"
                            className="text-gold"
                            onClick={() => {
                              setEditingId(expert.id)
                              setForm({
                                title: expert.title,
                                description: expert.description,
                                link: expert.link,
                                image: expert.image,
                              })
                            }}
                          >
                            {adminCopy.edit}
                          </button>
                          <button
                            type="button"
                            className="text-down"
                            onClick={() => onDelete(expert.id)}
                          >
                            {adminCopy.remove}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
