import React, { useState } from 'react'
import { useBookStore } from '../../store/bookStore'
import './Admin.css'

export default function AdminChapters() {
  const chapters = useBookStore((s) => s.chapters)
  const addChapter = useBookStore((s) => s.addChapter)
  const renameChapter = useBookStore((s) => s.renameChapter)
  const deleteChapter = useBookStore((s) => s.deleteChapter)
  const addPage = useBookStore((s) => s.addPage)
  const showToast = useBookStore((s) => s.showToast)

  const [newTitle, setNewTitle] = useState('')
  const [showPagePanel, setShowPagePanel] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState('')
  const [pageText, setPageText] = useState('')

  const handleAddChapter = () => {
    const t = newTitle.trim()
    if (!t) return showToast('Enter chapter title')
    addChapter(t)
    setNewTitle('')
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

      {/* CHAPTER LIST */}
      <div className="card-list">
        {chapters.map((ch, i) => (
          <div
            key={ch.id}
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem'
            }}
          >

            {/* LEFT */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <strong>CH {i + 1}</strong>
              <span>{ch.title}</span>
            </div>

            {/* RIGHT */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>

              {/* EDIT TITLE */}
              <button
                className="icon-btn"
                onClick={() => {
                  const t = window.prompt('Edit chapter title', ch.title)
                  if (t) renameChapter(ch.id, t)
                }}
              >
                ✎
              </button>

              {/* DELETE */}
              <button
                className="icon-btn"
                onClick={() => deleteChapter(ch.id)}
              >
                🗑
              </button>

              {/* UP */}
              <button onClick={() => moveChapter(i, i - 1)}>↑</button>

              {/* DOWN */}
              <button onClick={() => moveChapter(i, i + 1)}>↓</button>

            </div>
          </div>
        ))}
      </div>

      {/* ADD CHAPTER + PAGE */}
      <div style={{ marginTop: '1.5rem' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button className="btn-primary" onClick={handleAddChapter}>
            + Add Chapter
          </button>

          <button className="btn-primary" onClick={() => setShowPagePanel(!showPagePanel)}>
            + Add New Page
          </button>
        </div>

        {/* PAGE CREATOR */}
        {showPagePanel && (
          <div style={{ marginTop: '1rem' }}>

            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
            >
              <option value="">Select Chapter</option>
              {chapters.map(ch => (
                <option key={ch.id} value={ch.id}>
                  CH {chapters.indexOf(ch) + 1} — {ch.title}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Write page text..."
              value={pageText}
              onChange={(e) => setPageText(e.target.value)}
              style={{ width: '100%', minHeight: 120, marginTop: 10 }}
            />

            <button className="btn-primary" onClick={handleAddPage}>
              Create Page
            </button>

          </div>
        )}

      </div>
    </div>
  )
}