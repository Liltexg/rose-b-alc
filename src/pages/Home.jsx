// Powered by OrbXech Design Studio
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/db';
import { CheckCircle2, ArrowRight, Bell, FileText, Landmark, CalendarRange, GraduationCap } from 'lucide-react';

export default function Home({ setCurrentPage, setMovieMode }) {
  const [latestNotices, setLatestNotices] = useState([]);
  const [pricing, setPricing] = useState({});
  const parallaxRef = useRef(null);

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

    // Scroll Reveal Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.15 });

    setTimeout(() => {
      document.querySelectorAll('.reveal-hidden').forEach((el) => observer.observe(el));
    }, 100);

    // Movie Mode Observer — triggers fullscreen when parallax section enters
    const movieObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Enter movie mode
          setMovieMode(true);
          const el = document.documentElement;
          if (el.requestFullscreen) el.requestFullscreen();
          else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        } else {
          // Exit movie mode
          setMovieMode(false);
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
        }
      });
    }, { threshold: 0.2 });

    if (parallaxRef.current) movieObserver.observe(parallaxRef.current);

    return () => {
      clearInterval(timer);
      observer.disconnect();
      movieObserver.disconnect();
    };
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

      {/* Hero Section - Cinematic & Immersive */}
      <section style={{ 
        position: 'relative', 
        minHeight: '90vh', 
        display: 'flex', 
        alignItems: 'center', 
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Animated Background Image */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'slowZoom 20s infinite alternate',
          zIndex: 1
        }}></div>
        
        {/* Deep Cinematic Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(to bottom, rgba(15, 17, 21, 0.4) 0%, rgba(15, 17, 21, 0.95) 100%)',
          zIndex: 2
        }}></div>        <div className="container hero-container-mobile" style={{ position: 'relative', zIndex: 3, padding: '120px 40px 60px 40px' }}>
          <div className="reveal-hidden hero-meta-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>[ Est. 2011 ]</span>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>[ Kariega, SA ]</span>
          </div>
          
          <h1 className="reveal-hidden" style={{ marginBottom: '40px', maxWidth: '100%', color: 'var(--white)', textShadow: '0 10px 30px rgba(0,0,0,0.5)', transitionDelay: '0.2s' }}>
            Empowering Learners Through Strict Academic Discipline.
          </h1>
          
          <div className="reveal-hidden hero-cta-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '32px', transitionDelay: '0.4s' }}>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', maxWidth: '500px', lineHeight: '1.8' }}>
              Dedicated, CAPS-aligned Grade 12 Life Sciences support, designed to unlock university admission for current Grade 12s and NSC Rewrite candidates.
            </p>
            <div className="hero-btn-group" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => setCurrentPage('admissions')}>Apply Online</button>
              <button className="btn btn-outline-white" style={{ color: 'var(--white)', borderColor: 'rgba(255,255,255,0.4)' }} onClick={() => setCurrentPage('programmes')}>Explore Offerings</button>
            </div>
          </div>
        </div>

      </section>

      {/* Cinematic Parallax Storytelling - Movie Mode Trigger */}
      <section ref={parallaxRef} className="parallax-container" style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')` 
      }}>
        <div className="parallax-overlay"></div>
        
        <div className="parallax-story-block">
          <h2 className="reveal-hidden" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--white)', fontWeight: 300, letterSpacing: '-0.02em', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
            It starts with <span style={{ color: 'var(--secondary)', fontStyle: 'italic', fontWeight: 600 }}>discipline.</span>
          </h2>
        </div>

        <div className="parallax-story-block">
          <h2 className="reveal-hidden" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--white)', fontWeight: 300, letterSpacing: '-0.02em', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
            It ends with <span style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 600 }}>admission.</span>
          </h2>
        </div>

        <div className="parallax-story-block">
          <h2 className="reveal-hidden" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--white)', fontWeight: 300, letterSpacing: '-0.02em', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
            Your future, <span style={{ color: 'var(--white)', fontStyle: 'normal', fontWeight: 700, borderBottom: '4px solid var(--secondary)' }}>architected.</span>
          </h2>
        </div>
      </section>

      {/* Scene 1: Widescreen Directory (Quick Links) */}
      <section style={{ padding: 0, borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0f1115' }}>
        <div className="container-fluid" style={{ padding: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }} className="quick-links-grid">
            
            {/* Cell 1: Admissions */}
            <div 
              onClick={() => setCurrentPage('admissions')} 
              className="cinematic-card"
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="cinematic-card-bg"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop')` }}
              ></div>
              <div className="cinematic-card-overlay" style={{ backgroundColor: 'rgba(122, 28, 32, 0.85)' }}></div>
              <div className="cinematic-card-content">
                <span className="cinematic-card-num">01 / ADMISSIONS</span>
                <div>
                  <h4 className="cinematic-card-title">Admissions 2027</h4>
                  <p className="cinematic-card-desc">Secure registration slots for the upcoming academic cycle.</p>
                </div>
                <div className="cinematic-card-action">
                  <span>Explore Phase</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
            
            {/* Cell 2: Life Sciences */}
            <div 
              onClick={() => setCurrentPage('programmes')} 
              className="cinematic-card"
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="cinematic-card-bg"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=800&auto=format&fit=crop')` }}
              ></div>
              <div className="cinematic-card-overlay" style={{ backgroundColor: 'rgba(15, 17, 21, 0.9)' }}></div>
              <div className="cinematic-card-content">
                <span className="cinematic-card-num">02 / CORE FOCUS</span>
                <div>
                  <h4 className="cinematic-card-title">Life Sciences</h4>
                  <p className="cinematic-card-desc">CAPS syllabus consolidation and diagnostic matric prep.</p>
                </div>
                <div className="cinematic-card-action">
                  <span>Explore Phase</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
            
            {/* Cell 3: Math Lit */}
            <div 
              onClick={() => setCurrentPage('programmes')} 
              className="cinematic-card"
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="cinematic-card-bg"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1453733190148-c44698c26588?q=80&w=800&auto=format&fit=crop')` }}
              ></div>
              <div className="cinematic-card-overlay" style={{ backgroundColor: 'rgba(212, 175, 55, 0.9)' }}></div>
              <div className="cinematic-card-content">
                <span className="cinematic-card-num" style={{ color: 'rgba(15,17,21,0.6)' }}>03 / EXTENSION</span>
                <div>
                  <h4 className="cinematic-card-title" style={{ color: 'var(--primary)' }}>Math Literacy</h4>
                  <p className="cinematic-card-desc" style={{ color: 'rgba(15,17,21,0.8)' }}>Practical mathematical application modules. Coming soon.</p>
                </div>
                <div className="cinematic-card-action" style={{ color: 'var(--primary)', borderColor: 'rgba(15,17,21,0.2)' }}>
                  <span>View Status</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
            
            {/* Cell 4: Fees */}
            <div 
              onClick={() => setCurrentPage('fees')} 
              className="cinematic-card"
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="cinematic-card-bg"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop')` }}
              ></div>
              <div className="cinematic-card-overlay" style={{ backgroundColor: 'rgba(30, 32, 34, 0.95)' }}></div>
              <div className="cinematic-card-content">
                <span className="cinematic-card-num">04 / INVESTMENT</span>
                <div>
                  <h4 className="cinematic-card-title">Tuition Fees</h4>
                  <p className="cinematic-card-desc">Transparent pricing schedules and payment configurations.</p>
                </div>
                <div className="cinematic-card-action">
                  <span>Explore Phase</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Scene 2: The Launch Countdown (Matte Black Screen Cut) */}
      <section className="countdown-section" style={{ 
        backgroundColor: '#0a0b0d', 
        color: 'var(--white)',
        padding: '120px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        {/* Subtle Watermark letters */}
        <div className="watermark-bg" style={{ top: '50%', left: '5%', transform: 'translateY(-50%)', opacity: 0.03, color: '#FFF' }}>R</div>
        <div className="watermark-bg" style={{ top: '50%', right: '5%', transform: 'translateY(-50%)', opacity: 0.03, color: '#FFF' }}>B</div>

        <div className="container" style={{ position: 'relative', zIndex: 5 }}>
          <span className="meta-tag" style={{ color: 'var(--accent)', letterSpacing: '0.3em' }}>[ ANNOUNCEMENT / ESTABLISHMENT ]</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, marginBottom: '24px', letterSpacing: '-0.01em' }}>
            Physical Opening & Launch: <span style={{ fontWeight: 700, color: 'var(--white)' }}>31 August 2026</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto 60px', lineHeight: '1.8' }}>
            Our new physical learning facility in Kariega officially commences offline classes. Online enrollment is currently active to secure candidate slots.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '24px', 
            maxWidth: '800px', 
            margin: '0 auto' 
          }} className="countdown-timer-grid">
            
            {/* Days */}
            <div className="countdown-cell">
              <div className="countdown-cell-num">{timeLeft.days}</div>
              <div className="countdown-cell-label">Days</div>
            </div>

            {/* Hours */}
            <div className="countdown-cell">
              <div className="countdown-cell-num">{timeLeft.hours}</div>
              <div className="countdown-cell-label">Hours</div>
            </div>

            {/* Minutes */}
            <div className="countdown-cell">
              <div className="countdown-cell-num">{timeLeft.minutes}</div>
              <div className="countdown-cell-label">Minutes</div>
            </div>

            {/* Seconds */}
            <div className="countdown-cell">
              <div className="countdown-cell-num" style={{ color: 'var(--accent)' }}>{timeLeft.seconds}</div>
              <div className="countdown-cell-label">Seconds</div>
            </div>

          </div>
        </div>
      </section>

      {/* Scene 3: Why Choose Us (Widescreen Editorial Layout) */}
      <section className="why-section" style={{ backgroundColor: 'var(--primary)', color: 'var(--white)', padding: '120px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="reveal-hidden" style={{ textAlign: 'left', marginBottom: '100px', position: 'relative' }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: '20px' }}>[ SEC. 02 / PHILOSOPHY ]</span>
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--white)', lineHeight: '1.05', fontWeight: 300, letterSpacing: '-0.02em' }}>
              Built for <span style={{ fontWeight: 700 }}>Academic Dominance</span>.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }} className="quick-links-grid">
            <div className="reveal-hidden story-metric-card" style={{ transitionDelay: '0.1s' }}>
              <span className="story-metric-num">01</span>
              <h3 className="story-metric-title">Personal Support</h3>
              <p className="story-metric-desc">
                We identify specific curriculum gaps and build personalized pathways to bridge understanding, keeping learning highly individual.
              </p>
            </div>

            <div className="reveal-hidden story-metric-card" style={{ transitionDelay: '0.2s' }}>
              <span className="story-metric-num" style={{ color: 'var(--accent)' }}>02</span>
              <h3 className="story-metric-title">Exam Architecture</h3>
              <p className="story-metric-desc">
                Rigorous preparation specifically targeting National Senior Certificate (NSC) exam templates, time allocation, and grading grids.
              </p>
            </div>

            <div className="reveal-hidden story-metric-card" style={{ transitionDelay: '0.3s' }}>
              <span className="story-metric-num">03</span>
              <h3 className="story-metric-title">Qualified Instruction</h3>
              <p className="story-metric-desc">
                Led directly by Mr. E. Breintjies, combining 10 years of formal FET life sciences instruction with proven matric performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scene 4: Featured Programmes (Vertical Split Screen / Film Strip) */}
      <section style={{ padding: 0, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="container-fluid" style={{ padding: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="hero-grid-mobile">
            
            {/* Left - Sticky Widescreen Portrait */}
            <div className="sticky-widescreen-media">
              <div 
                className="widescreen-media-bg"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop')` }}
              ></div>
              <div className="widescreen-media-overlay"></div>
              <div className="widescreen-media-content">
                <span className="meta-tag" style={{ color: 'var(--accent)' }}>[ REPERTOIRE ]</span>
                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--white)', fontWeight: 700, lineHeight: 1.1 }}>
                  Academic Offerings.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '400px', fontSize: '1.05rem', marginTop: '16px' }}>
                  Targeted, structured curriculum revision and upgrade modules configured for high-performance outcomes.
                </p>
              </div>
            </div>

            {/* Right - Scrollable Offerings */}
            <div style={{ padding: '100px 80px', backgroundColor: 'var(--white)' }} className="scroll-content-container">
              {/* Program 1 */}
              <div className="reveal-hidden programme-scene-block" style={{ marginBottom: '80px' }}>
                <span className="programme-scene-num">01 / PROGRAMME</span>
                <h3 style={{ fontSize: '2rem', margin: '16px 0 24px', fontWeight: 700 }}>Life Sciences Support</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '32px' }}>
                  Targeted tuition configured for Grade 12 students and NSC rewrite candidates seeking top-tier university admission requirements.
                </p>
                <div style={{ borderLeft: '2px solid var(--secondary)', paddingLeft: '24px', marginBottom: '40px' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {["Weekly consolidated focus modules", "Alignment with ATP and CAPS structures", "Comprehensive mock papers & review", "Diagnostic feedback configuration"].map((it, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: 500 }}>
                        <CheckCircle2 size={16} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setCurrentPage('programmes')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                >
                  Configure Admission <ArrowRight size={16} />
                </button>
              </div>

              <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.08)', margin: '80px 0' }}></div>

              {/* Program 2 */}
              <div className="reveal-hidden programme-scene-block" style={{ opacity: 0.6 }}>
                <span className="programme-scene-num">02 / EXTENSION</span>
                <h3 style={{ fontSize: '2rem', margin: '16px 0 24px', fontWeight: 300, color: 'var(--text-muted)' }}>
                  Mathematical Literacy
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '32px' }}>
                  Configuring curriculum expansion templates targeting quantitative literacy, financial statistics, and logical computation.
                </p>
                <span 
                  className="tag tag-accent"
                  style={{ display: 'inline-block', padding: '8px 16px', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  DEVELOPMENT STAGE / LAUNCH PENDING
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Scene 5: Meet the Founder (Editorial Portrait Feature) */}
      <section className="founder-section" style={{ backgroundColor: 'var(--bg-alt)', padding: '120px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40% 60%',
            gap: '80px',
            alignItems: 'start'
          }} className="hero-grid-mobile">
            
            {/* Left Col - Editorial Portrait */}
            <div className="reveal-hidden" style={{ position: 'sticky', top: '140px' }}>
              <div className="founder-editorial-frame">
                <img 
                  src="/mr-breintjies.jpg" 
                  alt="Founder Mr. Edward Breintjies" 
                  className="founder-editorial-img"
                />
              </div>
              <div style={{ marginTop: '30px', padding: '24px 0', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                <h5 style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Credentials</h5>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>BEd (FET) Life Sciences</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>10 Years Active Secondary Instruction Experience</p>
              </div>
            </div>
            
            {/* Right Col - Story Narratives */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="meta-tag">[ SEC. 03 / DIRECTOR PROFILE ]</span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '32px', fontWeight: 700 }}>Mr. Edward Breintjies</h2>
              
              <blockquote className="founder-editorial-quote">
                "We do not standardize the learner; we standardize the discipline. Given structured pacing and strict logical direction, intellectual acceleration becomes inevitable."
              </blockquote>

              <p style={{
                color: 'var(--text-muted)',
                fontSize: '1.05rem',
                lineHeight: '1.85',
                marginBottom: '24px'
              }}>
                Having spent a decade configuring learners for the senior secondary certificate examinations within standard public and private environments, Edward founded the After School Learning Center to bypass large-classroom inefficiency.
              </p>

              <p style={{
                color: 'var(--text-muted)',
                fontSize: '1.05rem',
                lineHeight: '1.85',
                marginBottom: '40px'
              }}>
                By structuring micro-classes restricted to specific enrollment caps, candidates receive surgical focus, targeting curriculum disconnects before final matric evaluation schedules occur.
              </p>

              <button 
                className="btn btn-outline" 
                onClick={() => setCurrentPage('about')}
              >
                Inspect Biography
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Scene 6: Correspondence (The Chronicle Newspaper layout) */}
      <section className="chronicle-section" style={{ backgroundColor: 'var(--white)', padding: '120px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '60px',
            flexWrap: 'wrap',
            gap: '24px',
            borderBottom: '2px solid var(--primary)',
            paddingBottom: '24px'
          }}>
            <div>
              <span className="meta-tag">[ SEC. 04 / CHRONICLE ]</span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0 }}>Latest Correspondence</h2>
            </div>
            <button 
              className="btn btn-outline" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '0.8rem' }}
              onClick={() => setCurrentPage('notices')}
            >
              Archive Directory <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }} className="quick-links-grid">
            {latestNotices.map((notice, idx) => (
              <div key={notice.id} className="chronicle-card" style={{ transitionDelay: `${0.1 * (idx + 1)}s` }}>
                <div>
                  <div className="chronicle-meta">
                    <Bell size={12} />
                    <span>{new Date(notice.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h4 className="chronicle-title">{notice.title}</h4>
                  <p className="chronicle-body-text">
                    {notice.body}
                  </p>
                </div>
                <button 
                  className="chronicle-action-btn"
                  onClick={() => setCurrentPage('notices')}
                >
                  Read Document <ArrowRight size={14} />
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

// Media Query & Interactive Styling
const styleAdjustments = (
  <style>{`
    @media (max-width: 1024px) {
      .quick-links-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    @media (max-width: 768px) {
      .quick-links-grid {
        grid-template-columns: 1fr !important;
      }
      .hero-grid-mobile {
        grid-template-columns: 1fr !important;
      }
      .countdown-section {
        padding: 80px 0 !important;
      }
      .why-section {
        padding: 80px 0 !important;
      }
      .founder-section {
        padding: 80px 0 !important;
      }
      .chronicle-section {
        padding: 80px 0 !important;
      }
      .story-metric-card {
        padding: 32px 24px !important;
      }
    }
    @media (max-width: 600px) {
      .countdown-timer-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 16px !important;
      }
      /* Hero section mobile */
      .hero-container-mobile {
        padding: 80px 20px 40px !important;
      }
      .hero-meta-row {
        margin-bottom: 40px !important;
      }
      .hero-cta-row {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 24px !important;
      }
      .hero-btn-group {
        flex-direction: column !important;
        width: 100% !important;
      }
      .hero-btn-group .btn {
        width: 100% !important;
        justify-content: center !important;
      }
      /* Chronicle cards on mobile — remove fixed height */
      .chronicle-card {
        height: auto !important;
        border-right: none !important;
        border-bottom: 1px solid rgba(0,0,0,0.08);
        padding: 0 0 32px 0 !important;
      }
      .chronicle-card:last-child {
        border-bottom: none;
        padding-bottom: 0 !important;
      }
      /* Cinematic cards on mobile — taller for touch */
      .cinematic-card {
        height: 260px !important;
      }
      .cinematic-card-content {
        padding: 24px !important;
      }
      /* Cinematic card action always visible on mobile (no hover) */
      .cinematic-card-action {
        transform: translateY(0) !important;
        opacity: 1 !important;
      }
      /* Countdown cell compact */
      .countdown-cell {
        padding: 20px 12px !important;
      }
      .countdown-cell-num {
        font-size: clamp(2rem, 8vw, 3rem) !important;
      }
      /* Sticky widescreen media on mobile */
      .sticky-widescreen-media {
        height: 45vh !important;
        position: relative !important;
        padding: 40px 24px !important;
      }
      /* Founder editorial */
      .founder-editorial-img {
        height: 280px !important;
      }
    }
    @media (max-width: 480px) {
      /* Gallery hover overlay — always show on mobile */
      .gallery-overlay {
        opacity: 1 !important;
      }
      /* Countdown cell number bigger */
      .countdown-cell-num {
        font-size: 2.5rem !important;
      }
    }

    /* Cinematic card grid styles */
    .cinematic-card {
      position: relative;
      height: 380px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      border-right: 1px solid rgba(255,255,255,0.06);
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cinematic-card:last-child {
      border-right: none;
    }
    .cinematic-card-bg {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-size: cover;
      background-position: center;
      transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 0;
    }
    .cinematic-card-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1;
    }
    .cinematic-card-content {
      position: relative;
      z-index: 2;
      padding: 40px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .cinematic-card-num {
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.6);
    }
    .cinematic-card-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--white);
      margin-bottom: 12px;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cinematic-card-desc {
      font-size: 0.88rem;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.6;
      opacity: 0.8;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cinematic-card-action {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
      color: var(--white);
      border-bottom: 1px solid rgba(255,255,255,0.2);
      width: fit-content;
      padding-bottom: 4px;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Card Hovers */
    .cinematic-card:hover .cinematic-card-bg {
      transform: scale(1.08);
    }
    .cinematic-card:hover .cinematic-card-action {
      transform: translateY(0);
      opacity: 1;
    }

    /* Countdown cell styles */
    .countdown-cell {
      background-color: transparent;
      border: 1px solid rgba(255,255,255,0.1);
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .countdown-cell-num {
      font-family: var(--font-heading);
      font-size: clamp(3rem, 6vw, 4.5rem);
      font-weight: 300;
      line-height: 1;
      color: var(--white);
    }
    .countdown-cell-label {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: rgba(255,255,255,0.4);
      margin-top: 16px;
      font-weight: 700;
    }

    /* Metric cells */
    .story-metric-card {
      border: 1px solid rgba(255,255,255,0.08);
      padding: 50px 40px;
      background-color: rgba(255,255,255,0.01);
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .story-metric-card:hover {
      background-color: rgba(255,255,255,0.03);
      border-color: rgba(255,255,255,0.15);
    }
    .story-metric-num {
      font-family: var(--font-heading);
      font-size: 3rem;
      font-weight: 300;
      color: var(--secondary);
      line-height: 1;
      display: block;
      margin-bottom: 24px;
    }
    .story-metric-title {
      font-size: 1.4rem;
      font-weight: 400;
      color: var(--white);
      margin-bottom: 16px;
    }
    .story-metric-desc {
      font-size: 0.95rem;
      line-height: 1.7;
      color: rgba(255,255,255,0.5);
    }

    /* Widescreen Film Strip */
    .sticky-widescreen-media {
      position: sticky;
      top: 0;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 80px;
    }
    .widescreen-media-bg {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-size: cover;
      background-position: center;
      z-index: 0;
      filter: grayscale(100%) contrast(1.1) brightness(0.7);
    }
    .widescreen-media-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(to bottom, rgba(122,28,32,0.3) 0%, rgba(15,17,21,0.9) 100%);
      z-index: 1;
    }
    .widescreen-media-content {
      position: relative;
      z-index: 2;
    }

    /* Founder profile adjustments */
    .founder-editorial-frame {
      border: 1px solid rgba(0,0,0,0.15);
      padding: 12px;
      background-color: var(--white);
    }
    .founder-editorial-img {
      width: 100%;
      display: block;
      height: 480px;
      object-fit: cover;
      filter: grayscale(100%) contrast(1.2);
      transition: filter 0.6s ease;
    }
    .founder-editorial-frame:hover .founder-editorial-img {
      filter: grayscale(0%) contrast(1.0);
    }
    .founder-editorial-quote {
      font-family: var(--font-heading);
      font-size: clamp(1.4rem, 3vw, 1.8rem);
      font-style: italic;
      color: var(--primary);
      border-left: 3px solid var(--accent);
      padding-left: 30px;
      margin: 0 0 40px 0;
      line-height: 1.5;
    }

    /* Chronicle card designs */
    .chronicle-card {
      border-right: 1px solid rgba(0,0,0,0.08);
      padding: 0 30px 0 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 380px;
    }
    .chronicle-card:last-child {
      border-right: none;
      padding-right: 0;
    }
    .chronicle-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-muted);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 20px;
    }
    .chronicle-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--primary);
      line-height: 1.35;
      margin-bottom: 16px;
    }
    .chronicle-body-text {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.7;
      display: -webkit-box;
      WebkitLineClamp: 4;
      WebkitBoxOrient: 'vertical';
      overflow: 'hidden';
    }
    .chronicle-action-btn {
      background: none;
      border: none;
      color: var(--secondary);
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 0;
      width: fit-content;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid transparent;
      transition: all 0.3s ease;
    }
    .chronicle-action-btn:hover {
      border-bottom-color: var(--secondary);
      gap: 10px;
    }
  `}</style>
);

