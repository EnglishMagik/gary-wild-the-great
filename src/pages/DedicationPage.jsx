import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'

export default function DedicationPage() {
  const navigate = useNavigate()
  const dedication = useBookStore((s) => s.dedication)

  const displayText = dedication && dedication.trim()
    ? dedication
    : `Live fully.\nCare deeply.\nShare generously.\nCreate boldly.\nThis life is yours — make it meaningful.`

  // This is our universal spacing unit — every gap in the layout uses this
  const PAD = '4vw'

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

      {/* 
        INNER CONTENT AREA
        We use padding equal to PAD on all sides so the content
        never touches the leather frame edges.
        The two halves sit side by side with a gap also equal to PAD.
      */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        padding: `${PAD} ${PAD} ${PAD} ${PAD}`,
        gap: PAD,
        boxSizing: 'border-box',
      }}>

        {/* LEFT HALF — photo in gold frame, equal space on all 4 sides */}
        <div style={{
          flex: '0 0 auto',
          width: `calc(50% - (${PAD} * 1.5))`,
          height: `calc(100vh - (${PAD} * 2))`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* GOLD FRAME — fills the left half with equal padding all around */}
          <div style={{
            width: '100%',
            padding: '7px',
            background: 'linear-gradient(135deg, #8b6914, #c9a84c, #8b6914, #c9a84c)',
            borderRadius: '6px',
            boxShadow: '0 6px 24px rgba(0,0,0,0.45)',
            boxSizing: 'border-box',
          }}>
            <div style={{
              padding: '5px',
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

          <div style={{
            fontFamily: '"Bradley Hand ITC", "Bradley Hand", cursive',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 'clamp(0.7rem, 1.2vw, 1rem)',
            color: '#2a1a08',
            textAlign: 'center',
            marginTop: '0.5rem',
          }}>
            Making Life Magic
          </div>
        </div>

        {/* RIGHT HALF — dedication text, left-aligned */}
        <div style={{
          flex: 1,
          height: `calc(100vh - (${PAD} * 2))`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',   // left-aligns all children
          justifyContent: 'center',
          gap: '1rem',
        }}>

          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)',
            color: '#8b6914',
            letterSpacing: '0.3em',
          }}>
            ✦ ✦ ✦
          </div>

          <div style={{
            width: '80%',
            height: '1px',
            background: 'rgba(90,58,24,0.35)',
          }} />

          {/* TEXT — left aligned, not centred */}
          <div style={{
            fontFamily: '"Bradley Hand ITC", "Bradley Hand", cursive',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 'clamp(0.85rem, 1.5vw, 1.15rem)',
            color: '#3a2010',
            textAlign: 'left',
            lineHeight: 2,
            whiteSpace: 'pre-line',
          }}>
            {displayText}
          </div>

          <div style={{
            width: '80%',
            height: '1px',
            background: 'rgba(90,58,24,0.35)',
          }} />

          {/* ENTER BUTTON — left aligned to match text */}
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