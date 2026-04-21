import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'

export default function AudioPage() {
  const navigate = useNavigate()
  const mediaLibrary = useBookStore((s) => s.mediaLibrary)
  const audioItems = mediaLibrary.filter((m) =>
    m.type === 'audio' || m.type === 'video' ||
    m.type === 'video-recorded' || m.type === 'youtube' ||
    m.type === 'soundcloud'
  )

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundImage: "url('/leathers.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '1.5rem',
      paddingBottom: '4rem',
      boxSizing: 'border-box',
    }}>

      {/* KEY CIRCLE — back to /contents */}
      <div
        onClick={() => navigate('/contents')}
        style={{
          width: '65px', height: '65px',
          borderRadius: '50%', background: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 3px 12px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s', overflow: 'hidden',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <img src="/gary_book_key.png" alt="Back"
          style={{ width: '90%', height: '90%', objectFit: 'contain' }}
        />
      </div>

      {/* TITLE */}
      <div style={{
        background: 'rgba(210,180,140,0.92)',
        border: '2px solid #4a7c59',
        borderRadius: '3px',
        padding: '3px 2.5rem',
        marginTop: '1rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
      }}>
        <h1 style={{
          fontFamily: 'Cinzel, serif', color: '#3a1f00',
          fontSize: 'clamp(0.9rem, 2vw, 1.4rem)',
          letterSpacing: '0.15em', margin: 0, padding: 0,
        }}>AUDIO FOOTPRINTS</h1>
      </div>

      {audioItems.length === 0 ? (
        <p style={{
          textAlign: 'center', color: 'rgba(245,234,214,0.6)',
          fontFamily: 'Crimson Text, serif', fontStyle: 'italic', fontSize: '1.2rem',
        }}>
          No audio yet. Upload recordings in Admin → Media.
        </p>
      ) : (
        <div style={{
          display: 'flex', flexDirection: 'column',
          gap: '1.2rem', width: '100%', maxWidth: '680px',
        }}>
          {audioItems.map((item) => (
            <div key={item.id} style={{
              background: 'rgba(210,180,140,0.92)',
              borderRadius: '3px', padding: '1rem 1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              borderLeft: '3px solid #4a7c59',
            }}>
              <p style={{
                fontFamily: 'Cinzel, serif', fontSize: '0.8rem',
                color: '#3a1f00', marginBottom: '0.5rem',
              }}>{item.name}</p>
              {item.type === 'audio' && (
                <audio controls src={item.src} style={{ width: '100%' }} />
              )}
              {(item.type === 'video' || item.type === 'video-recorded') && (
                <video controls src={item.src} style={{ width: '100%', borderRadius: '4px' }} />
              )}
              {item.type === 'youtube' && (
                <a href={item.src} target="_blank" rel="noreferrer" style={{ color: '#3a1f00' }}>
                  ▶ Watch on YouTube
                </a>
              )}
              {item.type === 'soundcloud' && (
                <a href={item.src} target="_blank" rel="noreferrer" style={{ color: '#3a1f00' }}>
                  ♫ Listen on SoundCloud
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}