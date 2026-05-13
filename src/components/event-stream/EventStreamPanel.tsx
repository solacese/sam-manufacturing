'use client'

import { useEffect, useRef, useState } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { EventCard } from './EventCard'
import { EventCategory } from '@/types'
import { Radio } from 'lucide-react'

export function EventStreamPanel() {
  const events = useSimulationStore((s) => s.events)
  const [activeFilters] = useState<Set<EventCategory>>(new Set(['iot', 'mes', 'erp', 'agent', 'disruption']))
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [events.length])

  const filteredEvents = events.filter((e) => activeFilters.has(e.category))

  return (
    <div className="flex h-full flex-col bg-[#080d1a]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800">
        <Radio className="h-3.5 w-3.5 text-[#00c895]" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Event Stream</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin">
        {filteredEvents.slice(-50).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
