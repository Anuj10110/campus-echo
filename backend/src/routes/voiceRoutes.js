import express from 'express';
import multer from 'multer';
import * as voiceController from '../controllers/voiceController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Protect all voice routes
router.use(authMiddleware);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    // Whisper/OpenAI limit depends on model; keep a conservative server-side limit.
    fileSize: 25 * 1024 * 1024
  }
});

// Process voice query
router.post('/query', voiceController.processVoiceQuery);

// Transcribe an audio recording (multipart/form-data: audio=<file>)
router.post('/transcribe', upload.single('audio'), voiceController.transcribeAudio);

// Get voice query history
router.get('/history', voiceController.getVoiceHistory);

export default router;
