import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookStore } from '../store/bookStore';

export default function StudioPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState('audio'); // 'audio' or 'video'
  const [newTitle, setNewTitle] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [mediaPreview, setMediaPreview] = useState(null);
  const [seconds, setSeconds] = useState(0);

  const chapters = useBookStore((s) => s.chapters);
  const addMediaPage = useBookStore((s) => s.addMediaPage);
  const deleteChapter = useBookStore((s) => s.deleteChapter);

  const mediaRecorder = useRef(null);
  const timerInterval = useRef(null);
  const chunks = useRef([]);
  const streamRef = useRef(null);
  const videoRef = useRef(null);

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  const startRecording = async (type) => {
    try {
      setRecordingType(type);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: type === 'video' 
      });
      
      streamRef.current = stream;
      if (type === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const mimeType = type === 'video' ? 'video/mp4' : 'audio/wav';
        const blob = new Blob(chunks.current, { type: mimeType });
        setMediaPreview(URL.createObjectURL(blob));
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setSeconds(0);
      timerInterval.current = setInterval(() => setSeconds(s => s + 1), 1000);
      setStatus(`🎥 Recording ${type}...`);
    } catch (err) {
      setStatus("❌ Camera/Mic access denied.");
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    clearInterval(timerInterval.current);
    setIsRecording(false);
    setStatus("✅ Recording finished. Preview below.");
  };

  const handleSave = () => {
    if (!mediaPreview) return setStatus("⚠️ Record something first.");
    
    // Determine target chapter
    let targetId = selectedId;
    if (newTitle.trim()) {
      targetId = useBookStore.getState().addChapter(newTitle);
    } else if (!targetId) {
      targetId = chapters.length > 0 ? chapters[chapters.length - 1].id : useBookStore.getState().addChapter('New Chapter');
    }

    addMediaPage(targetId, mediaPreview, recordingType);
    setMediaPreview(null);
    setNewTitle('');
    setSelectedId('');
    setStatus("✅ Saved to Book!");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000' }}>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px', background: '#2c2c2c', padding: '8px' }}>
        {['COVER', 'CONTENTS', 'READ', '✎ WRITE', '⚙ ADMIN'].map((label, i) => (
          <button key={i} onClick={() => navigate(label === '✎ WRITE' ? '/studio' : label.toLowerCase())}
            style={{ padding: '4px 12px', background: label.includes('WRITE') ? '#388E3C' : '#e0e0e0', borderRadius: '3px', border: 'none', fontWeight: 'bold' }}>
            {label}
          </button>
        ))}
      </nav>

      <main style={{ flex: 1, padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* MOBILE RECORDING CONTROLS */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {!isRecording ? (
            <>
              <button onClick={() => startRecording('audio')} style={{ flex: 1, padding: '15px', background: '#222', color: '#d4af37', border: '2px solid #d4af37', borderRadius: '8px', fontWeight: 'bold' }}>🎤 AUDIO</button>
              <button onClick={() => startRecording('video')} style={{ flex: 1, padding: '15px', background: '#222', color: '#d4af37', border: '2px solid #d4af37', borderRadius: '8px', fontWeight: 'bold' }}>🎥 VIDEO</button>
            </>
          ) : (
            <button onClick={stopRecording} style={{ flex: 1, padding: '15px', background: '#cc0000', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
              ⏹ STOP RECORDING ({seconds}s)
            </button>
          )}
        </div>

        {/* LIVE CAMERA / PREVIEW AREA */}
        <div style={{ flex: 1, background: '#111', border: '1px solid #d4af37', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          {isRecording && recordingType === 'video' && (
            <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          {mediaPreview && (
            recordingType === 'video' 
              ? <video src={mediaPreview} controls style={{ width: '100%', maxHeight: '100%' }} />
              : <audio src={mediaPreview} controls style={{ width: '80%' }} />
          )}
          {!isRecording && !mediaPreview && <p style={{ color: '#444' }}>Select a mode to begin</p>}
        </div>

        {/* CHAPTER SELECTION */}
        <div style={{ background: '#111', padding: '12px', borderRadius: '8px', border: '1px solid #333' }}>
          <input placeholder="New Chapter Title..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            style={{ width: '100%', padding: '12px', background: '#222', color: '#fff', border: '1px solid #444', marginBottom: '10px', boxSizing: 'border-box' }} />
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}
            style={{ width: '100%', padding: '12px', background: '#222', color: '#fff', border: '1px solid #444' }}>
            <option value="">-- Add to Existing Chapter --</option>
            {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.title}</option>)}
          </select>
        </div>

        <button onClick={handleSave} style={{ width: '100%', padding: '18px', background: '#d4af37', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', fontSize: '18px' }}>
          SAVE TO BOOK
        </button>

        {status && <p style={{ textAlign: 'center', color: '#d4af37', margin: '0' }}>{status}</p>}
      </main>
    </div>
  );
}