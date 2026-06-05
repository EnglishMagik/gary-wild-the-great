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
        paddingBottom: '2rem',
        boxSizing: 'border-box',
        position: 'relative',
        overflowY: 'auto',
      }}>
        {/* Top-Right Logo Area for Mobile */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          paddingRight: '1rem',
          marginBottom: '1rem',
        }}>
          <img
            src="/BioMeLogo.png"
            alt="BioMe Logo"
            style={{
              width: BIOME_LOGO_SIZE,
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Outer Frame Mockup (Vertical Card) */}
        <div style={{
          width: '90%',
          maxWidth: '360px',
          aspectRatio: '1 / 1.414',
          background: '#f4ebd0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.08)',
          borderRadius: '4px',
          border: '1px solid #3a2010',
          boxSizing: 'border-box',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Inner Border */}
          <div style={{
            width: '100%',
            height: '100%',
            border: '1px dashed rgba(139, 105, 20, 0.4)',
            boxSizing: 'border-box',
            padding: '1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {/* Crown / Stars */}
            <div style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.6rem',
              color: '#8b6914',
              letterSpacing: '0.3em',
              textAlign: 'center',
              marginBottom: '0.5rem',
            }}>✦ ✦ ✦</div>

            {/* Dedication Text Content */}
            <div style={{
              fontFamily: '"Bradley Hand ITC", "Bradley Hand", cursive',
              fontStyle: 'italic',
              fontWeight: 'bold',
              fontSize: 'clamp(0.75rem, 3.5vw, 1rem)',
              color: '#3a2010',
              textAlign: 'center',
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
            }}>
              {displayText}
            </div>

            {/* Bottom Button Area */}
            <div style={{ marginTop: '1.5rem' }}>
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
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
              >
                CONTENTS
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── DESKTOP ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundImage: 'url("/book_pages.png")',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      boxSizing: 'border-box',
      // 1. Outer padding left reduced from 15vw to 12vw
      padding: '5vw 5vw 5vw 12vw',
    }}>
      {/* Left Blank Page Container */}
      <div style={{ flex: 1 }} />

      {/* Right Content Page Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // 2. Padding top reduced from 40px to 0px
        paddingTop: '0px',
        boxSizing: 'border-box',
      }}>
        {/* Inner Content Block */}
        <div style={{
          // 3. Margin left reduced from 20px to 0px
          marginLeft: '0px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Decorative Divider */}
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
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}
          >
            CONTENTS
          </button>
        </div>
      </div>
    </div>
  )
}