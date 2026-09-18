import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppProviders'
import type { SymbolId } from '../lib/market'
import { getSymbol } from '../lib/market'

type ChartMode = 'live' | 'desk'

export function TradingViewChart({
  symbolId,
  locale,
  theme,
}: {
  symbolId: SymbolId
  locale: 'ar' | 'en'
  theme: 'dark' | 'light'
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const { copy } = useApp()
  const [failed, setFailed] = useState(false)
  const symbol = getSymbol(symbolId)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    setFailed(false)
    host.innerHTML = ''

    const container = document.createElement('div')
    container.className = 'tradingview-widget-container'
    container.style.height = '100%'
    container.style.width = '100%'

    const widget = document.createElement('div')
    widget.className = 'tradingview-widget-container__widget'
    widget.style.height = '100%'
    widget.style.width = '100%'

    const script = document.createElement('script')
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol.tv,
      interval: '60',
      timezone: 'Etc/UTC',
      theme: theme === 'dark' ? 'dark' : 'light',
      style: '1',
      locale: locale === 'ar' ? 'ar' : 'en',
      backgroundColor: theme === 'dark' ? '#0b1016' : '#fffaf0',
      gridColor: theme === 'dark' ? 'rgba(212,175,55,0.08)' : 'rgba(138,109,31,0.12)',
      hide_side_toolbar: false,
      allow_symbol_change: true,
      calendar: false,
      hide_top_toolbar: false,
      withdateranges: true,
      support_host: 'https://www.tradingview.com',
    })

    script.onerror = () => setFailed(true)
    container.append(widget, script)
    host.append(container)

    const timeout = window.setTimeout(() => {
      const iframe = host.querySelector('iframe')
      if (!iframe) setFailed(true)
    }, 9000)

    return () => {
      window.clearTimeout(timeout)
      host.innerHTML = ''
    }
  }, [locale, symbol.tv, theme])

  if (failed) {
    return (
      <div className="grid h-full place-items-center px-6 text-center">
        <div>
          <p className="text-muted">{copy.market.fallback}</p>
          <a
            href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol.tv)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-gold underline-offset-4 hover:underline"
          >
            {copy.market.openTv}
          </a>
        </div>
      </div>
    )
  }

  return <div ref={hostRef} className="h-full w-full" dir="ltr" />
}

export type { ChartMode }
