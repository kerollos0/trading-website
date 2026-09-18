import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { CONTACTS } from '../lib/market'
import { useApp, useQuote } from '../context/AppProviders'
import { cn, formatPrice } from '../lib/cn'
import { WhatsAppIcon } from './Brand'
import { Container } from './Reveal'
import { GoldChart } from './GoldChart'

export function Hero() {
  const { copy } = useApp()
  const gold = useQuote('XAUUSD')
  const [titleA, titleB] = copy.hero.title.split('\n')

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div className="noise" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-[90px]"
        animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 text-[11px] font-medium uppercase tracking-[0.32em] text-gold"
          >
            {copy.hero.kicker}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            <span className="gold-text">{titleA}</span>
            <br />
            {titleB}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {copy.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href={CONTACTS.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-[#1a1408] shadow-[0_12px_32px_-12px_var(--glow)] transition hover:-translate-y-0.5 hover:bg-gold-2"
            >
              <WhatsAppIcon className="size-4" />
              {copy.hero.primary}
            </a>
            <a
              href="#market"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition hover:border-gold/50 hover:bg-gold/10"
            >
              {copy.hero.secondary}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mt-10 inline-flex items-center gap-4 rounded-2xl border border-line bg-panel px-4 py-3"
            dir="ltr"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{copy.hero.live}</p>
              <p className="font-mono text-xl text-ink">XAUUSD {formatPrice(gold.close, 2)}</p>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-sm',
                gold.up ? 'bg-up/12 text-up' : 'bg-down/12 text-down',
              )}
            >
              {gold.up ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
              {gold.changePct >= 0 ? '+' : ''}
              {gold.changePct.toFixed(2)}%
            </span>
            <p className="hidden text-xs text-muted sm:block">{copy.hero.session}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.8 }}
          className="panel hairline relative overflow-hidden rounded-3xl p-3 sm:p-4"
        >
          <div className="mb-3 flex items-center justify-between px-2 pt-1" dir="ltr">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold">XAUUSD</p>
              <p className="font-mono text-lg text-ink">{formatPrice(gold.close, 2)}</p>
            </div>
            <span className="rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted">
              H1
            </span>
          </div>
          <GoldChart symbolId="XAUUSD" height={320} />
        </motion.div>
      </Container>
    </section>
  )
}
