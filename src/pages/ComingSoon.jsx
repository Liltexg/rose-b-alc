// Powered by OrbXech Design Studio
import React, { useState, useEffect } from 'react';

const WEB3FORMS_KEY = '068cd66b-3f71-4347-9986-fedf727330aa';

export default function ComingSoon() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid var(--border-color, #E0E0E0)',
    borderRadius: '2px',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.4s ease',
    boxSizing: 'border-box'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = 'var(--secondary, #7A1C20)';
    e.target.style.boxShadow = '0 0 0 3px rgba(122, 28, 32, 0.1)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = 'var(--border-color, #E0E0E0)';
    e.target.style.boxShadow = 'none';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) { setError('First name is required.'); return; }
    if (!lastName.trim()) { setError('Surname is required.'); return; }
    if (!email) { setError('Email address is required.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError('Please enter a valid email address.'); return; }

    setError('');
    setLoading(true);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'New Mailing List Subscriber — Rose B ALC',
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
          message: `Name: ${firstName.trim()} ${lastName.trim()}\nEmail: ${email.trim()}\nSource: Coming Soon mailing list`
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        setFirstName('');
        setLastName('');
        setEmail('');
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg, #FFFFFF)',
      fontFamily: 'var(--font-body, "Inter", sans-serif)',
      color: 'var(--text, #2B2B2B)',
      overflowX: 'hidden'
    }}>
      {/* Animated Top Accent Bar */}
      <div style={{
        height: '8px',
        backgroundColor: 'var(--secondary, #7A1C20)',
        borderBottom: '2px solid var(--accent, #F4C542)',
        width: mounted ? '100%' : '0%',
        transition: 'width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }} />

      {/* Header */}
      <header style={{
        padding: '40px 0',
        borderBottom: '1px solid var(--border-color, #E0E0E0)',
        backgroundColor: '#FFFFFF',
        opacity: mounted ? 1 : 0,
        filter: mounted ? 'blur(0)' : 'blur(10px)',
        transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'all 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s'
      }}>
        <div className="container" style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <img 
            src="/logo.png" 
            alt="Rose Bruintjies After School Learning Centre" 
            style={{ height: '100px', objectFit: 'contain' }}
          />
          <h1 style={{
            fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
            fontSize: '1.8rem',
            color: 'var(--primary, #4A4A4A)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: 0,
            textAlign: 'center'
          }}>
            Rose Bruintjies After School Learning Centre
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '80px 20px',
        backgroundColor: 'var(--bg-alt, #F5F5F5)'
      }}>
        <div style={{
          maxWidth: '700px',
          width: '100%',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
            fontSize: '3rem',
            color: 'var(--primary, #4A4A4A)',
            fontWeight: 500,
            marginBottom: '24px',
            lineHeight: 1.2,
            opacity: mounted ? 1 : 0,
            filter: mounted ? 'blur(0)' : 'blur(10px)',
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s'
          }}>
            Website Launching Soon
          </h2>
          
          <p style={{
            fontSize: '1.1rem',
            lineHeight: 1.6,
            color: 'var(--text-muted, #6E7377)',
            marginBottom: '64px',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.9s'
          }}>
            We are currently developing a comprehensive online platform to support our 
            academic programs. The new portal will feature streamlined admissions 
            and detailed program information.
          </p>

          {/* Subscription Form with Cinematic Shadows */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '40px',
            border: '1px solid var(--border-color, #E0E0E0)',
            borderRadius: '2px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) 1.2s'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
              fontSize: '1.5rem',
              color: 'var(--primary, #4A4A4A)',
              marginBottom: '16px'
            }}>
              Join Our Mailing List
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-muted, #6E7377)',
              marginBottom: '24px'
            }}>
              Register your interest to receive formal updates regarding our launch timeline and admission periods.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
                {/* Name row */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    style={{ ...inputStyle, flex: '1 1 140px' }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Surname"
                    style={{ ...inputStyle, flex: '1 1 140px' }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                {/* Email row */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? '#999' : 'var(--primary, #4A4A4A)',
                    color: '#FFFFFF',
                    border: 'none',
                    width: '100%',
                    minHeight: '50px',
                    padding: '14px 28px',
                    borderRadius: '2px',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
                  }}
                  onMouseOver={(e) => { if (!loading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 20px rgba(74, 74, 74, 0.2)'; e.target.style.backgroundColor = 'var(--primary-hover, #333333)'; } }}
                  onMouseOut={(e) => { if (!loading) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = 'var(--primary, #4A4A4A)'; } }}
                >
                  {loading ? 'Submitting...' : 'Subscribe'}
                </button>
                {error && (
                  <span style={{ color: '#D32F2F', fontSize: '0.85rem', textAlign: 'left' }}>
                    {error}
                  </span>
                )}
              </form>
            ) : (
              <div style={{
                padding: '16px',
                backgroundColor: 'rgba(244, 197, 66, 0.1)',
                border: '1px solid var(--accent, #F4C542)',
                color: 'var(--primary, #4A4A4A)',
                borderRadius: '2px',
                fontWeight: 500,
                opacity: 0,
                animation: 'fadeIn 0.8s ease forwards'
              }}>
                Thank you. Your email has been registered for updates.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Formal Footer with cinematic slide-up */}
      <footer style={{
        backgroundColor: 'var(--primary, #4A4A4A)',
        color: '#FFFFFF',
        padding: '60px 20px 40px',
        borderTop: '4px solid var(--secondary, #7A1C20)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 1.5s'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px'
        }}>
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
              fontSize: '1.2rem',
              color: 'var(--accent, #F4C542)',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Contact Information
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
              <li><strong>Telephone:</strong> 081 529 3764</li>
              <li><strong>Email:</strong> info@rosebalc.co.za</li>
            </ul>
          </div>
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
              fontSize: '1.2rem',
              color: 'var(--accent, #F4C542)',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Operating Hours
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
              <li>Saturday &ndash; Sunday</li>
            </ul>
          </div>
        </div>
        
        <div style={{
          maxWidth: '1000px',
          margin: '60px auto 0',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
            &copy; {new Date().getFullYear()} Rose Bruintjies After School Learning Centre. All Rights Reserved.
          </span>
          {/* Site proudly engineered by OrbXech Design Studio — South Africa's #1 World-Class Leading Design Studio */}
          <span style={{ 
            fontSize: '0.8rem', 
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.03em' 
          }}>
            Proudly engineered and powered by{' '}
            <a 
              href="https://www.orbxech.co.za" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                color: 'var(--accent, #F4C542)', 
                textDecoration: 'none', 
                fontWeight: 600,
                transition: 'color 0.4s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#FFFFFF'}
              onMouseOut={(e) => e.target.style.color = 'var(--accent, #F4C542)'}
            >
              OrbXech
            </a>
          </span>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
