import React, { useState } from 'react';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email address is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg, #FFFFFF)',
      fontFamily: 'var(--font-body, "Inter", sans-serif)',
      color: 'var(--text, #2B2B2B)'
    }}>
      {/* Top Accent Bar */}
      <div style={{
        height: '8px',
        backgroundColor: 'var(--secondary, #7A1C20)',
        borderBottom: '2px solid var(--accent, #F4C542)'
      }} />

      {/* Header */}
      <header style={{
        padding: '40px 0',
        borderBottom: '1px solid var(--border-color, #E0E0E0)',
        backgroundColor: '#FFFFFF'
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
            lineHeight: 1.2
          }}>
            Website Launching Soon
          </h2>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: 1.6,
            color: 'var(--text-muted, #6E7377)',
            marginBottom: '48px'
          }}>
            We are currently developing a comprehensive online platform to support our 
            academic programs. The new portal will feature streamlined admissions 
            and detailed program information.
          </p>

          {/* Subscription Form */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '40px',
            border: '1px solid var(--border-color, #E0E0E0)',
            borderRadius: '2px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
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
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1px solid var(--border-color, #E0E0E0)',
                      borderRadius: '2px',
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary, #4A4A4A)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color, #E0E0E0)'}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: 'var(--primary, #4A4A4A)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0 24px',
                      borderRadius: '2px',
                      fontFamily: 'inherit',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'var(--primary-hover, #333333)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary, #4A4A4A)'}
                  >
                    Subscribe
                  </button>
                </div>
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
                fontWeight: 500
              }}>
                Thank you. Your email has been registered for updates.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Formal Footer */}
      <footer style={{
        backgroundColor: 'var(--primary, #4A4A4A)',
        color: '#FFFFFF',
        padding: '60px 20px 40px',
        borderTop: '4px solid var(--secondary, #7A1C20)'
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
                transition: 'color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#FFFFFF'}
              onMouseOut={(e) => e.target.style.color = 'var(--accent, #F4C542)'}
            >
              OrbXech
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
