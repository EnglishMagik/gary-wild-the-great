import React, { useState } from 'react'
import { useBookStore } from '../../store/bookStore'
import './Admin.css'

export default function AdminChapters() {
  const chapters     = useBookStore((s) => s.chapters)
  const addChapter   = useBookStore((s) => s.addChapter)
  const renameChapter = useBookStore((s) => s.renameChapter)
  const deleteChapter = useBookStore((s) => s.deleteChapter)
  const showToast    = useBookStore((s) => s.showToast)

  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const handleAdd = () => {
    const t = newTitle.trim()
    if (!t) { showToast('Please enter a chapter title.'); return }
    addChapter(t)
    setNewTitle('')
    showToast(`Chapter added: "${t}"`)
  }

  const startEdit = (ch) => { setEditingId(ch.id); setEditValue(ch.title) }

  const saveEdit = (id) => {
    const t = editValue.trim()
    if (t) { renameChapter(id, t); showToast('Chapter renamed.') }
    setEditingId(null)
  }

  const handleDelete = (id, title) => {
    if (!window.confirm(`Delete chapter "${title}" and all its pages?`)) return
    deleteChapter(id)
    showToast('Chapter deleted.')
  }

  return (
    <div className="admin-panel">
      <h2 className="admin-panel-title">Chapters</h2>

      {chapters.length === 0 && (
        <p className="admin-empty">No chapters yet. Add one below.</p>
      )}

      <div className="card-list">
        {chapters.map((ch, i) => (
          <div key={ch.id} className="card">
            <div className="card-info">
              <div className="card-label">CHAPTER {i + 1}</div>
              {editingId === ch.id ? (
                <input
                  className="inline-edit"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(ch.id); if (e.key === 'Escape') setEditingId(null) }}
                  autoFocus
                />
              ) : (
                <div className="card-title">{ch.title}</div>
              )}
              <div className="card-meta">{ch.pages.length} page{ch.pages.length !== 1 ? 's' : ''}</div>
            </div>
            <div className="card-actions">
              {editingId === ch.id ? (
                <>
                  <button className="icon-btn" onClick={() => saveEdit(ch.id)}>✓</button>
                  <button className="icon-btn" onClick={() => setEditingId(null)}>✕</button>
                </>
              ) : (
                <>
                  <button className="icon-btn" onClick={() => startEdit(ch)}>✎</button>
                  <button className="icon-btn btn-danger" onClick={() => handleDelete(ch.id, ch.title)}>🗑</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="add-form">
        <h3 className="add-form-title">Add New Chapter</h3>
        <div className="add-form-row">
          <input
            className="form-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="e.g. The Great Escape"
          />
          <button className="btn-primary" onClick={handleAdd}>+ Add Chapter</button>
        </div>
      </div>
    </div>
  )
}
