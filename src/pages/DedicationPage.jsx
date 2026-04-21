import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'

export default function DedicationPage() {
  const navigate = useNavigate()
  const dedication = useBookStore((s) => s.dedication)

  // Edit your text right here inside the backticks
  const displayText = dedication && dedication.trim()
    ? dedication
    : `Live fully.\nCare deeply.\nShare generously.\nCreate boldly.\nThis life is yours — make it meaningful.`

  const PAD = '5vw' // Slightly increased padding to pull content away from the leather edge

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundImage: "url('/leather_border.png')",
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
    }}>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        padding: PAD,
        gap: '2vw',
        boxSizing: 'border-box',
      }}>

        {/* LEFT HALF — Centered Image Container */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Centers horizontally
          justifyContent: 'center', // Centers vertically
        }}>
          {/* GOLD FRAME — Now smaller (75% width) and centered */}
          <div style={{
            width: '75%', 
            padding: '6px',
            background: 'linear-gradient(135deg, #8b6914, #c9a84c, #8b6914, #c9a84c)',
            borderRadius: '4px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            boxSizing: 'border-box',
          }}>
            <div style={{
              padding: '4px',
              background: '#f5ead6',
              borderRadius: '2px',
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
          </div>

          <div style={{
            fontFamily: '"Bradley Hand ITC", "Bradley Hand", cursive',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 'clamp(0.6rem, 1vw, 0.9rem)', // Smaller sub-text
            color: '#2a1a08',
            textAlign: 'center',
            marginTop: '1rem',
          }}>
            Making Life Magic
          </div>
        </div>

        {/* RIGHT HALF — Smaller, centered text column */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '0.8rem',
          paddingLeft: '2vw' // Gives the text a little "breathing room" from the center
        }}>

          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.6rem',
            color: '#8b6914',
            letterSpacing: '0.3em',
          }}>
            ✦ ✦ ✦
          </div>

          <div style={{
            width: '70%',
            height: '1px',
            background: 'rgba(90,58,24,0.2)',
          }} />

          {/* TEXT — Adjusted to be smaller and more elegant */}
          <div style={{
            fontFamily: '"Bradley Hand ITC", "Bradley Hand", cursive',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 'clamp(0.75rem, 1.2vw, 1rem)', // Reduced font size
            color: '#3a2010',
            textAlign: 'left',
            lineHeight: 1.8,
            whiteSpace: 'pre-line',
          }}>
            {displayText}
          </div>

          <div style={{
            width: '70%',
            height: '1px',
            background: 'rgba(90,58,24,0.2)',
          }} />

          <button
            onClick={() => navigate('/contents')}
            style={{
              marginTop: '0.5rem',
              background: 'linear-gradient(135deg, #c8c8c8 0%, #e8e8e8 40%, #b0b0b0 60%, #d4d4d4 100%)',
              border: '1px solid rgba(180,180,180,0.8)',
              borderRadius: '999px',
              padding: '0.3rem 1.5rem', // Smaller button
              fontFamily: 'Cinzel, serif',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              color: '#2a2a2a',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            ENTER
          </button>
        </div>

      </div>
    </div>
  )
}