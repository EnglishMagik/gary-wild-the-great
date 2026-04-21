import React, { useState } from 'react'
import { useBookStore } from '../../store/bookStore'
import './Admin.css'

export default function AdminPages() {
  const chapters = useBookStore((s) => s.chapters)
  const updatePage = useBookStore((s) => s.updatePage)
  const showToast = useBookStore((s) => s.showToast)

  const [editingPage, setEditingPage] = useState(null)
  const [editText, setEditText] = useState('')

  const handleEdit = (pg, ch) => {
    setEditingPage({ pageId: pg.id, chapterId: ch.id, chapterTitle: ch.title })
    setEditText(pg.text)
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSave = () => {
    if (!editingPage) return
    updatePage(editingPage.chapterId, editingPage.pageId, editText)
    setEditingPage(null)
    setEditText('')
    showToast('Page saved!')
  }

  const handleCancel = () => {
    setEditingPage(null)
    setEditText('')
  }

  // Rich text: wrap selection with tag
  const applyFormat = (tag, style = '') => {
    const textarea = document.getElementById('page-editor')
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = editText.substring(start, end)
    const before = editText.substring(0, start)
    const after = editText.substring(end)
    const wrapped = style
      ? `<span style="${style}">${selected}</span>`
      : `<${tag}>${selected}</${tag}>`
    setEditText(before + wrapped + after)
  }

  const fonts = [
    'Crimson Text', 'Playfair Display', 'Cinzel', 'Bradley Hand ITC',
    'Georgia', 'Times New Roman', 'Palatino', 'Garamond',
    'UnifrakturMaguntia', 'MedievalSharp'
  ]

  return (
    <div className="admin-panel">
      <h2 className="admin-panel-title">Manage Pages</h2>

      {/* ── EDITOR — appears at top when a page is selected ── */}
      {editingPage && (
        <div style={{
          background: '#fffcf5',
          border: '2px solid #c9a84c',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }}>
          {/* Chapter + page info */}
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            color: '#c9a84c',
            marginBottom: '0.75rem',
          }}>
            EDITING — {editingPage.chapterTitle}
          </div>

          {/* TOOLBAR */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            marginBottom: '0.75rem',
            padding: '0.5rem',
            background: '#f0e8d8',
            borderRadius: '4px',
            border: '1px solid #d4c0a0',
          }}>
            {/* Format buttons */}
            <button className="icon-btn" onClick={() => applyFormat('b')} title="Bold">
              <strong>B</strong>
            </button>
            <button className="icon-btn" onClick={() => applyFormat('i')} title="Italic">
              <em>I</em>
            </button>
            <button className="icon-btn" onClick={() => applyFormat('u')} title="Underline"
              style={{ textDecoration: 'underline' }}>
              U
            </button>

            {/* Divider */}
            <div style={{ width: '1px', background: '#c9a84c', margin: '0 0.25rem' }} />

            {/* Font colours */}
            {['#1a1208', '#8b1a1a', '#1a3a8b', '#1a6b1a', '#8b6914'].map(color => (
              <button
                key={color}
                className="icon-btn"
                onClick={() => applyFormat('span', `color:${color}`)}
                title={color}
                style={{
                  background: color,
                  width: '24px',
                  height: '24px',
                  padding: 0,
                  border: '2px solid rgba(0,0,0,0.2)',
                  borderRadius: '3px',
                }}
              />
            ))}

            {/* Divider */}
            <div style={{ width: '1px', background: '#c9a84c', margin: '0 0.25rem' }} />

            {/* Font family selector */}
            <select
              onChange={(e) => {
                if (e.target.value) applyFormat('span', `font-family:${e.target.value}`)
                e.target.value = ''
              }}
              defaultValue=""
              style={{
                padding: '2px 6px',
                border: '1px solid #c9a84c',
                borderRadius: '3px',
                fontFamily: 'Cinzel, serif',
                fontSize: '0.7rem',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="" disabled>Font...</option>
              {fonts.map(f => (
                <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
              ))}
            </select>

            {/* Font size */}
            <select
              onChange={(e) => {
                if (e.target.value) applyFormat('span', `font-size:${e.target.value}`)
                e.target.value = ''
              }}
              defaultValue=""
              style={{
                padding: '2px 6px',
                border: '1px solid #c9a84c',
                borderRadius: '3px',
                fontFamily: 'Cinzel, serif',
                fontSize: '0.7rem',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="" disabled>Size...</option>
              {['0.8rem','0.9rem','1rem','1.1rem','1.2rem','1.4rem','1.6rem','1.8rem','2rem'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* TEXTAREA */}
          <textarea
            id="page-editor"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{
              width: '100%',
              minHeight: '320px',
              padding: '1rem',
              fontFamily: 'Crimson Text, serif',
              fontSize: '1.05rem',
              lineHeight: '1.8',
              color: '#1a1208',
              border: '1px solid #c9a84c',
              borderRadius: '4px',
              background: '#fffef8',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button className="btn-primary" onClick={handleSave}>
              ✓ Save Page
            </button>
            <button
              className="btn-secondary"
              onClick={handleCancel}
              style={{ cursor: 'pointer' }}
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── PAGE LIST ── */}
      <div className="card-list">
        {chapters.map(ch =>
          ch.pages.map(pg => (
            <div key={pg.id} className="card" style={{
              background: editingPage?.pageId === pg.id ? 'rgba(201,168,76,0.08)' : 'white',
              border: editingPage?.pageId === pg.id ? '1px solid #c9a84c' : '1px solid #e0e0e0',
            }}>
              <div className="card-info">
                <span style={{ color: '#c9a84c', fontSize: '0.75rem', fontFamily: 'Cinzel, serif' }}>
                  {ch.title}
                </span>
                <div className="card-preview" style={{ marginTop: '0.25rem' }}>
                  {(pg.text || '').substring(0, 80)}...
                </div>
              </div>
              <button
                className="icon-btn"
                onClick={() => handleEdit(pg, ch)}
                style={{
                  background: editingPage?.pageId === pg.id ? '#c9a84c' : 'white',
                  color: editingPage?.pageId === pg.id ? 'white' : 'inherit',
                }}
              >
                ✎ Edit
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}