import { About } from '../components/About'
import { ChartSection } from '../components/ChartSection'
import { Contact } from '../components/Contact'
import { Experts } from '../components/Experts'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { MarketTicker } from '../components/MarketTicker'
import { Navbar } from '../components/Navbar'
import { Services } from '../components/Services'

export function LandingPage() {
  return (
    <div className="relative min-h-svh overflow-x-hidden bg-canvas text-ink">
      <Navbar />
      <main>
        <Hero />
        <MarketTicker />
        <Services />
        <Experts />
        <ChartSection />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
