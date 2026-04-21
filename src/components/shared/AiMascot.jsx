import React, { useState, useRef } from 'react'
import { useBookStore } from '../../store/bookStore'
import { askMascot } from '../../utils/aiClient'
import './AiMascot.css'

export default function AiMascot() {
  const [open, setOpen]       = useState(false)
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm Wilde, your AI writing companion. Ask me anything about your book." },
  ])
  const historyRef = useRef([])
  const chapters   = useBookStore((s) => s.chapters)
  const title      = useBookStore((s) => s.title)
  const msgsEndRef = useRef(null)

  const bookSummary = `Book: "${title}". Chapters: ${
    chapters.length
      ? chapters.map((c, i) => `Chapter ${i + 1}: "${c.title}" (${c.pages.length} pages)`).join(', ')
      : 'none yet'
  }.`

  const send = async () => {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    historyRef.current.push({ role: 'user', content: q })
    setLoading(true)

    try {
      const reply = await askMascot({ question: q, history: historyRef.current.slice(-10), bookSummary })
      setMessages((m) => [...m, { role: 'assistant', text: reply }])
      historyRef.current.push({ role: 'assistant', content: reply })
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: "I'm having a moment. Try again shortly." }])
    } finally {
      setLoading(false)
      setTimeout(() => msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }

  return (
    <div className="mascot-wrap">
      {open && (
        <div className="mascot-panel">
          <div className="mascot-header">✦ Wilde — AI Assistant</div>
          <div className="mascot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`mascot-msg ${m.role}`}>{m.text}</div>
            ))}
            {loading && <div className="mascot-msg assistant typing">✦ thinking…</div>}
            <div ref={msgsEndRef} />
          </div>
          <div className="mascot-input-row">
            <input
              className="mascot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask me anything…"
            />
            <button className="mascot-send" onClick={send} disabled={loading}>➤</button>
          </div>
        </div>
      )}
      <button className="mascot-btn" onClick={() => setOpen((o) => !o)} title="AI Writing Assistant">
        🦁
      </button>
    </div>
  )
}
