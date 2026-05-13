'use client'

import { memo } from 'react'
import { SolaceEvent } from '@/types'
import { EVENT_COLORS } from '@/lib/constants'
import { formatTimestamp } from '@/lib/utils'
import { cn } from '@/lib/cn'

export const EventCard = memo(function EventCard({ event, selected }: { event: SolaceEvent; selected?: boolean }) {
  const color = EVENT_COLORS[event.category]
  const topicShort = event.topic.split('/').slice(-2).join('/')
  const payload = Object.entries(event.payload).slice(0, 2).map(([k, v]) => `${k}:${v}`).join(' ')
  const isCritical = event.severity === 'critical'

  return (
    <div className={cn(
      'flex items-center gap-1.5 py-[3px] text-[9px] font-mono border-b border-slate-800/30 animate-fade-in transition-colors',
      isCritical && 'bg-red-500/5 border-b-red-500/20',
      selected && 'bg-[#00c895]/5 border-b-[#00c895]/30'
    )}>
      <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', isCritical && 'animate-pulse')} style={{ backgroundColor: isCritical ? '#ef4444' : color }} />
      <span className="text-slate-500 w-[58px] flex-shrink-0">{formatTimestamp(event.timestamp)}</span>
      <span className="truncate font-medium" style={{ color: isCritical ? '#ef4444' : color }}>{topicShort}</span>
      <span className="text-slate-600 truncate ml-auto text-[8px]">{payload}</span>
    </div>
  )
})
