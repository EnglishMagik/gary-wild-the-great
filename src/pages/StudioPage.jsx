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
  const uploadRef = useRef(null);
  const textRef = useRef('');

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSnippet = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcriptSnippet + ' ';
          } else {
            interimTranscript += transcriptSnippet;
          }
        }
        setText(finalTranscriptRef.current + interimTranscript);
      };
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setStatus("✅ Recording stopped.");
    } else {
      finalTranscriptRef.current = text;
      recognitionRef.current?.start();
      setIsRecording(true);
      setStatus("🎤 Listening...");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStatus("⏳ Transcribing your audio...");
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('model', 'whisper-1');
    try {
      const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Transcription failed');
      const data = await res.json();
      const transcribed = data.text || '';
      const updated = textRef.current ? textRef.current + '\n\n' + transcribed : transcribed;
      setText(updated);
      finalTranscriptRef.current = updated;
      setStatus("✅ Transcription complete! Edit the text then save.");
    } catch (err) {
      setStatus("❌ Upload failed. Check your API key in .env");
    }
    e.target.value = '';
  };

  const handleSave = () => {
    const current = textRef.current;
    if (!current.trim()) return setStatus("⚠️ Please enter text first.");
    processVoiceInput(current, selectedId || null, newTitle || null);
    setText('');
    finalTranscriptRef.current = '';
    textRef.current = '';
    setNewTitle('');
    setSelectedId('');
    setStatus("✅ Saved! Check your Table of Contents.");
  };

  const handleDelete = () => {
    if (!selectedId) return setStatus("⚠️ Select a chapter to delete.");
    if (window.confirm("Permanently delete this chapter and all its text?")) {
      deleteChapter(selectedId);
      setSelectedId('');
      setStatus("🗑️ Deleted.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000' }}>

      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        background: '#2c2c2c',
        padding: '8px',
        flexShrink: 0,
      }}>
        {[
          { label: 'COVER',    path: '/'        },
          { label: 'CONTENTS', path: '/contents' },
          { label: 'READ',     path: '/reader'   },
          { label: '✎ WRITE',  path: '/studio'   },
          { label: '⚙ ADMIN',  path: '/admin'    },
        ].map(({ label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              padding: '2px 18px',
              background: path === '/studio' ? '#388E3C' : '#e0e0e0',
              color: path === '/studio' ? 'white' : '#333',
              border: 'none',
              borderRadius: '3px',
              fontFamily: 'Cinzel, serif',
              fontWeight: '700',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <main style={{
        flex: 1,
        padding: '10px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={toggleRecording}
            style={{
              flex: 1, padding: '12px',
              background: isRecording ? '#cc0000' : (text ? '#2ecc71' : '#222'),
              color: '#fff', border: '1px solid #d4af37', fontWeight: 'bold', borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isRecording ? '⏹ STOP RECORDING' : '🎤 START RECORDING'}
          </button>
          <input ref={uploadRef} type="file" accept="audio/*,video/*" style={{ display: 'none' }} onChange={handleUpload} />
          <button
            onClick={() => uploadRef.current.click()}
            style={{
              flex: 1, padding: '12px', background: '#222',
              color: '#d4af37', border: '1px solid #d4af37', borderRadius: '4px', cursor: 'pointer'
            }}
          >
            📁 Upload Audio
          </button>
        </div>

        <div style={{ flex: 1, border: '1px solid #d4af37', background: '#111', overflowY: 'auto', minHeight: 0 }}>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); finalTranscriptRef.current = e.target.value; }}
            placeholder="Speak or type your story here..."
            style={{
              width: '100%', height: '100%', background: 'transparent', color: '#fff',
              border: 'none', padding: '12px', fontSize: '18px', outline: 'none', resize: 'none',
              fontFamily: 'serif', lineHeight: '1.6', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ background: '#111', padding: '12px', border: '1px solid #333', flexShrink: 0 }}>
          <input
            placeholder="New Chapter Name..."
            value={newTitle}
            onChange={(e) => { setNewTitle(e.target.value); setSelectedId(''); }}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#222', color: '#fff', border: '1px solid #444', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '5px' }}>
            <select
              value={selectedId}
              onChange={(e) => { setSelectedId(e.target.value); setNewTitle(''); }}
              style={{ flex: 1, padding: '10px', background: '#222', color: '#fff' }}
            >
              <option value="">-- Add to / Select Chapter --</option>
              {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.title}</option>)}
            </select>
            {selectedId && (
              <button onClick={handleDelete} style={{ background: '#441111', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '0 15px', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            width: '100%', padding: '16px', background: '#d4af37', color: '#000',
            fontWeight: 'bold', border: 'none', fontSize: '18px', borderRadius: '4px',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          SAVE TO BOOK
        </button>

        {status && <p style={{ textAlign: 'center', color: '#d4af37', margin: '5px 0', flexShrink: 0 }}>{status}</p>}
      </main>
    </div>
  );
}