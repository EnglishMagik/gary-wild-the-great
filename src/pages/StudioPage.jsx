import React, { useState, useRef, useEffect } from 'react';
import { useBookStore } from '../store/bookStore';

export default function StudioPage() {
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

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
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
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Transcription failed');
      const data = await res.json();
      const transcribed = data.text || '';

      setText((prev) => prev ? prev + '\n\n' + transcribed : transcribed);
      finalTranscriptRef.current = text + '\n\n' + transcribed;
      setStatus("✅ Transcription complete! Edit the text then save.");
    } catch (err) {
      setStatus("❌ Upload failed. Check your API key in .env");
    }

    e.target.value = '';
  };

  const handleSave = () => {
    if (!text.trim()) return setStatus("⚠️ Please enter text first.");
    processVoiceInput(text, selectedId, newTitle);
    setText('');
    finalTranscriptRef.current = '';
    setNewTitle('');
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
    <main style={{
      padding: '10px',
      background: '#000',
      color: '#fff',
      height: '85vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {/* RECORD / UPLOAD BUTTONS */}
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

        {/* Hidden file input */}
        <input
          ref={uploadRef}
          type="file"
          accept="audio/*,video/*"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
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

      {/* SCROLLABLE TEXT BOX */}
      <div style={{
        flex: '1',
        minHeight: '120px',
        border: '1px solid #d4af37',
        background: '#111',
        overflowY: 'auto'
      }}>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            finalTranscriptRef.current = e.target.value;
          }}
          placeholder="Speak or type your story here..."
          style={{
            width: '100%', height: '100%', background: 'transparent', color: '#fff',
            border: 'none', padding: '12px', fontSize: '18px', outline: 'none', resize: 'none',
            fontFamily: 'serif', lineHeight: '1.6'
          }}
        />
      </div>

      {/* CHAPTER MANAGEMENT */}
      <div style={{ background: '#111', padding: '12px', border: '1px solid #333' }}>
        <input
          placeholder="New Chapter Name..."
          value={newTitle}
          onChange={(e) => { setNewTitle(e.target.value); setSelectedId(''); }}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#222', color: '#fff', border: '1px solid #444' }}
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
            <button onClick={handleDelete} title="Delete Chapter" style={{ background: '#441111', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '0 15px', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
          )}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        style={{
          width: '100%', padding: '16px', background: '#d4af37', color: '#000',
          fontWeight: 'bold', border: 'none', fontSize: '18px', borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        SAVE TO BOOK
      </button>

      {status && <p style={{ textAlign: 'center', color: '#d4af37', margin: '5px 0' }}>{status}</p>}
    </main>
  );
}