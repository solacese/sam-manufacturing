'use client'

import { AgentMessage, AgentMessageType, AgentRole } from '@/types'
import { AGENT_COLORS, AGENT_NAMES } from '@/lib/constants'
import { cn } from '@/lib/cn'
import { ArrowRight } from 'lucide-react'

const typeLabels: Record<AgentMessageType, string> = { 'event-detected': 'DETECTED', 'task-decomposition': 'DECOMPOSE', 'delegation': 'DELEGATE', 'analysis': 'ANALYSIS', 'action': 'ACTION', 'resolution': 'RESOLVED', 'a2a-request': 'A2A REQ', 'a2a-response': 'A2A RESP' }
const typeColors: Record<AgentMessageType, string> = { 'event-detected': 'text-red-400 border-red-500/30 bg-red-500/5', 'task-decomposition': 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5', 'delegation': 'text-violet-400 border-violet-500/30 bg-violet-500/5', 'analysis': 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5', 'action': 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5', 'resolution': 'text-[#00c895] border-[#00c895]/40 bg-[#00c895]/5', 'a2a-request': 'text-purple-400 border-purple-500/30 bg-purple-500/5', 'a2a-response': 'text-teal-400 border-teal-500/30 bg-teal-500/5' }

export function AgentMessageCard({ message, index }: { message: AgentMessage; index: number }) {
  const toName = message.toAgent ? AGENT_NAMES[message.toAgent] : null
  return (
    <div className="relative pl-6 animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
      <div className="absolute left-0.5 top-1 h-4 w-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white ring-1 ring-slate-900" style={{ backgroundColor: AGENT_COLORS[message.fromAgent] }}>
        {message.fromAgent[0].toUpperCase()}
      </div>
      <div className={cn('rounded-md border p-1.5', typeColors[message.type])}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[8px] font-bold uppercase tracking-wider">{typeLabels[message.type]}</span>
          {toName && <span className="flex items-center gap-0.5 text-[8px] text-slate-500"><ArrowRight className="h-2 w-2" /><span style={{ color: AGENT_COLORS[message.toAgent!] }}>{toName.replace(' Agent', '')}</span></span>}
        </div>
        <p className="text-[9px] text-slate-300 leading-relaxed line-clamp-3">{message.content}</p>
      </div>
    </div>
  )
}
