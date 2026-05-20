import React, { useState } from 'react'
import { useBookStore } from '../../store/bookStore'
import './Admin.css'

export default function AdminChapters() {
  const chapters      = useBookStore((s) => s.chapters)
  const addChapter    = useBookStore((s) => s.addChapter)
  const renameChapter = useBookStore((s) => s.renameChapter)
  const deleteChapter = useBookStore((s) => s.deleteChapter)
  const addPage       = useBookStore((s) => s.addPage)
  const showToast     = useBookStore((s) => s.showToast)

  const [showChapterInput, setShowChapterInput] = useState(false)
  const [newTitle, setNewTitle]                 = useState('')
  const [showPagePanel, setShowPagePanel]       = useState(false)
  const [selectedChapter, setSelectedChapter]   = useState('')
  const [pageText, setPageText]                 = useState('')

  const handleAddChapter = () => {
    const t = newTitle.trim()
    if (!t) return showToast('Enter chapter title')
    addChapter(t)
    setNewTitle('')
    setShowChapterInput(false)
    showToast('Chapter added')
  }

  const handleAddPage = () => {
    if (!selectedChapter || !pageText.trim()) {
      return showToast('Select chapter + write text')
    }
    addPage(selectedChapter, pageText)
    setPageText('')
    setSelectedChapter('')
    setShowPagePanel(false)
    showToast('Page added')
  }

  const moveChapter = (from, to) => {
    const copy = [...chapters]
    if (to < 0 || to >= copy.length) return
    const temp = copy[to]
    copy[to] = copy[from]
    copy[from] = temp
    useBookStore.setState({ chapters: copy })
  }

  return (
    <div className="admin-panel" style={{ fontFamily: 'Calibri, Arial, sans-serif' }}>

      <h2 className="admin-panel-title">Chapters</h2>

      {/* ── TOP ACTION ROW: + Chapter and + Page side by side ── */}
      <div className="top-action-row">
        <button className="btn-half" onClick={() => { setShowChapterInput((v) => !v); setShowPagePanel(false) }}>
          + Chapter
        </button>
        <button className="btn-half btn-secondary-half" onClick={() => { setShowPagePanel((v) => !v); setShowChapterInput(false) }}>
          + Page
        </button>
      </div>

      {/* ── INLINE CHAPTER INPUT ── */}
      {showChapterInput && (
        <div className="add-form-row" style={{ marginBottom: '1rem' }}>
          <input
            className="form-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddChapter()}
            placeholder="Chapter title..."
            autoFocus
          />
          <button className="btn-primary" onClick={handleAddChapter}>Add</button>
        </div>
      )}

      {/* ── INLINE PAGE INPUT ── */}
      {showPagePanel && (
        <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <select
            className="form-input"
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
          >
            <option value="">Select Chapter</option>
            {chapters.map((ch, i) => (
              <option key={ch.id} value={ch.id}>CH {i + 1} — {ch.title}</option>
            ))}
          </select>
          <textarea
            placeholder="Write page text..."
            value={pageText}
            onChange={(e) => setPageText(e.target.value)}
            style={{ width: '100%', minHeight: 100, padding: '0.5rem', fontFamily: 'Calibri, sans-serif', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
          />
          <button className="btn-primary" onClick={handleAddPage}>Create Page</button>
        </div>
      )}

      {chapters.length === 0 && (
        <p className="admin-empty">No chapters yet. Tap + Chapter above.</p>
      )}

      {/* ── CHAPTER CARDS — 2 row layout ── */}
      <div className="card-list">
        {chapters.map((ch, i) => (
          <div key={ch.id} className="card card-stacked">

            {/* ROW 1: CH number + title */}
            <div className="card-top-row">
              <span className="card-label-inline">CH {i + 1}</span>
              <span className="card-title-inline">{ch.title}</span>
            </div>

            {/* ROW 2: page count + action buttons */}
            <div className="card-bottom-row">
              <span className="card-meta">
                {ch.pages.length} page{ch.pages.length !== 1 ? 's' : ''}
              </span>
              <div className="card-actions">
                <button
                  className="icon-btn"
                  onClick={() => {
                    const t = window.prompt('Edit chapter title', ch.title)
                    if (t) renameChapter(ch.id, t)
                  }}
                >✎</button>
                <button className="icon-btn" onClick={() => deleteChapter(ch.id)}>🗑</button>
                <button className="icon-btn" onClick={() => moveChapter(i, i - 1)}>↑</button>
                <button className="icon-btn" onClick={() => moveChapter(i, i + 1)}>↓</button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}
