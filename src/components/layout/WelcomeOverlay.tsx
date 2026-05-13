'use client'

import { useState, useEffect } from 'react'
import { X, Zap, AlertTriangle, MessageCircle, Wand2 } from 'lucide-react'

export function WelcomeOverlay() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('sam-welcome-dismissed')
    if (!dismissed) setShow(true)
  }, [])

  function dismiss() {
    setShow(false)
    sessionStorage.setItem('sam-welcome-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1729] border border-[#00c895]/30 rounded-2xl p-6 max-w-md shadow-2xl shadow-[#00c895]/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #00c895 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#00c895"/>
              <path d="M12 20c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="20" cy="20" r="1.5" fill="white"/>
            </svg>
            <h2 className="text-base font-bold text-white">Solace Agent Mesh Demo</h2>
          </div>
          <button onClick={dismiss} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
        </div>

        <p className="text-[12px] text-slate-300 mb-4 leading-relaxed">
          This demo shows how <span className="text-[#00c895] font-semibold">Solace Agent Mesh</span> coordinates 9 AI agents to detect and resolve manufacturing disruptions in real-time via event-driven A2A protocol.
        </p>

        <div className="space-y-2.5 mb-5">
          <Step icon={<Zap className="h-3.5 w-3.5 text-[#00c895]" />} text="Watch live IoT/MES/ERP events flow through the Solace PubSub+ mesh" />
          <Step icon={<AlertTriangle className="h-3.5 w-3.5 text-red-400" />} text="Inject disruptions — click buttons or describe custom scenarios with AI" />
          <Step icon={<Wand2 className="h-3.5 w-3.5 text-violet-400" />} text="Generate custom manufacturing flows for any industry with AI" />
          <Step icon={<MessageCircle className="h-3.5 w-3.5 text-indigo-400" />} text="Chat with the Orchestrator Agent for real-time insights" />
        </div>

        <button onClick={dismiss} className="w-full rounded-lg bg-[#00c895] hover:bg-[#00ad84] py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98]">
          Start Demo
        </button>
      </div>
    </div>
  )
}

function Step({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <span className="text-[11px] text-slate-400">{text}</span>
    </div>
  )
}
