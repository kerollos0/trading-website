import { useApp } from '../context/AppProviders'
import { Logo } from './Brand'
import { Container } from './Reveal'

export function Footer() {
  const { copy } = useApp()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line py-10">
      <Container className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo />
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            {copy.footer.disclaimer}
          </p>
        </div>
        <p className="text-sm text-muted">
          © {year} {copy.footer.rights}
        </p>
      </Container>
    </footer>
  )
}
