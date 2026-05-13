'use client'

import { useState } from 'react'
import { BookOpen, X } from 'lucide-react'

const steps = [
  { time: '0:00', action: 'Welcome overlay auto-shows — click "Start Demo" or press Enter' },
  { time: '0:10', action: 'Point out the 3 panels: Events (left), Flow (center), Agents (right)' },
  { time: '0:30', action: 'Show the event stream: "Real-time IoT, MES, ERP, Logistics events via MQTT/AMQP/REST"' },
  { time: '0:45', action: 'Click an event to pause and inspect — show the topic hierarchy and agent subscribers' },
  { time: '1:00', action: 'Switch to Supply Chain view — show end-to-end with protocol labels' },
  { time: '1:30', action: 'Switch back to Production Flow — point out OEE metrics updating live' },
  { time: '2:00', action: 'Click "CNC Spindle Failure" — watch flow steps turn red, agents activate' },
  { time: '2:30', action: 'Add 2-3 more disruptions while first is resolving — show parallel coordination' },
  { time: '3:00', action: 'Point out mesh topology (agents lighting up), progress bar, elapsed timer' },
  { time: '3:30', action: 'Wait for resolution — show SAM vs Manual comparison and KPIs' },
  { time: '4:00', action: 'Use AI Generate: type "port congestion delays titanium shipment 3 weeks"' },
  { time: '4:30', action: 'Show Orchestrator Chat — ask "What caused this?" or "How do agents handle it?"' },
  { time: '5:00', action: 'Navigate to Architecture page — walk through the system diagram' },
  { time: '5:30', action: 'Show "Why Solace Agent+Event Mesh?" benefits and Use Cases' },
]

export function DemoScript() {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-slate-500 hover:text-white transition-colors" title="Demo script for presenters">
        <BookOpen className="h-3 w-3" />
      </button>
    )
  }

  return (
    <div className="fixed top-14 right-4 z-40 w-[340px] max-h-[70vh] overflow-y-auto rounded-xl border border-slate-700 bg-[#0f1729] shadow-2xl p-4 animate-fade-in scrollbar-thin">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-[#00c895] uppercase tracking-wider">Presenter Script (5 min)</span>
        <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white"><X className="h-3.5 w-3.5" /></button>
      </div>
      <div className="space-y-2">
        {steps.map((s, i) => (
          <div key={i} className="flex gap-2 text-[9px]">
            <span className="text-[#00c895] font-mono font-bold w-[32px] flex-shrink-0">{s.time}</span>
            <span className="text-slate-300">{s.action}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-slate-800 text-[8px] text-slate-500">
        Tip: Press 1-8 for quick disruptions, Esc to reset, F for fullscreen
      </div>
    </div>
  )
}
