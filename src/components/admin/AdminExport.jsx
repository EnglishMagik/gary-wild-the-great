import React from 'react'
import { useBookStore } from '../../store/bookStore'
import { exportAsHTML, exportAsJSON } from '../../utils/exportBook'
import './Admin.css'

export default function AdminExport() {
  const book     = useBookStore()
  const showToast = useBookStore((s) => s.showToast)

  const handleHTML = () => {
    exportAsHTML(book)
    showToast('Book downloaded as HTML!')
  }

  const handleJSON = () => {
    exportAsJSON(book)
    showToast('Book data exported as JSON!')
  }

  return (
    <div className="admin-panel">
      <h2 className="admin-panel-title">Export &amp; Download</h2>
      <p className="admin-subtitle">
        Export your complete book as a self-contained HTML file you can host online, share, or archive locally.
        The JSON export is a full data backup you can reimport later.
      </p>

      <div className="export-card">
        <div className="export-icon">📖</div>
        <h3>Download as HTML</h3>
        <p>A single styled HTML file — open it in any browser or host it online. Includes all text, chapters, and the dedication page.</p>
        <button className="btn-primary" onClick={handleHTML}>⬇ Download HTML</button>
      </div>

      <div className="export-card">
        <div className="export-icon">💾</div>
        <h3>Export Book Data (JSON)</h3>
        <p>A raw JSON backup of all your chapters, pages, and settings. Use this to migrate or back up your work.</p>
        <button className="btn-secondary" onClick={handleJSON}>⬇ Export JSON</button>
      </div>
    </div>
  )
}
