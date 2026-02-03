import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService.js';

const VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

export const registerStudent = async (userData) => {
  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 10);

    // Create user and student record
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash,
        userType: 'STUDENT',
        isVerified: false,
        student: {
          create: {
            fullName: userData.fullName,
            rollNumber: userData.rollNumber,
            department: userData.department,
            year: userData.year,
            phone: userData.phone
          }
        }
      },
      include: { student: true }
    });

    // Generate verification token
    const verificationToken = uuidv4();
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY)
      }
    });

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(user.email, userData.fullName, verificationLink);

    return { 
      success: true, 
      message: 'Registration successful. Please verify your email.',
      userId: user.id
    };
  } catch (error) {
    console.error('Student registration error:', error);
    return { success: false, message: 'Registration failed', error: error.message };
  }
};

export const registerFaculty = async (userData) => {
  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 10);

    // Create user and faculty record
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash,
        userType: 'FACULTY',
        isVerified: false,
        faculty: {
          create: {
            fullName: userData.fullName,
            employeeId: userData.employeeId,
            department: userData.department,
            designation: userData.designation,
            phone: userData.phone
          }
        }
      },
      include: { faculty: true }
    });

    // Generate verification token
    const verificationToken = uuidv4();
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY)
      }
    });

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(user.email, userData.fullName, verificationLink);

    return { 
      success: true, 
      message: 'Registration successful. Please verify your email.',
      userId: user.id
    };
  } catch (error) {
    console.error('Faculty registration error:', error);
    return { success: false, message: 'Registration failed', error: error.message };
  }
};

export const login = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { student: true, faculty: true }
    });

    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    if (!user.isVerified) {
      return { success: false, message: 'Please verify your email first' };
    }

    if (!user.isActive) {
      return { success: false, message: 'Account is inactive' };
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return { success: false, message: 'Invalid credentials' };
    }

    const accessToken = generateAccessToken(user.id, user.userType);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    const userProfile = user.userType === 'STUDENT' ? user.student : user.faculty;

    return {
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          userType: user.userType,
          profile: userProfile
        }
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed', error: error.message };
  }
};

export const verifyEmail = async (token) => {
  try {
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token }
    });

    if (!verificationToken) {
      return { success: false, message: 'Invalid verification token' };
    }

    if (verificationToken.expiresAt < new Date()) {
      return { success: false, message: 'Verification token has expired' };
    }

    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { isVerified: true }
    });

    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id }
    });

    return { success: true, message: 'Email verified successfully' };
  } catch (error) {
    console.error('Email verification error:', error);
    return { success: false, message: 'Email verification failed', error: error.message };
  }
};

export const forgotPassword = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if email exists (security best practice)
      return { success: true, message: 'If email exists, reset link has been sent' };
    }

    const resetToken = uuidv4();
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + RESET_TOKEN_EXPIRY)
      }
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      include: { student: true, faculty: true }
    });
    const fullName = profile.student?.fullName || profile.faculty?.fullName || 'User';
    
    await sendPasswordResetEmail(email, fullName, resetLink);

    return { success: true, message: 'Password reset link sent to your email' };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { success: false, message: 'Request failed', error: error.message };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetToken) {
      return { success: false, message: 'Invalid reset token' };
    }

    if (resetToken.expiresAt < new Date()) {
      return { success: false, message: 'Reset token has expired' };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash }
    });

    // Delete all refresh tokens to invalidate all sessions
    await prisma.refreshToken.deleteMany({
      where: { userId: resetToken.userId }
    });

    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id }
    });

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, message: 'Password reset failed', error: error.message };
  }
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return { success: false, message: 'Invalid or expired refresh token' };
    }

    const user = await prisma.user.findUnique({
      where: { id: storedToken.userId }
    });

    if (!user || !user.isActive) {
      return { success: false, message: 'User not found or inactive' };
    }

    const newAccessToken = generateAccessToken(user.id, user.userType);

    return {
      success: true,
      data: { accessToken: newAccessToken }
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return { success: false, message: 'Token refresh failed', error: error.message };
  }
};

export const logout = async (userId, refreshToken) => {
  try {
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
        token: refreshToken
      }
    });

    return { success: true, message: 'Logout successful' };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: 'Logout failed', error: error.message };
  }
};

export const getCurrentUser = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { student: true, faculty: true }
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const profile = user.userType === 'STUDENT' ? user.student : user.faculty;

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        isVerified: user.isVerified,
        profile
      }
    };
  } catch (error) {
    console.error('Get user error:', error);
    return { success: false, message: 'Failed to fetch user', error: error.message };
  }
};
