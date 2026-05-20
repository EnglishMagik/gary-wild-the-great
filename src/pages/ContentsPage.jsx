import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ContentsPage.css'

const ADMIN_PASSWORD = 'weareONE1#'

export default function ContentsPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [shake, setShake]       = useState(false)
  const [isMobile]              = useState(() =>
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768
  )

  const portals = [
    { route: '/chapters', label: 'Life Chapters',    icon: '📖', description: 'The story of Gary'    },
    { route: '/gallery',  label: 'Gallery',          icon: '🖼',  description: 'Moments in time'      },
    { route: '/audio',    label: 'Audio Footprints', icon: '🎵',  description: 'His voice, his music'  },
  ]

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      navigate('/admin')
    } else {
      setShake(true)
      setPassword('')
      setTimeout(() => setShake(false), 500)
    }
  }

  // ── MOBILE LAYOUT ─────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="portals-page">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.2rem',
          padding: '2rem 1rem',
          width: '100%',
          boxSizing: 'border-box',
          minHeight: '100vh',
        }}>

          {/* CROWN — small, back to cover */}
          <div
            onClick={() => navigate('/')}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 3px 12px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img src="/crown.png" alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* PASSWORD BOX — replaces gear, enters admin */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
            maxWidth: '260px',
          }}>
            <div style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.6rem',
              color: 'rgba(245,234,214,0.7)',
              letterSpacing: '0.2em',
            }}>
              ENTER TO ADMIN
            </div>
            <div style={{
              display: 'flex',
              gap: '0.4rem',
              width: '100%',
              animation: shake ? 'shake 0.4s ease' : 'none',
            }}>
              <style>{`
                @keyframes shake {
                  0%,100% { transform: translateX(0); }
                  20%     { transform: translateX(-6px); }
                  40%     { transform: translateX(6px); }
                  60%     { transform: translateX(-4px); }
                  80%     { transform: translateX(4px); }
                }
              `}</style>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                placeholder="••••••••••"
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(201,168,76,0.5)',
                  borderRadius: '999px',
                  color: '#f5ead6',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.8rem',
                  outline: 'none',
                  textAlign: 'center',
                }}
              />
              <button
                onClick={handlePasswordSubmit}
                style={{
                  background: 'rgba(201,168,76,0.25)',
                  border: '1px solid rgba(201,168,76,0.5)',
                  borderRadius: '999px',
                  padding: '0.5rem 0.9rem',
                  color: '#c9a84c',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                }}
              >
                ↵
              </button>
            </div>
          </div>

          {/* THREE PORTAL CIRCLES */}
          <div className="portals-row">
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
      </div>
    )
  }

  // ── DESKTOP LAYOUT (unchanged) ────────────────────────────────────────────
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
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
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
