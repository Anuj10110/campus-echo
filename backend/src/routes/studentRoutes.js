import express from 'express';
import { authMiddleware, studentMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All student routes require authentication and student role
router.use(authMiddleware, studentMiddleware);

// Dashboard
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Student dashboard',
    data: {
      userId: req.user.userId,
      message: 'Welcome to your student dashboard!'
    }
  });
});

// Get campus notices
router.get('/notices', (req, res) => {
  res.json({
    success: true,
    message: 'Campus notices retrieved',
    data: {
      notices: [
        { id: 1, title: 'Exam Schedule Released', date: '2026-02-10' },
        { id: 2, title: 'Holiday Notice', date: '2026-02-15' }
      ]
    }
  });
});

// Get campus events
router.get('/events', (req, res) => {
  res.json({
    success: true,
    message: 'Campus events retrieved',
    data: {
      events: [
        { id: 1, title: 'Tech Fest 2026', date: '2026-03-01' },
        { id: 2, title: 'Career Fair', date: '2026-03-15' }
      ]
    }
  });
});

// Get academic resources
router.get('/resources', (req, res) => {
  res.json({
    success: true,
    message: 'Academic resources retrieved',
    data: {
      resources: [
        { id: 1, title: 'Library Access', type: 'link' },
        { id: 2, title: 'Course Materials', type: 'documents' }
      ]
    }
  });
});

export default router;
