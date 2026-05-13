'use client'

import { useEffect, useState } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ToastMessage {
  id: string
  type: 'success' | 'alert'
  text: string
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const resolutionComplete = useSimulationStore((s) => s.resolutionComplete)
  const activeDisruptions = useSimulationStore((s) => s.activeDisruptions)
  const isResolving = useSimulationStore((s) => s.isResolving)

  useEffect(() => {
    if (resolutionComplete && activeDisruptions.length > 0) {
      const id = `toast-${Date.now()}`
      setToasts(prev => [...prev, { id, type: 'success', text: `${activeDisruptions.length} disruption${activeDisruptions.length > 1 ? 's' : ''} resolved by Agent Mesh` }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
    }
  }, [resolutionComplete])

  useEffect(() => {
    if (isResolving && activeDisruptions.length > 0) {
      const latest = activeDisruptions[activeDisruptions.length - 1]
      const id = `toast-${Date.now()}`
      setToasts(prev => [...prev, { id, type: 'alert', text: `Detected: ${latest.name}` }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
    }
  }, [activeDisruptions.length])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-16 right-4 z-40 space-y-2">
      {toasts.map(toast => (
        <div key={toast.id} className={cn(
          'flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-medium shadow-lg animate-fade-in backdrop-blur-sm',
          toast.type === 'success' ? 'bg-[#00c895]/10 border-[#00c895]/30 text-[#00c895]' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
          {toast.text}
        </div>
      ))}
    </div>
  )
}
