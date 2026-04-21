import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'

export default function DedicationPage() {
  const navigate = useNavigate()
  const dedication = useBookStore((s) => s.dedication)

  const displayText = dedication && dedication.trim()
    ? dedication
    : `Live fully.\nCare deeply.\nShare generously.\nCreate boldly.\nThis life is yours — make it meaningful.`;

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundImage: "url('/leather_border.png')",
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '0 2vw', // Keeping sides clear
      boxSizing: 'border-box',
    }}>

      {/* OPEN BOOK */}
      <div style={{
        position: 'relative',
        marginTop: '15vh', // <--- This is the "Wee Nudge" (Changed from 12vh)
        width: 'min(75vw, calc(65vh * 1025 / 571))',
        aspectRatio: '1025 / 571',
      }}>
        <img
          src="/book_pages.png"
          alt="Book"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            display: 'block',
            pointerEvents: 'none',
          }}
        />

        {/* LEFT PAGE — photo, slightly smaller and shifted right */}
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '16%',       
          width: '28%',      
          bottom: '8%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
        }}>
          {/* GOLD FRAME */}
          <div style={{
            width: '100%',
            padding: '6px',
            background: 'linear-gradient(135deg, #8b6914, #c9a84c, #8b6914, #c9a84c)',
            borderRadius: '6px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}>
            <div style={{
              padding: '4px',
              background: '#f5ead6',
              borderRadius: '3px',
            }}>
              <img
                src="/Magicat.jpg"
                alt="Making Life Magic"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>

          {/* CAPTION */}
          <div style={{
            fontFamily: '"Bradley Hand ITC", "Bradley Hand", cursive',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 'clamp(0.65rem, 1.2vw, 1rem)',
            color: '#2a1a08',
            textAlign: 'center',
          }}>
            Making Life Magic
          </div>
        </div>

        {/* RIGHT PAGE — dedication text */}
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '56%',
          width: '33%',
          bottom: '8%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}>
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)',
            color: '#8b6914',
            letterSpacing: '0.3em',
            textAlign: 'center',
          }}>
            ✦ ✦ ✦
          </div>

          <div style={{
            width: '60%',
            height: '1px',
            background: 'rgba(90,58,24,0.35)',
          }} />

          {/* DEDICATION TEXT */}
          <div style={{
            fontFamily: '"Bradley Hand ITC", "Bradley Hand", cursive',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 'clamp(0.7rem, 1.2vw, 1rem)',
            color: '#3a2010',
            textAlign: 'center',
            lineHeight: 2,
            whiteSpace: 'pre-line',
          }}>
            {displayText}
          </div>

          <div style={{
            width: '60%',
            height: '1px',
            background: 'rgba(90,58,24,0.35)',
          }} />

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
              fontSize: 'clamp(0.55rem, 0.9vw, 0.75rem)',
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

          <div
            onClick={() => navigate('/')}
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(0.45rem, 0.7vw, 0.6rem)',
              letterSpacing: '0.15em',
              color: 'rgba(90,58,24,0.35)',
              cursor: 'pointer',
              transition: 'color 0.2s',
              marginTop: '0.25rem',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(90,58,24,0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(90,58,24,0.35)'}
          >
            ← COVER
          </div>
        </div>
      </div>
    </div>
  )
}