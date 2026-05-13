'use client'

import { cn } from '@/lib/cn'

interface BadgeProps {
  variant: 'info' | 'warning' | 'critical' | 'success' | 'neutral'
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeProps['variant'], string> = {
  info: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  critical: 'bg-red-500/20 text-red-300 border-red-500/30',
  success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  neutral: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider', variantStyles[variant], className)}>
      {children}
    </span>
  )
}
