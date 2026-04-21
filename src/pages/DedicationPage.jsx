import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'

export default function DedicationPage() {
  const navigate = useNavigate()
  const dedication = useBookStore((s) => s.dedication)

  const displayText = dedication && dedication.trim()
    ? dedication
    : `Live fully.\nCare deeply.\nShare generously.\nCreate boldly.\nBe Wild.`

  const PAD = '5vw'

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
      padding: PAD,
    }}>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1200px',
        gap: '3vw',
      }}>

        {/* LEFT — IMAGE PERFECTLY INSIDE FRAME */}
      <div style={{
   width: '40%',
   flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',   // 🔥 THIS moves it left
        justifyContent: 'center',
		paddingLeft: '2vw',
        }}>

        <div style={{
        width: '100%',
        maxWidth: '320px',
            aspectRatio: '1 / 1',
            padding: '8px',
            background: 'linear-gradient(135deg, #8b6914, #c9a84c, #8b6914)',
            borderRadius: '6px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            boxSizing: 'border-box',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              padding: '6px',
              background: '#f5ead6',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}>
              <img
                src="/Magicat.jpg"
                alt="Making Life Magic"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>

          <div style={{
            fontFamily: '"Bradley Hand ITC", "Bradley Hand", cursive',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 'clamp(0.7rem, 1vw, 0.95rem)',
            color: '#2a1a08',
            textAlign: 'center',
            marginTop: '1rem',
          }}>
            Making Life Magic
          </div>
        </div>

        {/* RIGHT — TEXT (UNCHANGED STRUCTURE) */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '0.8rem',
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

          <div style={{
            fontFamily: '"Bradley Hand ITC", "Bradley Hand", cursive',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 'clamp(0.75rem, 1.2vw, 1rem)',
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
              padding: '0.3rem 1.5rem',
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