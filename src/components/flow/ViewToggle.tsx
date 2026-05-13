'use client'

import { cn } from '@/lib/cn'
import { Factory, Globe } from 'lucide-react'

interface ViewToggleProps {
  view: 'production' | 'supply-chain'
  onChange: (view: 'production' | 'supply-chain') => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-slate-800/60 border border-slate-700/50 p-0.5">
      <button
        onClick={() => onChange('production')}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all',
          view === 'production' ? 'bg-[#00c895]/20 text-[#00c895] border border-[#00c895]/30' : 'text-slate-400 hover:text-slate-200'
        )}
      >
        <Factory className="h-3 w-3" />Production Flow
      </button>
      <button
        onClick={() => onChange('supply-chain')}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all',
          view === 'supply-chain' ? 'bg-[#00c895]/20 text-[#00c895] border border-[#00c895]/30' : 'text-slate-400 hover:text-slate-200'
        )}
      >
        <Globe className="h-3 w-3" />Supply Chain
      </button>
    </div>
  )
}
