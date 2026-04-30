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

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let newlyFinalized = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSnippet = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // ONLY add to the permanent pile when the browser is 100% sure
            newlyFinalized += transcriptSnippet + ' ';
          } else {
            // "Thinking" text stays temporary
            interimTranscript += transcriptSnippet;
          }
        }
        
        finalTranscriptRef.current += newlyFinalized;
        // Screen = Everything saved so far + the current thinking
        setText(finalTranscriptRef.current + interimTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        // We do NOT clear the screen here. It stays so you can read it.
        setStatus("⏸ Paused (Tap Record to continue)");
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setStatus("✅ Recording stopped.");
    } else {
      // PICK UP WHERE YOU LEFT OFF
      // This is the key: we don't clear finalTranscriptRef, we use what is already in text.
      finalTranscriptRef.current = text; 
      recognitionRef.current?.start();
      setIsRecording(true);
      setStatus("🎤 Listening..."); 
    }
  };

  const handleSave = () => {
    if (!text.trim()) return setStatus("⚠️ Please enter text first.");
    processVoiceInput(text, selectedId, newTitle);
    
    // ONLY clear now that it's safe in the book
    setText('');
    finalTranscriptRef.current = '';
    setNewTitle('');
    setStatus("✅ Saved! Check your Table of Contents.");
  };

  const handleDelete = () => {
    if (!selectedId) return setStatus("⚠️ Select a chapter to delete.");
    if (window.confirm("Permanently delete this chapter?")) {
      deleteChapter(selectedId);
      setSelectedId('');
      setStatus("🗑️ Deleted.");
    }
  };

  // UI remains exactly as your working old version
  return (
    <main style={{ padding: '10px', background: '#000', color: '#fff', height: '85vh', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={toggleRecording} style={{ flex: 1, padding: '12px', background: isRecording ? '#cc0000' : (text ? '#2ecc71' : '#222'), color: '#fff', border: '1px solid #d4af37', fontWeight: 'bold', borderRadius: '4px' }}>
          {isRecording ? '⏹ STOP RECORDING' : '🎤 START RECORDING'}
        </button>
      </div>

      <div style={{ flex: '1', minHeight: '120px', border: '1px solid #d4af37', background: '#111', overflowY: 'auto' }}>
        <textarea 
          value={text} 
          onChange={(e) => {
            setText(e.target.value);
            finalTranscriptRef.current = e.target.value;
          }} 
          placeholder="Continue your story here..."
          style={{ width: '100%', height: '100%', background: 'transparent', color: '#fff', border: 'none', padding: '12px', fontSize: '18px', outline: 'none', resize: 'none', fontFamily: 'serif', lineHeight: '1.6' }}
        />
      </div>

      <div style={{ background: '#111', padding: '12px', border: '1px solid #333' }}>
        <input placeholder="New Chapter Name..." value={newTitle} onChange={(e) => {setNewTitle(e.target.value); setSelectedId('');}} style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#222', color: '#fff', border: '1px solid #444' }} />
        <select value={selectedId} onChange={(e) => {setSelectedId(e.target.value); setNewTitle('');}} style={{ width: '100%', padding: '10px', background: '#222', color: '#fff' }}>
          <option value="">-- Add to / Select Chapter --</option>
          {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.title}</option>)}
        </select>
      </div>

      <button onClick={handleSave} style={{ width: '100%', padding: '16px', background: '#d4af37', color: '#000', fontWeight: 'bold', border: 'none', fontSize: '18px', borderRadius: '4px' }}>
        SAVE TO BOOK
      </button>
      {status && <p style={{ textAlign: 'center', color: '#d4af37', margin: '5px 0' }}>{status}</p>}
    </main>
  );
}