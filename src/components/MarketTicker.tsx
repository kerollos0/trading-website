import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useApp, useQuote } from '../context/AppProviders'
import { cn, formatPrice, percentChange } from '../lib/cn'
import { SYMBOLS } from '../lib/market'

export function MarketTicker() {
  const { copy, locale, setSelected } = useApp()

  return (
    <div className="border-y border-line bg-canvas-2/70">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-8">
        <span className="hidden shrink-0 text-[11px] uppercase tracking-[0.22em] text-gold sm:block">
          {copy.ticker.label}
        </span>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_28px,black_calc(100%-28px),transparent)]" dir="ltr">
          <div className="ticker-track flex w-max gap-8">
            {[0, 1].map((copyIndex) => (
              <div key={copyIndex} className="flex gap-8">
                {SYMBOLS.map((symbol) => (
                  <TickerItem
                    key={`${copyIndex}-${symbol.id}`}
                    id={symbol.id}
                    name={locale === 'ar' ? symbol.nameAr : symbol.nameEn}
                    onSelect={() => {
                      setSelected(symbol.id)
                      document.querySelector('#market')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TickerItem({
  id,
  name,
  onSelect,
}: {
  id: (typeof SYMBOLS)[number]['id']
  name: string
  onSelect: () => void
}) {
  const quote = useQuote(id)
  const sessionChange = percentChange(quote.close, quote.candles[0]?.open ?? quote.close)

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex items-center gap-3 font-mono text-sm"
    >
      <span className="text-muted">{name}</span>
      <span className="text-ink">{id}</span>
      <span className="text-ink">{formatPrice(quote.close, quote.symbol.digits)}</span>
      <span className={cn('inline-flex items-center gap-1', quote.up ? 'text-up' : 'text-down')}>
        {quote.up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
        <motion.span key={sessionChange.toFixed(2)}>
          {sessionChange >= 0 ? '+' : ''}
          {sessionChange.toFixed(2)}%
        </motion.span>
      </span>
    </button>
  )
}
