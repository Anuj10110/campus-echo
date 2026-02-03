import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';

/**
 * Campus Echo Registration Component
 * A complete registration system for students and faculty
 * 
 * Usage:
 * import Registration from './Registration';
 * <Registration />
 */

const Registration = () => {
  const navigate = useNavigate();
  const { registerStudent, registerFaculty } = useAuth();
  
  // State management
  const [currentView, setCurrentView] = useState('selection'); // 'selection', 'student', 'faculty'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    rollNumber: '',
    employeeId: '',
    department: '',
    year: '',
    designation: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      rollNumber: '',
      employeeId: '',
      department: '',
      year: '',
      designation: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  // Handle student registration submission
  const handleStudentSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.toLowerCase().endsWith('@college.edu')) {
      alert('Please use your college email ending with @college.edu');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('❌ Passwords do not match!');
      return;
    }

    try {
      const response = await registerStudent({
        fullName: formData.fullName,
        email: formData.email,
        rollNumber: formData.rollNumber,
        department: formData.department,
        year: formData.year,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.success) {
        alert('✅ Registration successful. Please verify your email before logging in.');
        resetForm();
        navigate('/login');
      } else {
        alert(response.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please try again.');
    }
  };

  // Handle faculty registration submission
  const handleFacultySubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.toLowerCase().endsWith('@college.edu')) {
      alert('Please use your official college email ending with @college.edu');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('❌ Passwords do not match!');
      return;
    }

    try {
      const response = await registerFaculty({
        fullName: formData.fullName,
        email: formData.email,
        employeeId: formData.employeeId,
        department: formData.department,
        designation: formData.designation,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.success) {
        alert('✅ Registration successful. Please verify your email before logging in.');
        resetForm();
        navigate('/login');
      } else {
        alert(response.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please try again.');
    }
  };

  // Navigation functions
  const showSelection = () => {
    setCurrentView('selection');
    window.scrollTo(0, 0);
  };

  const showStudentForm = () => {
    setCurrentView('student');
    window.scrollTo(0, 0);
  };

  const showFacultyForm = () => {
    setCurrentView('faculty');
    window.scrollTo(0, 0);
  };

  return (
    <div style={styles.registrationApp}>
      {/* Background Gradients */}
      <div style={{...styles.bgGradient, ...styles.gradientTop}}></div>
      <div style={{...styles.bgGradient, ...styles.gradientBottom}}></div>

      <div style={styles.registrationContent}>
        {/* ============ SELECTION VIEW ============ */}
        {currentView === 'selection' && (
          <div style={styles.selectionContainer}>
            <div style={styles.selectionHeader}>
              <h1 style={styles.selectionTitle}>Join Campus Echo</h1>
              <p style={styles.selectionSubtitle}>Choose your role to get started</p>
            </div>

            <div style={styles.userCards}>
              {/* Student Card */}
              <div 
                style={{...styles.userCard, ...styles.studentCard}} 
                onClick={showStudentForm}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={styles.cardIconWrapper}>
                  <div style={{...styles.cardIcon, ...styles.studentIcon}}>🎓</div>
                </div>
                <h2 style={styles.cardTitle}>I'm a Student</h2>
                <p style={styles.cardDescription}>
                  Access notices, events, resources
                </p>
                <div style={styles.cardFeatures}>
                  <div style={styles.feature}>✓ Campus Updates</div>
                  <div style={styles.feature}>✓ Event Notifications</div>
                  <div style={styles.feature}>✓ Resource Access</div>
                </div>
                <button style={{...styles.cardButton, ...styles.studentButton}}>
                  Register as Student →
                </button>
              </div>

              {/* Faculty Card */}
              <div 
                style={{...styles.userCard, ...styles.facultyCard}} 
                onClick={showFacultyForm}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={styles.cardIconWrapper}>
                  <div style={{...styles.cardIcon, ...styles.facultyIcon}}>💼</div>
                </div>
                <h2 style={styles.cardTitle}>I'm a Faculty Member</h2>
                <p style={styles.cardDescription}>
                  Manage classes, post announcements
                </p>
                <div style={styles.cardFeatures}>
                  <div style={styles.feature}>✓ Class Management</div>
                  <div style={styles.feature}>✓ Post Notices</div>
                  <div style={styles.feature}>✓ Attendance Tracking</div>
                </div>
                <button style={{...styles.cardButton, ...styles.facultyButton}}>
                  Register as Faculty →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============ STUDENT REGISTRATION FORM ============ */}
        {currentView === 'student' && (
          <div style={styles.formContainer}>
            <button style={styles.backButton} onClick={showSelection}>← Back</button>

            <div style={styles.formHeader}>
              {/* <div style={{...styles.formIconBox, ...styles.studentIcon}}>🎓</div> */}
              <h2 style={styles.formTitle}>Student Registration</h2>
              <p style={styles.formSubtitle}>Create your account to access Campus Echo</p>
            </div>

            <form style={styles.registrationForm} onSubmit={handleStudentSubmit}>
              <div style={styles.formGrid}>
                <div style={{...styles.formGroup, ...styles.fullWidth}}>
                  <label style={styles.formLabel}>👤 Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    style={styles.formInput}
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={{...styles.formGroup, ...styles.fullWidth}}>
                  <label style={styles.formLabel}>📧 College Email</label>
                  <input
                    type="email"
                    name="email"
                    style={styles.formInput}
                    placeholder="john.doe@college.edu"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={{...styles.formGroup, ...styles.fullWidth}}>
                  <label style={styles.formLabel}>🆔 Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    style={styles.formInput}
                    placeholder="2024CS001"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>📚 Department</label>
                  <select
                    name="department"
                    style={{...styles.formInput, cursor: 'pointer'}}
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option>Computer Science</option>
                    <option>Electronics & Communication</option>
                    <option>Mechanical Engineering</option>
                    <option>Civil Engineering</option>
                    <option>Information Technology</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>📅 Year</label>
                  <select
                    name="year"
                    style={{...styles.formInput, cursor: 'pointer'}}
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Year</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>

                <div style={{...styles.formGroup, ...styles.fullWidth}}>
                  <label style={styles.formLabel}>📱 Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    style={styles.formInput}
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>🔒 Password</label>
                  <input
                    type="password"
                    name="password"
                    style={styles.formInput}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>🔒 Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    style={styles.formInput}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" style={{...styles.submitButton, ...styles.studentButton}}>
                Create Student Account
              </button>

              <div style={styles.formFooter}>
                Already have an account? <span
              style={styles.signupLink}
              onClick={() => navigate("/Login")}
            >
              Login
            </span>
              </div>
            </form>
          </div>
        )}

        {/* ============ FACULTY REGISTRATION FORM ============ */}
        {currentView === 'faculty' && (
          <div style={styles.formContainer}>
            <button style={styles.backButton} onClick={showSelection}>← Back</button>

            <div style={styles.formHeader}>
              {/* <div style={{...styles.formIconBox, ...styles.facultyIcon}}>💼</div> */}
              <h2 style={styles.formTitle}>Faculty Registration</h2>
              <p style={styles.formSubtitle}>Join Campus Echo to manage your classes efficiently</p>
            </div>

            <form style={styles.registrationForm} onSubmit={handleFacultySubmit}>
              <div style={styles.formGrid}>
                <div style={{...styles.formGroup, ...styles.fullWidth}}>
                  <label style={styles.formLabel}>👤 Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    style={styles.formInput}
                    placeholder="Dr. Jane Smith"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={{...styles.formGroup, ...styles.fullWidth}}>
                  <label style={styles.formLabel}>📧 Official Email</label>
                  <input
                    type="email"
                    name="email"
                    style={styles.formInput}
                    placeholder="jane.smith@college.edu"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={{...styles.formGroup, ...styles.fullWidth}}>
                  <label style={styles.formLabel}>🆔 Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    style={styles.formInput}
                    placeholder="FAC2024001"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>🏢 Department</label>
                  <select
                    name="department"
                    style={{...styles.formInput, cursor: 'pointer'}}
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option>Computer Science</option>
                    <option>Electronics & Communication</option>
                    <option>Mechanical Engineering</option>
                    <option>Civil Engineering</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>💼 Designation</label>
                  <select
                    name="designation"
                    style={{...styles.formInput, cursor: 'pointer'}}
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Designation</option>
                    <option>Professor</option>
                    <option>Associate Professor</option>
                    <option>Assistant Professor</option>
                    <option>Lecturer</option>
                    <option>Head of Department</option>
                  </select>
                </div>

                <div style={{...styles.formGroup, ...styles.fullWidth}}>
                  <label style={styles.formLabel}>📱 Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    style={styles.formInput}
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>🔒 Password</label>
                  <input
                    type="password"
                    name="password"
                    style={styles.formInput}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>🔒 Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    style={styles.formInput}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" style={{...styles.submitButton, ...styles.facultyButton}}>
                Create Faculty Account
              </button>

              <div style={styles.formFooter}>
                Already have an account? <span
              style={styles.signupLink}
              onClick={() => navigate("/Login")}
            >
              Login
            </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// ============ STYLES ============
const styles = {
  registrationApp: {
    position: 'relative',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: '#0B0F14',
    color: 'white',
  },
  bgGradient: {
    position: 'fixed',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    filter: 'blur(100px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  gradientTop: {
    top: '-100px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(6, 182, 212, 0.15)',
  },
  gradientBottom: {
    bottom: '-100px',
    right: '-100px',
    background: 'rgba(168, 85, 247, 0.15)',
  },
  registrationContent: {
    position: 'relative',
    zIndex: 1,
    padding: '2rem',
  },
  selectionContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionHeader: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  selectionTitle: {
    fontSize: '3.5rem',
    fontWeight: 800,
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  selectionSubtitle: {
    fontSize: '1.25rem',
    color: '#9ca3af',
  },
  userCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    width: '100%',
  },
  userCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '2rem',
    padding: '3rem',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  studentCard: {
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  facultyCard: {
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  cardIconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  cardIcon: {
    width: '120px',
    height: '120px',
    borderRadius: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    transition: 'transform 0.4s',
  },
  studentIcon: {
    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(34, 211, 238, 0.1))',
    color: '#06b6d4',
    boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)',
  },
  facultyIcon: {
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(192, 132, 252, 0.1))',
    color: '#a855f7',
    boxShadow: '0 20px 40px rgba(168, 85, 247, 0.3)',
  },
  cardTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'white',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: '1rem',
    color: '#9ca3af',
    lineHeight: 1.7,
    marginBottom: '2rem',
    textAlign: 'center',
  },
  cardFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '2rem',
  },
  feature: {
    color: '#d1d5db',
    fontSize: '0.95rem',
    paddingLeft: '0.5rem',
  },
  cardButton: {
    width: '100%',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '1rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s',
  },
  studentButton: {
    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    boxShadow: '0 10px 30px rgba(6, 182, 212, 0.4)',
  },
  facultyButton: {
    background: 'linear-gradient(135deg, #a855f7, #9333ea)',
    boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)',
  },
  formContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem',
  },
  backButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginBottom: '2rem',
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  formIconBox: {
    width: '100px',
    height: '100px',
    borderRadius: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    margin: '0 auto 1.5rem',
  },
  formTitle: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: 'white',
  },
  formSubtitle: {
    fontSize: '1.1rem',
    color: '#9ca3af',
  },
  registrationForm: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '2rem',
    padding: '3rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  formLabel: {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#d1d5db',
    marginBottom: '0.5rem',
  },
  formInput: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    color: 'white',
    transition: 'all 0.3s',
    outline: 'none',
  },
  submitButton: {
    width: '100%',
    padding: '1.125rem 2rem',
    border: 'none',
    borderRadius: '1rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginBottom: '1.5rem',
  },
  formFooter: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '0.95rem',
  },
  signupLink: {
    color: '#09bcdc',
    textDecoration: 'none',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default Registration;