import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'

// ── EASY LOGO SIZE CONTROL ───────────────────────────────────────────────────
// Change this one number to make the BioMe logo bigger or smaller on mobile.
// 120px is a good starting point. Try 80px (smaller) or 160px (larger).
const BIOME_LOGO_SIZE = '120px'
// ─────────────────────────────────────────────────────────────────────────────

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

  // ── MOBILE ────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: '#2a1a0e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '1.5rem',
        paddingBottom: '2.5rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        boxSizing: 'border-box',
        gap: '1.5rem',
      }}>

        {/* WHITE CARD with gold border */}
        <div style={{
          background: '#ffffff',
          border: '3px solid #c9a84c',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          padding: '1.75rem 1.5rem',
          width: '100%',
          maxWidth: '340px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.1rem',
          boxSizing: 'border-box',
        }}>

          {/* PHOTO — dark grey border */}
          <div style={{
            width: '180px',
            height: '180px',
            padding: '6px',
            background: 'linear-gradient(135deg, #555555, #888888, #555555)',
            borderRadius: '6px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            boxSizing: 'border-box',
            flexShrink: 0,
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              padding: '4px',
              background: '#e8e8e8',
              borderRadius: '3px',
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

          {/* DIVIDER */}
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.6rem',
            color: '#c9a84c',
            letterSpacing: '0.4em',
          }}>
            ✦ ✦ ✦
          </div>

          {/* DEDICATION TEXT */}
          <div style={{
            fontFamily: '"Bradley Hand ITC", "Bradley Hand", cursive',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: '1.05rem',
            color: '#1a1208',
            lineHeight: 1.85,
            whiteSpace: 'pre-line',
            textAlign: 'center',
            width: '100%',
          }}>
            {displayText}
          </div>

          {/* BUTTON */}
          <button
            onClick={() => navigate('/contents')}
            style={{
              background: 'linear-gradient(135deg, #c8c8c8 0%, #e8e8e8 40%, #b0b0b0 60%, #d4d4d4 100%)',
              border: '1px solid rgba(180,180,180,0.8)',
              borderRadius: '999px',
              padding: '0.55rem 2rem',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.68rem',
              letterSpacing: '0.15em',
              color: '#2a2a2a',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            MAKING LIFE MAGIC
          </button>

        </div>

        {/* BIOME LOGO — sits below the card on the brown background        */}
        {/* To resize: change BIOME_LOGO_SIZE at the top of this file       */}
        <img
          src="/BioMe.png"
          alt="BioMe"
          style={{
            width: BIOME_LOGO_SIZE,
            height: 'auto',
            opacity: 0.9,
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
          }}
        />

      </div>
    )
  }

  // ── DESKTOP (unchanged) ───────────────────────────────────────────────────
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
      padding: '5vw 5vw 5vw 15vw',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto',
        gap: '2rem',
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
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          paddingTop: '40px',
          marginLeft: '60px',
        }}>
          <div style={{ paddingLeft: '0px' }}>
            <div style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.6rem',
              color: '#8b6914',
              letterSpacing: '0.3em',
              textAlign: 'center',
              marginBottom: '0.5rem',
            }}>✦ ✦ ✦</div>
            <div style={{
              fontFamily: '"Bradley Hand ITC", "Bradley Hand", cursive',
              fontStyle: 'italic',
              fontWeight: 'bold',
              fontSize: 'clamp(0.75rem, 1.2vw, 1rem)',
              color: '#3a2010',
              textAlign: 'center',
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
            }}>
              {displayText}
            </div>
          </div>
          <div style={{ paddingLeft: '0px', marginTop: '0.5rem' }}>
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
