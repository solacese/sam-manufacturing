'use client'

import { useState } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { Sparkles, Loader2 } from 'lucide-react'
import { Disruption } from '@/types'

export function CustomDisruptionInput() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const selectedFlow = useSimulationStore((s) => s.selectedFlow)
  const injectDisruption = useSimulationStore((s) => s.injectDisruption)

  async function handleGenerate() {
    if (!prompt.trim() || !selectedFlow || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/generate-disruption', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: prompt.trim(), flow: selectedFlow }) })
      if (!res.ok) throw new Error('Failed')
      const disruption: Disruption = await res.json()
      injectDisruption(disruption)
      setPrompt('')
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <div className="flex items-center gap-2 mb-2">
      <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        placeholder="Describe a disruption... (e.g. 'the paint robot caught fire')" disabled={!selectedFlow || loading}
        className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-[11px] text-slate-200 placeholder:text-slate-500 outline-none focus:border-[#00c895] focus:ring-1 focus:ring-[#00c895]/30 disabled:opacity-40 transition-all" />
      <button onClick={handleGenerate} disabled={!prompt.trim() || !selectedFlow || loading}
        className="flex items-center gap-1.5 rounded-lg bg-[#00c895] hover:bg-[#00ad84] px-3 py-1.5 text-[10px] font-semibold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95">
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
        {loading ? 'Generating...' : 'AI Generate'}
      </button>
    </div>
  )
}
