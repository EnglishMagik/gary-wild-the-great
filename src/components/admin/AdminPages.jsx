import React, { useState } from 'react'
import { useBookStore } from '../../store/bookStore'
import './Admin.css'

export default function AdminPages() {
  const chapters = useBookStore((s) => s.chapters)
  const updatePage = useBookStore((s) => s.updatePage)
  const showToast = useBookStore((s) => s.showToast)

  const [editingPage, setEditingPage] = useState(null)
  const [editHTML, setEditHTML] = useState('')

  const handleEdit = (pg, ch) => {
    setEditingPage({
      pageId: pg.id,
      chapterId: ch.id,
      chapterTitle: ch.title
    })
    setEditHTML(pg.text || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSave = () => {
    if (!editingPage) return
    updatePage(editingPage.chapterId, editingPage.pageId, editHTML)
    setEditingPage(null)
    setEditHTML('')
    showToast('Page saved!')
  }

  const handleCancel = () => {
    setEditingPage(null)
    setEditHTML('')
  }

  const exec = (command, value = null) => {
    document.execCommand(command, false, value)
    const el = document.getElementById('page-editor')
    if (el) setEditHTML(el.innerHTML)
  }

  const chaptersList = chapters

  return (
    <div className="admin-panel">
      <h2 className="admin-panel-title">Manage Pages</h2>

      {/* EDITOR */}
      {editingPage && (
        <div style={{
          background: '#fffcf5',
          border: '2px solid #c9a84c',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>

          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.75rem',
            color: '#c9a84c',
            marginBottom: '0.8rem'
          }}>
            EDITING — {editingPage.chapterTitle}
          </div>

          {/* TOOLBAR */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            paddingBottom: '0.8rem',
            marginBottom: '1rem',
            borderBottom: '1px solid #ddd'
          }}>

            <button onClick={() => exec('bold')}><b>B</b></button>
            <button onClick={() => exec('italic')}><i>I</i></button>
            <button onClick={() => exec('underline')}>U</button>

            <button onClick={() => exec('insertUnorderedList')}>• List</button>

            <input
              type="color"
              onChange={(e) => exec('foreColor', e.target.value)}
            />

            <select onChange={(e) => exec('fontName', e.target.value)}>
              <option>Calibri</option>
              <option>Georgia</option>
              <option>Playfair Display</option>
              <option>Cinzel</option>
            </select>

            <select onChange={(e) => exec('fontSize', e.target.value)}>
              <option value="3">Normal</option>
              <option value="4">Large</option>
              <option value="5">Larger</option>
              <option value="6">Huge</option>
            </select>

          </div>

          {/* EDITOR */}
          <div
            id="page-editor"
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setEditHTML(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: editHTML }}
            style={{
              minHeight: '320px',
              padding: '1rem',
              border: '1px solid #c9a84c',
              borderRadius: '6px',
              background: '#fffef8',
              fontFamily: 'Calibri, sans-serif',
              outline: 'none'
            }}
          />

          {/* ACTIONS */}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" onClick={handleSave}>
              Save Page
            </button>
            <button className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="card-list">

        {chaptersList.map((ch, i) => (
          <div key={ch.id} style={{ marginBottom: '1.5rem' }}>

            <div style={{
              fontFamily: 'Cinzel, serif',
              color: '#5a3d1a',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              {i + 1}. {ch.title}
            </div>

            {ch.pages.map((pg) => (
              <div key={pg.id} className="card">
                <div className="card-info">
                  <div
                    className="card-preview"
                    dangerouslySetInnerHTML={{
                      __html: (pg.text || '').substring(0, 120)
                    }}
                  />
                </div>

                <button
                  className="icon-btn"
                  onClick={() => handleEdit(pg, ch)}
                >
                  Edit
                </button>
              </div>
            ))}

          </div>
        ))}

      </div>
    </div>
  )
}