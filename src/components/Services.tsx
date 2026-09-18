import {
  BarChart3,
  BookOpen,
  CandlestickChart,
  GraduationCap,
  LineChart,
  Shield,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppProviders'
import { Container, Reveal, SectionHeading } from './Reveal'

const icons = [CandlestickChart, LineChart, BarChart3, GraduationCap, Shield, BookOpen]

export function Services() {
  const { copy } = useApp()

  return (
    <section id="services" className="relative py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            kicker={copy.services.kicker}
            title={copy.services.title}
            subtitle={copy.services.subtitle}
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {copy.services.items.map((item, index) => {
            const Icon = icons[index] ?? CandlestickChart
            return (
              <Reveal key={item.title} delay={index * 0.06}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="panel hairline group h-full rounded-3xl p-6"
                >
                  <span className="grid size-12 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-[#1a1408]">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
                </motion.article>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
