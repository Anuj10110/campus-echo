const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_STT_MODEL = process.env.OPENAI_STT_MODEL || 'whisper-1';

const OPENAI_TRANSCRIBE_URL = 'https://api.openai.com/v1/audio/transcriptions';

const ensureApiKey = () => {
  if (!OPENAI_API_KEY) {
    throw new Error(
      'OPENAI_API_KEY is not set. Configure it in backend/.env to enable audio transcription.'
    );
  }
};

/**
 * @param {{ buffer: Buffer, mimetype?: string, filename?: string, language?: string }} params
 * @returns {Promise<string>}
 */
export const transcribeAudioBuffer = async ({ buffer, mimetype, filename, language }) => {
  ensureApiKey();

  if (!buffer || buffer.length === 0) {
    throw new Error('Audio buffer is empty');
  }

  // Node 18+ provides fetch/FormData/Blob via undici.
  const form = new FormData();
  const blob = new Blob([buffer], { type: mimetype || 'application/octet-stream' });

  form.append('file', blob, filename || 'audio.webm');
  form.append('model', OPENAI_STT_MODEL);
  if (language) form.append('language', language);

  const res = await fetch(OPENAI_TRANSCRIBE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: form
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OpenAI transcription failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  const transcript = json?.text;

  if (typeof transcript !== 'string' || transcript.trim() === '') {
    throw new Error('OpenAI transcription returned an empty transcript');
  }

  return transcript;
};
