import { useEffect, useMemo, useState } from 'react'
import { resetAnalytics, stats, track } from '../analytics'

export default function Analytics() {
  const [data, setData] = useState(stats())

  useEffect(() => {
    track('tabViewed', { tab: 'analytics' })
    const t = setInterval(() => setData(stats()), 1000)
    return () => clearInterval(t)
  }, [])

  const byNameList = useMemo(() => Object.entries(data.byName), [data])

  return (
    <div className="card">
      <div className="card-header">Analytics (local)</div>
      <div className="stats">
        <div><strong>Événements totaux :</strong> {data.totalEvents}</div>
        <div><strong>Latence moyenne (user → assistant) :</strong> {data.avgLatencyMs} ms</div>
        <ul>
          {byNameList.map(([k, v]) => (
            <li key={k}><strong>{k}</strong> : {v}</li>
          ))}
        </ul>
        <button onClick={() => { resetAnalytics(); setData(stats()) }}>Réinitialiser</button>
      </div>
    </div>
  )
}