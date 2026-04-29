import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'

// The secret sauce: Short pages for mobile, standard for PC
const CHARS_PER_PAGE_PC = 600
const CHARS_PER_PAGE_MOBILE = 350 // Shorter to ensure NO scrolling

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

    paragraphs.forEach(para => {
      const limit = isFirstSlot ? (charsPerPage - 150) : charsPerPage
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
  const { chapters } = useBookStore()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [flatPageIndex, setFlatPageIndex] = useState(0)

  // Track screen size to swap versions instantly
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const charsLimit = isMobile ? CHARS_PER_PAGE_MOBILE : CHARS_PER_PAGE_PC
  const allSlots = buildPageSlots(chapters, charsLimit)
  
  // Navigation Logic
  const goNext = () => {
    const step = isMobile ? 1 : 2
    if (flatPageIndex + step < allSlots.length) setFlatPageIndex(flatPageIndex + step)
  }
  const goPrev = () => {
    const step = isMobile ? 1 : 2
    if (flatPageIndex - step >= 0) setFlatPageIndex(flatPageIndex - step)
  }

  const leftSlot = allSlots[flatPageIndex]
  const rightSlot = !isMobile ? allSlots[flatPageIndex + 1] : null

  // --- STYLES ---
  const textFont = "'Georgia', serif"

  if (isMobile) {
    // --- MOBILE VIEW: SINGLE SHORT PAGE ---
    return (
      <div style={{ 
        minHeight: '100vh', backgroundColor: '#fdf6e3', 
        display: 'flex', flexDirection: 'column', overflow: 'hidden' 
      }}>
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', textAlign: 'center', color: '#8b6914' }}>
            {leftSlot?.chapterTitle}
          </h2>
          <div style={{ 
            fontFamily: textFont, fontSize: '1.1rem', lineHeight: '1.6', 
            color: '#2a1a08', textAlign: 'left' 
          }}>
            {leftSlot?.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
        
        {/* Navigation Bar */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', padding: '20px', 
          background: '#f5ead6', borderTop: '1px solid #dcd0b9' 
        }}>
          <button onClick={goPrev} disabled={flatPageIndex === 0} style={navBtnStyle}>BACK</button>
          <span style={{ fontFamily: 'Cinzel', alignSelf: 'center' }}>{flatPageIndex + 1}</span>
          <button onClick={goNext} disabled={flatPageIndex >= allSlots.length - 1} style={navBtnStyle}>NEXT</button>
        </div>
      </div>
    )
  }

  // --- PC VIEW: THE ORIGINAL BOOK SPREAD ---
  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#e2d1b3',
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
    }}>
      <div style={{
        position: 'relative', width: '1000px', height: '700px',
        backgroundImage: 'url("/book_pages.png")', backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat', display: 'flex', padding: '40px 60px'
      }}>
        {/* Left Page */}
        <div style={pageContentStyle}>
          {leftSlot?.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {/* Right Page */}
        <div style={pageContentStyle}>
          {rightSlot?.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {/* Desktop Buttons */}
        <button onClick={goPrev} style={{ ...desktopNavBtn, left: '-60px' }}>PREV</button>
        <button onClick={goNext} style={{ ...desktopNavBtn, right: '-60px' }}>NEXT</button>
      </div>
    </div>
  )
}

const navBtnStyle = {
  padding: '10px 20px', background: '#8b6914', color: 'white', 
  border: 'none', borderRadius: '5px', fontFamily: 'Cinzel, serif'
}

const desktopNavBtn = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  padding: '15px', background: 'rgba(139, 105, 20, 0.8)', color: 'white',
  border: 'none', cursor: 'pointer', borderRadius: '50%'
}

const pageContentStyle = {
  flex: 1, padding: '20px 40px', overflow: 'hidden',
  fontFamily: "'Georgia', serif", fontSize: '1.05rem', lineHeight: '1.8'
}