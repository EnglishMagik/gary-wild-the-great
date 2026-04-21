import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'

// ─── PAGINATION ENGINE ───────────────────────────────────────────────
// Splits all chapter text into visual page slots based on chars-per-page
const CHARS_PER_PAGE = 600

function buildPageSlots(chapters) {
  const slots = []
  chapters.forEach((ch, chIndex) => {
    // Combine all pages of this chapter into one long text
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

    const charsForFirstSlot = CHARS_PER_PAGE - 200 // header takes space
    
    paragraphs.forEach(para => {
      const limit = isFirstSlot ? charsForFirstSlot : CHARS_PER_PAGE
      if (currentLen + para.length > limit && currentSlotParas.length > 0) {
        flushSlot()
      }
      currentSlotParas.push(para)
      currentLen += para.length
    })
    flushSlot()
  })
  return slots
}
// ─────────────────────────────────────────────────────────────────────

export default function ReaderPage() {
  const navigate = useNavigate()
  const { currentPageIndex, setCurrentPage, chapters } = useBookStore()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Build paginated slots from chapters
  const slots = buildPageSlots(chapters)

  if (slots.length === 0) {
    return (
      <div style={{
        minHeight: '100vh', background: '#ffffff',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: '#8b6914', fontFamily: 'Cinzel, serif', gap: '2rem',
      }}>
        <p>No pages yet.</p>
        <button onClick={() => navigate('/studio')} style={{
          background: '#c9a84c', color: '#1a1208', border: 'none',
          padding: '0.75rem 2rem', fontFamily: 'Cinzel, serif',
          cursor: 'pointer', fontSize: '0.9rem',
        }}>GO TO WRITE</button>
      </div>
    )
  }

  // Clamp currentPageIndex to valid range
  const safeIndex = Math.min(currentPageIndex, slots.length - 1)
  const pagesPerSpread = isMobile ? 1 : 2
  const leftSlot = slots[safeIndex]
  const rightSlot = !isMobile ? slots[safeIndex + 1] : null
  const canGoNext = safeIndex + pagesPerSpread < slots.length
  const canGoPrev = safeIndex > 0
  const goNext = () => { if (canGoNext) setCurrentPage(safeIndex + pagesPerSpread) }
  const goPrev = () => { if (canGoPrev) setCurrentPage(safeIndex - pagesPerSpread) }

  const textFont = '"Bradley Hand ITC", "Bradley Hand", cursive'

  const NavBtn = ({ onClick, disabled, label }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
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
        fontFamily: 'Cinzel, serif',
        fontStyle: 'italic',
        fontWeight: '700',
        fontSize: 'clamp(0.45rem, 0.65vw, 0.55rem)',
        color: '#5a3a18',
        letterSpacing: '0.1em',
        whiteSpace: 'nowrap',
      }}>{label}</span>
    </button>
  )

  const renderSlot = (slot, pageNum, isLeft) => {
    if (!slot) return null
    return (
      <div style={{
        position: 'absolute',
        top: '5%',
        left: isLeft ? '11%' : '56%',
        width: '33%',
        bottom: '4%',
        zIndex: 3,
      }}>
        {/* PAGE NUMBER */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: isLeft ? 0 : 'auto',
          right: isLeft ? 'auto' : 0,
          fontFamily: 'Cinzel, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)',
          color: '#5a3a18',
          letterSpacing: '0.2em',
          fontWeight: 'bold',
          lineHeight: 1,
          zIndex: 4,
        }}>
          {pageNum}
        </div>

        {/* CONTENT AREA */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          bottom: '3rem',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* CHAPTER HEADER — first slot of chapter only */}
          {slot.isFirstOfChapter && (
            <div style={{ textAlign: 'center', paddingTop: '0.8rem', flexShrink: 0 }}>
              {isLeft && (
                <div style={{ textAlign: 'left', marginBottom: '0.3rem' }}>
                  <NavBtn onClick={goPrev} disabled={!canGoPrev} label="Previous" />
                </div>
              )}
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '0.5rem', marginBottom: '0.1rem',
              }}>
                <img
                  src="/crown.png"
                  alt="Life Chapters"
                  onClick={() => navigate('/chapters')}
                  style={{
                    width: '75px', height: 'auto', cursor: 'pointer', opacity: 0.9,
                    filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.25))',
                    transition: 'opacity 0.2s, transform 0.2s', flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.08)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1)' }}
                />
                <div style={{
                  fontFamily: 'Cinzel, serif', fontStyle: 'italic', fontWeight: '900',
                  fontSize: 'clamp(0.4rem, 0.65vw, 0.55rem)', color: '#5a3a18',
                  letterSpacing: '0.3em', textTransform: 'uppercase',
                }}>
                  Chapter {slot.chapterNumber}
                </div>
              </div>
              <div style={{
                fontFamily: textFont, fontStyle: 'italic', fontWeight: 'bold',
                fontSize: 'clamp(0.85rem, 1.5vw, 1.2rem)', color: '#2a1a08', lineHeight: 1.15,
              }}>
                {slot.chapterTitle}
              </div>
              <div style={{
                width: '40%', height: '1px', background: 'rgba(90,58,24,0.4)',
                margin: '0.7rem auto 1rem auto',
              }} />
            </div>
          )}

          {/* CONTINUATION PAGE HEADER */}
          {!slot.isFirstOfChapter && (
            <div style={{
              display: 'flex', alignItems: 'center',
              paddingTop: '1rem', marginBottom: '0.5rem', flexShrink: 0,
            }}>
              {isLeft && <NavBtn onClick={goPrev} disabled={!canGoPrev} label="Previous" />}
              <div style={{
                fontFamily: textFont, fontStyle: 'italic',
                fontSize: 'clamp(0.4rem, 0.6vw, 0.55rem)', color: '#5a3a18',
                flex: 1, textAlign: 'center', padding: '0 0.25rem',
              }}>
                {slot.chapterTitle}
              </div>
              {!isLeft && <NavBtn onClick={goNext} disabled={!canGoNext} label="Next" />}
            </div>
          )}

          {/* PAGE TEXT */}
          <div style={{
            fontFamily: textFont, fontStyle: 'italic', fontWeight: 'bold',
            fontSize: 'clamp(0.72rem, 1.15vw, 0.98rem)', color: '#2a1a08',
            lineHeight: 1.78, overflow: 'hidden', flex: 1,
            wordBreak: 'break-word', overflowWrap: 'break-word',
          }}>
            {slot.paragraphs.map((para, i) => (
              <p key={i} style={{ marginBottom: '0.75rem', marginTop: 0 }}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── DESKTOP ──
  const renderDesktop = () => (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      padding: '2vh 2vw',
      boxSizing: 'border-box',
    }}>
      {/* 
        KEY FIX FOR SQUASHING:
        Use aspect-ratio to maintain 1025:571 book proportions.
        Max out width but never exceed height.
      */}
      <div style={{
        position: 'relative',
        width: 'min(96vw, calc(96vh * 1025 / 571))',
        aspectRatio: '1025 / 571',
      }}>
        <img
          src="/book_pages.png"
          alt="Book pages"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            display: 'block',
            pointerEvents: 'none',
          }}
        />
        {renderSlot(leftSlot, safeIndex + 1, true)}
        {rightSlot && renderSlot(rightSlot, safeIndex + 2, false)}
      </div>
    </div>
  )

  // ── MOBILE ──
  const renderMobile = () => (
    <div style={{
      width: '100%', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1vh 2vw', boxSizing: 'border-box', background: '#ffffff',
    }}>
      <div style={{ position: 'relative', width: '96vw', height: '95vh' }}>
        <img src="/Single_page.png" alt="Book page" style={{
          width: '100%', height: '100%', objectFit: 'fill',
          display: 'block', zIndex: 2, pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', top: '10%', left: '20%',
          right: '10%', bottom: '8%', zIndex: 3,
        }}>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            textAlign: 'center', fontFamily: 'Cinzel, serif',
            fontStyle: 'italic', fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            color: '#5a3a18', fontWeight: 'bold', letterSpacing: '0.2em',
          }}>
            {safeIndex + 1}
          </div>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            bottom: '2.5rem', display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            {leftSlot?.isFirstOfChapter ? (
              <div style={{ textAlign: 'center', paddingTop: '0.8rem', flexShrink: 0, marginBottom: '0.5rem' }}>
                <div style={{ textAlign: 'left', marginBottom: '0.3rem' }}>
                  <NavBtn onClick={goPrev} disabled={!canGoPrev} label="Previous" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.1rem' }}>
                  <img src="/crown.png" alt="Life Chapters" onClick={() => navigate('/chapters')}
                    style={{ width: '40px', height: 'auto', cursor: 'pointer', opacity: 0.9 }} />
                  <div style={{ fontFamily: 'Cinzel, serif', fontStyle: 'italic', fontWeight: '900', fontSize: 'clamp(0.5rem, 2vw, 0.65rem)', color: '#5a3a18', letterSpacing: '0.3em' }}>
                    Chapter {leftSlot?.chapterNumber}
                  </div>
                </div>
                <div style={{ fontFamily: textFont, fontStyle: 'italic', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 4vw, 1.2rem)', color: '#2a1a08', lineHeight: 1.15 }}>
                  {leftSlot?.chapterTitle}
                </div>
                <div style={{ width: '40%', height: '1px', background: 'rgba(90,58,24,0.4)', margin: '0.7rem auto 1rem auto' }}/>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, paddingTop: '1rem', marginBottom: '0.5rem' }}>
                <NavBtn onClick={goPrev} disabled={!canGoPrev} label="Previous" />
                <NavBtn onClick={goNext} disabled={!canGoNext} label="Next" />
              </div>
            )}
            <div style={{ fontFamily: textFont, fontStyle: 'italic', fontWeight: 'bold', fontSize: 'clamp(0.8rem, 3vw, 1rem)', color: '#2a1a08', lineHeight: 1.75, overflow: 'hidden', flex: 1, wordBreak: 'break-word' }}>
              {leftSlot?.paragraphs.map((para, i) => (
                <p key={i} style={{ marginBottom: '0.7rem', marginTop: 0 }}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ width: '100%', height: '100vh', background: '#ffffff', overflow: 'hidden' }}>
      {isMobile ? renderMobile() : renderDesktop()}
    </div>
  )
}