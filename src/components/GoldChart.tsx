import { useEffect, useRef } from 'react'
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  createChart,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts'
import { useApp, useQuote } from '../context/AppProviders'
import type { SymbolId } from '../lib/market'

type GoldChartProps = {
  symbolId: SymbolId
  height?: number
}

export function GoldChart({ symbolId, height }: GoldChartProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const { theme } = useApp()
  const quote = useQuote(symbolId)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const isDark = theme === 'dark'
    const chart = createChart(host, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: isDark ? '#9b9280' : '#6d6556',
        fontFamily: 'IBM Plex Mono, ui-monospace, monospace',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: isDark ? 'rgba(212,175,55,0.08)' : 'rgba(138,109,31,0.12)' },
        horzLines: { color: isDark ? 'rgba(212,175,55,0.08)' : 'rgba(138,109,31,0.12)' },
      },
      rightPriceScale: {
        borderColor: isDark ? 'rgba(212,175,55,0.16)' : 'rgba(138,109,31,0.2)',
      },
      timeScale: {
        borderColor: isDark ? 'rgba(212,175,55,0.16)' : 'rgba(138,109,31,0.2)',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: { color: isDark ? 'rgba(240,215,140,0.35)' : 'rgba(154,116,20,0.35)' },
        horzLine: { color: isDark ? 'rgba(240,215,140,0.35)' : 'rgba(154,116,20,0.35)' },
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { mouseWheel: true, pinch: true },
    })

    const series = chart.addSeries(CandlestickSeries, {
      upColor: isDark ? '#3ddc97' : '#0f8f5b',
      downColor: isDark ? '#f07167' : '#c4453c',
      borderUpColor: isDark ? '#3ddc97' : '#0f8f5b',
      borderDownColor: isDark ? '#f07167' : '#c4453c',
      wickUpColor: isDark ? '#3ddc97' : '#0f8f5b',
      wickDownColor: isDark ? '#f07167' : '#c4453c',
    })

    series.setData(
      quote.candles.map((candle) => ({
        time: candle.time as UTCTimestamp,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      })),
    )
    chart.timeScale().fitContent()
    seriesRef.current = series

    return () => {
      chart.remove()
      seriesRef.current = null
    }
    // quote.candles is read on theme/symbol change only; ticks use series.update.
  }, [theme, symbolId])

  useEffect(() => {
    const series = seriesRef.current
    if (!series) return
    const last = quote.candles[quote.candles.length - 1]
    if (!last) return
    series.update({
      time: last.time as UTCTimestamp,
      open: last.open,
      high: last.high,
      low: last.low,
      close: last.close,
    })
  }, [quote.candles])

  return (
    <div
      ref={hostRef}
      dir="ltr"
      className="w-full overflow-hidden rounded-2xl"
      style={{ height: height ?? '100%', minHeight: height ?? 280 }}
    />
  )
}
