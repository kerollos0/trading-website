import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProviders } from './context/AppProviders'
import { AdminPage } from './pages/AdminPage'
import { LandingPage } from './pages/LandingPage'

const basename =
  import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  )
}
