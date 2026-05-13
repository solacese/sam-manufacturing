'use client'

import { useEffect, useRef, useState } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { EventCard } from './EventCard'
import { EventCategory } from '@/types'
import { EVENT_COLORS } from '@/lib/constants'
import { Radio, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'

const filterOptions: { key: EventCategory; label: string }[] = [
  { key: 'iot', label: 'IoT' },
  { key: 'mes', label: 'MES' },
  { key: 'erp', label: 'ERP' },
]

export function EventStreamPanel() {
  const events = useSimulationStore((s) => s.events)
  const [paused, setPaused] = useState(false)
  const [filters, setFilters] = useState<Set<EventCategory>>(new Set(['iot', 'mes', 'erp', 'agent', 'disruption']))
  const scrollRef = useRef<HTMLDivElement>(null)
  const [pausedEvents, setPausedEvents] = useState<typeof events>([])

  useEffect(() => {
    if (!paused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [events.length, paused])

  useEffect(() => {
    if (paused) {
      setPausedEvents(events)
    }
  }, [paused, events])

  function toggleFilter(key: EventCategory) {
    setFilters(prev => {
      const next = new Set(prev)
      if (next.has(key)) { if (next.size > 1) next.delete(key) } else { next.add(key) }
      return next
    })
  }

  const displayEvents = (paused ? pausedEvents : events).filter(e => filters.has(e.category))

  return (
    <div className="flex h-full flex-col bg-[#080d1a]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800">
        <Radio className="h-3.5 w-3.5 text-[#00c895]" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Events</span>
        <div className="ml-auto flex items-center gap-1">
          {filterOptions.map(f => (
            <button key={f.key} onClick={() => toggleFilter(f.key)}
              className={cn('rounded px-1.5 py-0.5 text-[7px] font-bold uppercase border transition-all', filters.has(f.key) ? 'opacity-100' : 'opacity-30')}
              style={{ color: EVENT_COLORS[f.key], borderColor: EVENT_COLORS[f.key] + '40', backgroundColor: EVENT_COLORS[f.key] + '10' }}>
              {f.label}
            </button>
          ))}
          <button onClick={() => setPaused(!paused)}
            className={cn('ml-1 rounded p-1 transition-all', paused ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300')}>
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-1.5 py-0.5 scrollbar-thin">
        {displayEvents.slice(-100).map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <div className="border-t border-slate-800 px-3 py-1 text-[8px] font-mono text-slate-500 flex justify-between">
        <span>{events.length} total events</span>
        <span>{paused ? 'PAUSED' : `~${Math.round(1000/40)} ev/s`}</span>
      </div>
    </div>
  )
}
