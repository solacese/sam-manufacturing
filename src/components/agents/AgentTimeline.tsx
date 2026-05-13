'use client'

import { AgentMessage } from '@/types'
import { AgentMessageCard } from './AgentMessageCard'
import { useEffect, useRef } from 'react'

interface AgentTimelineProps {
  messages: AgentMessage[]
}

export function AgentTimeline({ messages }: AgentTimelineProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="space-y-1.5 pb-2">
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[9px] top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-[#00c895]/60 via-[#00c895]/30 to-transparent" />

        <div className="space-y-1.5">
          {messages.map((msg, idx) => (
            <AgentMessageCard key={msg.id} message={msg} index={idx} />
          ))}
        </div>
      </div>
      <div ref={endRef} />
    </div>
  )
}
