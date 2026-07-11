// Powered by OrbXech Design Studio
import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Programmes({ setCurrentPage }) {
  return (
    <div className="animated">
      {/* Page Header */}
      <section style={{
        padding: '100px 0 60px 0',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '20px' }}>Academic Focus</span>
              <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)' }}>Our Programmes</h1>
            </div>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Grade 12 / FET Phase</span>
          </div>
        </div>
      </section>

      {/* Life Sciences - Editorial Split */}
      <section style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <div className="container" style={{ padding: 0 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            minHeight: '600px'
          }} className="prog-grid-mobile">
            
            {/* Left — Large Number + Title (Sticky) */}
            <div style={{ borderRight: '1px solid rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '100px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'sticky', top: '100px', alignSelf: 'start', minHeight: 'calc(100vh - 100px)', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(8rem, 15vw, 14rem)', fontWeight: 300, lineHeight: 0.85, color: 'var(--accent)', opacity: 0.15, display: 'block', marginBottom: '-20px' }}>01</span>
                  <h2 style={{ marginBottom: '30px' }}>Life Sciences Tutoring</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.85', maxWidth: '460px' }}>
                    Our core programme is designed for both current Grade 12 learners and NSC Rewrite candidates. We provide continuous, targeted afternoon revision classes to reinforce classroom instruction, follow curriculum ATP pacing, and master exam techniques.
                  </p>
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setCurrentPage('admissions')}
                  style={{ alignSelf: 'flex-start', marginTop: '40px' }}
                >
                  Apply Online
                </button>
              </div>
            </div>

            {/* Right — Structured Details */}
            <div style={{ padding: '100px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: '60px' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '24px' }}>Schedule</span>
                <p style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>Saturday to Sunday</p>
              </div>

              <div style={{ marginBottom: '60px' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '24px' }}>Curriculum</span>
                <p style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>Strict CAPS Syllabus Alignment</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Synchronized with Annual Teaching Plans (ATP)</p>
              </div>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '40px' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '24px' }}>What We Cover</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    "Weekly revision sessions focusing on challenging sections",
                    "Structured homework support and study guidance",
                    "Past exam paper drills under timed conditions",
                    "Diagnostic feedback reports issued to parents"
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'baseline', gap: '16px', fontSize: '0.92rem' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', flexShrink: 0 }}>{String(idx + 1).padStart(2, '0')}</span>
                      <span style={{ color: 'var(--text)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mathematical Literacy - Editorial Split (Reversed) */}
      <section style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <div className="container" style={{ padding: 0 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            minHeight: '600px'
          }} className="prog-grid-mobile">
            
            {/* Left — Structured Details */}
            <div style={{ padding: '100px 60px', borderRight: '1px solid rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: '60px' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '24px' }}>Status</span>
                <p style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>Coming Soon</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Official launch date will be announced</p>
              </div>

              <div style={{ marginBottom: '60px' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '24px' }}>Focus Areas</span>
                <p style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>Paper 1 & Paper 2 Modules</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Targeting Financial Math, Data Handling & Measurement</p>
              </div>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '40px' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '24px' }}>Planned Strategies</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    "Intensive curriculum mapping separating Data Handling from Finance",
                    "Structured study schedules with daily practice exercises",
                    "Expert instruction on interpreting source materials and graphs",
                    "Exam-simulation environment under timed conditions"
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'baseline', gap: '16px', fontSize: '0.92rem' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', flexShrink: 0 }}>{String(idx + 1).padStart(2, '0')}</span>
                      <span style={{ color: 'var(--text)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Large Number + Title (Sticky) */}
            <div style={{ backgroundColor: 'var(--secondary)' }}>
              <div style={{ padding: '100px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'sticky', top: '100px', alignSelf: 'start', minHeight: 'calc(100vh - 100px)', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(8rem, 15vw, 14rem)', fontWeight: 300, lineHeight: 0.85, color: 'var(--white)', opacity: 0.1, display: 'block', marginBottom: '-20px' }}>02</span>
                  <h2 style={{ marginBottom: '30px', color: 'var(--white)' }}>Mathematical Literacy</h2>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: '1.85', maxWidth: '460px' }}>
                    We are finalising a comprehensive Mathematical Literacy programme designed for both current matriculants and rewrite candidates who want to secure higher marks. This intensive programme will break down complex, word-heavy questions into manageable steps.
                  </p>
                </div>
                <button 
                  className="btn btn-outline-white" 
                  style={{ alignSelf: 'flex-start', marginTop: '40px', opacity: 0.5, cursor: 'not-allowed', borderColor: 'rgba(255,255,255,0.3)', color: 'var(--white)' }}
                  disabled
                >
                  Launch Pending <ArrowRight size={14} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .prog-grid-mobile {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          .prog-grid-mobile > div {
            padding: 60px 28px !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(0,0,0,0.1);
          }
          .prog-grid-mobile > div:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </div>
  );
}
