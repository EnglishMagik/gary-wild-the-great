import { useState, useRef, useEffect } from 'react';

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [seconds, setSeconds] = useState(0);
  
  const mediaRecorder = useRef(null);
  const timerInterval = useRef(null);
  const audioChunks = useRef([]);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
    };

    mediaRecorder.current.start();
    setIsRecording(true);
    setSeconds(0);
    timerInterval.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };

  const stop = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
    clearInterval(timerInterval.current);
  };

  const reset = () => {
    setAudioURL('');
    setSeconds(0);
  };

  return { isRecording, audioURL, seconds, start, stop, reset };
}

export function useVideoRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const mediaRecorder = useRef(null);
  const timerInterval = useRef(null);
  const videoChunks = useRef([]);
  const streamRef = useRef(null);

  const initCamera = async (videoElement) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = stream;
    if (videoElement) videoElement.srcObject = stream;
    setCameraReady(true);
  };

  const start = () => {
    if (!streamRef.current) return;
    mediaRecorder.current = new MediaRecorder(streamRef.current);
    videoChunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => videoChunks.current.push(e.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(videoChunks.current, { type: 'video/mp4' });
      setVideoURL(URL.createObjectURL(blob));
    };

    mediaRecorder.current.start();
    setIsRecording(true);
    setSeconds(0);
    timerInterval.current = setInterval(() => setSeconds(s => s + 1), 1000);
  };

  const stop = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
    clearInterval(timerInterval.current);
  };

  const reset = () => {
    setVideoURL('');
    setSeconds(0);
    setCameraReady(false);
  };

  return { isRecording, videoURL, cameraReady, seconds, initCamera, start, stop, reset };
}