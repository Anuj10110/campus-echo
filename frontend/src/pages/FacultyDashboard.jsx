import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Faculty Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <div style={styles.welcomeCard}>
        <h2 style={styles.welcomeTitle}>
          Welcome, {user?.profile?.fullName || 'Professor'}! 👨‍🏫
        </h2>
        <p style={styles.welcomeSubtitle}>
          Employee ID: {user?.profile?.employeeId}
        </p>
        <p style={styles.welcomeSubtitle}>
          Designation: {user?.profile?.designation}
        </p>
        <p style={styles.welcomeSubtitle}>
          Department: {user?.profile?.department}
        </p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📢</div>
          <h3 style={styles.cardTitle}>Post Notice</h3>
          <p style={styles.cardText}>Create campus announcements</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>👥</div>
          <h3 style={styles.cardTitle}>Students</h3>
          <p style={styles.cardText}>View student list</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>✅</div>
          <h3 style={styles.cardTitle}>Attendance</h3>
          <p style={styles.cardText}>Mark student attendance</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>📊</div>
          <h3 style={styles.cardTitle}>Analytics</h3>
          <p style={styles.cardText}>View class statistics</p>
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

export default FacultyDashboard;
