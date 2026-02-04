import React, { useState, useRef } from 'react';
import apiService from '../services/api';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sttMode, setSttMode] = useState('speech'); // 'speech' | 'record' | 'none'
  const [transcript, setTranscript] = useState('');
  const [textQuery, setTextQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([]);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const chunksRef = useRef([]);

  // Initialize Web Speech API (primary STT when available)
  React.useEffect(() => {
    const speechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!speechSupported) {
      console.warn('Speech Recognition not supported; will use recording upload if possible.');

      const recordSupported =
        !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) &&
        typeof window.MediaRecorder !== 'undefined';

      setSttMode(recordSupported ? 'record' : 'none');
      return;
    }

    setSttMode('speech');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        interim += transcriptSegment;
      }
      setTranscript(interim);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;

    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];

    recorder.ondataavailable = (evt) => {
      if (evt.data && evt.data.size > 0) {
        chunksRef.current.push(evt.data);
      }
    };

    recorder.onstop = async () => {
      try {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        chunksRef.current = [];

        setIsProcessing(true);
        const resp = await apiService.transcribeAudio(blob, 'recording.webm');
        if (!resp?.success) {
          setResponse(resp?.message || 'Failed to transcribe audio.');
          return;
        }

        const t = resp.data?.transcript || '';
        setTranscript(t);
      } catch (err) {
        console.error('Audio recording/transcription error:', err);
        if (err?.status === 401) {
          setResponse('Your session expired. Please log in again.');
        } else {
          setResponse(err?.message || 'Sorry, I could not transcribe that recording.');
        }
      } finally {
        setIsProcessing(false);

        // Stop the mic stream to release the device.
        if (mediaStreamRef.current) {
          for (const track of mediaStreamRef.current.getTracks()) track.stop();
          mediaStreamRef.current = null;
        }
      }
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const startListening = async () => {
    setTranscript('');
    setResponse('');

    if (sttMode === 'speech' && recognitionRef.current) {
      recognitionRef.current.start();
      return;
    }

    if (sttMode === 'record') {
      await startRecording();
    }
  };

  const stopListening = () => {
    if (sttMode === 'speech' && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    if (sttMode === 'record') {
      stopRecording();
    }
  };

  // Load history from backend (requires auth)
  React.useEffect(() => {
    (async () => {
      try {
        const resp = await apiService.getVoiceHistory();
        if (resp?.success && Array.isArray(resp.data)) {
          setHistory(
            resp.data
              .filter((q) => q?.query)
              .map((q) => ({ query: q.query, response: q.response || '' }))
          );
        }
      } catch {
        // ignore: voice history isn't critical to render the dashboard
      }
    })();
  }, []);

  // Cleanup audio resources on unmount.
  React.useEffect(() => {
    return () => {
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      } catch {
        // ignore
      }

      try {
        if (mediaStreamRef.current) {
          for (const track of mediaStreamRef.current.getTracks()) track.stop();
          mediaStreamRef.current = null;
        }
      } catch {
        // ignore
      }
    };
  }, []);

  const submitQuery = async (queryText) => {
    const q = String(queryText || '').trim();
    if (!q) return;

    setIsProcessing(true);
    try {
      const result = await apiService.processVoiceQuery(q);

      if (!result?.success) {
        setResponse(result?.message || 'Failed to process your query.');
        return;
      }

      const aiResponse = result.data?.response || 'No response generated.';
      setResponse(aiResponse);

      // Keep local history in sync immediately; backend history will also record it.
      setHistory((prev) => [{ query: q, response: aiResponse }, ...prev].slice(0, 20));

      // Text-to-speech
      speakResponse(aiResponse);
    } catch (error) {
      console.error('Error processing query:', error);
      if (error?.status === 401) {
        setResponse('Your session expired. Please log in again.');
      } else {
        setResponse(error?.message || 'Sorry, I encountered an error processing your request.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const processVoiceQuery = async () => {
    await submitQuery(transcript);
  };

  const processTextQuery = async () => {
    await submitQuery(textQuery);
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const isCapturing = isListening || isRecording;

  return (
    <div style={styles.container}>
      {/* Mic Button */}
      <div style={styles.micSection}>
        <button
          type="button"
          style={{
            ...styles.micButton,
            ...(isCapturing ? styles.micButtonActive : {})
          }}
          onClick={isCapturing ? stopListening : startListening}
          disabled={isProcessing || sttMode === 'none'}
          title={
            sttMode === 'none'
              ? 'Speech input not supported in this browser'
              : sttMode === 'record'
                ? 'Record audio, then transcribe'
                : 'Speak to transcribe'
          }
        >
          <span style={styles.micIcon}>{isCapturing ? '🎙️' : '🎤'}</span>
        </button>
        <p style={styles.micStatus}>
          {sttMode === 'none'
            ? 'Speech input not available'
            : isListening
              ? 'Listening...'
              : isRecording
                ? 'Recording...'
                : 'Tap to ask'}
        </p>
      </div>

      {/* Text Input Fallback */}
      <div style={styles.textInputRow}>
        <input
          style={styles.textInput}
          placeholder="Type a question (optional)"
          value={textQuery}
          onChange={(e) => setTextQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              processTextQuery();
            }
          }}
          disabled={isProcessing}
        />
        <button
          type="button"
          style={styles.textSendButton}
          onClick={processTextQuery}
          disabled={isProcessing || !textQuery.trim()}
        >
          Send
        </button>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div style={styles.transcriptBox}>
          <p style={styles.transcriptLabel}>You said:</p>
          <p style={styles.transcriptText}>{transcript}</p>
          <button
            type="button"
            style={styles.submitButton}
            onClick={processVoiceQuery}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Get Answer'}
          </button>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div style={styles.responseBox}>
          <p style={styles.responseLabel}>🤖 Campus Echo:</p>
          <p style={styles.responseText}>{response}</p>
        </div>
      )}

      {/* Chat History */}
      {history.length > 0 && (
        <div style={styles.historyBox}>
          <h4 style={styles.historyTitle}>Conversation History</h4>
          <div style={styles.historyList}>
            {history.map((item, idx) => (
              <div key={idx} style={styles.historyItem}>
                <p style={styles.historyQuery}>👤 You: {item.query}</p>
                <p style={styles.historyResponse}>🤖 Echo: {item.response}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '32px',
    background: 'rgba(20, 25, 32, 0.6)',
    borderRadius: '24px',
    border: '1px solid rgba(0, 212, 255, 0.15)',
    marginTop: '32px',
  },
  micSection: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  micButton: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    fontSize: '48px',
    boxShadow: '0 12px 40px rgba(0, 212, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
  micButtonActive: {
    animation: 'pulse 0.6s infinite',
    boxShadow: '0 12px 60px rgba(0, 212, 255, 0.6)',
    transform: 'scale(1.05)',
  },
  micIcon: {
    display: 'block',
  },
  micStatus: {
    marginTop: '16px',
    color: '#9ca3af',
    fontSize: '14px',
    fontWeight: '600',
  },
  textInputRow: {
    display: 'flex',
    gap: '12px',
    margin: '0 auto 24px',
    maxWidth: '720px',
  },
  textInput: {
    flex: 1,
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(0, 212, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.03)',
    color: '#ffffff',
    outline: 'none',
  },
  textSendButton: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#e5e7eb',
    padding: '10px 16px',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  transcriptBox: {
    background: 'rgba(0, 212, 255, 0.05)',
    border: '1px solid rgba(0, 212, 255, 0.2)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
  },
  transcriptLabel: {
    fontSize: '12px',
    color: '#00d4ff',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  transcriptText: {
    color: '#ffffff',
    fontSize: '16px',
    marginBottom: '16px',
    fontStyle: 'italic',
  },
  submitButton: {
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    color: 'white',
    padding: '10px 24px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
  },
  responseBox: {
    background: 'rgba(168, 85, 247, 0.05)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
  },
  responseLabel: {
    fontSize: '12px',
    color: '#a855f7',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  responseText: {
    color: '#e5e7eb',
    fontSize: '15px',
    lineHeight: '1.6',
  },
  historyBox: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '20px',
    marginTop: '24px',
  },
  historyTitle: {
    color: '#00d4ff',
    fontSize: '14px',
    fontWeight: '700',
    marginBottom: '16px',
    textTransform: 'uppercase',
  },
  historyList: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  historyItem: {
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
  },
  historyQuery: {
    color: '#00d4ff',
    fontSize: '13px',
    marginBottom: '8px',
    fontWeight: '500',
  },
  historyResponse: {
    color: '#9ca3af',
    fontSize: '13px',
    fontStyle: 'italic',
  },
};

// Add CSS animation for pulse effect
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 12px 40px rgba(0, 212, 255, 0.3);
    }
    50% {
      box-shadow: 0 12px 60px rgba(0, 212, 255, 0.7);
    }
  }
`;
if (document.head && !document.querySelector('style[data-pulse]')) {
  styleSheet.setAttribute('data-pulse', 'true');
  document.head.appendChild(styleSheet);
}

export default VoiceAssistant;
