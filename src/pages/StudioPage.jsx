import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookStore } from '../store/bookStore';

export default function StudioPage() {
  const navigate = useNavigate();

  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const chapters = useBookStore((s) => s.chapters);
  const processVoiceInput = useBookStore((s) => s.processVoiceInput);
  const deleteChapter = useBookStore((s) => s.deleteChapter);

  const recognitionRef = useRef(null);
  const finalRef = useRef('');

  // ---------------- INIT ----------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          final += t;
        } else {
          interim += t;
        }
      }

      if (final) {
        finalRef.current += final + ' ';
      }

      setText(finalRef.current + interim);
    };

    rec.onerror = () => {
      setStatus('Mic error');
      setIsRecording(false);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = rec;
  }, []);

  // ---------------- RECORD ----------------
  const toggleRecording = () => {
    const rec = recognitionRef.current;
    if (!rec) return;

    if (isRecording) {
      rec.stop();
      setIsRecording(false);
      setStatus('Stopped');
    } else {
      rec.start();
      setIsRecording(true);
      setStatus('Recording...');
    }
  };

  // ---------------- SAVE ----------------
  const handleSave = () => {
    if (!text.trim()) return;

    processVoiceInput(text, selectedId || null, newTitle || null);

    setText('');
    finalRef.current = '';
    setNewTitle('');
    setSelectedId('');
    setStatus('Saved');
  };

  // ---------------- DELETE ----------------
  const handleDelete = () => {
    if (!selectedId) return;
    if (window.confirm('Delete chapter?')) {
      deleteChapter(selectedId);
      setSelectedId('');
    }
  };

  // ---------------- UI ----------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000' }}>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: 10, padding: 8 }}>
        {[
          { label: 'COVER', path: '/' },
          { label: 'CONTENTS', path: '/contents' },
          { label: 'READ', path: '/reader' },
          { label: 'WRITE', path: '/studio' }
        ].map(b => (
          <button key={b.path} onClick={() => navigate(b.path)}>
            {b.label}
          </button>
        ))}
      </nav>

      <div style={{ flex: 1, padding: 10, display: 'flex', flexDirection: 'column' }}>

        <button onClick={toggleRecording}>
          {isRecording ? 'STOP' : 'RECORD'}
        </button>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            finalRef.current = e.target.value;
          }}
          style={{ flex: 1, fontSize: 18 }}
        />

        <input
          placeholder="Chapter name"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />

        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">Select chapter</option>
          {chapters.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        {selectedId && (
          <button onClick={handleDelete}>Delete</button>
        )}

        <button onClick={handleSave}>SAVE</button>

        {status && <p>{status}</p>}
      </div>
    </div>
  );
}