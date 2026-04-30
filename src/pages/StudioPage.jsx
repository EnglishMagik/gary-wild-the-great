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
  const textRef = useRef('');
  const lastFinalRef = useRef('');

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      let newFinals = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim();
        
        if (event.results[i].isFinal) {
          // Guard against mobile repeats
          if (transcript !== lastFinalRef.current) {
            newFinals += transcript + ' ';
            lastFinalRef.current = transcript;
          }
        } else {
          interim += transcript + ' ';
        }
      }

      // Add to current session memory without deleting what was there
      finalTranscriptRef.current += newFinals;
      setText(finalTranscriptRef.current + interim);
    };

    recognition.onerror = (e) => {
      if (e.error === 'no-speech') return;
      setStatus('⚠️ Mic error');
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setStatus('⏸ Paused (Tap Record to continue)');
    };
  }, []);

  const toggleRecording = () => {
    const rec = recognitionRef.current;
    if (!rec) return;

    if (isRecording) {
      rec.stop();
      setIsRecording(false);
      setStatus('✅ Recording stopped.');
    } else {
      // NOTICE: We do NOT clear finalTranscriptRef or text here anymore.
      // This allows you to build the text up across multiple recording bursts.
      lastFinalRef.current = ''; 
      setStatus('🎤 Listening...');
      setIsRecording(true);
      try {
        rec.start();
      } catch (e) {
        console.error("Start error", e);
      }
    }
  };

  const handleSave = () => {
    const current = textRef.current;
    if (!current.trim()) return setStatus('⚠️ No text to save.');

    processVoiceInput(current, selectedId || null, newTitle || null);

    // ONLY clear the screen once the work is safely saved to the store
    setText('');
    finalTranscriptRef.current = '';
    lastFinalRef.current = '';
    setNewTitle('');
    setSelectedId('');
    setStatus('✅ Saved to Book!');
  };

  const handleDelete = () => {
    if (selectedId && window.confirm('Delete chapter?')) {
      deleteChapter(selectedId);
      setSelectedId('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000', color: '#fff' }}>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '10px', background: '#222' }}>
        {['COVER', 'CONTENTS', 'READ', 'WRITE'].map((label, idx) => (
          <button 
            key={label} 
            onClick={() => navigate(['/', '/contents', '/reader', '/studio'][idx])}
            style={{ padding: '8px 12px', background: label === 'WRITE' ? '#388E3C' : '#444', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            {label}
          </button>
        ))}
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', padding: '15px', overflowY: 'auto' }}>
        <button
          onClick={toggleRecording}
          style={{ padding: '20px', background: isRecording ? '#c0392b' : '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem' }}
        >
          {isRecording ? 'STOP RECORDING' : 'START RECORDING'}
        </button>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            finalTranscriptRef.current = e.target.value;
          }}
          placeholder="Continue your story..."
          style={{ flex: 1, padding: '15px', fontSize: '18px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '8px', resize: 'none' }}
        />

        <input
          placeholder="New Chapter Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ padding: '12px', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#fff' }}
        />

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ padding: '12px', borderRadius: '4px', background: '#222', color: '#fff' }}
        >
          <option value="">Add to existing chapter?</option>
          {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSave} style={{ flex: 2, padding: '15px', background: '#d4af37', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px' }}>SAVE WORK</button>
          {selectedId && <button onClick={handleDelete} style={{ flex: 1, padding: '15px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px' }}>DELETE</button>}
        </div>

        {status && <p style={{ textAlign: 'center', color: '#d4af37' }}>{status}</p>}
      </div>
    </div>
  );
}