import React from 'react'
import { useNavigate } from 'react-router-dom'
import BookCover from '../components/BookCover'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <BookCover onOpenComplete={() => navigate('/contents')} />
    </div>
  )
}