import React, { useState, useRef, useEffect } from 'react';
import { useBookStore } from '../store/bookStore';

// Detect mobile once at module level
const isMobile = () => window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

export default function StudioPage() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [mobile, setMobile] = useState(isMobile());

  const chapters = useBookStore((s) => s.chapters);
  const processVoiceInput = useBookStore((s) => s.processVoiceInput);
  const deleteChapter = useBookStore((s) => s.deleteChapter);

  const recognitionRef = useRef(null);
  // ─── THE FIX: persistent store of all confirmed (final) text ───
  // This ref survives across every onresult event, preventing the
  // "repeat lines" bug where each event resets finalTranscript to ''
  const confirmedTextRef = useRef('');

  useEffect(() => {
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("❌ Speech recognition not supported in this browser. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();

    // ─── CONTINUOUS: keeps listening through pauses (critical for mobile) ───
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';

      // Loop from resultIndex (only new results, not re-processing old ones)
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const snippet = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          // Append confirmed text to the persistent ref with a space
          confirmedTextRef.current += snippet + ' ';
        } else {
          // Build interim preview (not saved yet)
          interimTranscript += snippet;
        }
      }

      // Show confirmed text + live preview of what's being said now
      setText(confirmedTextRef.current + interimTranscript);
    };

    recognition.onerror = (event) => {
      // 'no-speech' is normal on mobile — don't show as error
      if (event.error !== 'no-speech') {
        setStatus(`⚠️ Mic error: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      // On mobile, continuous mode can still end unexpectedly.
      // Auto-restart if the user hasn't deliberately stopped.
      if (recognitionRef.current?._shouldBeRecording) {
        try { recognition.start(); } catch (e) { /* already started */ }
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognition;
    recognitionRef.current._shouldBeRecording = false;
  }, []);

  const startRecording = () => {
    // Sync confirmed ref with whatever is already in the textarea
    // so the user can keep adding to existing text
    confirmedTextRef.current = text ? text.trimEnd() + ' ' : '';
    recognitionRef.current._shouldBeRecording = true;
    try {
      recognitionRef.current?.start();
      setIsRecording(true);
      setStatus("🎤 Listening… speak now");
    } catch (e) {
      setStatus("⚠️ Could not start mic. Tap again.");
    }
  };

  const stopRecording = () => {
    recognitionRef.current._shouldBeRecording = false;
    recognitionRef.current?.stop();
    setIsRecording(false);
    setStatus("✅ Recording stopped. Edit above or save.");
  };

  const handleSave = () => {
    if (!text.trim()) return setStatus("⚠️ Nothing to save yet.");
    processVoiceInput(text, selectedId || null, newTitle.trim() || null);
    setText('');
    confirmedTextRef.current = '';
    setNewTitle('');
    setSelectedId('');
    setStatus("✅ Saved to your book!");
  };

  const handleDelete = () => {
    if (!selectedId) return setStatus("⚠️ Select a chapter to delete.");
    if (!window.confirm("Delete this entire chapter and all its pages?")) return;
    deleteChapter(selectedId);
    setSelectedId('');
    setStatus("🗑️ Chapter deleted.");
  };

  // ─────────────────────────────────────────────
  //  MOBILE LAYOUT  (large, finger-friendly)
  // ─────────────────────────────────────────────
  if (mobile) {
    return (
      <main style={{
        padding: '16px',
        background: '#0d0a06',
        color: '#f5ead6',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxSizing: 'border-box',
        fontFamily: 'Crimson Text, Georgia, serif',
      }}>

        {/* TITLE */}
        <div style={{ textAlign: 'center', paddingTop: '8px' }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1rem', color: '#c9a84c', letterSpacing: '0.2em' }}>
            WRITE YOUR STORY
          </div>
        </div>

        {/* MIC BUTTON — big, central, unmissable */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            padding: '20px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            fontFamily: 'Cinzel, serif',
            background: isRecording
              ? 'linear-gradient(135deg, #8b0000, #cc0000)'
              : 'linear-gradient(135deg, #1a5c1a, #2ecc71)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: isRecording
              ? '0 0 20px rgba(204,0,0,0.5)'
              : '0 0 20px rgba(46,204,113,0.4)',
            transition: 'all 0.2s',
            letterSpacing: '0.1em',
          }}
        >
          {isRecording ? '⏹  STOP RECORDING' : '🎤  START RECORDING'}
        </button>

        {/* STATUS */}
        {status && (
          <div style={{
            textAlign: 'center',
            color: isRecording ? '#2ecc71' : '#c9a84c',
            fontSize: '0.95rem',
            fontStyle: 'italic',
            minHeight: '1.4rem',
          }}>
            {status}
          </div>
        )}

        {/* TEXT AREA — editable, scrollable */}
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            confirmedTextRef.current = e.target.value;
          }}
          placeholder="Your words will appear here as you speak… or type directly."
          style={{
            flex: 1,
            minHeight: '220px',
            background: '#1a1208',
            color: '#f5ead6',
            border: '1px solid rgba(201,168,76,0.4)',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '1.15rem',
            lineHeight: '1.75',
            fontFamily: 'Crimson Text, Georgia, serif',
            resize: 'vertical',
            outline: 'none',
          }}
        />

        {/* CHAPTER SECTION */}
        <div style={{
          background: '#1a1208',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: '8px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.72rem', color: '#c9a84c', letterSpacing: '0.15em' }}>
            SAVE TO CHAPTER
          </div>

          <input
            placeholder="Create new chapter (type name here)…"
            value={newTitle}
            onChange={(e) => { setNewTitle(e.target.value); setSelectedId(''); }}
            style={{
              padding: '12px',
              background: '#0d0a06',
              color: '#f5ead6',
              border: '1px solid rgba(201,168,76,0.35)',
              borderRadius: '6px',
              fontSize: '1rem',
              fontFamily: 'Crimson Text, Georgia, serif',
              outline: 'none',
            }}
          />

          <div style={{ textAlign: 'center', color: 'rgba(245,234,214,0.35)', fontSize: '0.8rem', fontStyle: 'italic' }}>
            — or add to existing —
          </div>

          <select
            value={selectedId}
            onChange={(e) => { setSelectedId(e.target.value); setNewTitle(''); }}
            style={{
              padding: '12px',
              background: '#0d0a06',
              color: '#f5ead6',
              border: '1px solid rgba(201,168,76,0.35)',
              borderRadius: '6px',
              fontSize: '1rem',
              fontFamily: 'Crimson Text, Georgia, serif',
              outline: 'none',
            }}
          >
            <option value="">— Select existing chapter —</option>
            {chapters.map(ch => (
              <option key={ch.id} value={ch.id}>{ch.title}</option>
            ))}
          </select>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          style={{
            padding: '18px',
            background: 'linear-gradient(135deg, #8b6914, #c9a84c)',
            color: '#0d0a06',
            fontFamily: 'Cinzel, serif',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            letterSpacing: '0.15em',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(201,168,76,0.4)',
          }}
        >
          SAVE TO BOOK
        </button>

        {/* DELETE (only shown if chapter selected) */}
        {selectedId && (
          <button
            onClick={handleDelete}
            style={{
              padding: '14px',
              background: 'transparent',
              color: '#e74c3c',
              border: '1px solid #e74c3c',
              borderRadius: '8px',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}
          >
            🗑 DELETE SELECTED CHAPTER
          </button>
        )}

        <div style={{ height: '20px' }} />
      </main>
    );
  }

  // ─────────────────────────────────────────────
  //  DESKTOP LAYOUT  (original black theme, unchanged aesthetically)
  // ─────────────────────────────────────────────
  return (
    <main style={{
      padding: '10px',
      background: '#000',
      color: '#fff',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      boxSizing: 'border-box',
    }}>

      {/* RECORD BUTTON */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={{
          padding: '14px',
          background: isRecording ? '#cc0000' : '#2ecc71',
          color: '#fff',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        {isRecording ? '⏹ STOP RECORDING' : '🎤 START RECORDING'}
      </button>

      {/* STATUS */}
      {status && (
        <p style={{ margin: 0, color: '#d4af37', fontSize: '0.85rem', fontStyle: 'italic' }}>{status}</p>
      )}

      {/* SCROLLABLE TEXT BOX */}
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          confirmedTextRef.current = e.target.value;
        }}
        placeholder="Speak or type your story here…"
        style={{
          flex: 1,
          background: '#111',
          color: '#fff',
          border: '1px solid #444',
          padding: '12px',
          fontSize: '1rem',
          fontFamily: 'serif',
          lineHeight: '1.7',
          resize: 'none',
          outline: 'none',
        }}
      />

      {/* CHAPTER MANAGEMENT */}
      <div style={{ background: '#111', padding: '12px', border: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input
          placeholder="New Chapter Name…"
          value={newTitle}
          onChange={(e) => { setNewTitle(e.target.value); setSelectedId(''); }}
          style={{ padding: '10px', background: '#222', color: '#fff', border: '1px solid #444', fontSize: '0.95rem' }}
        />
        <div style={{ display: 'flex', gap: '6px' }}>
          <select
            value={selectedId}
            onChange={(e) => { setSelectedId(e.target.value); setNewTitle(''); }}
            style={{ flex: 1, padding: '10px', background: '#222', color: '#fff', border: '1px solid #444' }}
          >
            <option value="">— Add to / Select Chapter —</option>
            {chapters.map(ch => (
              <option key={ch.id} value={ch.id}>{ch.title}</option>
            ))}
          </select>
          {selectedId && (
            <button
              onClick={handleDelete}
              title="Delete Chapter"
              style={{ background: '#441111', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '0 15px', cursor: 'pointer' }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* SAVE */}
      <button
        onClick={handleSave}
        style={{
          padding: '16px',
          background: '#d4af37',
          color: '#000',
          fontWeight: 'bold',
          border: 'none',
          fontSize: '1rem',
          cursor: 'pointer',
        }}
      >
        SAVE TO BOOK
      </button>
    </main>
  );
}
