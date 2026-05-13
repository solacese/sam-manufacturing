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
  { key: 'logistics', label: 'LOG' },
  { key: 'supplier', label: 'SUP' },
]

export function EventStreamPanel() {
  const events = useSimulationStore((s) => s.events)
  const [paused, setPaused] = useState(false)
  const [filters, setFilters] = useState<Set<EventCategory>>(new Set(['iot', 'mes', 'erp', 'agent', 'disruption', 'logistics', 'supplier']))
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
        <div className="border-b border-slate-800 bg-slate-900/90 px-3 py-2.5 animate-fade-in">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[8px] font-bold text-[#00c895] uppercase tracking-wider">Event Inspector</span>
            <button onClick={() => { setSelectedEvent(null); setPaused(false) }} className="text-[8px] text-slate-500 hover:text-white flex items-center gap-1"><X className="h-3 w-3" />Resume</button>
          </div>
          <div className="text-[9px] font-mono space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: EVENT_COLORS[selectedEvent.category] }} />
              <span className="text-slate-200 uppercase font-bold">{selectedEvent.category}</span>
              <span className="text-slate-600">|</span>
              <span className={selectedEvent.severity === 'critical' ? 'text-red-400 font-bold' : 'text-slate-400'}>{selectedEvent.severity}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">{formatTimestamp(selectedEvent.timestamp)}</span>
            </div>
            <div>
              <span className="text-[7px] text-slate-500 uppercase">Topic (Event Mesh dynamic routing):</span>
              <div className="mt-0.5">
                {selectedEvent.topic.split('/').map((seg, i, arr) => (
                  <span key={i}>
                    <span className={i === arr.length - 1 ? 'text-[#00c895] font-bold' : i === 0 ? 'text-slate-400' : 'text-slate-300'}>{seg}</span>
                    {i < arr.length - 1 && <span className="text-slate-600">/</span>}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[7px] text-slate-500 uppercase">Payload (delivered to subscribed agents):</span>
              <div className="bg-slate-800/70 rounded p-2 text-slate-300 text-[9px] mt-0.5 border border-slate-700/50">
                {Object.entries(selectedEvent.payload).map(([k, v]) => (
                  <div key={k} className="flex gap-2"><span className="text-slate-500 min-w-[80px]">{k}:</span> <span className="text-white font-medium">{String(v)}</span></div>
                ))}
              </div>
            </div>
            <div className="text-[7px] text-slate-500 mt-1 pt-1 border-t border-slate-800/50">
              <span className="text-[#00c895] font-bold">Agent Mesh subscribers:</span>{' '}
              Orchestrator, {selectedEvent.category === 'iot' ? 'Predictive Analytics, Digital Twin, Safety' : selectedEvent.category === 'logistics' ? 'Logistics, Scheduling, Supplier Mgmt' : selectedEvent.category === 'supplier' ? 'Supplier Mgmt, Scheduling, Quality' : selectedEvent.category === 'mes' ? 'Quality Control, Scheduling, Maintenance' : 'Quality, Maintenance, Safety'}
            </div>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-1.5 py-0.5 scrollbar-thin">
        {displayEvents.map(event => (
          <div key={event.id} onClick={() => { if (!paused) { frozenRef.current = [...events]; setPaused(true) }; setSelectedEvent(event) }} className="cursor-pointer hover:bg-slate-800/30">
            <EventCard event={event} selected={selectedEvent?.id === event.id} />
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
