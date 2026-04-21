import React, { useRef } from 'react'
import { useBookStore } from '../../store/bookStore'
import './Admin.css'

const TYPE_ICONS = { image: '🖼', audio: '🎵', video: '🎬', 'video-recorded': '🎬', soundcloud: '🎧', youtube: '📺' }

export default function AdminMedia() {
  const mediaLibrary       = useBookStore((s) => s.mediaLibrary)
  const addToMediaLibrary  = useBookStore((s) => s.addToMediaLibrary)
  const removeFromMediaLibrary = useBookStore((s) => s.removeFromMediaLibrary)
  const showToast          = useBookStore((s) => s.showToast)

  const imageRef = useRef()
  const audioRef = useRef()

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      addToMediaLibrary({ id: `media-${Date.now()}`, type, name: file.name, src: ev.target.result })
      showToast(`${type === 'image' ? 'Image' : 'Audio'} uploaded!`)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleVideoLink = () => {
    const url = window.prompt('Enter YouTube or Vimeo URL:')
    if (url?.trim()) {
      addToMediaLibrary({ id: `media-${Date.now()}`, type: 'youtube', name: 'Video Link', src: url.trim() })
      showToast('Video link added.')
    }
  }

  const handleSoundcloud = () => {
    const url = window.prompt('Enter SoundCloud track URL:')
    if (url?.trim()) {
      addToMediaLibrary({ id: `media-${Date.now()}`, type: 'soundcloud', name: 'SoundCloud Track', src: url.trim() })
      showToast('SoundCloud track added.')
    }
  }

  const handleDelete = (id) => {
    if (!window.confirm('Remove this media item?')) return
    removeFromMediaLibrary(id)
    showToast('Media removed.')
  }

  return (
    <div className="admin-panel">
      <h2 className="admin-panel-title">Media Library</h2>
      <p className="admin-subtitle">Upload images and audio, or link to video and SoundCloud. Media can be attached to pages in the Pages panel.</p>

      {/* Upload actions */}
      <div className="media-upload-grid">
        <div className="media-upload-btn" onClick={() => imageRef.current.click()}>
          <span>🖼</span> Upload Image
          <input ref={imageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'image')} />
        </div>
        <div className="media-upload-btn" onClick={() => audioRef.current.click()}>
          <span>🎵</span> Upload Audio
          <input ref={audioRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'audio')} />
        </div>
        <div className="media-upload-btn" onClick={handleVideoLink}>
          <span>📺</span> Add Video Link
        </div>
        <div className="media-upload-btn" onClick={handleSoundcloud}>
          <span>🎧</span> SoundCloud Link
        </div>
      </div>

      {/* Library grid */}
      {mediaLibrary.length === 0 && (
        <p className="admin-empty">No media yet. Upload something above.</p>
      )}

      <div className="media-library-grid">
        {mediaLibrary.map((m) => (
          <div key={m.id} className="media-card">
            <div className="media-card-icon">{TYPE_ICONS[m.type] ?? '📎'}</div>
            {m.type === 'image' && (
              <img src={m.src} alt={m.name} className="media-card-thumb" />
            )}
            {m.type === 'audio' && (
              <audio controls src={m.src} style={{ width: '100%', marginTop: '0.5rem' }} />
            )}
            <div className="media-card-name">{m.name}</div>
            <button className="btn-danger" onClick={() => handleDelete(m.id)}>✕ Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}
