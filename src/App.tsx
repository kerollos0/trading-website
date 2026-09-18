import { AppProviders } from './context/AppProviders'
import { About } from './components/About'
import { ChartSection } from './components/ChartSection'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { MarketTicker } from './components/MarketTicker'
import { Navbar } from './components/Navbar'
import { Services } from './components/Services'

export default function App() {
  return (
    <AppProviders>
      <div className="relative min-h-svh overflow-x-hidden bg-canvas text-ink">
        <Navbar />
        <main>
          <Hero />
          <MarketTicker />
          <Services />
          <ChartSection />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </AppProviders>
  )
}
