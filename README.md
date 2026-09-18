# شادي للتداول · Shady Trading

Landing page for **Shady**, a sample gold and FX trading agency. Arabic is the default language, with a full English switch, dark and light themes, motion, and an XAUUSD market section.

Live site: [https://kerollos0.github.io/trading-website/](https://kerollos0.github.io/trading-website/)

Admin dashboard: run the app locally, then open `/admin`.

Username: `admin`  
Password: `Shady@2026`

The landing page and the dashboard share one JSON file: `public/experts.json`. The admin writes to it, and the experts section on the site reads from it. That is the whole connection — same project, same file, no extra database.

Change the password in `.env` (`ADMIN_USER`, `ADMIN_PASSWORD`) before using this in production.

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
  telegram: 'https://t.me/ShadyTradingDesk',
  telegramHandle: '@ShadyTradingDesk',
  whatsapp: 'https://wa.me/971501234567',
  phone: '+971501234567',
  phoneDisplay: '+971 50 123 4567',
}
```

Copy lives in `src/i18n/translations.ts`.

## Stack

React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Lightweight Charts, TradingView widgets.
