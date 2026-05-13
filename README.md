# Solace Agent+Event Mesh for Manufacturing

Interactive demonstration of the **Solace Agent+Event Mesh** — showing how real-time event streaming combined with autonomous AI agents can detect and resolve manufacturing disruptions in seconds.

**Live demo:** https://main.d21u736nv508yw.amplifyapp.com

## What It Does

Events flow through the Solace event mesh from IoT sensors, MES, ERP, logistics, and supplier systems. When a disruption is detected, 9 AI agents coordinate autonomously via A2A protocol to resolve it — typically in seconds vs hours of manual coordination.

## Features

**Event Mesh (left panel)**
- Real-time event stream: IoT (MQTT), MES (AMQP), ERP (REST), Logistics, Supplier
- ~25 events/sec with protocol labels
- Click any event to inspect: full topic, payload, subscriber list
- Pause/resume, category filters, sparkline throughput chart

**Production Flow (center)**
- 306 manufacturing flows across 8 industries
- Live OEE metrics with trend arrows (↑↓)
- Flow steps with gauges, status indicators, cascade failure detection
- Supply Chain View toggle: end-to-end Suppliers → Plant → Distribution → Customers

**Agent Mesh (right panel)**
- Animated mesh topology showing 9 agents with A2A connections
- Real-time coordination messages with topic paths
- Progress bar, elapsed timer, agent activity dots
- Resolution KPIs: SAM vs Manual comparison with savings estimate

**AI-Powered (LLM)**
- Custom disruption generation from natural language
- LLM-powered agent resolution (dynamic, not scripted)
- Orchestrator Chat for questions and what-if scenarios
- AI Scenario Generator for custom industry flows

**Presentation Tools**
- Auto Demo: 70-second automated sequence
- Presenter Script: step-by-step guide overlay
- Session Summary: wrap-up stats modal
- Keyboard shortcuts: 1-8 inject, Esc reset, F fullscreen
- Share button, fullscreen mode

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Tech Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- Zustand (state), Lucide React (icons)
- LLM: LiteLLM proxy (azure-gpt-4o)
- Deploy: AWS Amplify

## Environment Variables

```env
URL=https://lite-llm.mymaas.net
KEY=your-litellm-api-key
```

## Architecture

```
src/
├── app/              → Pages (/, /architecture) + 4 API routes
├── components/       → 25 React components
│   ├── agents/       → Agent panel, timeline, chat, topology
│   ├── disruption/   → Event injection, AI generator
│   ├── event-stream/ → Live stream, sparkline, inspector
│   ├── flow/         → Flow viz, supply chain, metrics
│   ├── layout/       → Header, welcome, auto-demo, summary
│   └── ui/           → Toast notifications
├── data/             → 306 flows, agents, disruptions, events
├── hooks/            → Event stream, agent simulation
├── lib/              → LLM client, utilities, constants
├── store/            → Zustand simulation state
└── types/            → TypeScript interfaces
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| 1-8 | Inject supply chain event |
| Esc | Reset / close inspector |
| F | Toggle fullscreen |
| Enter | Dismiss welcome overlay |
