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

  // Keep textRef in sync so handleSave always has latest text
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

      const updated = textRef.current ? textRef.current + '\n\n' + transcribed : transcribed;
      setText(updated);
      finalTranscriptRef.current = upda