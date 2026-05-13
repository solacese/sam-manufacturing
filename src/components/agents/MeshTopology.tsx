'use client'

import { AGENT_COLORS } from '@/lib/constants'
import { AgentRole } from '@/types'

const nodes: { role: AgentRole; x: number; y: number }[] = [
  { role: 'orchestrator', x: 50, y: 20 },
  { role: 'maintenance', x: 20, y: 45 },
  { role: 'scheduling', x: 80, y: 45 },
  { role: 'quality', x: 10, y: 75 },
  { role: 'supplier', x: 35, y: 75 },
  { role: 'safety', x: 60, y: 75 },
  { role: 'logistics', x: 85, y: 75 },
  { role: 'digital-twin', x: 25, y: 95 },
  { role: 'predictive', x: 70, y: 95 },
]

const connections: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [1, 3], [1, 7], [2, 5], [2, 6], [3, 4], [5, 8], [6, 8], [7, 8],
]

export function MeshTopology({ active, activeAgents = [] }: { active: boolean; activeAgents?: AgentRole[] }) {
  const activeSet = new Set(activeAgents)
  return (
    <svg viewBox="0 0 100 100" className="w-full h-[90px]" preserveAspectRatio="xMidYMid meet">
      {/* Connections */}
      {connections.map(([from, to], i) => (
        <line
          key={i}
          x1={nodes[from].x} y1={nodes[from].y}
          x2={nodes[to].x} y2={nodes[to].y}
          stroke={active ? '#00c895' : '#334155'}
          strokeWidth="0.4"
          opacity={active ? 0.6 : 0.3}
          strokeDasharray={active ? '2 2' : undefined}
        >
          {active && (
            <animate attributeName="stroke-dashoffset" from="0" to="-4" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
          )}
        </line>
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const isNodeActive = activeSet.has(node.role)
        return (
        <g key={node.role}>
          {(active || isNodeActive) && (
            <circle cx={node.x} cy={node.y} r="4" fill={AGENT_COLORS[node.role]} opacity="0.2">
              <animate attributeName="r" values="3;6;3" dur={`${1.5 + i * 0.1}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${1.5 + i * 0.1}s`} repeatCount="indefinite" />
            </circle>
          )}
          <circle
            cx={node.x} cy={node.y} r={isNodeActive ? 3 : 2.5}
            fill={AGENT_COLORS[node.role]}
            stroke={isNodeActive ? '#fff' : active ? '#fff' : '#1e293b'}
            strokeWidth={isNodeActive ? 0.8 : 0.5}
          />
          <text x={node.x} y={node.y + 7} textAnchor="middle" fontSize="3" fill="#94a3b8" fontFamily="sans-serif">
            {node.role === 'orchestrator' ? 'ORCH' : node.role === 'digital-twin' ? 'TWIN' : node.role.slice(0, 4).toUpperCase()}
          </text>
        </g>
        )
      })}

      {/* Data packets flowing along connections when active */}
      {active && connections.slice(0, 6).map(([from, to], i) => (
        <circle key={`pkt-${i}`} r="1" fill="#00c895">
          <animateMotion
            dur={`${2 + i * 0.3}s`}
            repeatCount="indefinite"
            path={`M${nodes[from].x},${nodes[from].y} L${nodes[to].x},${nodes[to].y}`}
          />
        </circle>
      ))}
    </svg>
  )
}
