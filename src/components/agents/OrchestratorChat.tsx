'use client'

import { useState, useRef, useEffect } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { MessageCircle, Send, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ChatMessage { role: 'user' | 'orchestrator'; content: string }

export function OrchestratorChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedFlow = useSimulationStore((s) => s.selectedFlow)
  const activeDisruptions = useSimulationStore((s) => s.activeDisruptions)
  const agentMessages = useSimulationStore((s) => s.agentMessages)

  useEffect(() => { scrollRef.current && (scrollRef.current.scrollTop = scrollRef.current.scrollHeight) }, [messages.length])

  async function handleSend() {
    if (!input.trim() || loading) return
    const msg = input.trim(); setInput('')
    setMessages(p => [...p, { role: 'user', content: msg }]); setLoading(true)
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg, flow: selectedFlow, disruptions: activeDisruptions, recentMessages: agentMessages.slice(-5) }) })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setMessages(p => [...p, { role: 'orchestrator', content: data.response }])
    } catch { setMessages(p => [...p, { role: 'orchestrator', content: 'Connection interrupted.' }]) }
    finally { setLoading(false) }
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-[#00c895]/40 bg-[#00c895]/10 px-2.5 py-1.5 text-[10px] font-semibold text-[#00c895] hover:bg-[#00c895]/20 transition-all">
      <MessageCircle className="h-3 w-3" />Ask Orchestrator
    </button>
  )

  return (
    <div className="flex flex-col border border-slate-700 rounded-lg bg-slate-900 h-[160px]">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800">
        <span className="text-[9px] font-bold text-slate-300 flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#00c895]" />Orchestrator Chat</span>
        <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300"><X className="h-3 w-3" /></button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 scrollbar-thin">
        {messages.length === 0 && (
          <div className="space-y-1">
            <p className="text-[9px] text-slate-500 italic mb-2">Try asking:</p>
            {(activeDisruptions.length > 0
              ? ['What caused this disruption?', 'How are the agents resolving it?', 'What is the estimated recovery time?']
              : ['What is the current OEE?', 'What if we shut down line 3?', 'Which agents would handle a supplier delay?']
            ).map(q => (
              <button key={q} onClick={() => { setInput(q) }} className="block text-[9px] text-[#00c895]/70 hover:text-[#00c895] transition-colors text-left">
                → {q}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => <div key={i} className="text-[10px] leading-relaxed"><span className={cn('font-bold', m.role === 'user' ? 'text-slate-400' : 'text-[#00c895]')}>{m.role === 'user' ? 'You' : 'Orchestrator'}:</span> <span className="text-slate-300">{m.content}</span></div>)}
        {loading && <div className="text-[9px] text-slate-500 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin text-[#00c895]" />Thinking...</div>}
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 border-t border-slate-800">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask..." className="flex-1 bg-transparent text-[10px] text-slate-200 placeholder:text-slate-600 outline-none" />
        <button onClick={handleSend} disabled={!input.trim() || loading} className="text-[#00c895] disabled:opacity-30"><Send className="h-3 w-3" /></button>
      </div>
    </div>
  )
}
