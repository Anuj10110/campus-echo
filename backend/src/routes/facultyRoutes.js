import express from 'express';
import { authMiddleware, facultyMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All faculty routes require authentication and faculty role
router.use(authMiddleware, facultyMiddleware);

// Dashboard
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Faculty dashboard',
    data: {
      userId: req.user.userId,
      message: 'Welcome to your faculty dashboard!'
    }
  });
});

// Create notice
router.post('/notices', (req, res) => {
  res.json({
    success: true,
    message: 'Notice created successfully',
    data: {
      noticeId: '123',
      ...req.body
    }
  });
});

// Update notice
router.put('/notices/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Notice updated successfully',
    data: {
      noticeId: req.params.id,
      ...req.body
    }
  });
});

// Delete notice
router.delete('/notices/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Notice deleted successfully'
  });
});

// Get students list
router.get('/students', (req, res) => {
  res.json({
    success: true,
    message: 'Students retrieved',
    data: {
      students: [
        { id: 1, name: 'John Doe', rollNumber: '2024CS001' },
        { id: 2, name: 'Jane Smith', rollNumber: '2024CS002' }
      ]
    }
  });
});

// Mark attendance
router.post('/attendance', (req, res) => {
  res.json({
    success: true,
    message: 'Attendance marked successfully',
    data: req.body
  });
});

export default router;
