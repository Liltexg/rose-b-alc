// Powered by OrbXech Design Studio
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { CheckCircle2, ArrowRight, Bell, FileText, Landmark, CalendarRange, GraduationCap } from 'lucide-react';

export default function Home({ setCurrentPage }) {
  const [latestNotices, setLatestNotices] = useState([]);
  const [pricing, setPricing] = useState({});

  const calculateTimeLeft = () => {
    const difference = +new Date("2026-08-31T00:00:00+02:00") - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const allNotices = db.getNotices();
    setLatestNotices(allNotices.slice(0, 3));
    setPricing(db.getPricing());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animated" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Promo Alert Bar */}
      {pricing.promoBannerActive && (
        <div style={{
          backgroundColor: 'var(--accent)',
          color: 'var(--primary)',
          textAlign: 'center',
          padding: '10px 40px',
          fontWeight: '700',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-body)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(30,32,34,0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--white)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.7rem'
          }}>OFFER</span>
          {pricing.promoBannerText}
        </div>
      )}

      {/* Hero Section - Asymmetrical and Architectural (UJ / OrbXech Style) */}
      <section style={{
        position: 'relative',
        minHeight: '80vh',
        background: `linear-gradient(rgba(30, 32, 34, 0.7), rgba(30, 32, 34, 0.85)), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        padding: '80px 0'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: '55% 45%',
          gap: '40px',
          alignItems: 'center'
        }} className="hero-grid-mobile">
          
          {/* Left Column - Large Asymmetric Hero Card */}
          <div className="card" style={{
            padding: '0',
            overflow: 'hidden',
            borderTop: '6px solid var(--secondary)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {/* Orange Tag Box */}
            <div style={{
              backgroundColor: 'var(--secondary)',
              color: 'var(--white)',
              padding: '12px 32px',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Academic Registration Open
            </div>
            
            <div style={{ padding: '40px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <img src="/logo.png" alt="Logo" style={{ height: '52px', objectFit: 'contain' }} />
                <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-color)' }}></div>
                <h5 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.78rem', color: 'var(--secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Rose Bruintjies ALC
                </h5>
              </div>
              <span className="meta-tag">[ SEC. 01 / REGISTRATION ]</span>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', lineHeight: '1.15' }}>
                Empowering Learners Through Academic Discipline.
              </h1>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px', lineHeight: '1.65' }}>
                Dedicated, CAPS-aligned FET support and intensive National Senior Certificate (NSC) Rewrite Upgrade programmes designed to unlock university admission.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setCurrentPage('admissions')}
                >
                  Apply Online
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => setCurrentPage('programmes')}
                >
                  Explore Offerings
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Scholastic Badge/Emblem overlay */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="hero-emblem-hide">
            <div className="museum-frame" style={{
              width: '280px',
              height: '320px',
              backgroundColor: 'var(--white)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              transform: 'rotate(2deg)'
            }}>
              <img src="/logo.png" alt="Rose B ALC Logo" style={{ height: '140px', marginBottom: '20px', objectFit: 'contain' }} />
              <h3 style={{ fontSize: '1.6rem', textAlign: 'center', margin: 0 }}>Rose B ALC</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 700, letterSpacing: '0.05em', marginTop: '4px', textTransform: 'uppercase' }}>
                Est. 2011
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* UJ-Style Quick Links Banner (Color Blocked Grid) */}
      <section style={{ padding: 0 }}>
        <div className="container" style={{ padding: 0 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            marginTop: '-30px',
            position: 'relative',
            zIndex: 10,
            boxShadow: 'var(--shadow-lg)'
          }} className="quick-links-grid">
            
            {/* Card 1: Orange */}
            <div 
              onClick={() => setCurrentPage('admissions')}
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--white)',
                padding: '36px 28px',
                cursor: 'pointer',
                transition: 'transform var(--transition-fast)'
              }}
              className="quick-link-tile"
            >
              <FileText size={24} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
              <h4 style={{ color: 'var(--white)', fontSize: '1.25rem', marginBottom: '8px' }}>Admissions 2027</h4>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.5' }}>
                Submit details and secure registration slots.
              </p>
            </div>

            {/* Card 2: Deep Slate */}
            <div 
              onClick={() => setCurrentPage('programmes')}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--white)',
                padding: '36px 28px',
                cursor: 'pointer',
                transition: 'transform var(--transition-fast)'
              }}
              className="quick-link-tile"
            >
              <GraduationCap size={24} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
              <h4 style={{ color: 'var(--white)', fontSize: '1.25rem', marginBottom: '8px' }}>Grade 12 Support</h4>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.5' }}>
                CAPS homework revision & exam prep tutoring.
              </p>
            </div>

            {/* Card 3: Gold */}
            <div 
              onClick={() => setCurrentPage('programmes')}
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--primary)',
                padding: '36px 28px',
                cursor: 'pointer',
                transition: 'transform var(--transition-fast)'
              }}
              className="quick-link-tile"
            >
              <CalendarRange size={24} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
              <h4 style={{ color: 'var(--primary)', fontSize: '1.25rem', marginBottom: '8px' }}>NSC Rewrite Upgrades</h4>
              <p style={{ fontSize: '0.8rem', color: 'rgba(30,32,34,0.7)', lineHeight: '1.5' }}>
                Diagnostic syllabus tracking over six months.
              </p>
            </div>

            {/* Card 4: Light Grey */}
            <div 
              onClick={() => setCurrentPage('fees')}
              style={{
                backgroundColor: 'var(--bg-alt)',
                color: 'var(--primary)',
                padding: '36px 28px',
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
                transition: 'transform var(--transition-fast)'
              }}
              className="quick-link-tile"
            >
              <Landmark size={24} style={{ color: 'var(--secondary)', marginBottom: '16px' }} />
              <h4 style={{ color: 'var(--primary)', fontSize: '1.25rem', marginBottom: '8px' }}>Fees & Pricing</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Explore standard hourly rates and monthly rewrite fees.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Launch Countdown Banner Section */}
      <section className="section-alt" style={{ 
        borderTop: '3px double var(--primary)', 
        borderBottom: '3px double var(--primary)',
        padding: '80px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Watermark letters */}
        <div className="watermark-bg" style={{ top: '50%', left: '5%', transform: 'translateY(-50%)' }}>R</div>
        <div className="watermark-bg" style={{ top: '50%', right: '5%', transform: 'translateY(-50%)' }}>B</div>

        <div className="container" style={{ position: 'relative', zIndex: 5 }}>
          <span className="meta-tag">[ ANNOUNCEMENT / CENTRE OPENING ]</span>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Physical Opening & Launch: 31 August 2026</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 40px' }}>
            Our physical learning centre in Rosebank officially opens on <strong>31 August 2026</strong>. Online registration is now open to secure your space before classes commence.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '24px', 
            maxWidth: '640px', 
            margin: '0 auto' 
          }} className="countdown-timer-grid">
            
            {/* Days */}
            <div style={{
              backgroundColor: 'var(--white)',
              border: '1px solid var(--border-color)',
              borderTop: '4px solid var(--secondary)',
              padding: '24px 16px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '3.6rem', 
                fontWeight: 700, 
                color: 'var(--primary)',
                lineHeight: '1'
              }}>{timeLeft.days}</div>
              <div style={{ 
                fontFamily: 'var(--font-body)', 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                letterSpacing: '0.12em', 
                textTransform: 'uppercase', 
                color: 'var(--text-muted)',
                marginTop: '10px'
              }}>Days</div>
            </div>

            {/* Hours */}
            <div style={{
              backgroundColor: 'var(--white)',
              border: '1px solid var(--border-color)',
              borderTop: '4px solid var(--primary)',
              padding: '24px 16px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '3.6rem', 
                fontWeight: 700, 
                color: 'var(--primary)',
                lineHeight: '1'
              }}>{timeLeft.hours}</div>
              <div style={{ 
                fontFamily: 'var(--font-body)', 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                letterSpacing: '0.12em', 
                textTransform: 'uppercase', 
                color: 'var(--text-muted)',
                marginTop: '10px'
              }}>Hours</div>
            </div>

            {/* Minutes */}
            <div style={{
              backgroundColor: 'var(--white)',
              border: '1px solid var(--border-color)',
              borderTop: '4px solid var(--accent)',
              padding: '24px 16px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '3.6rem', 
                fontWeight: 700, 
                color: 'var(--primary)',
                lineHeight: '1'
              }}>{timeLeft.minutes}</div>
              <div style={{ 
                fontFamily: 'var(--font-body)', 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                letterSpacing: '0.12em', 
                textTransform: 'uppercase', 
                color: 'var(--text-muted)',
                marginTop: '10px'
              }}>Minutes</div>
            </div>

            {/* Seconds */}
            <div style={{
              backgroundColor: 'var(--white)',
              border: '1px solid var(--border-color)',
              borderTop: '4px solid var(--secondary)',
              padding: '24px 16px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '3.6rem', 
                fontWeight: 700, 
                color: 'var(--secondary)',
                lineHeight: '1'
              }}>{timeLeft.seconds}</div>
              <div style={{ 
                fontFamily: 'var(--font-body)', 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                letterSpacing: '0.12em', 
                textTransform: 'uppercase', 
                color: 'var(--text-muted)',
                marginTop: '10px'
              }}>Seconds</div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Rose B ALC? - Bespoke Editorial Numbered list */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'left', marginBottom: '60px', position: 'relative' }}>
            <span className="meta-tag">[ SEC. 02 / INSTITUTIONAL EXCELLENCE ]</span>
            <h2 style={{ fontSize: '2.6rem' }} className="border-bottom-elegant">Why Choose Rose B ALC?</h2>
          </div>

          <div className="grid-3">
            <div className="card" style={{ border: 'none', borderLeft: '1px solid var(--border-color)', padding: '0 0 0 28px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: 'none' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                color: 'var(--secondary)',
                fontWeight: 'bold',
                lineHeight: '1'
              }}>01</div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 600 }}>Personal Academic Support</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65' }}>
                Every learner receives dedicated individual attention. We identify specific curriculum gaps and build personalized solutions to accelerate understanding.
              </p>
            </div>

            <div className="card" style={{ border: 'none', borderLeft: '1px solid var(--border-color)', padding: '0 0 0 28px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: 'none' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                color: 'var(--accent)',
                fontWeight: 'bold',
                lineHeight: '1'
              }}>02</div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 600 }}>Examination Preparation</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65' }}>
                Rigorous focus on National Senior Certificate (NSC) preparation, pacing, exam strategy, and answering techniques using past papers.
              </p>
            </div>

            <div className="card" style={{ border: 'none', borderLeft: '1px solid var(--border-color)', padding: '0 0 0 28px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: 'none' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                color: 'var(--primary)',
                fontWeight: 'bold',
                lineHeight: '1'
              }}>03</div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 600 }}>Experienced Teaching</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65' }}>
                Led by professional, fully qualified educators with years of high school teaching experience and a proven history of matric grade upgrades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programmes Section - Flat high-contrast cards */}
      <section className="section-alt" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="meta-tag">[ SEC. 03 / EDUCATIONAL OFFERINGS ]</span>
            <h2 style={{ fontSize: '2.6rem' }}>Featured Programmes</h2>
            <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--secondary)', margin: '16px auto 0' }}></div>
          </div>

          <div className="grid-2">
            {/* Grade 12 Card */}
            <div className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '3px double var(--secondary)',
              position: 'relative'
            }}>
              <div>
                <span className="tag tag-secondary" style={{ position: 'absolute', top: '24px', right: '28px' }}>
                  CAPS Support
                </span>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '16px', marginTop: '12px' }}>
                  Grade 12 Academic Support
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.92rem' }}>
                  Targeted afternoon classes designed to reinforce school teachings, follow curriculum pacing, and prepare matriculants for term exams.
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  marginBottom: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {["Weekly Revision & Topic Consolidation", "Follows Annual Teaching Plan (ATP)", "Life Sciences & Mathematics Specialization", "Mock Exam & Matric Support Resources"].map((it, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                      <CheckCircle2 size={15} style={{ color: 'var(--secondary)' }} /> {it}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', display: 'flex', gap: '8px' }}
                onClick={() => setCurrentPage('programmes')}
              >
                Learn More <ArrowRight size={14} />
              </button>
            </div>

            {/* Rewrite Card */}
            <div className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '3px double var(--accent)',
              position: 'relative'
            }}>
              <div>
                <span className="tag tag-accent" style={{ position: 'absolute', top: '24px', right: '28px' }}>
                  NSC Upgrade
                </span>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '16px', marginTop: '12px' }}>
                  NSC Rewrite / Upgrade
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.92rem' }}>
                  An intensive structured programme specifically structured for learners seeking to upgrade their previous NSC exam marks and open university doors.
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  marginBottom: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {["Complete Paper 1 & 2 Syllabus Coverage", "In-depth Diagnostic Analysis of Past Papers", "Six-Month Intensive Revision Commitment", "Exam Stress Management & Prep Strategies"].map((it, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                      <CheckCircle2 size={15} style={{ color: 'var(--accent-hover)' }} /> {it}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', display: 'flex', gap: '8px' }}
                onClick={() => setCurrentPage('admissions')}
              >
                Apply for Upgrade <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Preview Section - Asymmetric Picture Frame */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40% 60%',
            gap: '60px',
            alignItems: 'center'
          }} className="hero-grid-mobile">
            {/* Left Column - Picture with Museum frame */}
              <div className="museum-frame" style={{ width: '100%' }}>
              <img 
                src="/mr-breintjies.jpg" 
                alt="Mr Edward Bruintjies" 
                style={{ width: '100%', display: 'block', height: '360px', objectFit: 'cover' }}
              />
            </div>
            
            {/* Right Column - Editorial text */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="meta-tag">[ SEC. 04 / MEET THE FOUNDER ]</span>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Mr. Edward Bruintjies</h2>
              
              <div style={{
                borderLeft: '4px solid var(--accent)',
                paddingLeft: '20px',
                fontStyle: 'italic',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: 'var(--primary)',
                marginBottom: '20px'
              }}>
                "Dedicated educator committed to helping learners achieve their academic goals through structured support, discipline, and encouragement."
              </div>

              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                lineHeight: '1.7',
                marginBottom: '28px'
              }}>
                With 15+ years of classroom teaching experience, Edward founded the centre to target individual learning paths, ensuring no student is left behind in critical FET math and sciences.
              </p>

              <button 
                className="btn btn-outline" 
                onClick={() => setCurrentPage('about')}
              >
                Read Biography
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Notices Section - UJ Style Flat Press Cards */}
      <section className="section-alt" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <span className="meta-tag">[ SEC. 05 / CORRESPONDENCE ]</span>
              <h2 style={{ fontSize: '2.6rem' }}>Latest Notices</h2>
            </div>
            <button 
              className="btn btn-outline" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '0.8rem' }}
              onClick={() => setCurrentPage('notices')}
            >
              View All Notices <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid-3">
            {latestNotices.map((notice) => (
              <div key={notice.id} className="card" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '32px',
                borderLeft: '4px solid var(--secondary)'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    marginBottom: '14px'
                  }}>
                    <Bell size={13} style={{ color: 'var(--secondary)' }} />
                    <span>{new Date(notice.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h4 style={{
                    fontSize: '1.25rem',
                    color: 'var(--primary)',
                    marginBottom: '12px',
                    lineHeight: '1.3'
                  }}>{notice.title}</h4>
                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.65',
                    marginBottom: '24px'
                  }}>
                    {notice.body}
                  </p>
                </div>
                <button 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 0',
                    width: 'fit-content',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em'
                  }}
                  onClick={() => setCurrentPage('notices')}
                >
                  Read Official Notice <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {styleAdjustments}
    </div>
  );
}

// Media Query Styling
const styleAdjustments = (
  <style>{`
    @media (max-width: 900px) {
      .hero-grid-mobile {
        grid-template-columns: 1fr !important;
      }
      .hero-emblem-hide {
        display: none !important;
      }
      .quick-links-grid {
        grid-template-columns: 1fr !important;
        margin-top: 0px !important;
      }
    }
    @media (max-width: 600px) {
      .countdown-timer-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 16px !important;
      }
    }
    .quick-link-tile:hover {
      transform: translateY(-4px);
    }
  `}</style>
);

