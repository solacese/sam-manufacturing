'use client'

import { SolaceEvent } from '@/types'
import { EVENT_COLORS } from '@/lib/constants'
import { formatTimestamp } from '@/lib/utils'

export function EventCard({ event }: { event: SolaceEvent }) {
  const color = EVENT_COLORS[event.category]
  const topicShort = event.topic.split('/').slice(-2).join('/')
  const payload = Object.entries(event.payload).slice(0, 2).map(([k, v]) => `${k}:${v}`).join(' ')

  return (
    <div className="flex items-start gap-2 py-1 border-b border-slate-800/50 text-[10px] font-mono animate-fade-in">
      <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">{formatTimestamp(event.timestamp)}</span>
          <span className="truncate font-medium" style={{ color }}>{topicShort}</span>
        </div>
        <div className="text-slate-500 truncate">{payload}</div>
      </div>
    </div>
  )
}
