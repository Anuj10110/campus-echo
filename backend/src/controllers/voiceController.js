import * as voiceService from '../services/voiceService.js';
import { transcribeAudioBuffer } from '../services/openaiAudioService.js';

export const processVoiceQuery = async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user.userId;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query cannot be empty'
      });
    }

    const result = await voiceService.processQuery(userId, query);
    res.status(200).json(result);
  } catch (error) {
    console.error('Voice query error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice query',
      error: error.message
    });
  }
};

export const transcribeAudio = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Missing audio file (field name: "audio")'
      });
    }

    const transcript = await transcribeAudioBuffer({
      buffer: file.buffer,
      mimetype: file.mimetype,
      filename: file.originalname
    });

    res.status(200).json({
      success: true,
      data: { transcript }
    });
  } catch (error) {
    console.error('Audio transcription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to transcribe audio',
      error: error.message
    });
  }
};

export const getVoiceHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await voiceService.getQueryHistory(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Get voice history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch voice history',
      error: error.message
    });
  }
};
