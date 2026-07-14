// Powered by OrbXech Design Studio
import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { BookOpen, Compass, Award, Sparkles, ShieldCheck, Heart } from 'lucide-react';

export default function About() {
  const [content, setContent] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      const data = await db.getContent();
      setContent(data);
    };
    fetchContent();
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
        padding: '100px 0 60px 0',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--secondary)', display: 'block', marginBottom: '20px' }}>Historical Context</span>
              <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)' }}>About Us</h1>
            </div>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Rose B ALC</span>
          </div>
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
            
            {/* Museum framed image with Wix Overlap */}
            <div className="museum-frame about-museum-frame" style={{ 
              width: '100%', 
              marginTop: '-40px', 
              position: 'relative', 
              zIndex: 10,
              boxShadow: '0 30px 60px rgba(0,0,0,0.15)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80" 
                alt="Students studying at Rose B ALC" 
                style={{ width: '100%', display: 'block', height: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - High-contrast Brand Blocks */}
      <section style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <div className="container" style={{ padding: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="mission-grid-mobile">
            
            <div style={{
              backgroundColor: 'var(--secondary)',
              color: 'var(--white)',
              padding: '80px 60px',
              borderRight: '1px solid rgba(0,0,0,0.1)'
            }}>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '24px' }}>01 / Purpose</span>
              <h3 style={{ marginBottom: '24px', color: 'var(--white)', fontSize: '2rem' }}>Our Mission</h3>
              <p style={{
                fontSize: '1.25rem',
                lineHeight: '1.75',
                color: 'rgba(255,255,255,0.9)'
              }}>
                "{content.aboutMission || "To provide quality academic support that empowers every learner to reach their full potential through dedication, discipline, and excellence."}"
              </p>
            </div>

            <div style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--white)',
              padding: '80px 60px'
            }}>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '24px' }}>02 / Future</span>
              <h3 style={{ marginBottom: '24px', color: 'var(--white)', fontSize: '2rem' }}>Our Vision</h3>
              <p style={{
                fontSize: '1.25rem',
                lineHeight: '1.75',
                color: 'rgba(255,255,255,0.9)'
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
              <div key={index} style={{
                width: 'calc(33.333% - 16px)',
                minWidth: '280px',
                flexGrow: 1,
                padding: '40px 32px',
                textAlign: 'left',
                borderTop: `1px solid ${v.color}`,
                borderLeft: '1px solid rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
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
                  alt="Founder Mr. E. Bruintjies" 
                  style={{ width: '100%', display: 'block', height: '320px', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '32px', borderTop: '1px solid var(--accent)' }}>
                <h4 style={{ marginBottom: '16px', color: 'var(--primary)', paddingBottom: '10px' }}>
                  Professional Qualifications
                </h4>
                <ul style={{
                  paddingLeft: '20px',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  lineHeight: '1.5'
                }}>
                  {content.founderQualifications && content.founderQualifications.map((qual, idx) => (
                    <li key={idx}>{qual}</li>
                  )) || (
                    <>
                      <li>BEd (FET) Life Sciences</li>
                      <li>10 years experience teaching Life Science</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Right Col - Details */}
            <div style={{ padding: '60px', borderTop: '1px solid var(--secondary)', borderLeft: '1px solid rgba(0,0,0,0.1)' }}>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '24px' }}>Biography</span>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '32px' }}>Mr. E. Bruintjies</h2>
              
              <div style={{
                borderLeft: '1px solid var(--accent)',
                paddingLeft: '24px',
                margin: '32px 0',
                fontSize: '1.2rem',
                color: 'var(--primary)',
                marginBottom: '32px'
              }}>
                "Every learner has a unique cognitive makeup. Our job is not to force them into a mold, but to provide the structure, dedication, and clear guidance they need to unlock their academic capability."
              </div>

              <p style={{
                color: 'var(--text-muted)',
                lineHeight: '1.8',
                fontSize: '1.05rem',
                marginBottom: '40px'
              }}>
                {content.founderBio || "Mr. E. Bruintjies is a highly dedicated educator with 10 years of experience teaching Life Science."}
              </p>

              <h4 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Academic Focus Subjects:</h4>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                {["Life Sciences", "Mathematical Literacy", "Exam Preparation"].map((subj, idx) => (
                  <span key={idx} className="tag" style={{ borderBottomColor: 'var(--secondary)', color: 'var(--primary)' }}>
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
          .mission-grid-mobile {
            grid-template-columns: 1fr !important;
          }
          .mission-grid-mobile > div {
            border-right: none !important;
            padding: 60px 28px !important;
          }
          .about-museum-frame {
            margin-top: 0 !important;
          }
        }
        @media (max-width: 600px) {
          .about-grid-mobile > div:last-child {
            padding: 0 !important;
          }
          .mission-grid-mobile > div {
            padding: 40px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

