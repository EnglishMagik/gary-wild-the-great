import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookStore } from '../store/bookStore';

export default function StudioPage() {
  const navigate = useNavigate();

  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const chapters = useBookStore((s) => s.chapters);
  const processVoiceInput = useBookStore((s) => s.processVoiceInput);
  const deleteChapter = useBookStore((s) => s.deleteChapter);

  const recognitionRef = useRef(null);
  const finalChunksRef = useRef([]); // 🔥 canonical storage
  const textRef = useRef('');

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // ---------------- SPEECH RECOGNITION (STABLE VERSION) ----------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (!t) continue;

        const cleaned = t.trim();

        if (event.results[i].isFinal) {
          // 🔥 HARD DEDUPE: only store unique final chunks
          if (!finalChunksRef.current.includes(cleaned)) {
            finalChunksRef.current.push(cleaned);
          }
        } else {
          interim += cleaned + ' ';
        }
      }

      // 🔥 rebuild text from truth source (NO APPENDING BUGS)
      const finalText = finalChunksRef.current.join(' ');

      setText(finalText + interim);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setStatus('⚠️ Microphone error');
    };

    // ❌ IMPORTANT FIX:
    // DO NOT auto-restart (this causes repeats + mobile chaos)
    recognition.onend = () => {
      setIsRecording(false);
      setStatus('⏸ Paused (press RECORD to continue)');
    };
  }, []);

  // ---------------- CONTROLS ----------------
  const toggleRecording = () => {
    const rec = recognitionRef.current;
    if (!rec) return;

    if (isRecording) {
      rec.stop();
      setIsRecording(false);
      setStatus('✅ Recording stopped.');
    } else {
      // 🔥 FULL RESET ON START
      finalChunksRef.current = [];
      setText('');

      try {
        rec.start();
        setIsRecording(true);
        setStatus('🎤 Listening...');
      } catch (e) {
        console.log('start error:', e);
      }
    }
  };

  const handleSave = () => {
    const current = textRef.current;
    if (!current.trim()) return setStatus('⚠️ Please enter text first.');

    processVoiceInput(current, selectedId || null, newTitle || null);

    setText('');
    finalChunksRef.current = [];
    textRef.current = '';
    setNewTitle('');
    setSelectedId('');
    setStatus('✅ Saved!');
  };

  const handleDelete = () => {
    if (!selectedId) return;
    if (window.confirm('Delete chapter?')) {
      deleteChapter(selectedId);
      setSelectedId('');
    }
  };

  // ---------------- UI ----------------
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#000',
    }}>

      {/* NAV */}
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        padding: '8px',
        background: '#2c2c2c',
        flexShrink: 0,
      }}>
        {[
          { label: 'COVER', path: '/' },
          { label: 'CONTENTS', path: '/contents' },
          { label: 'READ', path: '/reader' },
          { label: 'WRITE', path: '/studio' },
        ].map(b => (
          <button
            key={b.path}
            onClick={() => navigate(b.path)}
            style={{
              padding: '4px 14px',
              borderRadius: '4px',
              border: 'none',
              background: b.path === '/studio' ? '#388E3C' : '#ddd',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {b.label}
          </button>
        ))}
      </nav>

      {/* MAIN */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '10px',
        overflow: 'auto',
      }}>

        {/* RECORD */}
        <button
          onClick={toggleRecording}
          style={{
            padding: '14px',
            background: isRecording ? '#c00' : '#2ecc71',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '6px',
          }}
        >
          {isRecording ? 'STOP' : 'RECORD'}
        </button>

        {/* TEXT */}
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            finalChunksRef.current = e.target.value ? [e.target.value] : [];
          }}
          placeholder="Speak or type..."
          style={{
            flex: 1,
            minHeight: '300px',
            width: '100%',
            fontSize: '18px',
            padding: '12px',
            background: '#111',
            color: '#fff',
            border: '1px solid #444',
            resize: 'none',
            overflowY: 'auto',
          }}
        />

        {/* CHAPTER INPUT */}
        <input
          placeholder="Chapter name"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ padding: '10px' }}
        />

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ padding: '10px' }}
        >
          <option value="">Select chapter</option>
          {chapters.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        {selectedId && (
          <button onClick={handleDelete}>Delete</button>
        )}

        {/* SAVE */}
        <button
          onClick={handleSave}
          style={{
            padding: '14px',
            background: '#d4af37',
            fontWeight: 'bold',
          }}
        >
          SAVE
        </button>

        {status && (
          <div style={{ color: '#d4af37', textAlign: 'center' }}>
            {status}
          </div>
        )}

      </div>
    </div>
  );
}