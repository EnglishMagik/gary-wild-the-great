import React from 'react'
import { useBookStore } from '../../store/bookStore'

export default function Toast() {
  const msg = useBookStore((s) => s.toast)
  return <div className={`toast ${msg ? 'visible' : ''}`}>{msg}</div>
}