import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [notice, setNotice] = useState({ title: '', content: '' });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleCreateNotice = (e) => {
    e.preventDefault();
    alert('Notice created: ' + notice.title);
    setNotice({ title: '', content: '' });
    setShowNoticeForm(false);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Campus Echo</h1>
          <div style={styles.headerActions}>
            <div style={styles.userInfo}>
              <span style={styles.username}>👨‍🏫 {user?.profile?.fullName}</span>
              <span style={styles.role}>{user?.profile?.designation}</span>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.welcomeBox}>
          <h2 style={styles.welcomeTitle}>Welcome, Dr. {user?.profile?.fullName?.split(' ').pop()}! 👋</h2>
          <p style={styles.welcomeText}>
            You are logged in as <strong>{user?.profile?.designation}</strong> in <strong>{user?.profile?.department}</strong>
          </p>
        </div>

        {/* Dashboard Sections */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📢 Create Notice</h3>
            <p style={styles.cardContent}>
              Post important announcements and notices for your students.
            </p>
            <button onClick={() => setShowNoticeForm(!showNoticeForm)} style={styles.cardBtn}>
              {showNoticeForm ? 'Cancel' : 'New Notice'} →
            </button>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📋 My Notices</h3>
            <p style={styles.cardContent}>
              View and manage notices you have posted.
            </p>
            <button style={styles.cardBtn}>View Notices →</button>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>👥 Student List</h3>
            <p style={styles.cardContent}>
              View list of students enrolled in your courses.
            </p>
            <button style={styles.cardBtn}>View Students →</button>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>✅ Mark Attendance</h3>
            <p style={styles.cardContent}>
              Take attendance for your classes and sessions.
            </p>
            <button style={styles.cardBtn}>Attendance →</button>
          </div>
        </div>

        {/* Notice Creation Form */}
        {showNoticeForm && (
          <div style={styles.formBox}>
            <h3 style={styles.formTitle}>Create New Notice</h3>
            <form onSubmit={handleCreateNotice} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Notice Title</label>
                <input
                  type="text"
                  value={notice.title}
                  onChange={(e) => setNotice({ ...notice, title: e.target.value })}
                  placeholder="Enter notice title"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Notice Content</label>
                <textarea
                  value={notice.content}
                  onChange={(e) => setNotice({ ...notice, content: e.target.value })}
                  placeholder="Enter notice content"
                  style={{ ...styles.input, minHeight: '150px' }}
                  required
                />
              </div>

              <button type="submit" style={styles.submitBtn}>
                Post Notice
              </button>
            </form>
          </div>
        )}

        {/* Faculty Info */}
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>Your Information</h3>
          <div style={styles.infoGrid}>
            <div>
              <strong>Email:</strong>
              <p>{user?.email}</p>
            </div>
            <div>
              <strong>Employee ID:</strong>
              <p>{user?.profile?.employeeId}</p>
            </div>
            <div>
              <strong>Department:</strong>
              <p>{user?.profile?.department}</p>
            </div>
            <div>
              <strong>Designation:</strong>
              <p>{user?.profile?.designation}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0B0F14',
    color: 'white',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    background: 'rgba(20, 25, 32, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(168, 85, 247, 0.1)',
    padding: '20px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #a855f7, #d946ef)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  username: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#d1d5db',
  },
  role: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  logoutBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  welcomeBox: {
    background: 'rgba(168, 85, 247, 0.1)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '40px',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '10px',
    color: '#a855f7',
  },
  welcomeText: {
    fontSize: '16px',
    color: '#d1d5db',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
    transition: 'all 0.3s',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '12px',
    color: '#ffffff',
  },
  cardContent: {
    fontSize: '14px',
    color: '#9ca3af',
    marginBottom: '16px',
    lineHeight: 1.6,
  },
  cardBtn: {
    width: '100%',
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #a855f7, #9333ea)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  formBox: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '40px',
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '20px',
    color: '#ffffff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#d1d5db',
  },
  input: {
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  submitBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #a855f7, #9333ea)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  infoBox: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
  },
  infoTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '20px',
    color: '#ffffff',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
};

export default FacultyDashboard;
