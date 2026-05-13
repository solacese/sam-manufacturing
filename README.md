# Solace Agent Mesh — Manufacturing Intelligence Demo

An interactive demonstration of **Solace Agent Mesh (SAM)** for manufacturing operations. Shows how event-driven AI agents detect disruptions in real-time and coordinate complex multi-agent resolutions across the production floor.

**Target audience:** Airbus, automotive OEMs, heavy industry, and any manufacturing company evaluating event-driven agent architectures.

## Features

- **306 Manufacturing Flows** across 8 industries (Aerospace, Automotive, Electronics, Heavy Machinery, Consumer Goods, Pharma, Energy, Defense)
- **Live Solace Event Stream** — simulated IoT telemetry, MES events, and ERP signals with realistic topic paths
- **Disruption Injection** — trigger machine breakdowns, supply chain failures, quality excursions, environmental incidents, and personnel gaps
- **Multi-Agent Resolution** — watch 9 specialized AI agents (Orchestrator, Maintenance, Scheduling, Quality, Supplier, Safety, Logistics, Digital Twin, Predictive) coordinate via A2A protocol
- **Resolution KPIs** — time-to-detect, time-to-resolve, cost impact, production recovery metrics

## Manufacturing Terminology

The demo uses authentic industry terms: MES, OEE, SCADA, PLC, IoT Gateway, Digital Twin, SPC, FMEA, CAPA, CMMS, NDI, Cpk, Takt Time, Cycle Time, First Pass Yield, BOM, Kanban, JIT, LOTO, NCR, and more.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — best viewed at 1920x1080 or wider.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Zustand (state management)
- Framer Motion (animations)
- Lucide React (icons)

## Architecture

All Solace events and agent behaviors are **simulated client-side** — no broker connection required. The demo runs as a static site and can be deployed anywhere.

```
src/
├── app/           → Next.js pages and layout
├── components/    → UI components (event-stream, flow, disruption, agents)
├── data/          → 306 flow templates, agents, disruption scenarios
├── hooks/         → Event stream, agent simulation hooks
├── lib/           → Utilities, constants
├── store/         → Zustand simulation state
└── types/         → TypeScript interfaces
```

## How It Works

1. Select a manufacturing flow from any industry
2. Watch live Solace events stream on the left panel
3. Inject a disruption (e.g., "CNC Spindle Failure")
4. The Orchestrator Agent detects, decomposes, and delegates to specialized agents
5. Watch real-time A2A protocol messages as agents resolve the issue
6. Review resolution KPIs when complete

## Deploy

```bash
npm run build    # Static export
```

Deploy the `.next` output to Vercel, Netlify, or any static host.
