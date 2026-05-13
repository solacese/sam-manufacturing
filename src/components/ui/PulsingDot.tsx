'use client'

import { cn } from '@/lib/cn'

interface PulsingDotProps {
  color: 'green' | 'yellow' | 'red' | 'blue' | 'gray'
  size?: 'sm' | 'md'
}

const colorMap = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  gray: 'bg-gray-400',
}

export function PulsingDot({ color, size = 'sm' }: PulsingDotProps) {
  return (
    <span className="relative flex">
      <span className={cn(
        'absolute inline-flex rounded-full opacity-60 animate-ping',
        colorMap[color],
        size === 'sm' ? 'h-2 w-2' : 'h-3 w-3'
      )} />
      <span className={cn(
        'relative inline-flex rounded-full',
        colorMap[color],
        size === 'sm' ? 'h-2 w-2' : 'h-3 w-3'
      )} />
    </span>
  )
}
