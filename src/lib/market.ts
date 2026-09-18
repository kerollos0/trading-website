export const CONTACTS = {
  telegram: 'https://t.me/ShadyTrading',
  telegramHandle: '@ShadyTrading',
  whatsapp: 'https://wa.me/971501234567',
  phone: '+971501234567',
  phoneDisplay: '+971 50 123 4567',
  hours: '24/5',
} as const

export const SYMBOLS = [
  {
    id: 'XAUUSD',
    tv: 'OANDA:XAUUSD',
    base: 3684.2,
    digits: 2,
    volatility: 0.0016,
    nameAr: 'الذهب',
    nameEn: 'Gold',
  },
  {
    id: 'XAGUSD',
    tv: 'OANDA:XAGUSD',
    base: 42.86,
    digits: 3,
    volatility: 0.0022,
    nameAr: 'الفضة',
    nameEn: 'Silver',
  },
  {
    id: 'EURUSD',
    tv: 'FX:EURUSD',
    base: 1.0841,
    digits: 5,
    volatility: 0.0009,
    nameAr: 'يورو/دولار',
    nameEn: 'EUR/USD',
  },
  {
    id: 'GBPUSD',
    tv: 'FX:GBPUSD',
    base: 1.3148,
    digits: 5,
    volatility: 0.0011,
    nameAr: 'جنيه/دولار',
    nameEn: 'GBP/USD',
  },
  {
    id: 'USDJPY',
    tv: 'FX:USDJPY',
    base: 147.92,
    digits: 3,
    volatility: 0.001,
    nameAr: 'دولار/ين',
    nameEn: 'USD/JPY',
  },
  {
    id: 'BTCUSD',
    tv: 'BITSTAMP:BTCUSD',
    base: 64180,
    digits: 0,
    volatility: 0.0034,
    nameAr: 'بيتكوين',
    nameEn: 'Bitcoin',
  },
] as const

export type SymbolId = (typeof SYMBOLS)[number]['id']
export type MarketSymbol = (typeof SYMBOLS)[number]

export type Candle = {
  time: number
  open: number
  high: number
  low: number
  close: number
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateCandles(symbol: MarketSymbol, count = 180): Candle[] {
  const rand = mulberry32(symbol.id.split('').reduce((a, c) => a + c.charCodeAt(0), 97))
  const candles: Candle[] = []
  let price = symbol.base * (0.96 + rand() * 0.03)
  const now = Math.floor(Date.now() / 1000)
  const step = 3600
  const start = now - count * step

  for (let i = 0; i < count; i++) {
    const drift = (rand() - 0.49) * symbol.base * symbol.volatility
    const open = price
    const close = Math.max(symbol.base * 0.2, open + drift)
    const wick = symbol.base * symbol.volatility * (0.35 + rand())
    const high = Math.max(open, close) + wick * rand()
    const low = Math.min(open, close) - wick * rand()
    candles.push({
      time: start + i * step,
      open: roundTo(open, symbol.digits),
      high: roundTo(high, symbol.digits),
      low: roundTo(low, symbol.digits),
      close: roundTo(close, symbol.digits),
    })
    price = close
  }

  return candles
}

export function tickCandle(candle: Candle, symbol: MarketSymbol): Candle {
  const delta = (Math.random() - 0.5) * symbol.base * symbol.volatility * 0.18
  const close = roundTo(Math.max(symbol.base * 0.2, candle.close + delta), symbol.digits)
  return {
    ...candle,
    close,
    high: roundTo(Math.max(candle.high, close), symbol.digits),
    low: roundTo(Math.min(candle.low, close), symbol.digits),
  }
}

export function roundTo(value: number, digits: number) {
  const p = 10 ** digits
  return Math.round(value * p) / p
}

export function getSymbol(id: SymbolId) {
  return SYMBOLS.find((item) => item.id === id) ?? SYMBOLS[0]
}
