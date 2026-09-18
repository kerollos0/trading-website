import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppProviders'
import { cn } from '../lib/cn'
import { Button } from './ui/button'
import { Logo } from './Brand'

const root = import.meta.env.BASE_URL

const links = [
  { href: `${root}#top`, key: 'home' },
  { href: `${root}#services`, key: 'services' },
  { href: `${root}#experts`, key: 'experts' },
  { href: `${root}#market`, key: 'market' },
  { href: `${root}#about`, key: 'about' },
  { href: `${root}#contact`, key: 'contact' },
] as const

export function Navbar() {
  const { copy, locale, setLocale, theme, toggleTheme } = useApp()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled
          ? 'border-line bg-canvas/80 backdrop-blur-xl'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-gold"
            >
              {copy.nav[link.key]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-line p-1 sm:flex">
            <button
              type="button"
              onClick={() => setLocale('ar')}
              className={cn(
                'rounded-full px-3 py-1 text-xs transition-colors',
                locale === 'ar' ? 'bg-gold text-[#1a1408]' : 'text-muted hover:text-ink',
              )}
            >
              AR
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={cn(
                'rounded-full px-3 py-1 text-xs transition-colors',
                locale === 'en' ? 'bg-gold text-[#1a1408]' : 'text-muted hover:text-ink',
              )}
            >
              EN
            </button>
          </div>

          <Button
            variant="icon"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? copy.theme.light : copy.theme.dark}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <Button
            variant="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label={copy.menu}
          >
            <Menu className="size-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 bg-canvas/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between px-5 py-5">
              <Logo />
              <Button variant="icon" onClick={() => setOpen(false)} aria-label={copy.close}>
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-2 px-6 pt-6">
              {links.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="border-b border-line py-4 text-2xl text-ink"
                >
                  {copy.nav[link.key]}
                </motion.a>
              ))}
              <div className="mt-6 flex gap-3">
                <Button
                  variant={locale === 'ar' ? 'gold' : 'ghost'}
                  onClick={() => setLocale('ar')}
                >
                  العربية
                </Button>
                <Button
                  variant={locale === 'en' ? 'gold' : 'ghost'}
                  onClick={() => setLocale('en')}
                >
                  English
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
