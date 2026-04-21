import React, { useState } from 'react';
import { useBookStore } from '../../store/bookStore';   
import { useNavigate } from 'react-router-dom';

export default function ReaderPage() {
  const navigate = useNavigate();
  const { currentPageIndex, setCurrentPage, getFlatPages } = useBookStore();
  
  const allPages = getFlatPages();
  const currentPage = allPages[currentPageIndex];

  if (!currentPage) return null;

  const isFirstPageOfChapter = currentPageIndex === 0 || allPages[currentPageIndex - 1].chapterId !== currentPage.chapterId;

  return (
    <div style={{ 
      minHeight: '100vh', 
      // 📔 LEATHER BACKDROP
      backgroundImage: 'url("/src/components/assets/Gary_leather.jpg")', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      padding: '80px 20px'
    }}>
      {/* 📄 THE WHITE TEXT PANEL */}
      <div style={{ 
        width: '100%',
        maxWidth: '800px',
        backgroundColor: '#fffcf5', // Warm white/parchment
        padding: '60px 80px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {isFirstPageOfChapter && (
          <h1 style={{ 
            textAlign: 'center', 
            fontSize: '2.2rem', 
            fontFamily: 'Cinzel, serif', 
            color: '#1a1208',
            marginBottom: '40px' 
          }}>
            {currentPage.chapterTitle}
          </h1>
        )}

        <div style={{ 
          lineHeight: '1.8', 
          fontSize: '1.2rem', 
          color: '#1a1208',
          whiteSpace: 'pre-wrap', 
          fontFamily: 'Crimson Text, serif',
          flex: 1 
        }}>
          {currentPage.text}
        </div>

        {/* PAGE NAVIGATION */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '40px', 
          borderTop: '1px solid rgba(0,0,0,0.1)', 
          paddingTop: '20px' 
        }}>
          <button onClick={() => setCurrentPage(currentPageIndex - 1)} disabled={currentPageIndex === 0} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.5rem' }}>←</button>
          <span style={{ color: '#8b6914', fontFamily: 'Cinzel' }}>{currentPageIndex + 1}</span>
          <button onClick={() => setCurrentPage(currentPageIndex + 1)} disabled={currentPageIndex === allPages.length - 1} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.5rem' }}>→</button>
        </div>
      </div>
    </div>
  );
}