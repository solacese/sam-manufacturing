'use client'

import { useState } from 'react'
import { useSimulationStore } from '@/store/simulation-store'
import { Wand2, Loader2 } from 'lucide-react'

export function ScenarioGenerator() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const selectFlow = useSimulationStore((s) => s.selectFlow)

  async function handleGenerate() {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setStatus('Generating production flow...')
    try {
      const res = await fetch('/api/generate-scenario', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ industry: 'custom', companyDescription: prompt.trim() }) })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      if (data.flow) {
        setStatus(`Created: ${data.flow.category} (${data.flow.steps?.length || 0} steps)`)
        selectFlow(data.flow)
      }
      setPrompt('')
      setTimeout(() => setStatus(''), 4000)
    } catch (err) {
      console.error(err)
      setStatus('Failed to generate')
      setTimeout(() => setStatus(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        placeholder="AI: Describe your process... (e.g. 'Tesla battery pack assembly' or 'Pfizer vaccine fill-finish')" disabled={loading}
        className="flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-[11px] text-slate-200 placeholder:text-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-40 transition-all" />
      <button onClick={handleGenerate} disabled={!prompt.trim() || loading}
        className="flex items-center gap-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 px-3 py-1.5 text-[10px] font-semibold text-white transition-all disabled:opacity-30 active:scale-95 shadow-lg shadow-violet-600/20">
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
        {loading ? 'Creating...' : 'AI Scenario'}
      </button>
      {status && <span className="text-[9px] text-violet-300 animate-fade-in whitespace-nowrap">{status}</span>}
    </div>
  )
}
