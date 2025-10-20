// Analytics minimalistes: tout en localStorage (pas de backend nécessaire)
// Événements suivis: sessionStart, userMessage, assistantMessage, tabViewed

const KEY = 'mini-agent-analytics'

export type EventName = 'sessionStart' | 'userMessage' | 'assistantMessage' | 'tabViewed'

export interface AnalyticEvent {
  name: EventName
  ts: number
  meta?: Record<string, unknown>
}

export interface AnalyticsState {
  events: AnalyticEvent[]
}

function load(): AnalyticsState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { events: [] }
    return JSON.parse(raw)
  } catch {
    return { events: [] }
  }
}

function save(state: AnalyticsState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function track(name: EventName, meta?: Record<string, unknown>) {
  const state = load()
  state.events.push({ name, ts: Date.now(), meta })
  save(state)
}

export function stats() {
  const s = load()
  const total = s.events.length
  const byName = s.events.reduce<Record<string, number>>((acc, e) => {
    acc[e.name] = (acc[e.name] ?? 0) + 1
    return acc
  }, {})

  // Durée moyenne entre messages user → assistant (approx.)
  const pairs: number[] = []
  for (let i = 0; i < s.events.length - 1; i++) {
    const a = s.events[i]
    const b = s.events[i + 1]
    if (a.name === 'userMessage' && b.name === 'assistantMessage') {
      pairs.push(b.ts - a.ts)
    }
  }
  const avgLatency = pairs.length ? Math.round(pairs.reduce((x, y) => x + y, 0) / pairs.length) : 0

  return { totalEvents: total, byName, avgLatencyMs: avgLatency }
}

export function resetAnalytics() {
  localStorage.removeItem(KEY)
}