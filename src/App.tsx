import { useEffect, useState } from 'react'
import Chat from './components/Chat'
import Analytics from './components/Analytics'
import './styles.css'

export default function App() {
  const [tab, setTab] = useState<'chat' | 'analytics'>('chat')

  useEffect(() => {
    // Démarre une session analytics
    if (!sessionStorage.getItem('session-started')) {
      sessionStorage.setItem('session-started', '1')
      import('./analytics').then(({ track }) => track('sessionStart'))
    }
  }, [])

  return (
    <div className="container">
      <h1>Mini Agent IA – React + TypeScript</h1>
      <div className="tabs">
        <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>Chat</button>
        <button className={tab === 'analytics' ? 'active' : ''} onClick={() => setTab('analytics')}>Analytics</button>
      </div>
      {tab === 'chat' ? <Chat /> : <Analytics />}
      <footer>
        <small>Démo sans clé API. Logique d'intentions côté client + analytics localStorage.</small>
      </footer>
    </div>
  )
}