import React, { useState, useEffect } from 'react'
import { useBookStore } from '../store/bookStore'
import { useNavigate } from 'react-router-dom'

export default function ReaderPage() {
  const navigate = useNavigate()
  const {
    currentPageIndex,
    setCurrentPage,
    getFlatPages,
    updatePage,
    deleteChapter,
    deletePage,
    updateChapterTitle,
  } = useBookStore()

  const allPages = getFlatPages()
  const currentPage = allPages[currentPageIndex]

  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText]   = useState('')
  const [editTitle, setEditTitle] = useState('')

  // Swipe support
  const [touchStartX, setTouchStartX] = useState(null)

  useEffect(() => { window.scrollTo(0, 0) }, [currentPageIndex])

  if (!currentPage) {
    return (
      <div style={{
        minHeight: '100vh', background: '#1a1208',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', textAlign: 'center'
      }}>
        <p style={{ color: '#c9a84c', fontFamily: 'Cinzel, serif', fontSize: '1.1rem', marginBottom: '24px' }}>
          The book is empty. Head to the Studio to begin writing.
        </p>
        <button
          onClick={() => navigate('/studio')}
          style={{
            padding: '14px 32px', background: '#c9a84c', color: '#1a1208',
            border: 'none', fontFamily: 'Cinzel, serif', fontSize: '0.9rem',
            fontWeight: '700', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '4px'
          }}
        >
          GO TO STUDIO
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '12px', background: 'none', border: 'none',
            color: 'rgba(201,168,76,0.5)', fontFamily: 'Cinzel, serif',
            fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.15em'
          }}
        >
          ← BACK TO COVER
        </button>
      </div>
    )
  }

  const isFirstPageOfChapter =
    currentPageIndex === 0 ||
    allPages[currentPageIndex - 1].chapterId !== currentPage.chapterId

  const startEdit = () => {
    setEditText(currentPage.text)
    setEditTitle(currentPage.chapterTitle)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    updatePage(currentPage.chapterId, currentPage.id, editText)
    if (isFirstPageOfChapter && updateChapterTitle) {
      updateChapterTitle(currentPage.chapterId, editTitle)
    }
    setIsEditing(false)
  }

  const handleDeletePage = () => {
    const chapters = useBookStore.getState().chapters
    const parentChapter = chapters.find(ch => ch.id === currentPage.chapterId)
    if (parentChapter && parentChapter.pages.length > 1) {
      if (window.confirm('Delete ONLY this page?')) {
        deletePage(currentPage.chapterId, currentPage.id)
        setIsEditing(false)
      }
    } else {
      if (window.confirm('This is the last page. Delete the entire chapter?')) {
        deleteChapter(currentPage.chapterId)
        navigate('/contents')
      }
    }
  }

  const goNext = () => {
    if (currentPageIndex < allPages.length - 1) setCurrentPage(currentPageIndex + 1)
  }
  const goPrev = () => {
    if (currentPageIndex > 0) setCurrentPage(currentPageIndex - 1)
  }

  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX)
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev() }
    setTouchStartX(null)
  }

  /* ── PARAGRAPH RENDERER ── */
  const renderText = (text) =>
    text.split('\n').filter(p => p.trim()).map((para, i) => (
      <p key={i} style={{
        margin: '0 0 1.4em 0',
        textIndent: i === 0 ? '0' : '2em',
        lineHeight: '1.9',
        fontSize: 'clamp(1rem, 2.8vw, 1.15rem)',
        fontFamily: "'Crimson Text', serif",
        color: '#1a1208',
        textAlign: 'justify',
        hyphens: 'auto',
      }}>
        {para}
      </p>
    ))

  return (
    <div
      style={{ minHeight: '100vh', background: '#2a1f0d' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── TOP BAR ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(26,18,8,0.95)',
        borderBottom: '1px solid rgba(201,168,76,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '52px',
      }}>
        <button
          onClick={() => navigate('/contents')}
          style={{
            background: 'none', border: 'none', color: '#c9a84c',
            fontFamily: 'Cinzel, serif', fontSize: '0.72rem',
            letterSpacing: '0.15em', cursor: 'pointer', padding: '8px 4px'
          }}
        >
          ← CONTENTS
        </button>

        <span style={{
          fontFamily: 'Cinzel, serif', fontSize: '0.68rem',
          color: 'rgba(201,168,76,0.5)', letterSpacing: '0.2em'
        }}>
          {currentPageIndex + 1} / {allPages.length}
        </span>

        {!isEditing ? (
          <button
            onClick={startEdit}
            style={{
              background: 'none', border: '1px solid rgba(201,168,76,0.3)',
              color: 'rgba(201,168,76,0.6)', fontFamily: 'Cinzel, serif',
              fontSize: '0.68rem', letterSpacing: '0.1em',
              padding: '6px 10px', cursor: 'pointer', borderRadius: '3px'
            }}
          >
            EDIT
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSaveEdit} style={{ padding: '6px 12px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '0.75rem', cursor: 'pointer' }}>SAVE</button>
            <button onClick={handleDeletePage} style={{ padding: '6px 12px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '0.75rem', cursor: 'pointer' }}>DEL</button>
            <button onClick={() => setIsEditing(false)} style={{ padding: '6px 12px', background: '#555', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '0.75rem', cursor: 'pointer' }}>✕</button>
          </div>
        )}
      </div>

      {/* ── PAGE CONTENT ── */}
      <div style={{
        paddingTop: '68px', paddingBottom: '100px',
        maxWidth: '680px', margin: '0 auto',
        padding: '68px 20px 100px',
      }}>
        {/* Spine accent bar */}
        <div style={{
          width: '3px', height: '40px',
          background: 'linear-gradient(180deg, #c9a84c, transparent)',
          margin: '0 auto 24px',
          borderRadius: '2px',
        }} />

        {isEditing ? (
          <div style={{ background: '#f5ead6', padding: '24px', borderRadius: '4px' }}>
            {isFirstPageOfChapter && (
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                style={{
                  width: '100%', marginBottom: '16px', padding: '10px',
                  fontSize: '1.3rem', textAlign: 'center',
                  fontFamily: 'Playfair Display, serif',
                  border: '1px solid #c9a84c', background: 'white',
                  boxSizing: 'border-box'
                }}
                placeholder="Chapter Title"
              />
            )}
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              style={{
                width: '100%', minHeight: '60vh',
                border: '1px solid #c9a84c', padding: '12px',
                fontSize: '1rem', fontFamily: "'Crimson Text', serif",
                lineHeight: '1.8', background: 'white', boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>
        ) : (
          <div style={{
            background: '#f5ead6',
            padding: 'clamp(24px, 6vw, 56px) clamp(20px, 6vw, 48px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 4px 0 8px rgba(0,0,0,0.05)',
            minHeight: '70vh',
            position: 'relative',
          }}>
            {/* Chapter label + title */}
            {isFirstPageOfChapter && (
              <>
                <div style={{
                  fontFamily: 'Cinzel, serif', fontSize: '0.68rem',
                  letterSpacing: '0.3em', color: '#8b6914',
                  textAlign: 'center', textTransform: 'uppercase', marginBottom: '6px'
                }}>
                  Chapter {allPages.slice(0, currentPageIndex + 1).filter((p, idx) =>
                    idx === 0 || allPages[idx - 1].chapterId !== p.chapterId
                  ).length}
                </div>
                <h1 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.4rem, 5vw, 2rem)',
                  fontStyle: 'italic',
                  color: '#1a1208',
                  textAlign: 'center',
                  marginBottom: '2rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid #8b6914',
                }}>
                  {currentPage.chapterTitle}
                </h1>
              </>
            )}

            {/* Drop cap + paragraphs */}
            <div>
              {currentPage.text
                ? renderText(currentPage.text)
                : <p style={{ fontStyle: 'italic', color: 'rgba(26,18,8,0.3)', textAlign: 'center' }}>This page is empty.</p>
              }
            </div>

            {/* Page number */}
            <div style={{
              textAlign: 'center', fontFamily: 'Cinzel, serif',
              fontSize: '0.7rem', color: '#8b6914',
              marginTop: '2.5rem', letterSpacing: '0.2em'
            }}>
              — {currentPageIndex + 1} —
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      {!isEditing && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(13,10,6,0.96)',
          borderTop: '1px solid rgba(201,168,76,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', height: '64px',
        }}>
          <button
            onClick={goPrev}
            disabled={currentPageIndex === 0}
            style={{
              background: 'none',
              border: '1px solid rgba(201,168,76,0.4)',
              color: currentPageIndex === 0 ? 'rgba(201,168,76,0.2)' : '#c9a84c',
              fontFamily: 'Cinzel, serif', fontSize: '1.2rem',
              width: '52px', height: '44px', cursor: currentPageIndex === 0 ? 'default' : 'pointer',
              borderRadius: '4px',
            }}
          >
            ←
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.65rem', color: 'rgba(201,168,76,0.4)', letterSpacing: '0.2em' }}>
              {currentPage.chapterTitle}
            </div>
          </div>

          <button
            onClick={goNext}
            disabled={currentPageIndex === allPages.length - 1}
            style={{
              background: 'none',
              border: '1px solid rgba(201,168,76,0.4)',
              color: currentPageIndex === allPages.length - 1 ? 'rgba(201,168,76,0.2)' : '#c9a84c',
              fontFamily: 'Cinzel, serif', fontSize: '1.2rem',
              width: '52px', height: '44px', cursor: currentPageIndex === allPages.length - 1 ? 'default' : 'pointer',
              borderRadius: '4px',
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}