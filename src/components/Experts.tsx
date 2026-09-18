import { ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppProviders'
import { fetchExperts, type Expert } from '../lib/experts'
import { Container, Reveal, SectionHeading } from './Reveal'

export function Experts() {
  const { copy } = useApp()
  const [experts, setExperts] = useState<Expert[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    fetchExperts()
      .then((items) => {
        if (active) setExperts(items)
      })
      .finally(() => {
        if (active) setLoaded(true)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section id="experts" className="relative py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            kicker={copy.experts.kicker}
            title={copy.experts.title}
            subtitle={copy.experts.subtitle}
          />
        </Reveal>

        {!loaded ? (
          <div className="mt-12 h-40" />
        ) : experts.length === 0 ? (
          <p className="mt-12 text-center text-muted">{copy.experts.empty}</p>
        ) : (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {experts.map((expert, index) => (
              <Reveal key={expert.id} delay={index * 0.06}>
                <article className="panel hairline flex h-full flex-col overflow-hidden rounded-3xl">
                  {expert.image ? (
                    <img
                      src={expert.image}
                      alt={expert.title}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-36 place-items-center bg-gold/10 text-gold">
                      <span className="text-xs uppercase tracking-[0.28em]">EA</span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold text-ink">{expert.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                      {expert.description}
                    </p>
                    {expert.link ? (
                      <a
                        href={expert.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-sm text-gold hover:text-gold-2"
                      >
                        {copy.experts.open}
                        <ExternalLink className="size-4" />
                      </a>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
