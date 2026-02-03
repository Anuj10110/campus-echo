import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import VoiceAssistant from '../components/VoiceAssistant';
import apiService from '../services/api';

const StudentDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    (async () => {
      setDataLoading(true);
      setDataError('');

      try {
        const [n, e, r] = await Promise.all([
          apiService.getNotices(),
          apiService.getEvents(),
          apiService.getResources(),
        ]);

        if (cancelled) return;

        setNotices(n?.data?.notices || []);
        setEvents(e?.data?.events || []);
        setResources(r?.data?.resources || []);
      } catch (err) {
        if (cancelled) return;
        setDataError(err?.message || 'Failed to load dashboard data.');
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Campus Echo</h1>
          <div style={styles.headerActions}>
            <div style={styles.userInfo}>
              <span style={styles.username}>👤 {user?.profile?.fullName}</span>
              <span style={styles.role}>{user?.profile?.rollNumber}</span>
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
          <h2 style={styles.welcomeTitle}>Welcome, {user?.profile?.fullName}! 👋</h2>
          <p style={styles.welcomeText}>
            You are logged in as a <strong>Student</strong> in <strong>{user?.profile?.department}</strong>
          </p>
        </div>

        {/* Dashboard Sections */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📢 Campus Notices</h3>
            <p style={styles.cardContent}>
              View all important announcements and notices from your college administration.
            </p>
            {dataLoading ? (
              <p style={styles.miniText}>Loading…</p>
            ) : (
              <ul style={styles.miniList}>
                {(notices || []).slice(0, 3).map((n) => (
                  <li key={n.id} style={styles.miniListItem}>
                    <span>{n.title}</span>
                    <span style={styles.miniDate}>{n.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🎉 Campus Events</h3>
            <p style={styles.cardContent}>
              Stay updated with upcoming events, seminars, and workshops on campus.
            </p>
            {dataLoading ? (
              <p style={styles.miniText}>Loading…</p>
            ) : (
              <ul style={styles.miniList}>
                {(events || []).slice(0, 3).map((ev) => (
                  <li key={ev.id} style={styles.miniListItem}>
                    <span>{ev.title}</span>
                    <span style={styles.miniDate}>{ev.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📚 Academic Resources</h3>
            <p style={styles.cardContent}>
              Access study materials, lecture notes, and learning resources from faculty.
            </p>
            {dataLoading ? (
              <p style={styles.miniText}>Loading…</p>
            ) : (
              <ul style={styles.miniList}>
                {(resources || []).slice(0, 3).map((res) => (
                  <li key={res.id} style={styles.miniListItem}>
                    <span>{res.title}</span>
                    <span style={styles.miniPill}>{res.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>👤 My Profile</h3>
            <p style={styles.cardContent}>
              View and manage your profile information and academic details.
            </p>
            <div style={styles.miniText}>
              <div><strong>Email:</strong> {user?.email}</div>
              <div><strong>Year:</strong> {user?.profile?.year}</div>
            </div>
          </div>
        </div>

        {dataError && (
          <div style={styles.errorBox}>
            <strong>Dashboard data error:</strong> {dataError}
          </div>
        )}

        {/* Voice Assistant */}
        <VoiceAssistant />

        {/* User Info */}
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>Your Information</h3>
          <div style={styles.infoGrid}>
            <div>
              <strong>Email:</strong>
              <p>{user?.email}</p>
            </div>
            <div>
              <strong>Roll Number:</strong>
              <p>{user?.profile?.rollNumber}</p>
            </div>
            <div>
              <strong>Department:</strong>
              <p>{user?.profile?.department}</p>
            </div>
            <div>
              <strong>Year:</strong>
              <p>{user?.profile?.year}</p>
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
    borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
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
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
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
    background: 'rgba(0, 212, 255, 0.1)',
    border: '1px solid rgba(0, 212, 255, 0.2)',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '40px',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '10px',
    color: '#00d4ff',
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
    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
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
  errorBox: {
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#fecaca',
    marginBottom: '24px',
  },
  miniText: {
    fontSize: '13px',
    color: '#d1d5db',
    lineHeight: 1.6,
  },
  miniList: {
    margin: 0,
    paddingLeft: '18px',
    color: '#d1d5db',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  miniListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
  },
  miniDate: {
    color: '#9ca3af',
    whiteSpace: 'nowrap',
  },
  miniPill: {
    color: '#9ca3af',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '999px',
    padding: '0 10px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
};

export default StudentDashboard;
