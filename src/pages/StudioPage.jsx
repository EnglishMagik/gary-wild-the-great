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
  const finalTranscriptRef = useRef('');

  // ---------------- INIT SPEECH ----------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // ✅ FIXED: correct incremental handling (NO duplication)
    recognition.onresult = (event) => {
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscriptRef.current += result.trim() + ' ';
        } else {
          interim += result;
        }
      }

      setText((finalTranscriptRef.current + interim).trim());
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setStatus('⚠️ Mic error');
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  }, []);

  // ---------------- TOGGLE RECORD ----------------
  const toggleRecording = () => {
    const rec = recognitionRef.current;
    if (!rec) return;

    if (isRecording) {
      rec.stop();
      setIsRecording(false);
      setStatus('✅ Stopped');
    } else {
      rec.start();
      setIsRecording(true);
      setStatus('🎤 Listening...');
    }
  };

  // ---------------- SAVE ----------------
  const handleSave = () => {
    const clean = finalTranscriptRef.current.trim();

    if (!clean) {
      setStatus('⚠️ Enter text first.');
      return;
    }

    processVoiceInput(clean, selectedId || null, newTitle || null);

    setText('');
    finalTranscriptRef.current = '';
    setNewTitle('');
    setSelectedId('');

    setStatus('✅ Saved');
  };

  // ---------------- DELETE ----------------
  const handleDelete = () => {
    if (!selectedId) return;

    if (window.confirm('Delete chapter?')) {
      deleteChapter(selectedId);
      setSelectedId('');
      setStatus('🗑️ Deleted');
    }
  };

  // ---------------- UI ----------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000' }}>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '8px', background: '#2c2c2c' }}>
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
              border: 'none',
              borderRadius: '4px',
              background: b.path === '/studio' ? '#388E3C' : '#ddd',
              fontSize: '12px'
            }}
          >
            {b.label}
          </button>
        ))}
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}>

        <button
          onClick={toggleRecording}
          style={{
            padding: '14px',
            background: isRecording ? '#c00' : '#2ecc71',
            color: '#fff',
            fontWeight: 'bold'
          }}
        >
          {isRecording ? 'STOP' : 'RECORD'}
        </button>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            finalTranscriptRef.current = e.target.value;
          }}
          style={{
            flex: 1,
            minHeight: '300px',
            fontSize: '18px',
            padding: '12px',
            background: '#111',
            color: '#fff'
          }}
        />

        <input
          placeholder="Chapter name"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Select chapter</option>
          {chapters.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        {selectedId && (
          <button onClick={handleDelete}>Delete</button>
        )}

        <button onClick={handleSave}>SAVE</button>

        {status && <div style={{ color: '#d4af37' }}>{status}</div>}
      </div>
    </div>
  );
}