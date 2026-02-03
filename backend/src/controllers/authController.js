import * as authService from '../services/authService.js';

export const registerStudent = async (req, res) => {
  const result = await authService.registerStudent(req.validatedData);
  res.status(result.success ? 201 : 400).json(result);
};

export const registerFaculty = async (req, res) => {
  const result = await authService.registerFaculty(req.validatedData);
  res.status(result.success ? 201 : 400).json(result);
};

export const login = async (req, res) => {
  const { email, password } = req.validatedData;
  const result = await authService.login(email, password);
  
  if (result.success && result.data.refreshToken) {
    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
  
  res.status(result.success ? 200 : 401).json(result);
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  const result = await authService.verifyEmail(token);
  res.status(result.success ? 200 : 400).json(result);
};

export const forgotPassword = async (req, res) => {
  const { email } = req.validatedData;
  const result = await authService.forgotPassword(email);
  res.status(200).json(result); // Always return 200 for security
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.validatedData;
  const result = await authService.resetPassword(token, newPassword);
  res.status(result.success ? 200 : 400).json(result);
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ 
      success: false, 
      message: 'No refresh token provided' 
    });
  }
  
  const result = await authService.refreshAccessToken(refreshToken);
  res.status(result.success ? 200 : 401).json(result);
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  const result = await authService.logout(req.user.userId, refreshToken);
  
  if (result.success) {
    res.clearCookie('refreshToken');
  }
  
  res.status(200).json(result);
};

export const getCurrentUser = async (req, res) => {
  const result = await authService.getCurrentUser(req.user.userId);
  res.status(result.success ? 200 : 404).json(result);
};
