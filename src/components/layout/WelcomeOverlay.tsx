'use client'

import { useState, useEffect } from 'react'
import { X, Zap, Globe, AlertTriangle, MessageCircle, Wand2, Radio } from 'lucide-react'

export function WelcomeOverlay() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('sam-welcome-dismissed')
    if (!dismissed) setShow(true)
  }, [])

  useEffect(() => {
    if (!show) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter' || e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [show])

  function dismiss() {
    setShow(false)
    sessionStorage.setItem('sam-welcome-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1729] border border-[#00c895]/30 rounded-2xl p-6 max-w-lg shadow-2xl shadow-[#00c895]/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #00c895 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#00c895"/>
                <path d="M12 20c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M16 20c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="20" cy="20" r="1.5" fill="white"/>
              </svg>
              <div>
                <h2 className="text-base font-bold text-white">Solace Agent Mesh</h2>
                <p className="text-[9px] text-slate-400">AI Agents Coordinating on the Solace Platform</p>
              </div>
            </div>
            <button onClick={dismiss} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
          </div>

          <p className="text-[12px] text-slate-300 mb-4 leading-relaxed">
            <span className="text-[#00c895] font-semibold">Solace Agent Mesh</span> enables teams of AI agents to autonomously detect and resolve manufacturing disruptions in real-time — communicating via events on the Solace Platform.
          </p>

          <div className="space-y-2.5 mb-5">
            <Step icon={<Zap className="h-3.5 w-3.5 text-[#00c895]" />} text="9 AI agents coordinate autonomously via A2A protocol on the Solace Platform" />
            <Step icon={<Globe className="h-3.5 w-3.5 text-cyan-400" />} text="Real-time events from IoT, MES, ERP, logistics — all flowing through the mesh" />
            <Step icon={<AlertTriangle className="h-3.5 w-3.5 text-red-400" />} text="Inject supply chain events — disruptions, demand spikes, logistics delays" />
            <Step icon={<Radio className="h-3.5 w-3.5 text-amber-400" />} text="Watch agents detect, decompose, delegate, and resolve in seconds" />
            <Step icon={<Wand2 className="h-3.5 w-3.5 text-violet-400" />} text="AI-powered: generate custom scenarios and chat with the Orchestrator" />
          </div>

          <button onClick={dismiss} className="w-full rounded-lg bg-[#00c895] hover:bg-[#00ad84] py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98]">
            Start Demo
          </button>
          <p className="text-[9px] text-slate-500 text-center mt-2">Press Enter to start</p>
        </div>
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
