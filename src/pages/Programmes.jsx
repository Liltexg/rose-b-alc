// Powered by OrbXech Design Studio
import React from 'react';
import { CheckCircle2, Calendar, FileText, Clock, HelpCircle, ArrowRight } from 'lucide-react';

export default function Programmes({ setCurrentPage }) {
  return (
    <div className="animated">
      {/* Page Header */}
      <section style={{
        backgroundColor: 'var(--bg-alt)',
        padding: '60px 0',
        borderBottom: '3px double var(--primary)',
        textAlign: 'center'
      }}>
        <div className="container">
          <span className="meta-tag">[ SEC. 01 / ACADEMIC FOCUS ]</span>
          <h1 style={{ fontSize: '2.8rem', margin: 0, color: 'var(--primary)' }}>Our Programmes</h1>
          <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--secondary)', margin: '12px auto 0' }}></div>
        </div>
      </section>

      {/* Grade 12 Support */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '55% 45%',
            gap: '60px',
            alignItems: 'start'
          }} className="prog-grid-mobile">
            
            {/* Details Left */}
            <div>
              <span className="meta-tag">[ SEC. 02 / FET PHASE SUPPORT ]</span>
              <h2 style={{ marginBottom: '24px', fontSize: '2.2rem' }} className="border-bottom-elegant">Grade 12 Academic Support</h2>
              
              <p style={{ color: 'var(--text)', fontSize: '1.02rem', lineHeight: '1.85', marginBottom: '28px' }}>
                Our Grade 12 support programme follows the standard school term system, providing continuous, targeted afternoon revision classes to reinforce classroom instruction, follow curriculum ATP pacing, and master exam techniques.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '28px',
                marginBottom: '36px'
              }} className="sub-grid-mobile">
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Calendar size={20} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>Weekly Schedule</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Monday to Friday afternoon classes (14:00 - 18:00)</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <FileText size={20} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>CAPS Syllabus</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Strict synchronization with Annual Teaching Plans (ATP)</p>
                  </div>
                </div>
              </div>

              <h4 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Key Programme Structures:</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                marginBottom: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {[
                  "Weekly revision sessions focusing on challenging sections",
                  "Structured homework support and study guidance",
                  "Past exam paper drills under timed conditions",
                  "Diagnostic feedback reports issued to parents"
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subject Panel Right */}
            <div className="card" style={{
              borderTop: '3px double var(--secondary)',
              backgroundColor: 'var(--bg-alt)',
              padding: '40px'
            }}>
              <h3 style={{ marginBottom: '16px', fontSize: '1.4rem' }}>Supported Subjects</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
                Specialized focus on FET core subjects critical for overall NSC score card improvement.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div style={{
                  backgroundColor: 'var(--white)',
                  padding: '18px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <h4 style={{ color: 'var(--secondary)', fontSize: '1.05rem', marginBottom: '6px' }}>Life Sciences</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Curriculum consolidation covering DNA, plant hormones, environmental biology, and human systems.</p>
                </div>

                <div style={{
                  backgroundColor: 'var(--white)',
                  padding: '18px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <h4 style={{ color: 'var(--primary)', fontSize: '1.05rem', marginBottom: '6px' }}>Mathematics & Physical Sciences</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Focus on functions, calculus, organic chemistry, forces, energy, and physical science past paper answers.</p>
                </div>
              </div>

              <button 
                className="btn btn-secondary" 
                style={{ width: '100%' }}
                onClick={() => setCurrentPage('admissions')}
              >
                Apply Online Now
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Upgrade / Rewrite Programme */}
      <section className="section-alt" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '45% 55%',
            gap: '60px',
            alignItems: 'start'
          }} className="prog-grid-mobile-alt">

            {/* Requirement Card Left */}
            <div className="card" style={{
              borderTop: '3px double var(--accent)',
              backgroundColor: 'var(--white)',
              padding: '40px'
            }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.4rem' }}>Upgrade Requirements</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
                Crucial conditions for matriculants upgrading their final NSC scores.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Clock size={18} style={{ color: 'var(--accent)', marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>Six-Month Duration</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requires full syllabus revision commitment and diagnostic mock trials.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <FileText size={18} style={{ color: 'var(--accent)', marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>Paper 1 & 2 Focus</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Separate mock test cycles targeting Paper 1 and Paper 2 templates.</p>
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center' }}
                onClick={() => setCurrentPage('admissions')}
              >
                Apply for Upgrade <ArrowRight size={14} />
              </button>
            </div>

            {/* Details Right */}
            <div>
              <span className="meta-tag">[ SEC. 03 / UPGRADE STRATEGY ]</span>
              <h2 style={{ marginBottom: '24px', fontSize: '2.2rem' }} className="border-bottom-elegant">NSC Rewrite / Upgrade</h2>
              
              <p style={{ color: 'var(--text)', fontSize: '1.02rem', lineHeight: '1.85', marginBottom: '24px' }}>
                Our Rewrite Upgrade Programme is custom-designed for candidates who have already written their matric examinations but did not achieve the specific grades needed for university admission.
              </p>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.75', marginBottom: '24px' }}>
                This is an intensive diagnostic program. We review each candidate's previous exam answers to pinpoint exactly where marks were dropped (e.g., incorrect diagram interpretations, incomplete explanations, or weak time management).
              </p>

              <h4 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Academic Strategies Implemented:</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {[
                  "Intensive curriculum mapping separating Paper 1 and Paper 2 sections",
                  "Structured study schedules with mandatory daily progress targets",
                  "Expert instruction on how external markers evaluate answer booklets",
                  "Exam-simulation environment under strict, timed conditions"
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .prog-grid-mobile {
            grid-template-columns: 1fr !important;
          }
          .prog-grid-mobile-alt {
            grid-template-columns: 1fr !important;
          }
          .prog-grid-mobile-alt > div:first-child {
            order: 2;
          }
          .prog-grid-mobile-alt > div:last-child {
            order: 1;
          }
          .sub-grid-mobile {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

