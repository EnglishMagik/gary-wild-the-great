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

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // ---------------- SIMPLE STABLE SPEECH ----------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    const safeStart = () => {
      try {
        recognition.start();
      } catch (e) {}
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let newlyFinalized = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          // ✅ ONLY commit FINAL speech (this fixes repeats)
          newlyFinalized += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (newlyFinalized) {
        finalTranscriptRef.current += newlyFinalized;
      }

      setText(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = () => {
      setStatus('⚠️ Mic error');
      setIsRecording(false);
    };

    recognition.onend = () => {
      // ✅ FIX auto-stop: restart only if user still recording
      if (isRecording) {
        setTimeout(() => safeStart(), 200);
      }
    };
  }, [isRecording]);

  // ---------------- CONTROLS ----------------
  const toggleRecording = () => {
    const rec = recognitionRef.current;
    if (!rec) return;

    if (isRecording) {
      rec.stop();
      setIsRecording(false);
      setStatus('✅ Recording stopped.');
    } else {
      finalTranscriptRef.current = '';
      textRef.current = '';
      setText('');

      try {
        rec.start();
        setIsRecording(true);
        setStatus('🎤 Listening...');
      } catch (e) {}
    }
  };

  const handleSave = () => {
    const current = textRef.current;
    if (!current.trim()) return setStatus('⚠️ Please enter text first.');

    processVoiceInput(current, selectedId || null, newTitle || null);

    setText('');
    finalTranscriptRef.current = '';
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000' }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        padding: '8px',
        background: '#2c2c2c',
      }}>
        {[
          { label: 'COVER', path: '/' },
          { label: 'CONTENTS', path: '/contents' },
          { label: 'READ', path: '/reader' },
          { label: 'WRITE', path: '/studio' },
        ].map(b => (
          <button key={b.path} onClick={() => navigate(b.path)}>
            {b.label}
          </button>
        ))}
      </nav>

      <div style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={toggleRecording}>
          {isRecording ? 'STOP' : 'RECORD'}
        </button>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            finalTranscriptRef.current = e.target.value;
          }}
          style={{ flex: 1 }}
        />

        <button onClick={handleSave}>SAVE</button>

        {status && <div>{status}</div>}
      </div>
    </div>
  );
}