import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Student Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <div style={styles.welcomeCard}>
        <h2 style={styles.welcomeTitle}>
          Welcome, {user?.profile?.fullName || 'Student'}! 🎓
        </h2>
        <p style={styles.welcomeSubtitle}>
          Roll Number: {user?.profile?.rollNumber}
        </p>
        <p style={styles.welcomeSubtitle}>
          Department: {user?.profile?.department}
        </p>
        <p style={styles.welcomeSubtitle}>
          Year: {user?.profile?.year}
        </p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📢</div>
          <h3 style={styles.cardTitle}>Campus Notices</h3>
          <p style={styles.cardText}>View important announcements</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>📅</div>
          <h3 style={styles.cardTitle}>Events</h3>
          <p style={styles.cardText}>Upcoming campus events</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>📚</div>
          <h3 style={styles.cardTitle}>Resources</h3>
          <p style={styles.cardText}>Academic materials & links</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>💬</div>
          <h3 style={styles.cardTitle}>AI Assistant</h3>
          <p style={styles.cardText}>Ask questions about campus</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0B0F14',
    color: 'white',
    padding: '2rem',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoutBtn: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s',
  },
  welcomeCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '2rem',
  },
  welcomeTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  welcomeSubtitle: {
    fontSize: '1.1rem',
    color: '#9ca3af',
    marginBottom: '0.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  cardIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  cardText: {
    fontSize: '1rem',
    color: '#9ca3af',
  },
};

export default StudentDashboard;
