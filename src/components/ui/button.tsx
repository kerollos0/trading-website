import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        gold: 'bg-gold text-[#1a1408] shadow-[0_10px_30px_-12px_var(--glow)] hover:bg-gold-2 hover:-translate-y-0.5',
        ghost:
          'border border-line bg-transparent text-ink hover:border-gold/50 hover:bg-gold/10',
        icon: 'size-10 rounded-full border border-line p-0 text-ink hover:border-gold/50 hover:bg-gold/10',
      },
    },
    defaultVariants: {
      variant: 'gold',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: ReactNode
  }

export function Button({ className, variant, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props}>
      {children}
    </button>
  )
}
