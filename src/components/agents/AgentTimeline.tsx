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
    <div className="space-y-2 pb-2">
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-cyan-500/30 to-transparent" />
        <div className="space-y-2">
          {messages.map((msg, idx) => (
            <AgentMessageCard key={msg.id} message={msg} index={idx} />
          ))}
        </div>
      </div>
      <div ref={endRef} />
    </div>
  )
}
