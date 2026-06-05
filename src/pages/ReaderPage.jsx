import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'

const CHARS_PER_PAGE = 800
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

  const useMobilePortrait = isMobile && !isLandscape
  const charsPerPage = useMobilePortrait ? CHARS_PER_PAGE_MOBILE : CHARS_PER_PAGE
  const slots = buildPageSlots(chapters, charsPerPage)

  if (slots.length === 0) {
    return (
      <div style={{
        minHeight: '100vh', background: '#f5ead6',
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

  const safeIndex      = Math.min(currentPageIndex, slots.length - 1)
  const pagesPerSpread = useMobilePortrait ? 1 : 2
  const leftSlot       = slots[safeIndex]
  const rightSlot      = !useMobilePortrait ? slots[safeIndex + 1] : null
  const canGoNext      = safeIndex + pagesPerSpread < slots.length
  const canGoPrev      = safeIndex > 0
  const goNext         = () => { if (canGoNext) setCurrentPage(safeIndex + pagesPerSpread) }
  const goPrev         = () => { if (canGoPrev) setCurrentPage(safeIndex - pagesPerSpread) }

  // Page numbers — 1-based
  const leftPageNum  = safeIndex + 1
  const rightPageNum = safeIndex + 2

  const textFont = '"Bradley Hand ITC", "Bradley Hand", cursive'

  // ── PAGE NUMBER BUTTON — inside card at bottom ──
  // Page 1: no arrow (nothing before it)
  // All others: arrow showing direction
  const PageNumBtn = ({ pageNum, onClick, disabled, isLeft }) => {
    const label = pageNum === 1
      ? `${pageNum}`
      : isLeft ? `← ${pageNum}` : `${pageNum} →`
    return (
      <button onClick={onClick} disabled={disabled} style={{
        background: disabled ? 'transparent' : 'rgba(139,105,20,0.12)',
        border: '1px solid rgba(139,105,20,0.35)',
        borderRadius: '999px',
        cursor: disabled ? 'default' : 'pointer',
        visibility: disabled ? 'hidden' : 'visible',
        padding: '4px 14px',
        transition: 'background 0.2s',
      }}
        onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = 'rgba(139,105,20,0.28)' }}
        onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = 'rgba(139,105,20,0.12)' }}
      >
        <span style={{
          fontFamily: 'Cinzel, serif', fontStyle: 'italic', fontWeight: '700',
          fontSize: '0.72rem', color: '#5a3a18', letterSpacing: '0.08em', whiteSpace: 'nowrap',
        }}>{label}</span>
      </button>
    )
  }

  // ── PAGE CARD ──
  const PageCard = ({ slot, pageNum, isLeft, onNav, canNav }) => {
    if (!slot) return null
    return (
      <div style={{
        flex: 1,
        background: '#fffcf0',
        border: '1px solid rgba(139,105,20,0.25)',
        borderRadius: '8px',
        boxShadow: isLeft
          ? '4px 0 12px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.1)'
          : '-4px 0 12px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.1)',
        padding: '2rem 2.5rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}>
        {/* CHAPTER HEADER */}
        {slot.isFirstOfChapter && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
            <img src="/crown.png" alt="crown" onClick={() => navigate('/chapters')}
              style={{ width: '48px', height: 'auto', cursor: 'pointer', opacity: 0.85, marginBottom: '0.4rem' }} />
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.65rem', color: '#8b6914', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Chapter {slot.chapterNumber}
            </div>
            <div style={{ fontFamily: textFont, fontStyle: 'italic', fontWeight: 'bold', fontSize: '1.4rem', color: '#2a1a08', lineHeight: 1.2, marginBottom: '0.8rem' }}>
              {slot.chapterTitle}
            </div>
            <div style={{ width: '40%', height: '1px', background: 'rgba(139,105,20,0.35)', margin: '0 auto' }} />
          </div>
        )}

        {/* CONTINUATION HEADER */}
        {!slot.isFirstOfChapter && (
          <div style={{ fontFamily: textFont, fontStyle: 'italic', fontSize: '0.8rem', color: '#8b6914', textAlign: 'center', marginBottom: '1rem', flexShrink: 0 }}>
            {slot.chapterTitle}
          </div>
        )}

        {/* PAGE TEXT */}
        <div style={{
          fontFamily: textFont, fontStyle: 'italic', fontWeight: 'bold',
          fontSize: '1.05rem', color: '#2a1a08', lineHeight: 1.85,
          flex: 1, overflow: 'hidden',
        }}>
          {slot.paragraphs.map((para, i) => (
            <p key={i} style={{ marginBottom: '0.9rem', marginTop: 0 }}>{para}</p>
          ))}
        </div>

        {/* PAGE NUMBER BUTTON — bottom corner */}
        <div style={{
          display: 'flex',
          justifyContent: isLeft ? 'flex-start' : 'flex-end',
          marginTop: '0.75rem',
          flexShrink: 0,
        }}>
          <PageNumBtn pageNum={pageNum} onClick={onNav} disabled={!canNav} isLeft={isLeft} />
        </div>
      </div>
    )
  }

  // ── MOBILE TAP BUTTON ──
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

  // ── DESKTOP RENDER ──
  const renderDesktop = () => (
    <div style={{
      width: '100%', height: '100vh', background: '#e8d5b0',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '1vh 4vw 0.5vh', boxSizing: 'border-box', gap: '0.4vh',
    }}>
      {/* TWO PAGE SPREAD */}
      <div style={{
        display: 'flex', gap: '0', width: '100%', maxWidth: '1100px',
        height: 'calc(100vh - 6vh)',
        filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.25))',
      }}>
        {/* LEFT SPINE */}
        <div style={{ width: '18px', flexShrink: 0, alignSelf: 'stretch', background: 'linear-gradient(90deg, #5a3a18, #8b6914, #5a3a18)', borderRadius: '2px 0 0 2px' }} />

        <PageCard
          slot={leftSlot}
          pageNum={leftPageNum}
          isLeft={true}
          onNav={goPrev}
          canNav={canGoPrev}
        />

        {/* CENTRE SPINE */}
        <div style={{ width: '12px', flexShrink: 0, alignSelf: 'stretch', background: 'linear-gradient(90deg, rgba(90,58,24,0.3), rgba(139,105,20,0.15), rgba(90,58,24,0.3))' }} />

        {rightSlot
          ? <PageCard slot={rightSlot} pageNum={rightPageNum} isLeft={false} onNav={goNext} canNav={canGoNext} />
          : <div style={{ flex: 1, background: '#fffcf0', borderRadius: '0 8px 8px 0', opacity: 0.4 }} />
        }

        {/* RIGHT SPINE */}
        <div style={{ width: '18px', flexShrink: 0, alignSelf: 'stretch', background: 'linear-gradient(90deg, #5a3a18, #8b6914, #5a3a18)', borderRadius: '0 2px 2px 0' }} />
      </div>

      {/* CONTENTS ONLY — centred below spread */}
      <div
        onClick={() => navigate('/chapters')}
        style={{
          fontFamily: 'Cinzel, serif', fontSize: '0.78rem', fontWeight: '700',
          color: '#5a3a18', letterSpacing: '0.25em', cursor: 'pointer',
          padding: '0.3rem 1rem',
        }}
      >
        CONTENTS
      </div>
    </div>
  )

  // ── MOBILE PORTRAIT RENDER — unchanged ──
  const renderMobilePortrait = () => (
    <div style={{
      width: '100%', minHeight: '100vh', background: '#f5ead6',
      display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
    }}>
      <div style={{
        flex: 1, margin: '1rem', background: '#fffcf0',
        border: '1px solid rgba(139,105,20,0.3)', borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)', padding: '1.5rem 1.25rem',
        display: 'flex', flexDirection: 'column', gap: '1rem',
      }}>
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
        {!leftSlot?.isFirstOfChapter && (
          <div style={{ textAlign: 'center', fontFamily: textFont, fontStyle: 'italic', fontSize: '0.85rem', color: '#8b6914', borderBottom: '1px solid rgba(139,105,20,0.2)', paddingBottom: '0.5rem' }}>
            {leftSlot?.chapterTitle}
          </div>
        )}
        <div style={{ fontFamily: textFont, fontStyle: 'italic', fontWeight: 'bold', fontSize: '1.1rem', color: '#2a1a08', lineHeight: 1.9, flex: 1 }}>
          {leftSlot?.paragraphs.map((para, i) => (
            <p key={i} style={{ marginBottom: '1rem', marginTop: 0 }}>{para}</p>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontFamily: 'Cinzel, serif', fontSize: '0.9rem', color: '#8b6914', letterSpacing: '0.2em' }}>
          — {safeIndex + 1} —
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem 1.25rem', background: '#f5ead6' }}>
        <MobileBtn onClick={goPrev} disabled={!canGoPrev} label={canGoPrev ? `← ${safeIndex}` : '← 1'} />
        <div onClick={() => navigate('/chapters')} style={{ fontFamily: 'Cinzel, serif', fontSize: '0.65rem', fontWeight: '700', color: '#8b6914', letterSpacing: '0.15em', cursor: 'pointer', textAlign: 'center' }}>
          CONTENTS
        </div>
        <MobileBtn onClick={goNext} disabled={!canGoNext} label={`${safeIndex + 2} →`} />
      </div>
    </div>
  )

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f5ead6', overflow: useMobilePortrait ? 'auto' : 'hidden' }}>
      {useMobilePortrait ? renderMobilePortrait() : renderDesktop()}
    </div>
  )
}
