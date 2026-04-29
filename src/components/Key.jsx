import React, { useState } from 'react'

export default function Key({ onKeyUsed }) {
  const [clicked, setClicked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <style>{`
        @keyframes magicPulse {
          0%   { filter: brightness(1) drop-shadow(0 0 5px white); }
          50%  { filter: brightness(2.5) drop-shadow(0 0 30px rgba(255,255,255,1)); }
          100% { filter: brightness(1.5) drop-shadow(0 0 15px rgba(200,230,255,0.8)); }
        }
        @keyframes keyFloat {
          0%, 100% { transform: rotate(180deg) scale(0.85) translateY(0px); }
          50%       { transform: rotate(180deg) scale(0.85) translateY(-4px); }
        }
      `}</style>
      <img
        src="/gary_book_key.png"
        alt="Unlock the book"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        onClick={() => {
          setClicked(true)
          setTimeout(onKeyUsed, 1200)
        }}
        style={{
          position: 'absolute',
          /* Lock is on right side ~72% down the cover */
          top: '69%',
          right: '2%',
          width: '32%',
          height: 'auto',
          zIndex: 99999,
          cursor: 'pointer',
          animation: clicked
            ? 'magicPulse 1.5s infinite ease-in-out'
            : 'keyFloat 3s ease-in-out infinite',
          filter: isHovered
            ? 'drop-shadow(0 0 12px rgba(255,255,255,0.9)) brightness(1.5)'
            : 'drop-shadow(0 0 8px rgba(201,168,76,0.5))',
          transform: clicked
            ? 'rotate(180deg) scale(0.5) translate(50%, 50%)'
            : isHovered
            ? 'rotate(180deg) scale(0.95)'
            : 'rotate(180deg) scale(0.85)',
          transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s',
        }}
      />
    </>
  )
}