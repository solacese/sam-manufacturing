import { AgentRole, EventCategory, Industry } from '@/types'

export const EVENT_COLORS: Record<EventCategory, string> = {
  iot: '#22d3ee',
  mes: '#a78bfa',
  erp: '#fbbf24',
  agent: '#00c895',
  disruption: '#ef4444',
}

export const EVENT_LABELS: Record<EventCategory, string> = {
  iot: 'IoT Telemetry',
  mes: 'MES',
  erp: 'ERP',
  agent: 'Agent',
  disruption: 'Disruption',
}

export const AGENT_COLORS: Record<AgentRole, string> = {
  orchestrator: '#00c895',
  maintenance: '#ea580c',
  scheduling: '#7c3aed',
  quality: '#0891b2',
  supplier: '#0d9488',
  safety: '#dc2626',
  logistics: '#2563eb',
  'digital-twin': '#db2777',
  predictive: '#059669',
}

export const AGENT_NAMES: Record<AgentRole, string> = {
  orchestrator: 'Orchestrator Agent',
  maintenance: 'Maintenance Agent',
  scheduling: 'Scheduling Agent',
  quality: 'Quality Control Agent',
  supplier: 'Supplier Management Agent',
  safety: 'Safety & Compliance Agent',
  logistics: 'Logistics Agent',
  'digital-twin': 'Digital Twin Agent',
  predictive: 'Predictive Analytics Agent',
}

export const INDUSTRY_LABELS: Record<Industry, string> = {
  aerospace: 'Aerospace & Defense',
  automotive: 'Automotive',
  electronics: 'Electronics & Semiconductors',
  'heavy-machinery': 'Heavy Machinery & Industrial',
  'consumer-goods': 'Consumer Goods & FMCG',
  pharma: 'Pharmaceutical & Biotech',
  energy: 'Energy & Renewables',
  defense: 'Defense & Security',
}

export const PLANTS = [
  { id: 'plant-munich', name: 'Munich Plant', country: 'Germany' },
  { id: 'plant-toulouse', name: 'Toulouse Plant', country: 'France' },
  { id: 'plant-detroit', name: 'Detroit Plant', country: 'USA' },
  { id: 'plant-shanghai', name: 'Shanghai Plant', country: 'China' },
  { id: 'plant-nagoya', name: 'Nagoya Plant', country: 'Japan' },
  { id: 'plant-sao-paulo', name: 'São Paulo Plant', country: 'Brazil' },
]

export const MAX_EVENTS = 200
export const EVENT_INTERVAL_IOT = 400
export const EVENT_INTERVAL_MES = 3000
export const EVENT_INTERVAL_ERP = 7000
