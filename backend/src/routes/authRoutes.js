import express from 'express';
import * as authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { 
  validate, 
  studentRegistrationSchema, 
  facultyRegistrationSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../utils/validation.js';

const router = express.Router();

// Public routes
router.post('/register/student', validate(studentRegistrationSchema), authController.registerStudent);
router.post('/register/faculty', validate(facultyRegistrationSchema), authController.registerFaculty);
router.post('/login', validate(loginSchema), authController.login);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getCurrentUser);

export default router;
