# شادي للتداول · Shady Trading

Landing page for **Shady**, a sample gold and FX trading agency. Arabic is the default language, with a full English switch, dark and light themes, motion, and an XAUUSD market section.

## Features

- Arabic-first layout (`dir="rtl"`) with a one-click English switch
- Dark and light themes, remembered in the browser
- Framer Motion section reveals, hover, and live price motion
- Desk candlestick chart (TradingView Lightweight Charts) for XAUUSD and other pairs
- Live TradingView advanced chart for the real market tape
- Services, about, and contact — WhatsApp, Telegram, and phone links (no form)
- Desktop and mobile layouts

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:45217](http://127.0.0.1:45217).

```bash
npm run build
npm run preview
```

## Customize contact links

Edit `src/lib/market.ts`:

```ts
export const CONTACTS = {
  telegram: 'https://t.me/ShadyTrading',
  telegramHandle: '@ShadyTrading',
  whatsapp: 'https://wa.me/971501234567',
  phone: '+971501234567',
  phoneDisplay: '+971 50 123 4567',
}
```

Copy lives in `src/i18n/translations.ts`.

## Stack

React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Lightweight Charts, TradingView widgets.
