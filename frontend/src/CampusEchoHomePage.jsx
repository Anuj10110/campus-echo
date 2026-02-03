import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CampusEchoHomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const navigate = useNavigate();

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLaunch = () => {
    navigate('/login');
  };


  return (
    <div style={styles.app}>
      {/* Background Effects */}
      <div style={styles.bgEffects}>
        <div style={{
          ...styles.orb,
          ...styles.orb1,
          transform: `translate(${(mousePosition.x - 0.5) * 20}px, ${(mousePosition.y - 0.5) * 20}px)`
        }}></div>
        <div style={{
          ...styles.orb,
          ...styles.orb2,
          transform: `translate(${(mousePosition.x - 0.5) * 40}px, ${(mousePosition.y - 0.5) * 40}px)`
        }}></div>
        <div style={{
          ...styles.orb,
          ...styles.orb3,
          transform: `translate(${(mousePosition.x - 0.5) * 30}px, ${(mousePosition.y - 0.5) * 30}px)`
        }}></div>
      </div>
      <div style={styles.gridOverlay}></div>

      {/* Navigation */}
      <nav style={{
        ...styles.nav,
        ...(isScrolled ? styles.navScrolled : {})
      }}>
        <div style={styles.container}>
          <div style={styles.navContent}>
            <div style={styles.logo}>
              {/* <div style={styles.logoIcon}>🎙️</div> */}
              <div style={styles.logoText}>Campus Echo</div>
            </div>
            <button 
              style={styles.navCta}
              onClick={() => scrollToSection('get-started')}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.container}>
          <div style={styles.heroBadge}>
            <span style={styles.statusDot}></span>
            <span>Powered by Advanced AI Technology</span>
          </div>
          <h1 style={styles.heroTitle}>
            Your <span style={styles.gradientText}>Voice-Powered</span><br />
            College Assistant
          </h1>
          <p style={styles.heroDescription}>
            Campus Echo is an intelligent AI assistant designed exclusively for college students.
            Get instant updates on notices, deadlines, exams, and reminders - all through simple voice commands.
          </p>
          <div style={styles.heroButtons}>
            <button 
              style={styles.btnPrimary}
              onClick={() => scrollToSection('get-started')}
            >
              <span>Start Using Now</span>
              <span>→</span>
            </button>
            <button 
              style={styles.btnSecondary}
              onClick={() => scrollToSection('features')}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={styles.section} id="about">
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionLabel}>// What is Campus Echo?</div>
            <h2 style={styles.sectionTitle}>Your Smart Campus Companion</h2>
            <p style={styles.sectionDescription}>
              Campus Echo transforms how you manage your college life. Using cutting-edge voice recognition
              and AI technology, we make staying organized effortless and intuitive.
            </p>
          </div>

          <div style={styles.infoGrid}>
            {[
              {
                icon: '🎤',
                title: 'Voice-First Design',
                description: 'No more endless scrolling. Just speak naturally and get instant answers about your classes, assignments, and campus events. It\'s like having a personal assistant in your pocket.'
              },
              {
                icon: '🤖',
                title: 'AI-Powered Intelligence',
                description: 'Our advanced AI understands context, learns your preferences, and provides personalized responses. The more you use it, the smarter it gets at helping you succeed.'
              },
              {
                icon: '⚡',
                title: 'Real-Time Updates',
                description: 'Stay ahead with instant notifications about campus notices, deadline changes, exam schedules, and important announcements. Never miss what matters.'
              }
            ].map((card, index) => (
              <div key={index} style={styles.infoCard}>
                <span style={styles.cardIcon}>{card.icon}</span>
                <h3 style={styles.cardTitle}>{card.title}</h3>
                <p style={styles.cardText}>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.section} id="features">
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionLabel}>// Key Features</div>
            <h2 style={styles.sectionTitle}>Everything You Need to Excel</h2>
            <p style={styles.sectionDescription}>
              Campus Echo packs powerful features into a beautifully simple interface
            </p>
          </div>

          <div style={styles.featuresGrid}>
            {[
              {
                icon: '📢',
                title: 'Campus Notices Hub',
                description: 'Access all college announcements, department notices, and event updates in one place. Filter by relevance and never miss important information.'
              },
              {
                icon: '⏰',
                title: 'Smart Deadline Tracking',
                description: 'Automatic reminders for assignments, projects, and submissions. Get notified before deadlines with intelligent timing based on task complexity.'
              },
              {
                icon: '📝',
                title: 'Exam Schedule Manager',
                description: 'View upcoming exams, access study materials, and get countdown reminders. Organize your preparation with AI-powered study suggestions.'
              },
              {
                icon: '🔔',
                title: 'Custom Reminders',
                description: 'Set voice-activated reminders for classes, meetings, club activities, or personal tasks. Your AI assistant remembers so you don\'t have to.'
              },
              {
                icon: '🌙',
                title: 'Dark Mode Optimized',
                description: 'Designed for late-night study sessions with a beautiful dark interface that\'s easy on the eyes and saves battery life.'
              },
              {
                icon: '🔒',
                title: 'Privacy & Security',
                description: 'Your academic data is encrypted and never shared. We respect your privacy with end-to-end security protocols.'
              }
            ].map((feature, index) => (
              <div key={index} style={styles.featureItem}>
                <div style={styles.featureIcon}>{feature.icon}</div>
                <div style={styles.featureContent}>
                  <h3 style={styles.featureTitle}>{feature.title}</h3>
                  <p style={styles.featureDescription}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionLabel}>// How It Works</div>
            <h2 style={styles.sectionTitle}>Get Started in 3 Simple Steps</h2>
          </div>

          <div style={styles.stepsContainer}>
            {[
              {
                number: '1',
                title: 'Tap the Mic',
                description: 'Press the glowing microphone button on your screen and speak naturally. No complicated commands needed.'
              },
              {
                number: '2',
                title: 'Ask Anything',
                description: 'Ask about notices, deadlines, exams, or set reminders. Our AI understands context and conversational language.'
              },
              {
                number: '3',
                title: 'Get Instant Answers',
                description: 'Receive immediate, accurate responses with relevant information. Listen to voice playback or read on screen.'
              }
            ].map((step, index) => (
              <div key={index} style={styles.stepCard}>
                <div style={styles.stepNumber}>{step.number}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div style={styles.container}>
        <div style={styles.statsSection}>
          <div style={styles.statsGrid}>
            {[
              { number: '50K+', label: 'Active Students' },
              { number: '200+', label: 'Partner Colleges' },
              { number: '1M+', label: 'Voice Queries' },
              { number: '99%', label: 'Accuracy Rate' }
            ].map((stat, index) => (
              <div key={index} style={styles.statItem}>
                <div style={styles.statNumber}>{stat.number}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.container}>
        <div style={styles.ctaSection} id="get-started">
          <h2 style={styles.ctaTitle}>
            Ready to Transform Your<br />
            <span style={styles.gradientText}>College Experience?</span>
          </h2>
          <p style={styles.ctaDescription}>
            Join thousands of students who are already using Campus Echo to stay organized and succeed academically.
          </p>
          <button style={styles.btnPrimary} onClick={handleLaunch}>
            <span>Launch Campus Echo</span>
            <span>🚀</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerContent}>
            <div style={styles.footerBrand}>
              <h3 style={styles.footerBrandTitle}>Campus Echo</h3>
              <p style={styles.footerBrandText}>
                Empowering students with AI-powered voice assistance for a smarter, more organized college life.
              </p>
            </div>

            {[
              { title: 'Product', links: ['Features', 'About', 'Pricing', 'Roadmap'] },
              { title: 'Resources', links: ['Documentation', 'Help Center', 'Community', 'Blog'] },
              { title: 'Company', links: ['Contact', 'Privacy', 'Terms', 'Careers'] }
            ].map((section, index) => (
              <div key={index} style={styles.footerLinks}>
                <h4 style={styles.footerLinksTitle}>{section.title}</h4>
                <ul style={styles.footerLinksList}>
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex} style={styles.footerLinkItem}>
                      <a href={`#${link.toLowerCase()}`} style={styles.footerLink}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={styles.footerBottom}>
            <p>© 2026 Campus Echo. All rights reserved. Built with ❤️ for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Inline Styles
const styles = {
  app: {
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: '#0B0F14',
    color: '#ffffff',
    minHeight: '100vh',
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
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(100px)',
    opacity: 0.2,
    transition: 'transform 0.3s ease-out',
  },
  orb1: {
    width: '500px',
    height: '500px',
    background: '#00d4ff',
    top: '-200px',
    right: '-200px',
  },
  orb2: {
    width: '400px',
    height: '400px',
    background: '#a855f7',
    bottom: '-150px',
    left: '-100px',
  },
  orb3: {
    width: '300px',
    height: '300px',
    background: '#ff006e',
    top: '50%',
    left: '50%',
  },
  gridOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.02) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    position: 'relative',
    zIndex: 1,
  },
  nav: {
    padding: '24px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    transition: 'all 0.3s ease',
  },
  navScrolled: {
    background: 'rgba(11, 15, 20, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(0, 212, 255, 0.12)',
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
//   logoIcon: {
//     width: '48px',
//     height: '48px',
//     background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
//     borderRadius: '12px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '24px',
//     boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
//   },
  logoText: {
    fontSize: '28px',
    fontWeight: 800,
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  navCta: {
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    color: 'white',
    padding: '12px 28px',
    borderRadius: '30px',
    fontWeight: 600,
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
  hero: {
    padding: '100px 0 80px',
    textAlign: 'center',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 212, 255, 0.12)',
    padding: '8px 20px',
    borderRadius: '30px',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '32px',
    color: '#00d4ff',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    background: '#00ff88',
    borderRadius: '50%',
    display: 'inline-block',
  },
  heroTitle: {
    fontSize: '72px',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: '24px',
    letterSpacing: '-2px',
  },
  gradientText: {
    background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 50%, #ff006e 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroDescription: {
    fontSize: '20px',
    color: '#9ca3af',
    maxWidth: '700px',
    margin: '0 auto 48px',
    lineHeight: 1.7,
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    color: 'white',
    padding: '16px 40px',
    borderRadius: '30px',
    fontWeight: 700,
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 8px 30px rgba(0, 212, 255, 0.4)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
  },
  btnSecondary: {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 212, 255, 0.12)',
    color: '#ffffff',
    padding: '16px 40px',
    borderRadius: '30px',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  section: {
    padding: '100px 0',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '80px',
  },
  sectionLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    fontWeight: 600,
    color: '#00d4ff',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '48px',
    fontWeight: 800,
    marginBottom: '20px',
    letterSpacing: '-1px',
  },
  sectionDescription: {
    fontSize: '18px',
    color: '#9ca3af',
    maxWidth: '700px',
    margin: '0 auto',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    marginTop: '60px',
  },
  infoCard: {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 212, 255, 0.12)',
    borderRadius: '24px',
    padding: '40px',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  cardIcon: {
    fontSize: '48px',
    marginBottom: '24px',
    display: 'block',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '12px',
  },
  cardText: {
    color: '#9ca3af',
    fontSize: '15px',
    lineHeight: 1.7,
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '32px',
    marginTop: '60px',
  },
  featureItem: {
    display: 'flex',
    gap: '20px',
  },
  featureIcon: {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    flexShrink: 0,
    boxShadow: '0 8px 24px rgba(0, 212, 255, 0.3)',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '8px',
  },
  featureDescription: {
    color: '#9ca3af',
    fontSize: '15px',
    lineHeight: 1.6,
  },
  stepsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '40px',
    marginTop: '60px',
  },
  stepCard: {
    textAlign: 'center',
  },
  stepNumber: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: 800,
    margin: '0 auto 24px',
    boxShadow: '0 8px 32px rgba(0, 212, 255, 0.4)',
  },
  stepTitle: {
    fontSize: '22px',
    fontWeight: 700,
    marginBottom: '12px',
  },
  stepDescription: {
    color: '#9ca3af',
    fontSize: '15px',
    lineHeight: 1.6,
  },
  statsSection: {
    background: '#141920',
    borderRadius: '32px',
    padding: '80px 60px',
    margin: '100px 0',
    position: 'relative',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '60px',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '56px',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '16px',
    color: '#9ca3af',
    fontWeight: 600,
  },
  ctaSection: {
    textAlign: 'center',
    padding: '120px 0',
    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(168, 85, 247, 0.05))',
    borderRadius: '32px',
    margin: '100px 0',
  },
  ctaTitle: {
    fontSize: '56px',
    fontWeight: 800,
    marginBottom: '24px',
    letterSpacing: '-1px',
  },
  ctaDescription: {
    fontSize: '20px',
    color: '#9ca3af',
    marginBottom: '48px',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  footer: {
    padding: '60px 0 40px',
    borderTop: '1px solid rgba(0, 212, 255, 0.12)',
    marginTop: '100px',
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '60px',
    marginBottom: '40px',
  },
  footerBrand: {},
  footerBrandTitle: {
    fontSize: '24px',
    fontWeight: 800,
    marginBottom: '12px',
    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  footerBrandText: {
    color: '#9ca3af',
    fontSize: '14px',
    lineHeight: 1.6,
  },
  footerLinks: {},
  footerLinksTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#00d4ff',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '16px',
  },
  footerLinksList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  footerLinkItem: {
    marginBottom: '12px',
  },
  footerLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.3s ease',
  },
  footerBottom: {
    textAlign: 'center',
    paddingTop: '40px',
    borderTop: '1px solid rgba(0, 212, 255, 0.12)',
    color: '#6b7280',
    fontSize: '14px',
  },
};

export default CampusEchoHomePage;
