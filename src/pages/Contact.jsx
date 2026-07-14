// Powered by OrbXech Design Studio
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const WEB3FORMS_KEY = '068cd66b-3f71-4347-9986-fedf727330aa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields (Name, Email, Message)');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: formData.subject ? `New Contact Message: ${formData.subject}` : 'New Contact Message — Rose B ALC',
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message.trim()}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
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
    <div className="animated">
      {/* Page Header */}
      <section style={{
        backgroundColor: 'var(--bg-alt)',
        padding: '60px 0',
        borderBottom: '3px double var(--primary)',
        textAlign: 'center'
      }}>
        <div className="container">
          <span style={{
            color: 'var(--secondary)',
            fontWeight: 700,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '6px'
          }}>Get in Touch</span>
          <h1 style={{ fontSize: '2.8rem', margin: 0, color: 'var(--primary)' }}>Contact Us</h1>
          <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--secondary)', margin: '12px auto 0' }}></div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40% 60%',
            gap: '60px',
            alignItems: 'start'
          }} className="contact-grid">
            
            {/* Left Column - Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card" style={{ padding: '32px', display: 'flex', gap: '20px', alignItems: 'flex-start', borderLeft: '4px solid var(--secondary)' }}>
                <div style={{ color: 'var(--secondary)', flexShrink: 0 }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Phone Numbers</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                    076 423 7821<br />
                    011 555 6789 (Intake Hub)
                  </p>
                </div>
              </div>

              <div className="card" style={{ padding: '32px', display: 'flex', gap: '20px', alignItems: 'flex-start', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ color: 'var(--accent)', flexShrink: 0 }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Email Addresses</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    edwardbreintjies@rosebalc.co.za<br />
                    admissions@rosebalc.co.za
                  </p>
                </div>
              </div>

              <div className="card" style={{ padding: '32px', display: 'flex', gap: '20px', alignItems: 'flex-start', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ color: 'var(--primary)', flexShrink: 0 }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Location</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    Rose Bruintjies ALC Main Hub<br />
                    12 Pine Street, Kariega<br />
                    Eastern Cape, 6229
                  </p>
                </div>
              </div>

              <div className="card" style={{ padding: '32px', display: 'flex', gap: '20px', alignItems: 'flex-start', borderLeft: '4px solid var(--secondary)' }}>
                <div style={{ color: 'var(--secondary)', flexShrink: 0 }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Operating Hours</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                    Saturday - Sunday
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="card" style={{ padding: '48px', borderTop: '4px solid var(--secondary)' }}>
              {submitted ? (
                <div className="animated" style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'rgba(229, 91, 19, 0.08)',
                    color: 'var(--secondary)',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <CheckCircle size={32} />
                  </div>
                  <h3 style={{ marginBottom: '12px' }}>Message Sent Successfully!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
                    Thank you for reaching out. We have received your inquiry and our administrator will respond within 24 hours.
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ marginBottom: '8px' }}>Send Us a Message</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
                    Have questions about registration, fees, or class schedules? Send an inquiry and we'll reply shortly.
                  </p>

                  {error && (
                    <div style={{
                      backgroundColor: 'rgba(229, 91, 19, 0.05)',
                      border: '1px solid rgba(229, 91, 19, 0.2)',
                      color: 'var(--secondary)',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      marginBottom: '16px',
                      fontWeight: 600
                    }}>
                      {error}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Full Name*</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address*</label>
                    <input 
                      type="email" 
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="e.g. Enrollment Enquiry"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '28px' }}>
                    <label className="form-label">Message Details*</label>
                    <textarea 
                      className="form-control"
                      rows="4"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Type your message here..."
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-secondary"
                    disabled={loading}
                    style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Sending...' : 'Send Message'} {!loading && <Send size={16} />}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Vector Map Mockup with UJ Orange Pin */}
      <section className="section-alt" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h3>Our Physical Location</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
              Located in a central, highly accessible area in Kariega, Eastern Cape.
            </p>
          </div>

          <div style={{
            position: 'relative',
            height: '400px',
            backgroundColor: '#CBD5E1',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)'
          }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
              <rect width="100%" height="100%" fill="#E2E8F0" />
              <rect x="50" y="50" width="180" height="150" rx="4" fill="#DCFCE7" />
              <rect x="50" y="240" width="180" height="130" rx="4" fill="#F1F5F9" />
              <rect x="270" y="50" width="300" height="150" rx="4" fill="#FEF08A" opacity="0.3" />
              <rect x="600" y="50" width="350" height="320" rx="4" fill="#E2E8F0" />
              <rect x="270" y="240" width="300" height="130" rx="4" fill="#DCFCE7" opacity="0.5" />
              
              <line x1="250" y1="0" x2="250" y2="400" stroke="#FFFFFF" strokeWidth="24" />
              <line x1="0" y1="220" x2="1000" y2="220" stroke="#FFFFFF" strokeWidth="24" />
              <line x1="580" y1="0" x2="580" y2="400" stroke="#FFFFFF" strokeWidth="20" />
              
              <text x="254" y="80" transform="rotate(90, 254, 80)" fill="#94A3B8" fontSize="10" fontWeight="bold" letterSpacing="1">OXFORD ROAD</text>
              <text x="80" y="224" fill="#94A3B8" fontSize="10" fontWeight="bold" letterSpacing="1">PINE STREET</text>
              <text x="320" y="224" fill="#94A3B8" fontSize="10" fontWeight="bold" letterSpacing="1">GLENHOVE ROAD</text>
              
              <circle cx="250" cy="220" r="16" fill="rgba(229, 91, 19, 0.15)" />
              <circle cx="250" cy="220" r="8" fill="rgba(229, 91, 19, 0.3)" />
            </svg>

            {/* Orange Pin Indicator */}
            <div style={{
              position: 'absolute',
              top: '220px',
              left: '250px',
              transform: 'translate(-50%, -100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--white)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 700,
                boxShadow: 'var(--shadow-md)',
                whiteSpace: 'nowrap',
                marginBottom: '4px',
                border: '1px solid var(--accent)'
              }}>
                Rose B ALC
              </div>
              <div style={{
                width: '18px',
                height: '18px',
                backgroundColor: 'var(--secondary)',
                border: '3px solid var(--white)',
                borderRadius: '50%',
                boxShadow: 'var(--shadow-md)'
              }}></div>
            </div>

            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid var(--border-color)'
            }}>
              <button style={{ border: 'none', background: 'none', padding: '10px', cursor: 'pointer', fontWeight: 'bold', borderBottom: '1px solid var(--border-color)' }}>+</button>
              <button style={{ border: 'none', background: 'none', padding: '10px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
            </div>
            
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(255,255,255,0.95)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-md)',
              maxWidth: '220px',
              fontSize: '0.8rem',
              border: '1px solid var(--border-color)'
            }}>
              <strong>Address:</strong><br />
              12 Pine Street, Kariega, Eastern Cape.
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 800px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}

