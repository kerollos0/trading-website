import { cn } from '../lib/cn'
import { useApp } from '../context/AppProviders'

export function Logo({ compact = false }: { compact?: boolean }) {
  const { copy } = useApp()

  return (
    <a href={import.meta.env.BASE_URL} className="group flex items-center gap-3">
      <span className="relative grid size-10 place-items-center overflow-hidden rounded-md border border-gold/35 bg-gold/10">
        <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
          <rect x="6" y="16" width="3" height="9" rx="0.4" fill="currentColor" className="text-gold" />
          <rect x="12" y="10" width="3" height="15" rx="0.4" fill="currentColor" className="text-gold-2" />
          <rect x="18" y="13" width="3" height="12" rx="0.4" fill="currentColor" className="text-gold" />
          <rect x="24" y="7" width="3" height="18" rx="0.4" fill="currentColor" className="text-gold-2" />
        </svg>
      </span>
      <span className={cn('leading-tight', compact && 'hidden sm:block')}>
        <span className="block font-semibold tracking-[0.28em] text-ink">
          {copy.brandEn}
        </span>
        <span className="block text-[11px] text-muted">{copy.desk}</span>
      </span>
    </a>
  )
}

export function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M21.8 4.3c.3-.9-.5-1.7-1.4-1.4L3.2 9.3c-1 .3-1 1.7.1 2l4.3 1.3 1.6 5.1c.3.9 1.4 1.1 2 .4l2.3-2.4 4.2 3.1c.7.5 1.7.1 1.9-.7l2.2-13.8ZM8.6 12.3l8.7-5.4-6.7 6.6-.3 2.3-1.7-3.5Z" />
    </svg>
  )
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.5 2 2.02 6.45 2.02 12c0 1.76.46 3.47 1.34 4.98L2 22l5.16-1.32A10 10 0 0 0 12.04 22C17.58 22 22 17.55 22 12S17.58 2 12.04 2Zm0 18.15a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.06.78.82-2.98-.2-.31a8.13 8.13 0 1 1 6.87 3.82Zm4.45-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  )
}
