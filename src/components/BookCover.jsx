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
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'relative',
        height: '90vh',
        width: 'auto',
      }}>
        <img
          src="/book_cover.png"
          alt="Book Cover"
          style={{
            height: '100%',
            width: 'auto',
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