import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './styles/global.css'
import RotateNudge from './components/shared/RotateNudge'

import HomePage      from './pages/HomePage'
import ContentsPage  from './pages/ContentsPage'
import DedicationPage from './pages/DedicationPage'
import ChaptersPage  from './pages/ChaptersPage'
import GalleryPage   from './pages/GalleryPage'
import AudioPage     from './pages/AudioPage'
import ReaderPage    from './pages/ReaderPage'
import StudioPage    from './pages/StudioPage'
import AdminPage     from './pages/AdminPage'

function AppContent() {
  const location = useLocation()
  // Cover page is the only page that looks good in portrait
  const isCover = location.pathname === '/'

  return (
    <>
      {/* Show rotate nudge on all pages EXCEPT the cover */}
      {!isCover && <RotateNudge />}

      <Routes>
        <Route path="/"                           element={<HomePage />} />
        <Route path="/contents"                   element={<ContentsPage />} />
        <Route path="/dedication"                 element={<DedicationPage />} />
        <Route path="/chapters"                   element={<ChaptersPage />} />
        <Route path="/gallery"                    element={<GalleryPage />} />
        <Route path="/audio"                      element={<AudioPage />} />
        <Route path="/reader"                     element={<ReaderPage />} />
        <Route path="/read/:chapterId/:pageIndex" element={<ReaderPage />} />
        <Route path="/studio"                     element={<StudioPage />} />
        <Route path="/admin/*"                    element={<AdminPage />} />
        <Route path="*"                           element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}