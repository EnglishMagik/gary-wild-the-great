import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'

export default function DedicationPage() {
  const navigate = useNavigate()
  const dedication = useBookStore((s) => s.dedication)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const displayText =
    dedication && dedication.trim()
      ? dedication
      : `Live fully.\nCare deeply.\nShare generously.\nCreate boldly.\nBe Wild.`

  // ── MOBILE ───────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundImage: "url('/leather_border.png')",
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        boxSizing: 'border-box',
        // Wide side padding pulls content inside the leather border
        padding: '2.5rem 3.5rem 3rem 3.5rem',
        gap: '1rem',
        overflowY: 'auto',
      }}>

        {/* PHOTO */}
        <div style={{
          width: '100%',
          maxWidth: '200px',
          aspectRatio: '1 / 1',
          padding: '8px',
          background: 'linear-gradient(135deg, #8b6914, #c9a84c, #8b6914)',
          borderRadius: '6px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          boxSizing: 'border-box',
          flexShrink: 0,
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

        {/* DEDICATION TEXT */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.6rem',
            color: '#8b6914',
            letterSpacing: '0.3em',
            marginBottom: '0.6rem',
          }}>
            ✦ ✦ ✦
          </div>
          <div style={{
            fontFamily: '"Bradley Hand ITC", "Bradley Hand", cursive',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: '1rem',
            color: '#3a2010',
            lineHeight: 1.75,
            whiteSpace: 'pre-line',
          }}>
            {displayText}
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate('/contents')}
          style={{
            background: 'linear-gradient(135deg, #c8c8c8 0%, #e8e8e8 40%, #b0b0b0 60%, #d4d4d4 100%)',
            border: '1px solid rgba(180,180,180,0.8)',
            borderRadius: '999px',
            padding: '0.55rem 1.75rem',
            fontFamily: 'Cinzel, serif',
            fontSize: '0.68rem',
            letterSpacing: '0.15em',
            color: '#2a2a2a',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            marginTop: '0.25rem',
            flexShrink: 0,
          }}
        >
          MAKING LIFE MAGIC
        </button>

      </div>
    )
  }

  // ── DESKTOP (unchanged) ───────────────────────────────────────────────────
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
        margin: '0 auto',
        gap: '2rem',
        paddingLeft: '350px',
      }}>
        <div style={{
          flex: '0 0 265px',
          maxWidth: '265px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '20px',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '245px',
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
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '0.6rem',
          paddingTop: '40px',
          marginLeft: '10px',
        }}>
          <div style={{ paddingLeft: '70px' }}>
            <div style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.6rem',
              color: '#8b6914',
              letterSpacing: '0.3em',
              textAlign: 'left',
              marginBottom: '0.5rem',
            }}>
              ✦ ✦ ✦
            </div>
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
          </div>
          <div style={{ paddingLeft: '30px', marginTop: '0.5rem' }}>
            <button
              onClick={() => navigate('/contents')}
              style={{
                background: 'linear-gradient(135deg, #c8c8c8 0%, #e8e8e8 40%, #b0b0b0 60%, #d4d4d4 100%)',
                border: '1px solid rgba(180,180,180,0.8)',
                borderRadius: '999px',
                padding: '0.4rem 1.8rem',
                fontFamily: 'Cinzel, serif',
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                color: '#2a2a2a',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              MAKING LIFE MAGIC
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
