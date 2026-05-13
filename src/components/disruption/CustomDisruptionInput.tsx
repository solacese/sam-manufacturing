'use client'

import { useState } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { Sparkles, Loader2 } from 'lucide-react'
import { Disruption } from '@/types'

export function CustomDisruptionInput() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const selectedFlow = useSimulationStore((s) => s.selectedFlow)
  const injectDisruption = useSimulationStore((s) => s.injectDisruption)

  async function handleGenerate() {
    if (!prompt.trim() || !selectedFlow || loading) return
    setLoading(true)
    setError('')
    try {
      const flowSummary = {
        category: selectedFlow.category,
        plant: selectedFlow.plant,
        line: selectedFlow.line,
        steps: selectedFlow.steps.map((s, i) => ({ name: s.name, index: i })),
        cycleTime: selectedFlow.cycleTime,
        firstPassYield: selectedFlow.firstPassYield,
      }
      const res = await fetch('/api/generate-disruption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), flow: flowSummary }),
      })
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const disruption: Disruption = await res.json()
      if (!disruption.resolutionScript) disruption.resolutionScript = []
      disruption.id = `dis-ai-${Date.now()}`
      injectDisruption(disruption)
      setPrompt('')
    } catch (err) {
      console.error(err)
      setError('Failed — check connection')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-3 w-3 text-[#00c895]" />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">AI-Powered Disruption</span>
        {error && <span className="text-[9px] text-red-400 ml-2">{error}</span>}
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="Describe any scenario... (e.g. 'sand contamination in the CNC trimming station')" disabled={!selectedFlow || loading}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-[11px] text-slate-200 placeholder:text-slate-500 outline-none focus:border-[#00c895] focus:ring-2 focus:ring-[#00c895]/20 disabled:opacity-40 transition-all" />
        <button onClick={handleGenerate} disabled={!prompt.trim() || !selectedFlow || loading}
          className="flex items-center gap-1.5 rounded-lg bg-[#00c895] hover:bg-[#00ad84] px-4 py-2 text-[10px] font-semibold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-[#00c895]/20">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {loading ? 'Generating...' : 'Generate & Inject'}
        </button>
      </div>
    </div>
  )
}
