interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface LLMOptions {
  model?: string
  temperature?: number
  maxTokens?: number
}

const BASE_URL = process.env.LLM_URL || process.env.URL || 'https://lite-llm.mymaas.net'
const API_KEY = process.env.LLM_KEY || process.env.KEY || 'sk-Pns7dn9fgQWl5kokhNz43w'

export async function callLLM(messages: Message[], options: LLMOptions = {}): Promise<string> {
  const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: options.model || 'azure-gpt-4o',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens || 4096,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`LLM API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function streamLLM(messages: Message[], options: LLMOptions = {}): Promise<ReadableStream> {
  const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: options.model || 'azure-gpt-4o',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens || 4096,
      stream: true,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`LLM API error ${response.status}: ${err}`)
  }

  return response.body!
}

export function extractJSON(text: string): string {
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlock) return codeBlock[1].trim()

  const trimmed = text.trim()
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) return trimmed

  const arrayMatch = text.match(/\[[\s\S]*\]/)
  if (arrayMatch) return arrayMatch[0]

  const objMatch = text.match(/\{[\s\S]*\}/)
  if (objMatch) return objMatch[0]

  return text
}
