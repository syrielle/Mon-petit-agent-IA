import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import type { Message } from '../types'
import { runAgent } from '../agent'
import { track } from '../analytics'

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const hello: Message = { id: nanoid(), role: 'assistant', content: 'Bienvenue! Posez-moi une question.', ts: Date.now() }
    return [hello]
  })
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    track('tabViewed', { tab: 'chat' })
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text) return
    const userMsg: Message = { id: nanoid(), role: 'user', content: text, ts: Date.now() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    track('userMessage', { len: text.length })

    const reply = await runAgent(text)
    const botMsg: Message = { id: nanoid(), role: 'assistant', content: reply.text, ts: Date.now() }
    setMessages((m) => [...m, botMsg])
    track('assistantMessage')
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') send()
  }

  return (
    <div className="card">
      <div className="card-header">Mini Agent IA (démo)</div>
      <div className="chat-list" ref={listRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`bubble ${msg.role}`}> {msg.content} </div>
        ))}
      </div>
      <div className="input-row">
        <input
          placeholder="Écrire un message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
        />
        <button onClick={send}>Envoyer</button>
      </div>
    </div>
  )
}