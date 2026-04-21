import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ContentsPage.css'

export default function ContentsPage() {
  const navigate = useNavigate()

  const portals = [
    { route: '/chapters', label: 'Life Chapters', icon: '📖', description: 'The story of Gary' },
    { route: '/gallery',  label: 'Gallery',       icon: '🖼',  description: 'Moments in time'  },
    { route: '/audio',    label: 'Audio Footprints', icon: '🎵', description: 'His voice, his music' },
  ]

  return (
    <div className="portals-page">

      {/* CROWN IN WHITE CIRCLE */}
      <div style={{
        position: 'absolute',
        top: '18%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        width: '65px',
        height: '65px',
        borderRadius: '50%',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 3px 12px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        overflow: 'hidden',
        padding: 0,
      }}
        onClick={() => navigate('/')}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)'
          e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.45)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1)'
          e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.3)'
        }}
      >
        <img src="/crown.png" alt="Book Cover" style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}/>
      </div>

      {/* GEAR IN WHITE CIRCLE */}
      <div style={{
        position: 'absolute',
        bottom: '18%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 3px 12px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        fontSize: '2rem',
      }}
        onClick={() => navigate('/admin')}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)'
          e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.45)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1)'
          e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.3)'
        }}
      >
        ⚙
      </div>

      {/* 3 PORTAL CIRCLES */}
      <div className="portals-row" style={{ marginTop: '5rem' }}>
        {portals.map((p) => (
          <div
            key={p.route}
            className="portal-circle"
            onClick={() => navigate(p.route)}
          >
            <div className="portal-icon">{p.icon}</div>
            <div className="portal-label">{p.label}</div>
            <div className="portal-desc">{p.description}</div>
          </div>
        ))}
      </div>

    </div>
  )
}