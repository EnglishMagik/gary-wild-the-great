import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'

export default function DedicationPage() {
  const navigate = useNavigate()
  const dedication = useBookStore((s) => s.dedication)

  const displayText = dedication && dedication.trim()
    ? dedication
    : `Live fully.\nCare deeply.\nShare generously.\nCreate boldly.\nThis life is yours — make it meaningful.`

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundImage: "url('/leathers.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      boxSizing: 'border-box',
    }}>
      {/* OUTER PARCHMENT FRAME */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        aspectRatio: '3 / 4',
        backgroundImage: "url('/Single_page.png')",
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }}>
        {/* INNER CONTENT */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '12%',
          right: '12%',
          bottom: '10%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
        }}>
          {/* IMAGE */}
          <div style={{
            width: '100%',
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            border: '2px solid rgba(139,105,20,0.3)',
          }}>
            <img
              src="/Magicat.jpg"
              alt="Making Life Magic"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* CAPTION */}
          <div style={{
            fontFamily: '"Bradley Hand ITC", "Bradley Hand", cursive',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            color: '#2a1a08',
            textAlign: 'center',
            lineHeight: 1.3,
          }}>
            Making Life Magic
          </div>

          {/* DIVIDER */}
          <div style={{
            width: '60%',
            height: '1px',
            background: 'rgba(90,58,24,0.35)',
          }} />

          {/* DEDICATION TEXT */}
          <div style={{
            fontFamily: '"Bradley Hand ITC", "Bradley Hand", cursive',
            fontStyle: 'italic',
            fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
            color: '#3a2010',
            textAlign: 'center',
            lineHeight: 2,
            whiteSpace: 'pre-line',
          }}>
            {displayText}
          </div>
        </div>

        {/* NAVIGATION — bottom centre */}
        <div style={{
          position: 'absolute',
          bottom: '3%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
        }}>
          <button
            onClick={() => navigate('/contents')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              color: 'rgba(90,58,24,0.5)',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(90,58,24,1)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(90,58,24,0.5)'}
          >
            ← BACK
          </button>
          <button
            onClick={() => navigate('/chapters')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              color: 'rgba(90,58,24,0.5)',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(90,58,24,1)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(90,58,24,0.5)'}
          >
            LIFE CHAPTERS →
          </button>
        </div>
      </div>
    </div>
  )
}