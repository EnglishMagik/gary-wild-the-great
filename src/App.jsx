import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './styles/global.css'

import HomePage      from './pages/HomePage'
import ContentsPage  from './pages/ContentsPage'
import ChaptersPage  from './pages/ChaptersPage'
import GalleryPage   from './pages/GalleryPage'
import AudioPage     from './pages/AudioPage'
import ReaderPage    from './pages/ReaderPage'
import StudioPage    from './pages/StudioPage'
import AdminPage     from './pages/AdminPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"                           element={<HomePage />} />
        <Route path="/contents"                   element={<ContentsPage />} />
        <Route path="/chapters"                   element={<ChaptersPage />} />
        <Route path="/gallery"                    element={<GalleryPage />} />
        <Route path="/audio"                      element={<AudioPage />} />
        <Route path="/reader"                     element={<ReaderPage />} />
        <Route path="/read/:chapterId/:pageIndex" element={<ReaderPage />} />
        <Route path="/studio"                     element={<StudioPage />} />
        <Route path="/admin/*"                    element={<AdminPage />} />
        <Route path="*"                           element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}