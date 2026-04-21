import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'

export default function ChaptersPage() {
  const navigate = useNavigate()
  const chapters = useBookStore((s) => s.chapters)
  const setCurrentPage = useBookStore((s) => s.setCurrentPage)
  const getFlatPages = useBookStore((s) => s.getFlatPages)

  const handleChapterClick = (chapterId) => {
    const allPages = getFlatPages()
    const firstPageIndex = allPages.findIndex((p) => p.chapterId === chapterId)
    if (firstPageIndex !== -1) {
      setCurrentPage(firstPageIndex)
      navigate('/reader')
    }
  }

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

      {/* KEY — no circle, dimensional_key.png, double size */}
      <img
        src="/dimensional_key.png"
        alt="Back to Contents"
        onClick={() => navigate('/contents')}
        style={{
          width: '130px',
          height: 'auto',
          cursor: 'pointer',
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
          transition: 'transform 0.2s, filter 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.filter = 'drop-shadow(0 6px 18px rgba(0,0,0,0.7)) brightness(1.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))'
        }}
      />

      {/* TITLE */}
      <div style={{
        background: 'rgba(210,180,140,0.92)',
        border: '2px solid #4a7c59',
        borderRadius: '3px',
        padding: '3px 2.5rem',
        marginTop: '1rem',
        marginBottom: '1.2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
      }}>
        <h1 style={{
          fontFamily: 'Cinzel, serif',
          color: '#3a1f00',
          fontSize: 'clamp(0.9rem, 2vw, 1.4rem)',
          letterSpacing: '0.15em',
          margin: 0,
          padding: 0,
        }}>
          LIFE CHAPTERS
        </h1>
      </div>

      {/* CHAPTER LIST */}
      <div style={{
        width: '100%',
        maxWidth: '680px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        padding: '0 1rem',
        boxSizing: 'border-box',
      }}>
        {chapters.length === 0 && (
          <p style={{
            textAlign: 'center',
            color: 'rgba(245,234,214,0.6)',
            fontFamily: 'Crimson Text, serif',
            fontStyle: 'italic',
            fontSize: '1.2rem',
          }}>
            No chapters yet.
          </p>
        )}

        {chapters.map((ch, i) => (
          <div
            key={ch.id}
            onClick={() => handleChapterClick(ch.id)}
            style={{
              background: 'rgba(255,255,255,0.92)',
              borderRadius: '3px',
              padding: '4px 1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              borderLeft: '3px solid #4a7c59',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(5px)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontStyle: 'italic',
              fontSize: '0.65rem',
              color: '#3a1f00',
              letterSpacing: '0.2em',
              minWidth: '70px',
              flexShrink: 0,
            }}>
              CHAPTER {i + 1}
            </span>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1rem',
              color: '#1a1208',
              fontStyle: 'italic',
            }}>
              {ch.title}
            </span>
          </div>
        ))}
      </div>

      {/* Hidden gear */}
      <div style={{ marginTop: '5rem' }}>
        <span
          onClick={() => navigate('/admin')}
          style={{
            fontSize: '1.2rem', opacity: 0.25,
            cursor: 'pointer', transition: 'opacity 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.25'}
        >⚙</span>
      </div>
    </div>
  )
}