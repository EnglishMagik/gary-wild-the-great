import React, { useState } from 'react'
import { useBookStore } from '../../store/bookStore'
import './Admin.css'

export default function AdminDedication() {
  const dedication    = useBookStore((s) => s.dedication)
  const setDedication = useBookStore((s) => s.setDedication)
  const showToast     = useBookStore((s) => s.showToast)

  const [text, setText] = useState(dedication)

  const save = () => {
    setDedication(text)
    showToast('Dedication saved!')
  }

  return (
    <div className="admin-panel">
      <h2 className="admin-panel-title">Dedication Page</h2>
      <p className="admin-subtitle">
        This appears before Chapter 1. Use it for a dedication, a quote, an inside joke — or all three.
      </p>

      <textarea
        className="dedication-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="For everyone who told me I couldn't do it — you were right, but I did it anyway."
      />

      <div style={{ marginTop: '1rem' }}>
        <button className="btn-primary" onClick={save}>Save Dedication</button>
      </div>
    </div>
  )
}
