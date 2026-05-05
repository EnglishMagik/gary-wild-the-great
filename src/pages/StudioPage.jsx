import React, { useState, useRef, useEffect } from 'react';
import { useBookStore } from '../store/bookStore';
import { useNavigate } from 'react-router-dom';

const isMobile = () =>
  window.innerWidth <= 768 ||
  /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

export default function StudioPage() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const [mobile, setMobile] = useState(() => isMobile());

  const navigate = useNavigate();

  const chapters = useBookStore((s) => s.chapters);
  const processVoiceInput = useBookStore((s) => s.processVoiceInput);

  const recognitionRef = useRef(null);

  // 🎤 speech engine state
  const committedRef = useRef('');
  const lastFinalRef = useRef('');
  const restartLockRef = useRef(false);
  const isTypingRef = useRef(false);

  useEffect(() => {
    const onResize = () => setMobile(isMobile());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus('Speech not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const raw = result[0].transcript;
        if (!raw) continue;

        const clean = raw.trim().replace(/\s+/g, ' ');
        const normalized = clean.toLowerCase();

        if (result.isFinal) {
          if (normalized === lastFinalRef.current) continue;
          lastFinalRef.current = normalized;

          const buffer = committedRef.current.toLowerCase().trim();

          if (!buffer.endsWith(normalized)) {
            committedRef.current =
              (committedRef.current + ' ' + clean).trim() + ' ';
          }
        } else {
          interim += clean + ' ';
        }
      }

      const finalText = (committedRef.current + interim).trim();

      if (!isTypingRef.current) {
        setText(finalText);
      }
    };

    recognition.onerror = (e) => {
      if (e.error !== 'no-speech') setStatus(e.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (!recognitionRef.current?._shouldBeRecording) {
        setIsRecording(false);
        return;
      }

      if (restartLockRef.current) return;
      restartLockRef.current = true;

      setTimeout(() => {
        try {
          if (recognitionRef.current?._shouldBeRecording) {
            recognition.start();
          }
        } catch {}
        restartLockRef.current = false;
      }, 700);
    };

    recognitionRef.current = recognition;
  }, []);

  // ---------------- RECORD ----------------

  const startRecording = () => {
    committedRef.current = text.trim() + ' ';
    lastFinalRef.current = '';
    restartLockRef.current = false;

    recognitionRef.current._shouldBeRecording = true;

    recognitionRef.current.start();
    setIsRecording(true);
    setStatus('🎤 Listening...');
  };

  const stopRecording = () => {
    recognitionRef.current._shouldBeRecording = false;
    recognitionRef.current?.stop();
    setIsRecording(false);
    setStatus('Stopped');
  };

  // ---------------- SAVE / PARSE ----------------

  const handleSave = () => {
    if (!text.trim()) return;

    /**
     * KEY BUSINESS LOGIC:
     * This is your "lesson parsing equivalent"
     * → decides WHERE speech goes
     */
    processVoiceInput(
      text,
      selectedId || null,
      newTitle.trim() || null
    );

    setText('');
    committedRef.current = '';
    lastFinalRef.current = '';
    setNewTitle('');
    setSelectedId('');
    setStatus('Saved to chapter');
  };

  // ---------------- UI ----------------

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>

      {/* NAVIGATION */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/')}>
          ← Back to Contents
        </button>

        <div>Studio</div>
      </div>

      {/* STATUS */}
      <p>{status}</p>

      {/* TEXT AREA */}
      <textarea
        value={text}
        onChange={(e) => {
          isTypingRef.current = true;
          setText(e.target.value);
        }}
        onBlur={() => (isTypingRef.current = false)}
        style={{ width: '100%', height: 300 }}
      />

      {/* RECORD BUTTONS */}
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        {!isRecording ? (
          <button onClick={startRecording}>🎤 Start</button>
        ) : (
          <button onClick={stopRecording}>⏹ Stop</button>
        )}
      </div>

      {/* CHAPTER SELECTION (CRITICAL UX) */}
      <div style={{ marginTop: 20 }}>
        <input
          placeholder="New chapter title"
          value={newTitle}
          onChange={(e) => {
            setNewTitle(e.target.value);
            setSelectedId('');
          }}
        />

        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setNewTitle('');
          }}
        >
          <option value="">Select existing chapter</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* SAVE */}
      <button onClick={handleSave} style={{ marginTop: 20 }}>
        Save to Chapter
      </button>
    </div>
  );
}