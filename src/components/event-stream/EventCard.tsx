'use client'

import { memo } from 'react'
import { SolaceEvent } from '@/types'
import { EVENT_COLORS } from '@/lib/constants'
import { formatTimestamp } from '@/lib/utils'

export const EventCard = memo(function EventCard({ event }: { event: SolaceEvent }) {
  const color = EVENT_COLORS[event.category]
  const topicShort = event.topic.split('/').slice(-2).join('/')
  const payload = Object.entries(event.payload).slice(0, 2).map(([k, v]) => `${k}:${v}`).join(' ')

  return (
    <div className="flex items-center gap-1.5 py-[3px] text-[9px] font-mono border-b border-slate-800/30 animate-fade-in">
      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-slate-500 w-[62px] flex-shrink-0">{formatTimestamp(event.timestamp)}</span>
      <span className="truncate font-medium" style={{ color }}>{topicShort}</span>
      <span className="text-slate-600 truncate ml-auto">{payload}</span>
    </div>
  )
})
