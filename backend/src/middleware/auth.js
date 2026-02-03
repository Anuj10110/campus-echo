import { verifyAccessToken } from '../utils/jwt.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

export const studentMiddleware = (req, res, next) => {
  if (req.user && req.user.userType === 'STUDENT') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Student role required.' 
    });
  }
};

export const facultyMiddleware = (req, res, next) => {
  if (req.user && req.user.userType === 'FACULTY') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Faculty role required.' 
    });
  }
};
