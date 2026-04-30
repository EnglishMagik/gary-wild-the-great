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
  
  // Refs for PC Logic
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');

  // Refs for Mobile Logic (Record then Transcribe)
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Detect if user is on Mobile
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

  useEffect(() => {
    // Only initialize PC SpeechRecognition if NOT on mobile
    if (!isMobile) {
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
    }
  }, [isMobile]);

  const toggleRecording = async () => {
    if (isRecording) {
      // STOP LOGIC
      if (isMobile) {
        mediaRecorderRef.current.stop(); // This triggers the transcription flow
      } else {
        recognitionRef.current?.stop();
      }
      setIsRecording(false);
      setStatus("✅ Processing audio...");
    } else {
      // START LOGIC
      if (isMobile) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorderRef.current = new MediaRecorder(stream);
          audioChunksRef.current = [];

          mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
          
          mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            setStatus("✨ Transcribing full recording...");
            
            // Pass the blob to your store's AI processing
            // Assuming your store can handle a blob or a large text block
            // For now, we simulate the "One-Tap" result from the video
            const cleanText = await processVoiceInput(audioBlob, selectedId, newTitle, true); 
            if (cleanText) setText(prev => prev + " " + cleanText);
            setStatus("✅ Transcription complete.");
          };

          mediaRecorderRef.current.start();
          setIsRecording(true);
          setStatus("🎤 Recording (Mobile Mode)...");
        } catch (err) {
          setStatus("❌ Mic access denied.");
        }
      } else {
        finalTranscriptRef.current = text; 
        recognitionRef.current?.start();
        setIsRecording(true);
        setStatus("🎤 Listening (PC Mode)...");
      }
    }
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
    if (window.confirm("Permanently delete this chapter?")) {
      deleteChapter(selectedId);
      setSelectedId('');
      setStatus("🗑️ Deleted.");
    }
  };

  return (
    <main style={{ padding: '10px', background: '#000', color: '#fff', height: '85vh', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          {isRecording ? '⏹ STOP' : `🎤 START ${isMobile ? '(MOBILE)' : '(PC)'}`}
        </button>
        <button style={{ flex: 1, padding: '12px', background: '#222', color: '#d4af37', border: '1px solid #d4af37', borderRadius: '4px', cursor: 'pointer' }}>📁 Upload</button>
      </div>

      <div style={{ flex: '1', minHeight: '120px', border: '1px solid #d4af37', background: '#111', overflowY: 'auto' }}>
        <textarea 
          value={text} 
          onChange={(e) => {
            setText(e.target.value);
            finalTranscriptRef.current = e.target.value;
          }} 
          placeholder={isMobile ? "Record to see text here..." : "Speak or type here..."}
          style={{ width: '100%', height: '100%', background: 'transparent', color: '#fff', border: 'none', padding: '12px', fontSize: '18px', outline: 'none', resize: 'none', fontFamily: 'serif', lineHeight: '1.6' }}
        />
      </div>

      <div style={{ background: '#111', padding: '12px', border: '1px solid #333' }}>
        <input 
          placeholder="New Chapter Name..." 
          value={newTitle} 
          onChange={(e) => {setNewTitle(e.target.value); setSelectedId('');}} 
          style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#222', color: '#fff', border: '1px solid #444' }} 
        />
        <div style={{ display: 'flex', gap: '5px' }}>
          <select value={selectedId} onChange={(e) => {setSelectedId(e.target.value); setNewTitle('');}} style={{ flex: 1, padding: '10px', background: '#222', color: '#fff' }}>
            <option value="">-- Add to / Select Chapter --</option>
            {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.title}</option>)}
          </select>
          {selectedId && <button onClick={handleDelete} style={{ background: '#441111', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '0 15px', borderRadius: '4px' }}>🗑️</button>}
        </div>
      </div>

      <button onClick={handleSave} style={{ width: '100%', padding: '16px', background: '#d4af37', color: '#000', fontWeight: 'bold', border: 'none', fontSize: '18px', borderRadius: '4px' }}>
        SAVE TO BOOK
      </button>

      {status && <p style={{ textAlign: 'center', color: '#d4af37', margin: '5px 0' }}>{status}</p>}
    </main>
  );
}