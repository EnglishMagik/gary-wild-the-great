import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'

const CHARS_PER_PAGE = 600
const CHARS_PER_PAGE_MOBILE = 400

function buildPageSlots(chapters, charsPerPage) {
  const slots = []
  chapters.forEach((ch, chIndex) => {
    const fullText = ch.pages.map(p => p.text).join('\n\n')
    const paragraphs = fullText.split('\n').filter(p => p.trim())
    let currentSlotParas = []
    let currentLen = 0
    let isFirstSlot = true

    const flushSlot = () => {
      if (currentSlotParas.length === 0) return
      slots.push({
        chapterId: ch.id,
        chapterTitle: ch.title,
        chapterNumber: chIndex + 1,
        isFirstOfChapter: isFirstSlot,
        paragraphs: [...currentSlotParas],
      })
      isFirstSlot = false
      currentSlotParas = []
      currentLen = 0
    }

    const charsForFirstSlot = charsPerPage - 200

    paragraphs.forEach(para => {
      const limit = isFirstSlot ? charsForFirstSlot : charsPerPage
      if (currentLen + para.length > limit && currentSlotParas.length > 0) flushSlot()
      currentSlotParas.push(para)
      currentLen += para.length
    })
    flushSlot()
  })
  return slots
}

export default function ReaderPage() {
  const navigate = useNavigate()
  const { currentPageIndex, setCurrentPage, chapters } = useBookStore()
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsLandscape(window.innerWidth > window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mobile landscape uses desktop-style two-page spread
  // Mobile portrait uses single scrollable page
  const useMobilePortrait = isMobile && !isLandscape
  const charsPerPage = useMobilePortrait ? CHARS_PER_PAGE_MOBILE : CHARS_PER_PAGE
  const slots = buildPageSlots(chapters, charsPerPage)

  if (slots.length === 0) {
    return (
      <div style={{
        minHeight: '100vh', background: '#ffffff',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: '#8b6914', fontFamily: 'Cinzel, serif', gap: '2rem',
        padding: '2rem',
      }}>
        <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>No pages yet.</p>
        <button onClick={() => navigate('/studio')} style={{
          background: '#c9a84c', color: '#1a1208', border: 'none',
          padding: '0.75rem 2rem', fontFamily: 'Cinzel, serif',
          cursor: 'pointer', fontSize: '0.9rem', borderRadius: '4px',
        }}>GO TO WRITE</button>
      </div>
    )
  }

  const safeIndex = Math.min(currentPageIndex, slots.length - 1)
  const pagesPerSpread = useMobilePortrait ? 1 : 2
  const leftSlot = slots[safeIndex]
  const rightSlot = !useMobilePortrait ? slots[safeIndex + 1] : null
  const canGoNext = safeIndex + pagesPerSpread < slots.length
  const canGoPrev = safeIndex > 0
  const goNext = () => { if (canGoNext) setCurrentPage(safeIndex + pagesPerSpread) }
  const goPrev = () => { if (canGoPrev) setCurrentPage(safeIndex - pagesPerSpread) }

  const textFont = '"Bradley Hand ITC", "Bradley Hand", cursive'

  // ── DESKTOP NAV BUTTON (small, hover-based) ──
  const NavBtn = ({ onClick, disabled, label }) => (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? 'rgba(139,105,20,0.08)' : 'rgba(139,105,20,0.18)',
      border: '1px solid rgba(139,105,20,0.35)',
      borderRadius: '999px',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.3 : 1,
      padding: '2px 10px',
      transition: 'background 0.2s',
      flexShrink: 0,
    }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = 'rgba(139,105,20,0.32)' }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = 'rgba(139,105,20,0.18)' }}
    >
      <span style={{
        fontFamily: 'Cinzel, serif', fontStyle: 'italic', fontWeight: '700',
        fontSize: 'clamp(0.45rem, 0.65vw, 0.55rem)', color: '#5a3a18',
        letterSpacing: '0.1em', whiteSpace: 'nowrap',
      }}>{label}</span>
    </button>
  )

  // ── MOBILE TAP BUTTON (large, finger-friendly) ──
  const MobileBtn = ({ onClick, disabled, label }) => (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? 'rgba(139,105,20,0.1)' : 'rgba(139,105,20,0.25)',
      border: '2px solid rgba(139,105,20,0.5)',
      borderRadius: '999px',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.3 : 1,
      padding: '10px 24px',
      fontFamily: 'Cinzel, serif',
      fontStyle: 'italic',
      fontWeight: '700',
      fontSize: '0.9rem',
      color: '#5a3a18',
      letterSpacing: '0.1em',
      minWidth: '90px',
      touchAction: 'manipulation',
    }}>
      {label}
    </button>
  )

  // ── DESKTOP SLOT RENDERER ──
  const renderSlot = (slot, pageNum, isLeft) => {
    if (!slot) return null
    return (
      <div style={{
        position: 'absolute',
        top: '5%', left: isLeft ? '11%' : '56%',
        width: '33%', bottom: '4%', zIndex: 3,
      }}>
        <div style={{
          position: 'absolute', bottom: '0.5rem',
          left: isLeft ? 0 : 'auto', right: isLeft ? 'auto' : 0,
          fontFamily: 'Cinzel, serif', fontStyle: 'italic',
          fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)', color: '#5a3a18',
          letterSpacing: '0.2em', fontWeight: 'bold', lineHeight: 1, zIndex: 4,
        }}>
          {pageNum}
        </div>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          bottom: '3rem', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {slot.isFirstOfChapter && (
            <div style={{ textAlign: 'center', paddingTop: '0.8rem', flexShrink: 0 }}>
              {isLeft && (
                <div style={{ textAlign: 'left', marginBottom: '0.3rem', marginTop: '1rem' }}>
                  <NavBtn onClick={goPrev} disabled={!canGoPrev} label="Previous" />
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.1rem' }}>
                <img src="/crown.png" alt="Life Chapters" onClick={() => navigate('/chapters')}
                  style={{ width: '75px', height: 'auto', cursor: 'pointer', opacity: 0.9, flexShrink: 0 }} />
                <div style={{ fontFamily: 'Cinzel, serif', fontStyle: 'italic', fontWeight: '900', fontSize: 'clamp(0.4rem, 0.65vw, 0.55rem)', color: '#5a3a18', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                  Chapter {slot.chapterNumber}
                </div>
              </div>
              <div style={{ fontFamily: textFont, fontStyle: 'italic', fontWeight: 'bold', fontSize: 'clamp(0.85rem, 1.5vw, 1.2rem)', color: '#2a1a08', lineHeight: 1.15 }}>
                {slot.chapterTitle}
              </div>
              <div style={{ width: '40%', height: '1px', background: 'rgba(90,58,24,0.4)', margin: '0.7rem auto 1rem auto' }} />
            </div>
          )}
          {!slot.isFirstOfChapter && (
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '2rem', marginBottom: '0.5rem', flexShrink: 0 }}>
              {isLeft && <NavBtn onClick={goPrev} disabled={!canGoPrev} label="Previous" />}
              <div style={{ fontFamily: textFont, fontStyle: 'italic', fontSize: 'clamp(0.4rem, 0.6vw, 0.55rem)', color: '#5a3a18', flex: 1, textAlign: 'center', padding: '0 0.25rem' }}>
                {slot.chapterTitle}
              </div>
              {!isLeft && <NavBtn onClick={goNext} disabled={!canGoNext} label="Next" />}
            </div>
          )}
          <div style={{ fontFamily: textFont, fontStyle: 'italic', fontWeight: 'bold', fontSize: 'clamp(0.72rem, 1.15vw, 0.98rem)', color: '#2a1a08', lineHeight: 1.78, overflow: 'hidden', flex: 1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            {slot.paragraphs.map((para, i) => (
              <p key={i} style={{ marginBottom: '0.75rem', marginTop: 0 }}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── DESKTOP RENDER (includes mobile landscape) ──
  const renderDesktop = () => (
    <div style={{
      width: '100%', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#ffffff', padding: '2vh 2vw', boxSizing: 'border-box',
    }}>
      <div style={{
        position: 'relative',
        width: 'min(96vw, calc(96vh * 1025 / 571))',
        aspectRatio: '1025 / 571',
      }}>
        <img src="/book_pages.png" alt="Book pages" style={{
          width: '100%', height: '100%', objectFit: 'fill',
          display: 'block', pointerEvents: 'none',
        }} />
        {renderSlot(leftSlot, safeIndex + 1, true)}
        {rightSlot && renderSlot(rightSlot, safeIndex + 2, false)}
      </div>
    </div>
  )

  // ── MOBILE PORTRAIT RENDER — clean scrollable parchment ──
  const renderMobilePortrait = () => (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#f5ead6',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}>
      {/* PARCHMENT PAGE */}
      <div style={{
        flex: 1,
        margin: '1rem',
        background: '#fffcf0',
        border: '1px solid rgba(139,105,20,0.3)',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        padding: '1.5rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>

        {/* CHAPTER HEADER */}
        {leftSlot?.isFirstOfChapter && (
          <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(139,105,20,0.3)', paddingBottom: '1rem' }}>
            <img src="/crown.png" alt="crown" onClick={() => navigate('/chapters')}
              style={{ width: '50px', height: 'auto', cursor: 'pointer', opacity: 0.9, marginBottom: '0.5rem' }} />
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', color: '#8b6914', letterSpacing: '0.3em', marginBottom: '0.3rem' }}>
              CHAPTER {leftSlot.chapterNumber}
            </div>
            <div style={{ fontFamily: textFont, fontStyle: 'italic', fontWeight: 'bold', fontSize: '1.4rem', color: '#2a1a08', lineHeight: 1.2 }}>
              {leftSlot.chapterTitle}
            </div>
          </div>
        )}

        {/* NON-CHAPTER HEADER */}
        {!leftSlot?.isFirstOfChapter && (
          <div style={{ textAlign: 'center', fontFamily: textFont, fontStyle: 'italic', fontSize: '0.85rem', color: '#8b6914', borderBottom: '1px solid rgba(139,105,20,0.2)', paddingBottom: '0.5rem' }}>
            {leftSlot?.chapterTitle}
          </div>
        )}

        {/* PAGE TEXT — large and readable */}
        <div style={{
          fontFamily: textFont,
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          color: '#2a1a08',
          lineHeight: 1.9,
          flex: 1,
        }}>
          {leftSlot?.paragraphs.map((para, i) => (
            <p key={i} style={{ marginBottom: '1rem', marginTop: 0 }}>{para}</p>
          ))}
        </div>

        {/* PAGE NUMBER */}
        <div style={{ textAlign: 'center', fontFamily: 'Cinzel, serif', fontSize: '0.9rem', color: '#8b6914', letterSpacing: '0.2em' }}>
          — {safeIndex + 1} —
        </div>
      </div>

      {/* NAVIGATION — large tap targets at bottom */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem 1.25rem',
        background: '#f5ead6',
      }}>
        <MobileBtn onClick={goPrev} disabled={!canGoPrev} label="← Prev" />
        <div
          onClick={() => navigate('/chapters')}
          style={{ fontFamily: 'Cinzel, serif', fontSize: '0.65rem', color: '#8b6914', letterSpacing: '0.15em', cursor: 'pointer', textAlign: 'center' }}
        >
          CONTENTS
        </div>
        <MobileBtn onClick={goNext} disabled={!canGoNext} label="Next →" />
      </div>
    </div>
  )

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#ffffff', overflow: useMobilePortrait ? 'auto' : 'hidden' }}>
      {useMobilePortrait ? renderMobilePortrait() : renderDesktop()}
    </div>
  )
}