import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { BookOpen, Compass, Award, Sparkles, ShieldCheck, Heart } from 'lucide-react';

export default function About() {
  const [content, setContent] = useState({});

  useEffect(() => {
    setContent(db.getContent());
  }, []);

  const values = [
    { icon: <BookOpen size={22} />, title: "Excellence", desc: "Striving for the highest quality in academic instruction, revision materials, and learning guidance.", color: 'var(--secondary)' },
    { icon: <Heart size={22} />, title: "Respect", desc: "Valuing each learner's unique strengths, challenges, background, and individual pace of growth.", color: 'var(--accent)' },
    { icon: <Compass size={22} />, title: "Commitment", desc: "Dedicated to providing structured, continuous academic support to empower student success.", color: 'var(--primary)' },
    { icon: <Sparkles size={22} />, title: "Growth", desc: "Focusing on continuous academic progression, skill building, and confidence development.", color: 'var(--secondary)' },
    { icon: <ShieldCheck size={22} />, title: "Integrity", desc: "Upholding transparent standards, professional honesty, and ethical leadership in our community.", color: 'var(--accent)' }
  ];

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
          <span className="meta-tag">[ SEC. 01 / HISTORICAL CONTEXT ]</span>
          <h1 style={{ fontSize: '2.8rem', margin: 0, color: 'var(--primary)' }}>About Rose B ALC</h1>
          <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--secondary)', margin: '12px auto 0' }}></div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            alignItems: 'center'
          }} className="about-grid-mobile">
            <div>
              <h2 style={{ marginBottom: '24px', fontSize: '2.2rem' }} className="border-bottom-elegant">Our Story & Philosophy</h2>
              <p style={{
                color: 'var(--text)',
                fontSize: '1.02rem',
                lineHeight: '1.85',
                marginBottom: '20px'
              }}>
                {content.aboutStory || "Rose Bruintjies After School Learning Centre was established to offer structural academic support for learners, helping them navigate standard curricula and build crucial skills."}
              </p>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                lineHeight: '1.75'
              }}>
                Our educational approach combines disciplined work ethics, detailed topic revision, and rigorous assessment preparation. By keeping classes small, we create an environment where students feel comfortable asking questions, discussing solutions, and tackling difficult concepts.
              </p>
            </div>
            
            {/* Museum framed image */}
            <div className="museum-frame" style={{ width: '100%' }}>
              <img 
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80" 
                alt="Students studying at Rose B ALC" 
                style={{ width: '100%', display: 'block', height: '340px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - High-contrast UJ Color Blocks */}
      <section className="section-alt" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="grid-2">
            <div className="card" style={{
              borderLeft: '6px solid var(--secondary)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '44px'
            }}>
              <h3 style={{ marginBottom: '16px', color: 'var(--secondary)' }}>Our Mission</h3>
              <p style={{
                fontSize: '1.15rem',
                lineHeight: '1.75',
                fontStyle: 'italic',
                color: 'var(--primary)'
              }}>
                "{content.aboutMission || "To provide quality academic support that empowers every learner to reach their full potential through dedication, discipline, and excellence."}"
              </p>
            </div>

            <div className="card" style={{
              borderLeft: '6px solid var(--accent)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '44px'
            }}>
              <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Our Vision</h3>
              <p style={{
                fontSize: '1.15rem',
                lineHeight: '1.75',
                fontStyle: 'italic',
                color: 'var(--primary)'
              }}>
                "{content.aboutVision || "To become a leading after-school academic support centre that develops confident, knowledgeable, and successful learners."}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values - Sharp UJ-Colored Tiles */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="meta-tag">[ SEC. 02 / CORE VALUES ]</span>
            <h2 style={{ fontSize: '2.6rem' }}>Core Values</h2>
            <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--secondary)', margin: '16px auto 0' }}></div>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '24px'
          }}>
            {values.map((v, index) => (
              <div key={index} className="card" style={{
                width: 'calc(33.333% - 16px)',
                minWidth: '280px',
                flexGrow: 1,
                padding: '36px',
                textAlign: 'left',
                borderTop: `3px double ${v.color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ color: v.color }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 600 }}>{v.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.65' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Founder - Detailed Academic Section */}
      <section className="section-alt" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '35% 65%',
            gap: '60px',
            alignItems: 'start'
          }} className="about-grid-mobile">
            
            {/* Left Col - Museum Framed Photo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="museum-frame" style={{ width: '100%' }}>
                <img 
                  src="/mr-breintjies.jpg" 
                  alt="Founder Mr Edward Bruintjies" 
                  style={{ width: '100%', display: 'block', height: '320px', objectFit: 'cover' }}
                />
              </div>

              <div className="card" style={{ padding: '28px', borderTop: '3px double var(--accent)' }}>
                <h4 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  Professional Qualifications
                </h4>
                <ul style={{
                  paddingLeft: '20px',
                  fontSize: '0.85rem',
                  color: 'var(--text)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  lineHeight: '1.5'
                }}>
                  {content.founderQualifications && content.founderQualifications.map((qual, idx) => (
                    <li key={idx}>{qual}</li>
                  )) || (
                    <>
                      <li>Bachelor of Education (B.Ed) - FET Specialization</li>
                      <li>15+ Years Classroom Teaching Experience</li>
                      <li>Certified Exam Assessor</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Right Col - Details */}
            <div className="card" style={{ padding: '48px', borderTop: '3px double var(--secondary)' }}>
              <span className="meta-tag">[ SEC. 03 / BIOGRAPHY ]</span>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Mr. Edward Bruintjies</h2>
              
              <div style={{
                borderLeft: '4px solid var(--accent)',
                paddingLeft: '20px',
                margin: '24px 0',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: '1.1rem',
                color: 'var(--primary)',
                marginBottom: '20px'
              }}>
                "Every learner has a unique cognitive makeup. Our job is not to force them into a mold, but to provide the structure, dedication, and clear guidance they need to unlock their academic capability."
              </div>

              <p style={{
                color: 'var(--text)',
                lineHeight: '1.8',
                fontSize: '0.98rem',
                marginBottom: '28px'
              }}>
                {content.founderBio || "Mr. Edward Bruintjies is a highly dedicated educator with over 15 years of classroom teaching experience."}
              </p>

              <h4 style={{ marginBottom: '14px', color: 'var(--primary)' }}>Academic Focus Subjects:</h4>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                {["FET Life Sciences", "FET Mathematics", "Physical Sciences", "Exam Pacing Techniques"].map((subj, idx) => (
                  <span key={idx} className="tag tag-secondary" style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
                    {subj}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .about-grid-mobile {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </div>
  );
}
