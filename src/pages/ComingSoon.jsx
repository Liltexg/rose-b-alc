// Powered by OrbXech Design Studio
import React, { useState, useEffect } from 'react';
import { PhoneCall, Mail } from 'lucide-react';

// Official WhatsApp brand icon
const WhatsAppIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="wa-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#25D366"/>
        <stop offset="100%" stopColor="#128C7E"/>
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="10" fill="url(#wa-grad)"/>
    <path fill="#fff" d="M24 9.6A14.37 14.37 0 0 0 9.6 24c0 2.53.66 4.99 1.91 7.16L9.6 38.4l7.45-1.88A14.4 14.4 0 1 0 24 9.6Zm0 26.28a11.88 11.88 0 0 1-6.05-1.65l-.44-.26-4.42 1.12 1.16-4.28-.29-.46A11.88 11.88 0 1 1 24 35.88Zm6.52-8.89c-.36-.18-2.1-1.03-2.43-1.15-.33-.12-.57-.18-.81.18-.24.36-.93 1.15-1.14 1.39-.21.24-.42.27-.78.09-.36-.18-1.51-.55-2.87-1.76-1.06-.94-1.77-2.1-1.98-2.46-.21-.36-.02-.55.16-.73.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.81-1.94-1.11-2.66-.29-.7-.59-.6-.81-.61h-.69c-.24 0-.63.09-.96.45-.33.36-1.26 1.23-1.26 3s1.29 3.48 1.47 3.72c.18.24 2.54 3.87 6.15 5.43.86.37 1.53.59 2.05.75.86.27 1.64.23 2.26.14.69-.1 2.1-.86 2.4-1.69.3-.83.3-1.54.21-1.69-.09-.15-.33-.24-.69-.42Z"/>
  </svg>
);

const WEB3FORMS_KEY = '068cd66b-3f71-4347-9986-fedf727330aa';

export default function ComingSoon() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [learnerName, setLearnerName] = useState('');
  const [grade, setGrade] = useState('');
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
    if (!phone.trim()) { setError('Phone number is required.'); return; }
    if (!learnerName.trim()) { setError('Learner name is required.'); return; }
    if (!grade) { setError('Please select a programme.'); return; }

    setError('');
    setLoading(true);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'New Early Submission — Rose B ALC',
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
          message: `Parent Name: ${firstName.trim()} ${lastName.trim()}\nEmail: ${email.trim()}\nPhone: ${phone.trim()}\nLearner Name: ${learnerName.trim()}\nProgramme: ${grade}\nSource: Coming Soon early submission`
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setLearnerName('');
        setGrade('');
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
              First 20 Early Submissions
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-muted, #6E7377)',
              marginBottom: '24px'
            }}>
              Submit your details below to secure one of the first 20 early submissions for our upcoming launch.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
                {/* Name row */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Parent's First Name"
                    style={{ ...inputStyle, flex: '1 1 140px' }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Parent's Surname"
                    style={{ ...inputStyle, flex: '1 1 140px' }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                {/* Contact row */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    style={{ ...inputStyle, flex: '1 1 140px' }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    style={{ ...inputStyle, flex: '1 1 140px' }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                {/* Learner Info */}
                <input
                  type="text"
                  value={learnerName}
                  onChange={(e) => setLearnerName(e.target.value)}
                  placeholder="Learner's Full Name"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  style={{ ...inputStyle, color: grade ? 'inherit' : '#757575', cursor: 'pointer' }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <option value="" disabled>Select Programme</option>
                  <option value="Grade 12 Support">Grade 12 Support</option>
                  <option value="Rewrite / Upgrade">Rewrite / Upgrade Programme</option>
                </select>
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
                  {loading ? 'Submitting...' : 'Submit'}
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
                Thank you. Your early submission has been received.
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
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneCall size={16} /> <strong>Telephone:</strong> <a href="tel:0764237821" style={{ color: 'inherit', textDecoration: 'none' }}>076 423 7821</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <WhatsAppIcon size={16} /> <strong>WhatsApp:</strong> <a href="https://wa.me/27764237821?text=Hi%20Mr.%20Bruintjies,%20I%20would%20like%20to%20inquire%20about%20the%20after-school%20programmes%20at%20Rose%20B%20ALC." target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#25D366'} onMouseOut={(e) => e.target.style.color = 'inherit'}>076 423 7821</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} /> <strong>Email:</strong> <a href="mailto:edwardbreintjies@rosebalc.co.za" style={{ color: 'inherit', textDecoration: 'none' }}>edwardbreintjies@rosebalc.co.za</a>
              </li>
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

      {/* Floating Action Buttons */}
      <div className="fab-container" style={{
        position: 'fixed',
        bottom: '24px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999
      }}>
        <a 
          href="https://wa.me/27764237821?text=Hi%20Mr.%20Bruintjies,%20I%20would%20like%20to%20inquire%20about%20the%20after-school%20programmes%20at%20Rose%20B%20ALC." 
          target="_blank" 
          rel="noopener noreferrer"
          className="fab-btn"
          style={{
            backgroundColor: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '10px',
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
            transition: 'all 0.3s ease',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 211, 102, 0.3)';
          }}
          title="Chat on WhatsApp"
        >
          <WhatsAppIcon size={52} />
        </a>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
