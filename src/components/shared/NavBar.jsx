import React from 'react'
import { NavLink } from 'react-router-dom'
import './NavBar.css'

const LINKS = [
  { to: '/',         label: 'COVER'    },
  { to: '/contents', label: 'CONTENTS' },
  { to: '/reader',   label: 'READ'     },
  { to: '/studio',   label: '✎ WRITE'  },
  { to: '/admin',    label: '⚙ ADMIN'  },
]

export default function NavBar() {
  return (
    <nav className="top-button-strip">
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `slim-nav-button ${isActive ? 'active' : ''}`}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}