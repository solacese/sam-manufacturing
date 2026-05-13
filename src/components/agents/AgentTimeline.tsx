'use client'

import { AgentMessage } from '@/types'
import { AgentMessageCard } from './AgentMessageCard'
import { useEffect, useRef } from 'react'
import { useSimulationStore } from '@/store/simulation-store'

interface AgentTimelineProps {
  messages: AgentMessage[]
}

export function AgentTimeline({ messages }: AgentTimelineProps) {
  const endRef = useRef<HTMLDivElement>(null)
  const isResolving = useSimulationStore((s) => s.isResolving)

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

      {/* Typing indicator when resolving */}
      {isResolving && (
        <div className="pl-6 animate-fade-in">
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-slate-800/30 border border-slate-700/30 w-fit">
            <div className="flex gap-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00c895] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-[#00c895] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-[#00c895] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[8px] text-slate-500">agents coordinating...</span>
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  )
}
