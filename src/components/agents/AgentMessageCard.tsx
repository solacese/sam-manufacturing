'use client'

import { memo } from 'react'
import { AgentMessage, AgentMessageType } from '@/types'
import { AGENT_COLORS, AGENT_NAMES } from '@/lib/constants'
import { cn } from '@/lib/cn'
import { ArrowRight } from 'lucide-react'

const typeLabels: Record<AgentMessageType, string> = { 'event-detected': 'DETECTED', 'task-decomposition': 'DECOMPOSE', 'delegation': 'DELEGATE', 'analysis': 'ANALYSIS', 'action': 'ACTION', 'resolution': 'RESOLVED', 'a2a-request': 'A2A REQ', 'a2a-response': 'A2A RESP' }

const typeBorder: Record<AgentMessageType, string> = {
  'event-detected': 'border-l-red-500',
  'task-decomposition': 'border-l-indigo-500',
  'delegation': 'border-l-violet-500',
  'analysis': 'border-l-cyan-500',
  'action': 'border-l-emerald-500',
  'resolution': 'border-l-[#00c895]',
  'a2a-request': 'border-l-purple-500',
  'a2a-response': 'border-l-teal-500',
}

const typeText: Record<AgentMessageType, string> = {
  'event-detected': 'text-red-400',
  'task-decomposition': 'text-indigo-400',
  'delegation': 'text-violet-400',
  'analysis': 'text-cyan-400',
  'action': 'text-emerald-400',
  'resolution': 'text-[#00c895]',
  'a2a-request': 'text-purple-400',
  'a2a-response': 'text-teal-400',
}

export const AgentMessageCard = memo(function AgentMessageCard({ message, index }: { message: AgentMessage; index: number }) {
  const toName = message.toAgent ? AGENT_NAMES[message.toAgent] : null

  return (
    <div className="relative pl-6 animate-fade-in" style={{ animationDelay: `${index * 20}ms` }}>
      <div
        className="absolute left-[3px] top-1.5 h-[14px] w-[14px] rounded-full flex items-center justify-center text-[6px] font-bold text-white ring-2 ring-[#0b1120] z-10"
        style={{ backgroundColor: AGENT_COLORS[message.fromAgent] }}
      >
        {message.fromAgent[0].toUpperCase()}
      </div>

      <div className={cn(
        'rounded-md border border-slate-700/50 bg-slate-800/40 p-1.5 border-l-2',
        typeBorder[message.type]
      )}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={cn('text-[8px] font-bold uppercase tracking-wider', typeText[message.type])}>
            {typeLabels[message.type]}
          </span>
          {toName && (
            <span className="flex items-center gap-0.5 text-[8px] text-slate-500">
              <ArrowRight className="h-2 w-2" />
              <span className="font-medium" style={{ color: AGENT_COLORS[message.toAgent!] }}>
                {toName.replace(' Agent', '').replace(' Management', '')}
              </span>
            </span>
          )}
          {message.type === 'resolution' && (
            <span className="ml-auto text-[7px] bg-[#00c895]/20 text-[#00c895] rounded px-1 py-0.5 font-bold">DONE</span>
          )}
        </div>
        <p className="text-[9px] text-slate-300 leading-relaxed line-clamp-3">{message.content}</p>
      </div>
    </div>
  )
})
