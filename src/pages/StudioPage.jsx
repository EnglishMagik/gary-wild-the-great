import React, { useState, useRef, useEffect } from 'react';
import { useBookStore } from '../store/bookStore';
import { useNavigate } from 'react-router-dom';

const isMobile = () =>
  /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ||
  window.innerWidth <= 768;

export default function StudioPage() {
  const [text, setText]               = useState('');
  const [status, setStatus]           = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [newTitle, setNewTitle]       = useState('');
  const [selectedId, setSelectedId]   = useState('');
  const [mobile]                      = useState(() => isMobile());

  const navigate          = useNavigate();
  const chapters          = useBookStore((s) => s.chapters);
  const processVoiceInput = useBookStore((s) => s.processVoiceInput);
  const deleteChapter     = useBookStore((s) => s.deleteChapter);

  const recognitionRef   = useRef(null);
  const committedTextRef = useRef('');
  const lastFinalRef     = useRef('');
  // Mirrors isRecording so onend can read the LIVE value (state is stale in callbacks)
  const isRecordingRef   = useRef(false);
  const textareaRef      = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('❌ Speech recognition not supported. Use Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous     = true;
    recognition.lang           = 'en-US';
    // Mobile: false — Android sends the growing sentence on every word, causing duplicates
    // Desktop: true — gives live word-by-word preview
    recognition.interimResults = !mobile;

    recognition.onresult = (event) => {
      // Process final results — both platforms
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (!event.results[i].isFinal) continue;

        const clean = event.results[i][0].transcript.trim().replace(/\s+/g, ' ');
        if (!clean) continue;
        if (clean === lastFinalRef.current) continue; // duplicate guard
        lastFinalRef.current = clean;

        committedTextRef.current = (committedTextRef.current + ' ' + clean).trim();
      }

      // Desktop: also show live interim preview on top of committed text
      let display = committedTextRef.current;
      if (!mobile) {
        const last = event.results[event.results.length - 1];
        if (!last.isFinal) {
          display = (committedTextRef.current + ' ' + last[0].transcript.trim()).trim();
        }
      }

      setText(display);

      // Auto-scroll textarea to bottom so latest text is always visible
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      }, 0);
    };

    recognition.onerror = (e) => {
      // no-speech and aborted are normal — do not stop recording for these
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      setStatus(`⚠️ Mic error: ${e.error}`);
      isRecordingRef.current = false;
      setIsRecording(false);
    };

    // KEY FIX: Android kills the session after ~2s silence.
    // If isRecordingRef is still true, the USER hasn't stopped — restart immediately.
    recognition.onend = () => {
      if (isRecordingRef.current) {
        setTimeout(() => {
          try { recognition.start(); } catch (_) {}
        }, mobile ? 100 : 300);
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognition;

    // ── CLEANUP (Sally-approved) ───────────────────────────────────────────
    // When the user navigates away, kill the recognition session completely.
    // Without this, onend keeps firing and restarting, causing the ping loop.
    return () => {
      isRecordingRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.onend   = null;
        recognitionRef.current.onerror = null;
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, [mobile]);

  // ── Start ──────────────────────────────────────────────────────────────
  const startRecording = () => {
    committedTextRef.current = text.trim();
    lastFinalRef.current     = '';
    isRecordingRef.current   = true;

    try {
      recognitionRef.current?.start();
      setIsRecording(true);
      setStatus(mobile ? '🎤 Listening… text appears after each pause' : '🎤 Listening…');
    } catch (e) {
      isRecordingRef.current = false;
      setStatus('⚠️ Could not start mic. Tap again.');
    }
  };

  // ── Stop ───────────────────────────────────────────────────────────────
  const stopRecording = () => {
    // MUST set ref to false BEFORE calling .stop() — otherwise onend restarts
    isRecordingRef.current = false;
    setIsRecording(false);
    try { recognitionRef.current?.stop(); } catch (_) {}
    setStatus('✅ Recording stopped.');
  };

  // ── Save ───────────────────────────────────────────────────────────────
  const handleSave = () => {
    const finalText = committedTextRef.current.trim() || text.trim();
    if (!finalText) return setStatus('⚠️ Nothing to save yet.');

    const hasNewTitle    = newTitle.trim().length > 0;
    const hasChapterId   = selectedId.length > 0;

    if (hasNewTitle) {
      // Create a brand new chapter with this title
      processVoiceInput(finalText, null, newTitle.trim());
    } else if (hasChapterId) {
      // Add to the selected existing chapter
      processVoiceInput(finalText, selectedId, null);
    } else {
      // No selection — add to last chapter, or create one called "My Story"
      processVoiceInput(finalText, null, null);
    }

    committedTextRef.current = '';
    lastFinalRef.current     = '';
    setText('');
    setNewTitle('');
    setSelectedId('');
    setStatus('✅ Saved! Tap CONTENTS to see it.');
  };

  // ── Delete chapter ─────────────────────────────────────────────────────
  const handleDelete = () => {
    if (!selectedId) return setStatus('⚠️ Select a chapter to delete.');
    if (window.confirm('Permanently delete this chapter and all its pages?')) {
      deleteChapter(selectedId);
      setSelectedId('');
      setStatus('🗑️ Deleted.');
    }
  };

  // ── UI ─────────────────────────────────────────────────────────────────
  return (
    <main style={{
      padding: '10px',
      background: '#0d0a06',
      color: '#f5ead6',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      boxSizing: 'border-box',
    }}>

      {/* TOP BAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => navigate('/contents')}
          style={{
            padding: '8px 14px',
            background: 'transparent',
            color: '#c9a84c',
            border: '1px solid #c9a84c',
            borderRadius: '4px',
            fontFamily: 'Cinzel, serif',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          ← CONTENTS
        </button>
        <span style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: 'Cinzel, serif',
          fontSize: '0.9rem',
          color: '#c9a84c',
          letterSpacing: '0.2em',
        }}>
          WRITING STUDIO
        </span>
        <div style={{ width: '90px' }} />
      </div>

      {/* RECORD BUTTON */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={{
          padding: '16px',
          background: isRecording
            ? 'linear-gradient(135deg, #8b0000, #cc0000)'
            : 'linear-gradient(135deg, #1a4a1a, #2ecc71)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontFamily: 'Cinzel, serif',
          fontWeight: 'bold',
          fontSize: '1rem',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          boxShadow: isRecording
            ? '0 0 12px rgba(204,0,0,0.5)'
            : '0 0 12px rgba(46,204,113,0.3)',
        }}
      >
        {isRecording ? '⏹  STOP RECORDING' : '🎤  START RECORDING'}
      </button>

      {/* STATUS */}
      {status && (
        <p style={{
          textAlign: 'center',
          color: '#c9a84c',
          fontStyle: 'italic',
          fontSize: '0.9rem',
          margin: 0,
        }}>
          {status}
        </p>
      )}

      {/* TEXT AREA */}
      <div style={{
        flex: 1,
        minHeight: '300px',
        border: '1px solid rgba(201,168,76,0.4)',
        background: '#1a1208',
        borderRadius: '6px',
      }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            committedTextRef.current = e.target.value;
            lastFinalRef.current     = '';
          }}
          placeholder={
            isRecording && mobile
              ? 'Speak now… text appears after each pause'
              : 'Speak or type your story here…'
          }
          style={{
            width: '100%',
            height: '100%',
            minHeight: '300px',
            background: 'transparent',
            color: '#f5ead6',
            border: 'none',
            padding: '14px',
            fontSize: '1.1rem',
            outline: 'none',
            resize: 'none',
            fontFamily: 'Crimson Text, Georgia, serif',
            lineHeight: '1.7',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        />
      </div>

      {/* CHAPTER MANAGEMENT */}
      <div style={{
        background: '#1a1208',
        padding: '12px',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <input
          placeholder="New chapter title…"
          value={newTitle}
          onChange={(e) => { setNewTitle(e.target.value); setSelectedId(''); }}
          style={{
            padding: '10px',
            background: '#0d0a06',
            color: '#f5ead6',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '4px',
            fontSize: '1rem',
          }}
        />

        <div style={{ display: 'flex', gap: '6px' }}>
          <select
            value={selectedId}
            onChange={(e) => { setSelectedId(e.target.value); setNewTitle(''); }}
            style={{
              flex: 1,
              padding: '10px',
              background: '#0d0a06',
              color: '#f5ead6',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          >
            <option value="">— Or add to existing chapter —</option>
            {chapters.map(ch => (
              <option key={ch.id} value={ch.id}>{ch.title}</option>
            ))}
          </select>

          {selectedId && (
            <button
              onClick={handleDelete}
              title="Delete this chapter"
              style={{
                background: '#441111',
                color: '#ff4d4d',
                border: '1px solid #ff4d4d',
                padding: '0 14px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        disabled={!text.trim()}
        style={{
          padding: '16px',
          background: text.trim()
            ? 'linear-gradient(135deg, #8b6914, #c9a84c)'
            : '#333',
          color: text.trim() ? '#0d0a06' : '#666',
          fontFamily: 'Cinzel, serif',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          letterSpacing: '0.1em',
          border: 'none',
          borderRadius: '8px',
          cursor: text.trim() ? 'pointer' : 'not-allowed',
        }}
      >
        SAVE TO BOOK
      </button>

    </main>
  );
}
