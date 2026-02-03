import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';

const CampusEchoLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userType, setUserType] = useState('student'); // 'student' or 'faculty'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login API call
    setTimeout(() => {
      console.log('Login submitted:', { userType, ...formData });
      alert(`${userType === 'student' ? 'Student' : 'Faculty'} Login Successful!\n\nEmail: ${formData.email}`);
      setIsLoading(false);
    }, 1500);
  };

  // const handleGoogleLogin = () => {
  //   alert('Google OAuth login would be triggered here');
  // };

  // const handleMicrosoftLogin = () => {
  //   alert('Microsoft OAuth login would be triggered here');
  // };

  return (
    <div style={styles.container}>
      {/* Background Effects */}
      <div style={styles.bgEffects}>
        <div style={{...styles.orb, ...styles.orb1}}></div>
        <div style={{...styles.orb, ...styles.orb2}}></div>
        <div style={{...styles.orb, ...styles.orb3}}></div>
      </div>
      <div style={styles.gridOverlay}></div>

      {/* Login Card */}
      <div style={styles.loginCard}>
        {/* Logo Section */}
        <div style={styles.logoSection}>
          {/* <div style={styles.logoIcon}>🎙️</div> */}
          <h1 style={styles.logoText}>Campus Echo</h1>
          <p style={styles.tagline}>Your AI-Powered College Assistant</p>
        </div>

        {/* User Type Toggle */}
        <div style={styles.toggleContainer}>
          <button
            style={{
              ...styles.toggleButton,
              ...(userType === 'student' ? styles.toggleButtonActive : {})
            }}
            onClick={() => setUserType('student')}
          >
            <span style={styles.toggleIcon}>🎓</span>
            <span>Student</span>
          </button>
          <button
            style={{
              ...styles.toggleButton,
              ...(userType === 'faculty' ? styles.toggleButtonActive : {})
            }}
            onClick={() => setUserType('faculty')}
          >
            <span style={styles.toggleIcon}>👨‍🏫</span>
            <span>Faculty</span>
          </button>
        </div>

        {/* Welcome Message */}
        <div style={styles.welcomeSection}>
          <h2 style={styles.welcomeTitle}>
            Welcome Back, {userType === 'student' ? 'Student' : 'Professor'}!
          </h2>
          <p style={styles.welcomeSubtitle}>
            {userType === 'student' 
              ? 'Access your personalized campus assistant' 
              : 'Manage your classes and student interactions'}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              {userType === 'student' ? 'Student Email' : 'Faculty Email'}
            </label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>✉️</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={userType === 'student' ? 'student@college.edu' : 'faculty@college.edu'}
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                style={styles.input}
                required
              />
              <button
                type="button"
                style={styles.showPasswordBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={styles.formOptions}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                style={styles.checkbox}
              />
              <span style={styles.checkboxText}>Remember me</span>
            </label>
            <a href="#forgot" style={styles.forgotLink}>Forgot Password?</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(isLoading ? styles.submitButtonLoading : {})
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span style={styles.spinner}></span>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        {/* <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>OR CONTINUE WITH</span>
          <span style={styles.dividerLine}></span>
        </div> */}

        {/* Social Login */}
        {/* <div style={styles.socialLogin}>
          <button style={styles.socialButton} onClick={handleGoogleLogin}>
            <span style={styles.socialIcon}>🔴</span>
            <span>Google</span>
          </button>
          <button style={styles.socialButton} onClick={handleMicrosoftLogin}>
            <span style={styles.socialIcon}>🔷</span>
            <span>Microsoft</span>
          </button>
        </div> */}

        {/* Sign Up Link */}
        <div style={styles.signupSection}>
          <p style={styles.signupText}>
            Don't have an account?{" "}
            <span
              style={styles.signupLink}
              onClick={() => navigate("/register")}
            >
              Sign up here
            </span>
          </p>
        </div>

        {/* Info Badge */}
        {/* <div style={styles.infoBadge}>
          <span style={styles.lockIcon}>🔒</span>
          <span style={styles.infoText}>Secure login with end-to-end encryption</span>
        </div> */}
      </div>

      {/* Back to Home Link */}
      <a href="/" style={styles.backLink}>
        ← Back to Home
      </a>
    </div>
  );
};

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B0F14',
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  bgEffects: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(100px)',
    opacity: 0.15,
  },
  orb1: {
    width: '400px',
    height: '400px',
    background: '#00d4ff',
    top: '-150px',
    right: '-150px',
  },
  orb2: {
    width: '350px',
    height: '350px',
    background: '#a855f7',
    bottom: '-100px',
    left: '-100px',
  },
  orb3: {
    width: '300px',
    height: '300px',
    background: '#ff006e',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  gridOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.02) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  loginCard: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '480px',
    width: '100%',
    background: 'rgba(20, 25, 32, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 212, 255, 0.15)',
    borderRadius: '32px',
    padding: '48px 40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoIcon: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    borderRadius: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    marginBottom: '16px',
    boxShadow: '0 8px 32px rgba(0, 212, 255, 0.3)',
  },
  logoText: {
    fontSize: '32px',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
  },
  tagline: {
    fontSize: '14px',
    color: '#9ca3af',
    fontWeight: 400,
  },
  toggleContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '32px',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '6px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  toggleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'transparent',
    border: 'none',
    borderRadius: '12px',
    color: '#9ca3af',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  toggleButtonActive: {
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    color: '#ffffff',
    boxShadow: '0 4px 16px rgba(0, 212, 255, 0.3)',
  },
  toggleIcon: {
    fontSize: '20px',
  },
  welcomeSection: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  welcomeTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: '8px',
  },
  welcomeSubtitle: {
    fontSize: '14px',
    color: '#9ca3af',
  },
  form: {
    marginBottom: '24px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '8px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    fontSize: '18px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  showPasswordBtn: {
    position: 'absolute',
    right: '12px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px',
  },
  formOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkboxText: {
    fontSize: '14px',
    color: '#9ca3af',
  },
  forgotLink: {
    fontSize: '14px',
    color: '#00d4ff',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'color 0.3s ease',
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(0, 212, 255, 0.4)',
  },
  submitButtonLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '32px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: 600,
    letterSpacing: '1px',
  },
  socialLogin: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '24px',
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  socialIcon: {
    fontSize: '20px',
  },
  signupSection: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  signupText: {
    fontSize: '14px',
    color: '#9ca3af',
  },
  signupLink: {
    color: '#00d4ff',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'color 0.3s ease',
    cursor: 'pointer',
  },
  infoBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: 'rgba(0, 255, 136, 0.1)',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    borderRadius: '12px',
  },
  lockIcon: {
    fontSize: '16px',
  },
  infoText: {
    fontSize: '12px',
    color: '#00ff88',
    fontWeight: 600,
  },
  backLink: {
    position: 'fixed',
    top: '24px',
    left: '24px',
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'color 0.3s ease',
    zIndex: 10,
  },
};

// Add keyframe animation for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  input:focus {
    border-color: #00d4ff !important;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1) !important;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  a:hover {
    color: #00d4ff !important;
  }
  
  .social-button:hover {
    border-color: rgba(0, 212, 255, 0.3) !important;
    background: rgba(0, 212, 255, 0.1) !important;
  }
`;
document.head.appendChild(styleSheet);

export default CampusEchoLogin;
