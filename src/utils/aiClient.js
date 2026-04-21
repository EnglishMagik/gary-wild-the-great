/**
 * aiClient.js
 * This file handles turning your voice into text and 
 * then making that text look like a professional book.
 */

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const WHISPER_URL = 'https://api.openai.com/v1/audio/transcriptions';

// ── 1. THE EARS (Transcribes your recording) ──
async function transcribeAudio(audioUrl) {
  // We turn the recording URL back into a file the AI can read
  const response = await fetch(audioUrl);
  const blob = await response.blob();
  
  const formData = new FormData();
  formData.append('file', blob, 'recording.wav');
  formData.append('model', 'whisper-1');

  const res = await fetch(WHISPER_URL, {
    method: 'POST',
    headers: {
      // You will need to add your OpenAI key to Vercel for this to work
      'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
    },
    body: formData,
  });

  if (!res.ok) throw new Error('Transcription failed. Check your API key.');
  const data = await res.json();
  return data.text;
}

// ── 2. THE BRAIN (Calls Claude to polish the text) ──
async function callClaude({ system = '', messages }) {
  const body = {
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 1000,
    messages,
  };
  if (system) body.system = system;

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('Claude AI failed to respond.');
  const data = await res.json();
  return data.content?.find((b) => b.type === 'text')?.text ?? '';
}

// ── 3. THE MAGIC BUTTON (Used by your Studio Page) ──
export async function formatTranscription(input) {
  let rawText = '';

  // If the input is a recording URL, transcribe it first
  if (typeof input === 'string' && input.startsWith('blob:')) {
    rawText = await transcribeAudio(input);
  } else {
    rawText = input;
  }

  // Then send the text to Claude to be formatted
  return callClaude({
    messages: [
      {
        role: 'user',
        content: `You are a literary editor. Format this transcript into professional book prose. Remove fillers like "um" or "ah", add punctuation, and use proper paragraphs.\n\nTEXT: ${rawText}`,
      },
    ],
  });
}

// ── 4. OTHER HELPERS ──
export async function askMascot({ question, history, bookSummary }) {
  const messages = [...history, { role: 'user', content: question }];
  return callClaude({
    system: `You are Wilde, the charismatic AI for "Gary Wild The Great". Book state: ${bookSummary}`,
    messages,
  });
}

export async function suggestChapterTitle(pageText) {
  return callClaude({
    messages: [{ role: 'user', content: `Suggest 3 chapter titles for this: ${pageText}` }],
  });
}