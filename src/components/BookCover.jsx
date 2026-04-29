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
        /* On mobile portrait: fill width. On desktop: fill height. */
        width: 'min(90vw, calc(90vh * 0.75))',
        height: 'auto',
      }}>
        <img
          src="/book_cover.png"
          alt="Book Cover"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
          }}
        />
        <Key onKeyUsed={onOpenComplete} />
      </div>
    </div>
  )
}