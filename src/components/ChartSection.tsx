import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { useApp, useQuote } from '../context/AppProviders'
import { cn, formatPrice } from '../lib/cn'
import { SYMBOLS, type SymbolId } from '../lib/market'
import { GoldChart } from './GoldChart'
import { Container, Reveal, SectionHeading } from './Reveal'
import { TradingViewChart, type ChartMode } from './TradingViewChart'

export function ChartSection() {
  const { copy, locale, theme, selected, setSelected } = useApp()
  const [mode, setMode] = useState<ChartMode>('live')
  const quote = useQuote(selected)

  return (
    <section id="market" className="relative py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            kicker={copy.market.kicker}
            title={copy.market.title}
            subtitle={copy.market.subtitle}
          />
        </Reveal>

        <Reveal delay={0.08} className="mt-10">
          <div className="panel hairline overflow-hidden rounded-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-6">
              <div className="flex flex-wrap gap-2" dir="ltr">
                {SYMBOLS.map((symbol) => (
                  <SymbolChip
                    key={symbol.id}
                    id={symbol.id}
                    active={selected === symbol.id}
                    onSelect={setSelected}
                    label={locale === 'ar' ? symbol.nameAr : symbol.nameEn}
                  />
                ))}
              </div>
              <div className="flex rounded-full border border-line p-1">
                <ModeButton active={mode === 'live'} onClick={() => setMode('live')}>
                  {copy.market.liveTab}
                </ModeButton>
                <ModeButton active={mode === 'desk'} onClick={() => setMode('desk')}>
                  {copy.market.deskTab}
                </ModeButton>
              </div>
            </div>

            <div className="grid gap-4 border-b border-line px-4 py-4 sm:grid-cols-4 sm:px-6">
              <QuoteStat label={selected} value={formatPrice(quote.close, quote.symbol.digits)} />
              <QuoteStat
                label={copy.market.change}
                value={`${quote.changePct >= 0 ? '+' : ''}${quote.changePct.toFixed(2)}%`}
                tone={quote.up ? 'up' : 'down'}
              />
              <QuoteStat
                label={copy.market.high}
                value={formatPrice(quote.sessionHigh, quote.symbol.digits)}
              />
              <QuoteStat
                label={copy.market.low}
                value={formatPrice(quote.sessionLow, quote.symbol.digits)}
              />
            </div>

            <div className="relative h-[420px] bg-canvas-2 sm:h-[560px]">
              {mode === 'live' ? (
                <TradingViewChart symbolId={selected} locale={locale} theme={theme} />
              ) : (
                <div className="h-full p-2 sm:p-3">
                  <GoldChart symbolId={selected} />
                </div>
              )}
            </div>

            <p className="px-5 py-4 text-sm leading-relaxed text-muted">{copy.market.note}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

function SymbolChip({
  id,
  label,
  active,
  onSelect,
}: {
  id: SymbolId
  label: string
  active: boolean
  onSelect: (id: SymbolId) => void
}) {
  const quote = useQuote(id)

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs transition-all',
        active
          ? 'border-gold bg-gold/15 text-ink'
          : 'border-line text-muted hover:border-gold/40 hover:text-ink',
      )}
    >
      <span className="font-mono">{id}</span>
      <span className="mx-1.5 text-muted">{label}</span>
      <span className={cn('inline-flex items-center', quote.up ? 'text-up' : 'text-down')}>
        {quote.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
      </span>
    </button>
  )
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-3 py-1.5 text-xs transition-colors',
        active ? 'bg-gold text-[#1a1408]' : 'text-muted hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}

function QuoteStat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'up' | 'down'
}) {
  return (
    <motion.div layout>
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</p>
      <p
        className={cn(
          'mt-1 font-mono text-lg',
          tone === 'up' && 'text-up',
          tone === 'down' && 'text-down',
          !tone && 'text-ink',
        )}
        dir="ltr"
      >
        {value}
      </p>
    </motion.div>
  )
}
