import express from 'express';
import * as voiceController from '../controllers/voiceController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Protect all voice routes
router.use(authMiddleware);

// Process voice query
router.post('/query', voiceController.processVoiceQuery);

// Get voice query history
router.get('/history', voiceController.getVoiceHistory);

export default router;
