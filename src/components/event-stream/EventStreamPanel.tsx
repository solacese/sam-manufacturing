'use client'

import { useEffect, useRef, useState } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { EventCard } from './EventCard'
import { EventCategory, SolaceEvent } from '@/types'
import { EVENT_COLORS } from '@/lib/constants'
import { Radio, Pause, Play, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatTimestamp } from '@/lib/utils'
import { Sparkline } from './Sparkline'

const filterOptions: { key: EventCategory; label: string }[] = [
  { key: 'iot', label: 'IoT' },
  { key: 'mes', label: 'MES' },
  { key: 'erp', label: 'ERP' },
]

export function EventStreamPanel() {
  const events = useSimulationStore((s) => s.events)
  const [paused, setPaused] = useState(false)
  const [filters, setFilters] = useState<Set<EventCategory>>(new Set(['iot', 'mes', 'erp', 'agent', 'disruption']))
  const [selectedEvent, setSelectedEvent] = useState<SolaceEvent | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const frozenRef = useRef<SolaceEvent[]>([])

  function handlePause() {
    if (!paused) frozenRef.current = [...events]
    setPaused(!paused)
  }

  useEffect(() => {
    if (!paused && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [events.length, paused])

  function toggleFilter(key: EventCategory) {
    setFilters(prev => {
      const next = new Set(prev)
      if (next.has(key)) { if (next.size > 1) next.delete(key) } else { next.add(key) }
      return next
    })
  }

  const source = paused ? frozenRef.current : events
  const displayEvents = source.filter(e => filters.has(e.category)).slice(-100)

  return (
    <div className="flex h-full flex-col bg-[#080d1a]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800">
        <Radio className="h-3.5 w-3.5 text-[#00c895]" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Solace Events</span>
        <div className="ml-auto flex items-center gap-1">
          {filterOptions.map(f => (
            <button key={f.key} onClick={() => toggleFilter(f.key)}
              className={cn('rounded px-1.5 py-0.5 text-[7px] font-bold uppercase border transition-all', filters.has(f.key) ? 'opacity-100' : 'opacity-30')}
              style={{ color: EVENT_COLORS[f.key], borderColor: EVENT_COLORS[f.key] + '40', backgroundColor: EVENT_COLORS[f.key] + '10' }}>
              {f.label}
            </button>
          ))}
          <button onClick={handlePause}
            className={cn('ml-1 rounded p-1 transition-all', paused ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300')}>
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Event detail popup */}
      {selectedEvent && (
        <div className="border-b border-slate-800 bg-slate-900/80 px-3 py-2 animate-fade-in">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">Event Detail</span>
            <button onClick={() => setSelectedEvent(null)} className="text-slate-500 hover:text-white"><X className="h-3 w-3" /></button>
          </div>
          <div className="text-[9px] font-mono space-y-1">
            <div className="text-slate-400">Time: <span className="text-slate-200">{formatTimestamp(selectedEvent.timestamp)}</span> | Category: <span className="text-slate-200 uppercase">{selectedEvent.category}</span> | Severity: <span className={selectedEvent.severity === 'critical' ? 'text-red-400' : 'text-slate-200'}>{selectedEvent.severity}</span></div>
            <div className="text-slate-400">Topic: <span className="text-[#00c895]">{selectedEvent.topic}</span></div>
            <div className="text-slate-400">Payload:</div>
            <div className="bg-slate-800/50 rounded p-1.5 text-slate-300 text-[8px] overflow-x-auto">
              {Object.entries(selectedEvent.payload).map(([k, v]) => (
                <div key={k}><span className="text-slate-500">{k}:</span> <span className="text-white">{String(v)}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-1.5 py-0.5 scrollbar-thin">
        {displayEvents.map(event => (
          <div key={event.id} onClick={() => { setPaused(true); frozenRef.current = [...events]; setSelectedEvent(event) }} className="cursor-pointer">
            <EventCard event={event} />
          </div>
        ))}
      </div>
      {/* Sparkline + status */}
      <div className="border-t border-slate-800">
        <Sparkline />
        <div className="px-3 py-1 text-[8px] font-mono text-slate-500 flex justify-between items-center">
          <span>{displayEvents.length} / {events.length}</span>
          <span className={cn('font-bold', paused ? 'text-amber-400' : 'text-[#00c895]')}>
            {paused ? '⏸ PAUSED' : '● LIVE'}
          </span>
        </div>
      </div>
    </div>
  )
}
