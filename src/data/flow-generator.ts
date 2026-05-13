import { ManufacturingFlow, FlowStep, Industry } from '@/types'
import { flowTemplates } from './flow-templates'
import { PLANTS } from '@/lib/constants'

interface FlowVariant {
  plantIdx: number
  lineNumber: number
  yieldOffset: number
  cycleOffset: number
  suffix: string
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function generateVariants(templateIdx: number, count: number): FlowVariant[] {
  const rand = seededRandom(templateIdx * 1000)
  const variants: FlowVariant[] = []
  const suffixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta']

  for (let i = 0; i < count; i++) {
    variants.push({
      plantIdx: Math.floor(rand() * PLANTS.length),
      lineNumber: Math.floor(rand() * 8) + 1,
      yieldOffset: (rand() - 0.5) * 4,
      cycleOffset: (rand() - 0.5) * 0.3,
      suffix: suffixes[i],
    })
  }
  return variants
}

function buildFlow(
  templateIdx: number,
  template: typeof flowTemplates[number],
  variant: FlowVariant,
  variantIdx: number
): ManufacturingFlow {
  const plant = PLANTS[variant.plantIdx]
  const rand = seededRandom(templateIdx * 100 + variantIdx)

  const baseCycle = template.cycleTimeRange[0] +
    (template.cycleTimeRange[1] - template.cycleTimeRange[0]) * (0.5 + variant.cycleOffset)
  const baseYield = template.yieldRange[0] +
    (template.yieldRange[1] - template.yieldRange[0]) * 0.5 + variant.yieldOffset

  const steps: FlowStep[] = template.baseSteps.map((step, i) => {
    const stepDuration = baseCycle / template.baseSteps.length
    return {
      id: `step-${templateIdx}-${variantIdx}-${i}`,
      name: step.name,
      description: step.description,
      duration: formatDuration(stepDuration),
      status: 'running' as const,
      metrics: generateStepMetrics(step.type, rand),
    }
  })

  const taktTime = baseCycle * (0.9 + rand() * 0.2)

  return {
    id: `flow-${templateIdx}-${variantIdx}`,
    name: `${template.category} — ${variant.suffix}`,
    industry: template.industry,
    category: template.category,
    plant: plant.id,
    line: `line-${variant.lineNumber}`,
    steps,
    cycleTime: formatDuration(baseCycle),
    taktTime: formatDuration(taktTime),
    firstPassYield: Math.min(99.9, Math.max(60, baseYield)),
  }
}

function formatDuration(minutes: number): string {
  if (minutes < 1) return `${(minutes * 60).toFixed(1)}s`
  if (minutes < 60) return `${minutes.toFixed(1)} min`
  if (minutes < 1440) return `${(minutes / 60).toFixed(1)} hr`
  return `${(minutes / 1440).toFixed(1)} days`
}

function generateStepMetrics(type: string, rand: () => number): Record<string, number> {
  switch (type) {
    case 'thermal':
      return { temperature: Math.round(120 + rand() * 200), pressure: +(1 + rand() * 6).toFixed(1) }
    case 'machining':
      return { spindleRpm: Math.round(2000 + rand() * 18000), feedRate: Math.round(50 + rand() * 450) }
    case 'processing':
      return { throughput: Math.round(10 + rand() * 990), efficiency: Math.round(85 + rand() * 14) }
    case 'assembly':
      return { torque: +(5 + rand() * 95).toFixed(1), cycleCount: Math.round(rand() * 50000) }
    case 'quality':
      return { passRate: +(94 + rand() * 5.9).toFixed(1), defectPpm: Math.round(rand() * 500) }
    case 'finishing':
      return { thickness: +(10 + rand() * 90).toFixed(1), roughness: +(0.1 + rand() * 2.9).toFixed(2) }
    default:
      return { throughput: Math.round(10 + rand() * 990) }
  }
}

function getVariantCount(industry: Industry, templateIdx: number): number {
  const counts: Record<Industry, number[]> = {
    aerospace: [6, 6, 6, 6, 6, 6],
    automotive: [6, 6, 6, 6, 6, 6],
    electronics: [6, 6, 6, 6, 6],
    'heavy-machinery': [6, 6, 6, 6, 6],
    'consumer-goods': [6, 6, 6, 6, 6],
    pharma: [6, 6, 6, 6],
    energy: [6, 6, 6, 6],
    defense: [6, 6, 6, 6, 6, 6],
  }
  const arr = counts[industry]
  return arr ? arr[templateIdx % arr.length] || 5 : 5
}

let _allFlows: ManufacturingFlow[] | null = null

export function getAllFlows(): ManufacturingFlow[] {
  if (_allFlows) return _allFlows

  const flows: ManufacturingFlow[] = []
  let industryTemplateIdx = 0

  for (let t = 0; t < flowTemplates.length; t++) {
    const template = flowTemplates[t]
    const count = getVariantCount(template.industry, industryTemplateIdx)
    const variants = generateVariants(t, count)

    for (let v = 0; v < variants.length; v++) {
      flows.push(buildFlow(t, template, variants[v], v))
    }

    if (t < flowTemplates.length - 1 && flowTemplates[t + 1].industry !== template.industry) {
      industryTemplateIdx = 0
    } else {
      industryTemplateIdx++
    }
  }

  _allFlows = flows
  return flows
}

export function getFlowsByIndustry(): Record<Industry, ManufacturingFlow[]> {
  const flows = getAllFlows()
  const grouped: Record<string, ManufacturingFlow[]> = {}

  for (const flow of flows) {
    if (!grouped[flow.industry]) grouped[flow.industry] = []
    grouped[flow.industry].push(flow)
  }

  return grouped as Record<Industry, ManufacturingFlow[]>
}
