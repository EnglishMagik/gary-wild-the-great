import React, { useState, useRef, useEffect } from 'react';
import { useBookStore } from '../store/bookStore';
import { useNavigate } from 'react-router-dom';

export default function StudioPage() {
  const [text, setText]               = useState('');
  const [status, setStatus]           = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [newTitle, setNewTitle]       = useState('');
  const [selectedId, setSelectedId]   = useState('');

  const navigate          = useNavigate();
  const chapters          = useBookStore((s) => s.chapters);
  const processVoiceInput = useBookStore((s) => s.processVoiceInput);
  const deleteChapter     = useBookStore((s) => s.deleteChapter);

  const recognitionRef   = useRef(null);
  const committedTextRef = useRef('');  // confirmed final text as a plain string
  const lastFinalRef     = useRef('');  // exact-match guard
  const processedCountRef = useRef(0);  // how many results we have already finalised

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('❌ Speech recognition not supported. Use Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous     = true;
    recognition.interimResults = true;
    recognition.lang           = 'en-US';

    recognition.onresult = (event) => {
      // ─────────────────────────────────────────────────────────────────────
      // THE ANDROID BUG (confirmed by screenshot pattern):
      //
      // On Android Chrome, event.resultIndex is frequently reset to 0 on
      // every single onresult call. This means the loop replays ALL results
      // from the very beginning every time — not just the new ones.
      //
      // THE FIX:
      // We track processedCountRef ourselves — the number of results we have
      // already committed as final. We only loop from that index forward.
      // Interim is ONLY taken from the very last result in the event.
      // ─────────────────────────────────────────────────────────────────────

      const results = event.results;

      // Process any NEW final results we haven't seen yet
      for (let i = processedCountRef.current; i < results.length; i++) {
        if (results[i].isFinal) {
          const clean = results[i][0].transcript.trim().replace(/\s+/g, ' ');

          // Exact-match duplicate guard
          if (clean && clean !== lastFinalRef.current) {
            lastFinalRef.current = clean;
            committedTextRef.current = (committedTextRef.current + ' ' + clean).trim();
          }

          // Advance our counter so we never process this result again
          processedCountRef.current = i + 1;
        }
      }

      // Show committed text + ONLY the very last result if it's interim
      const lastResult = results[results.length - 1];
      const currentInterim = (!lastResult.isFinal)
        ? lastResult[0].transcript.trim()
        : '';

      const display = committedTextRef.current
        + (currentInterim ? ' ' + currentInterim : '');

      setText(display.trim());
    };

    recognition.onerror = (e) => {
      if (e.error !== 'no-speech') {
        setStatus(`⚠️ Mic error: ${e.error}`);
        setIsRecording(false);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // ── Start ────────────────────────────────────────────────────────────────
  const startRecording = () => {
    // Seed committed text with whatever is already in the box
    committedTextRef.current  = text.trim();
    lastFinalRef.current      = '';
    processedCountRef.current = 0;

    try {
      recognitionRef.current?.start();
      setIsRecording(true);
      setStatus('🎤 Listening…');
    } catch (e) {
      setStatus('⚠️ Could not start mic. Tap again.');
    }
  };

  // ── Stop ─────────────────────────────────────────────────────────────────
  const stopRecording = () => {
    try { recognitionRef.current?.stop(); } catch (_) {}
    setIsRecording(false);
    setStatus('✅ Recording stopped.');
  };

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = () => {
    const finalText = committedTextRef.current.trim() || text.trim();
    if (!finalText) return setStatus('⚠️ Nothing to save yet.');

    processVoiceInput(
      finalText,
      newTitle.trim() ? null : (selectedId || null),
      newTitle.trim() || null
    );

    committedTextRef.current  = '';
    lastFinalRef.current      = '';
    processedCountRef.current = 0;
    setText('');
    setNewTitle('');
    setSelectedId('');
    setStatus('✅ Saved! Tap CONTENTS to see it.');
  };

  // ── Delete chapter ────────────────────────────────────────────────────────
  const handleDelete = () => {
    if (!selectedId) return setStatus('⚠️ Select a chapter to delete.');
    if (window.confirm('Permanently delete this chapter and all its pages?')) {
      deleteChapter(selectedId);
      setSelectedId('');
      setStatus('🗑️ Deleted.');
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────────
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
        minHeight: '200px',
        border: '1px solid rgba(201,168,76,0.4)',
        background: '#1a1208',
        borderRadius: '6px',
        overflow: 'hidden',
      }}>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            committedTextRef.current  = e.target.value;
            processedCountRef.current = 0;
            lastFinalRef.current      = '';
          }}
          placeholder="Speak or type your story here…"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '200px',
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
