import React from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import NavBar from '../components/shared/NavBar'

import AdminChapters   from '../components/admin/AdminChapters'
import AdminPages      from '../components/admin/AdminPages'
import AdminMedia      from '../components/admin/AdminMedia'
import AdminDedication from '../components/admin/AdminDedication'
import AdminExport     from '../components/admin/AdminExport'

import './AdminPage.css'

export default function AdminPage() {
  return (
    <div className="admin-page-container">
      {/* 🟢 YOUR EXIT BUTTONS ARE HERE */}
      <NavBar />

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <p className="admin-sidebar-label font-cinzel">Admin Control</p>
          <NavLink to="/admin/chapters"   className={navClass}>Chapters</NavLink>
          <NavLink to="/admin/pages"      className={navClass}>Pages</NavLink>
          <NavLink to="/admin/media"      className={navClass}>Media</NavLink>
          <NavLink to="/admin/dedication" className={navClass}>Dedication</NavLink>
          <NavLink to="/admin/export"     className={navClass}>Export</NavLink>
        </aside>

        <main className="admin-main">
          <Routes>
            <Route index                  element={<Navigate to="chapters" replace />} />
            <Route path="chapters"        element={<AdminChapters />} />
            <Route path="pages"           element={<AdminPages />} />
            <Route path="media"           element={<AdminMedia />} />
            <Route path="dedication"      element={<AdminDedication />} />
            <Route path="export"          element={<AdminExport />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function navClass({ isActive }) {
  return `admin-nav-link font-cinzel${isActive ? ' active' : ''}`
}