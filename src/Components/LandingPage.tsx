import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPageStyle.module.css';
import NavBar from './NavBar';
import Footer from './Footer';

const features = [
  {
    icon: '📊',
    color: '#007AFF',
    title: 'Track Your Progress',
    desc: 'Stay on top of your learning with visual progress bars and instant feedback on your course completion.',
  },
  {
    icon: '🎓',
    color: '#34C759',
    title: 'Expert Content',
    desc: 'Access high-quality courses with a distraction-free viewer designed for maximum focus and retention.',
  },
  {
    icon: '📈',
    color: '#FF9F0A',
    title: 'Powerful Metrics',
    desc: 'Teachers get detailed insights into student performance and course engagement metrics.',
  },
];

function LandingPage() {
  // Scroll-in animation via IntersectionObserver
  React.useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.transitionDelay = `${i * 0.05}s`;
            el.classList.add(styles.revealed);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.landing_page}>
      <NavBar user_is_loged_in={false} logo="/logo.jpg" />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <header className={styles.hero}>
        <div className={styles.hero_content} data-reveal>
          <p className={styles.hero_eyebrow}>Welcome to SchoolNet</p>
          <h1 className={styles.hero_title}>
            Empower Your<br />Educational Journey
          </h1>
          <p className={styles.hero_subtitle}>
            A focused, distraction-free environment designed for teachers to inspire and students to thrive.
          </p>
          <div className={styles.cta_container}>
            <Link to="/Signin" className={styles.btn_primary_large}>
              Get Started
            </Link>
            <Link to="/Login" className={styles.btn_secondary_large}>
              Log In
            </Link>
          </div>
        </div>
      </header>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section className={styles.features}>
        <p className={styles.section_eyebrow}>Why Choose SchoolNet?</p>
        <h2 className={styles.section_title}>Everything you need to learn and teach</h2>
        <div className={styles.features_grid}>
          {features.map((f) => (
            <div key={f.title} className={styles.feature_card} data-reveal>
              <div
                className={styles.feature_icon_badge}
                style={{ background: f.color }}
              >
                <span>{f.icon}</span>
              </div>
              <h3 className={styles.feature_title}>{f.title}</h3>
              <p className={styles.feature_desc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className={styles.cta_banner} data-reveal>
        <h2 className={styles.cta_banner_title}>Ready to start learning?</h2>
        <p className={styles.cta_banner_sub}>
          Join thousands of students and educators already on SchoolNet.
        </p>
        <Link to="/Signin" className={styles.btn_primary_large}>
          Create Free Account
        </Link>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
