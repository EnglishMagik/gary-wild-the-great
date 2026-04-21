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
          top: '8%',
          left: '12%',
          right: '12%',
          bottom: '12%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.2rem',
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
              style={{ width: '100%', height: 'auto', display: 'block' }}
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

          {/* ENTER BUTTON */}
          <button
            onClick={() => navigate('/contents')}
            style={{
              marginTop: '0.5rem',
              background: 'linear-gradient(135deg, #c8c8c8 0%, #e8e8e8 40%, #b0b0b0 60%, #d4d4d4 100%)',
              border: '1px solid rgba(180,180,180,0.8)',
              borderRadius: '999px',
              padding: '0.4rem 2rem',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              color: '#2a2a2a',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.06)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)'
            }}
          >
            ENTER
          </button>

        </div>

        {/* SUBTLE BACK LINK — bottom left, barely visible */}
        <div
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            bottom: '3%',
            left: '8%',
            fontFamily: 'Cinzel, serif',
            fontSize: '0.55rem',
            letterSpacing: '0.15em',
            color: 'rgba(90,58,24,0.35)',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(90,58,24,0.8)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(90,58,24,0.35)'}
        >
          ← COVER
        </div>

      </div>
    </div>
  )
}