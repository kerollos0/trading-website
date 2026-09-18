import { motion } from 'framer-motion'
import { useApp } from '../context/AppProviders'
import { Container, Reveal, SectionHeading } from './Reveal'

export function About() {
  const { copy } = useApp()

  return (
    <section id="about" className="relative py-20 sm:py-28">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <SectionHeading kicker={copy.about.kicker} title={copy.about.title} />
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              {copy.about.body}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {copy.about.stats.map((stat) => (
                <div key={stat.label} className="panel rounded-2xl px-4 py-5">
                  <p className="gold-text font-mono text-2xl font-semibold sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-4">
            {copy.about.points.map((point, index) => (
              <Reveal key={point.title} delay={index * 0.07}>
                <motion.article
                  whileHover={{ x: 0, y: -4 }}
                  className="panel rounded-3xl p-6"
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gold">
                    0{index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-ink">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{point.body}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
