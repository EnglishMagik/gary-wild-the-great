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

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      navigate('/admin')
    } else {
      setShake(true)
      setPassword('')
      setTimeout(() => setShake(false), 500)
    }
  }

  // ── MOBILE ────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="portals-page">
        <style>{`
          @keyframes shake {
            0%,100% { transform: translateX(0); }
            20%     { transform: translateX(-6px); }
            40%     { transform: translateX(6px); }
            60%     { transform: translateX(-4px); }
            80%     { transform: translateX(4px); }
          }
          .pw-input::placeholder { color: rgba(255,255,255,0.6); }
        `}</style>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '1.5rem 1rem 2rem',
          width: '100%',
          boxSizing: 'border-box',
          minHeight: '100vh',
        }}>

          {/* CROWN — 130px, large and centred */}
          <div
            onClick={() => navigate('/')}
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.45)',
              overflow: 'hidden',
              flexShrink: 0,
              padding: '8px',
              boxSizing: 'border-box',
            }}
          >
            <img
              src="/crown.png"
              alt="Cover"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* PASSWORD BOX — skinny, white text */}
          <div style={{
            display: 'flex',
            gap: '0.4rem',
            width: '100%',
            maxWidth: '240px',
            animation: shake ? 'shake 0.4s ease' : 'none',
          }}>
            <input
              className="pw-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="Enter to admin..."
              style={{
                flex: 1,
                padding: '0.28rem 0.75rem',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(201,168,76,0.45)',
                borderRadius: '999px',
                color: '#ffffff',
                fontFamily: 'Cinzel, serif',
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                outline: 'none',
                textAlign: 'center',
                height: '30px',
                boxSizing: 'border-box',
                caretColor: '#ffffff',
              }}
            />
            <button
              onClick={handlePasswordSubmit}
              style={{
                background: 'rgba(201,168,76,0.2)',
                border: '1px solid rgba(201,168,76,0.45)',
                borderRadius: '999px',
                padding: '0 0.75rem',
                color: '#c9a84c',
                fontFamily: 'Cinzel, serif',
                fontSize: '0.75rem',
                cursor: 'pointer',
                height: '30px',
                boxSizing: 'border-box',
              }}
            >
              ↵
            </button>
          </div>

          {/* LIFE CHAPTERS — large */}
          <div
            className="portal-circle portal-circle--large"
            onClick={() => navigate('/chapters')}
          >
            <div className="portal-icon">📖</div>
            <div className="portal-label">Life Chapters</div>
            <div className="portal-desc">The story of Gary</div>
          </div>

          {/* GALLERY + AUDIO — smaller, side by side */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <div className="portal-circle portal-circle--small" onClick={() => navigate('/gallery')}>
              <div className="portal-icon" style={{ fontSize: '1.6rem' }}>🖼</div>
              <div className="portal-label" style={{ fontSize: '0.68rem' }}>Gallery</div>
              <div className="portal-desc" style={{ fontSize: '0.62rem' }}>Moments in time</div>
            </div>
            <div className="portal-circle portal-circle--small" onClick={() => navigate('/audio')}>
              <div className="portal-icon" style={{ fontSize: '1.6rem' }}>🎵</div>
              <div className="portal-label" style={{ fontSize: '0.68rem' }}>Audio</div>
              <div className="portal-desc" style={{ fontSize: '0.62rem' }}>His voice, his music</div>
            </div>
          </div>

        </div>
      </div>
    )
  }

  // ── DESKTOP (unchanged) ───────────────────────────────────────────────────
  const portals = [
    { route: '/chapters', label: 'Life Chapters',    icon: '📖', description: 'The story of Gary'   },
    { route: '/gallery',  label: 'Gallery',          icon: '🖼',  description: 'Moments in time'     },
    { route: '/audio',    label: 'Audio Footprints', icon: '🎵',  description: 'His voice, his music' },
  ]

  return (
    <div className="portals-page">
      <div style={{
        position: 'absolute', top: '18%', left: '50%',
        transform: 'translateX(-50%)', zIndex: 10,
        width: '65px', height: '65px', borderRadius: '50%',
        background: 'white', display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer',
        boxShadow: '0 3px 12px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        overflow: 'hidden', padding: 0,
      }}
        onClick={() => navigate('/')}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)'; e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.45)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(-50%) scale(1)'; e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.3)' }}
      >
        <img src="/crown.png" alt="Book Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
      </div>

      <div style={{
        position: 'absolute', bottom: '18%', left: '50%',
        transform: 'translateX(-50%)', zIndex: 10,
        width: '38px', height: '38px', borderRadius: '50%',
        background: 'white', display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer',
        boxShadow: '0 3px 12px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s, box-shadow 0.2s', fontSize: '2rem',
      }}
        onClick={() => navigate('/admin')}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)'; e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.45)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(-50%) scale(1)'; e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.3)' }}
      >
        ⚙
      </div>

      <div className="portals-row" style={{ marginTop: '5rem' }}>
        {portals.map((p) => (
          <div key={p.route} className="portal-circle" onClick={() => navigate(p.route)}>
            <div className="portal-icon">{p.icon}</div>
            <div className="portal-label">{p.label}</div>
            <div className="portal-desc">{p.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
