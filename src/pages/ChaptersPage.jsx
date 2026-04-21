import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'

export default function ChaptersPage() {
  const navigate = useNavigate()
  const chapters = useBookStore((s) => s.chapters)
  const setCurrentPage = useBookStore((s) => s.setCurrentPage)
  const getFlatPages = useBookStore((s) => s.getFlatPages)
  const keyRef = useRef(null)

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

      <style>{`
        @keyframes keyGlow {
          0%   { filter: drop-shadow(0 0 4px rgba(255,220,100,0)) brightness(1); }
          50%  { filter: drop-shadow(0 0 18px rgba(255,220,100,0.9)) drop-shadow(0 0 35px rgba(255,180,50,0.6)) brightness(1.25); }
          100% { filter: drop-shadow(0 0 4px rgba(255,220,100,0)) brightness(1); }
        }

        @keyframes titleFlow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* KEY — glowing, no rectangle */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '0.5rem',
      }}>
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '100px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, transparent 75%)',
          pointerEvents: 'none',
        }} />
        <img
          ref={keyRef}
          src="/dimensional_key.png"
          alt="Back to Contents"
          onClick={() => navigate('/contents')}
          style={{
            width: '130px',
            height: 'auto',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1,
            animation: 'keyGlow 3s ease-in-out infinite',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.12)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      {/* TITLE — living liquid metal */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(270deg, #aaa, #e8e8e8, #fff, #c0c0c0, #888, #e0e0e0, #aaa)',
        backgroundSize: '400% 400%',
        animation: 'titleFlow 4s ease infinite',
        border: '1px solid rgba(180,180,180,0.6)',
        borderRadius: '20px',
        padding: '5px 0.8rem',
        marginTop: '0.5rem',
        marginBottom: '1.2rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)',
      }}>
        <h1 style={{
          fontFamily: 'Cinzel, serif',
          color: '#2a2a2a',
          fontSize: 'clamp(0.9rem, 2vw, 1.4rem)',
          letterSpacing: '0.2em',
          margin: 0,
          padding: 0,
          textShadow: '0 1px 0 rgba(255,255,255,0.7)',
          position: 'relative',
          zIndex: 1,
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
              background: 'rgba(253,248,240,0.85)',
              borderRadius: '3px',
              padding: '6px 1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              border: '1px solid rgba(192,192,192,0.6)',
              borderLeft: '3px solid #888',
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
              color: '#555',
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