import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { copy, type Copy, type Locale } from '../i18n/translations'
import {
  generateCandles,
  getSymbol,
  SYMBOLS,
  tickCandle,
  type Candle,
  type SymbolId,
} from '../lib/market'

export type Theme = 'dark' | 'light'

type MarketBook = Record<SymbolId, Candle[]>

type AppContextValue = {
  locale: Locale
  theme: Theme
  copy: Copy
  setLocale: (locale: Locale) => void
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  book: MarketBook
  selected: SymbolId
  setSelected: (id: SymbolId) => void
}

const AppContext = createContext<AppContextValue | null>(null)

function readLocale(): Locale {
  try {
    const stored = localStorage.getItem('shady-lang')
    if (stored === 'en' || stored === 'ar') return stored
  } catch {
    /* ignore */
  }
  return 'ar'
}

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem('shady-theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  return 'dark'
}

function buildBook(): MarketBook {
  return SYMBOLS.reduce((acc, symbol) => {
    acc[symbol.id] = generateCandles(symbol)
    return acc
  }, {} as MarketBook)
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocale)
  const [theme, setThemeState] = useState<Theme>(readTheme)
  const [selected, setSelected] = useState<SymbolId>('XAUUSD')
  const [book, setBook] = useState<MarketBook>(buildBook)

  const applyDocument = useCallback((nextLocale: Locale, nextTheme: Theme) => {
    const root = document.documentElement
    root.lang = nextLocale
    root.dir = nextLocale === 'ar' ? 'rtl' : 'ltr'
    root.dataset.theme = nextTheme
    root.style.colorScheme = nextTheme
    document.title = copy[nextLocale].metaTitle
    localStorage.setItem('shady-lang', nextLocale)
    localStorage.setItem('shady-theme', nextTheme)
  }, [])

  useEffect(() => {
    applyDocument(locale, theme)
  }, [applyDocument, locale, theme])

  useEffect(() => {
    const id = window.setInterval(() => {
      setBook((current) => {
        const next = { ...current }
        for (const symbol of SYMBOLS) {
          const candles = next[symbol.id]
          const last = candles[candles.length - 1]
          if (!last) continue
          next[symbol.id] = [...candles.slice(0, -1), tickCandle(last, symbol)]
        }
        return next
      })
    }, 1400)
    return () => window.clearInterval(id)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      locale,
      theme,
      copy: copy[locale],
      setLocale,
      setTheme,
      toggleTheme,
      book,
      selected,
      setSelected,
    }),
    [book, locale, selected, setLocale, setTheme, theme, toggleTheme],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProviders')
  return ctx
}

export function useQuote(id: SymbolId) {
  const { book } = useApp()
  const candles = book[id]
  const last = candles[candles.length - 1]
  const prev = candles[candles.length - 2]
  const symbol = getSymbol(id)
  const close = last?.close ?? symbol.base
  const open = candles[0]?.open ?? close
  const change = close - open
  const changePct = open ? (change / open) * 100 : 0
  const high = last?.high ?? close
  const low = last?.low ?? close
  const sessionHigh = candles.reduce((m, c) => Math.max(m, c.high), close)
  const sessionLow = candles.reduce((m, c) => Math.min(m, c.low), close)
  return {
    symbol,
    candles,
    close,
    open: last?.open ?? close,
    prevClose: prev?.close ?? close,
    change,
    changePct,
    high,
    low,
    sessionHigh,
    sessionLow,
    up: change >= 0,
  }
}
