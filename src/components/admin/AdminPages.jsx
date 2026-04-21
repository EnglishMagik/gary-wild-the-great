import React, { useState } from 'react'
import { useBookStore } from '../../store/bookStore'
import EditPageModal from '../reader/EditPageModal'
import './Admin.css'
// inside src/components/admin/AdminPages.jsx

export default function AdminPages() {
  const chapters = useBookStore((s) => s.chapters)
  const [selectedPage, setSelectedPage] = useState(null)

  return (
    <div className="admin-panel">
      <h2 className="admin-panel-title">Manage Pages</h2>
      
      <div className="card-list">
        {chapters.map(ch => 
          ch.pages.map(pg => (
            <div key={pg.id} className="card">
              <div className="card-info">
                <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>{ch.title}</span>
                <div className="card-preview">
                  {(pg.text || "").substring(0, 80)}...
                </div>
              </div>
              
              <button 
                className="icon-btn" 
                onClick={() => setSelectedPage({ 
                  pageId: pg.id, 
                  chapterId: ch.id, 
                  chapterTitle: ch.title, 
                  text: pg.text 
                })}
              >
                ✎ Edit
              </button>
            </div>
          ))
        )}
      </div>

      {/* 📜 THIS IS THE PARCHMENT MODAL */}
      {selectedPage && (
        <EditPageModal 
          page={selectedPage} 
          onClose={() => setSelectedPage(null)} 
        />
      )}
    </div>
  )
}