import React from 'react'
import Key from './Key'

export default function BookCover({ onOpenComplete }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'relative',
        /* 
          This is the key fix: we use min() to pick whichever is smaller —
          90% of the viewport height OR 90% of the viewport width.
          This ensures the book never overflows in either direction,
          whether the phone is portrait or landscape.
        */
        height: 'min(90vh, 90vw * 1.3)',
        width: 'auto',
        maxHeight: '95vh',
        maxWidth: '95vw',
      }}>
        <img
          src="/book_cover.png"
          alt="Book Cover"
          style={{
            height: '100%',
            width: 'auto',
            maxWidth: '95vw',
            maxHeight: '95vh',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
          }}
        />
        <Key onKeyUsed={onOpenComplete} />
      </div>
    </div>
  )
}