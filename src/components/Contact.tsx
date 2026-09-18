import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { CONTACTS } from '../lib/market'
import { useApp } from '../context/AppProviders'
import { TelegramIcon, WhatsAppIcon } from './Brand'
import { Container, Reveal, SectionHeading } from './Reveal'

export function Contact() {
  const { copy } = useApp()

  const cards = [
    {
      href: CONTACTS.telegram,
      label: copy.contact.telegram,
      hint: copy.contact.telegramHint,
      meta: CONTACTS.telegramHandle,
      icon: TelegramIcon,
    },
    {
      href: CONTACTS.whatsapp,
      label: copy.contact.whatsapp,
      hint: copy.contact.whatsappHint,
      meta: CONTACTS.phoneDisplay,
      icon: WhatsAppIcon,
    },
    {
      href: `tel:${CONTACTS.phone}`,
      label: copy.contact.phone,
      hint: copy.contact.phoneHint,
      meta: CONTACTS.phoneDisplay,
      icon: Phone,
    },
  ]

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            kicker={copy.contact.kicker}
            title={copy.contact.title}
            subtitle={copy.contact.subtitle}
          />
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = card.icon
            return (
              <Reveal key={card.href} delay={index * 0.08}>
                <motion.a
                  href={card.href}
                  target={card.href.startsWith('http') ? '_blank' : undefined}
                  rel={card.href.startsWith('http') ? 'noreferrer' : undefined}
                  whileHover={{ y: -8 }}
                  className="panel hairline group block rounded-3xl p-7"
                >
                  <span className="grid size-14 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-[#1a1408]">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold text-ink">{card.label}</h3>
                  <p className="mt-2 text-sm text-muted">{card.hint}</p>
                  <p className="mt-6 font-mono text-gold" dir="ltr">
                    {card.meta}
                  </p>
                </motion.a>
              </Reveal>
            )
          })}
        </div>
        <p className="mt-8 text-center text-sm text-muted">{copy.contact.hours}</p>
      </Container>
    </section>
  )
}
