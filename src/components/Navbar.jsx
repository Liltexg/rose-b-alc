// Powered by OrbXech Design Studio
import React, { useState } from 'react';
import { Menu, X, Phone, Mail, Clock } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'programmes', label: 'Programmes' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'fees', label: 'Fees' },
    { id: 'notices', label: 'Notices' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
      {/* Top Utility Bar */}
      <div className="nav-utility-bar" style={{
        backgroundColor: 'var(--white)',
        color: 'var(--text-muted)',
        fontSize: '0.78rem',
        padding: '8px 40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        fontFamily: 'var(--font-body)',
        letterSpacing: '0.03em'
      }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={12} style={{ color: 'var(--primary)' }} /> 076 423 7821
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={12} style={{ color: 'var(--primary)' }} /> edwardbreintjies@rosebalc.co.za
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }} className="hide-mobile-top">
            <Clock size={12} style={{ color: 'var(--primary)' }} /> Sat-Sun
          </span>
        </div>
      </div>

      {/* Main Header - Glassmorphism Pill */}
      <div className="nav-pill-wrapper" style={{ padding: '12px 20px 0', pointerEvents: 'none' }}>
        <nav className="nav-pill-inner" style={{
          padding: '10px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: '50px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          pointerEvents: 'auto',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Brand Logo and Title */}
          <div
            onClick={() => handleNavClick('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexShrink: 0 }}
          >
            <img
              src="/logo.png"
              alt="Rose B ALC Logo"
              className="nav-logo-img"
              style={{ height: '52px', objectFit: 'contain', flexShrink: 0 }}
            />
            <div className="nav-brand-text">
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1.35rem',
                lineHeight: '1.0',
                color: 'var(--secondary)',
                letterSpacing: '0.01em'
              }}>
                ROSE BREINTJIES
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.62rem',
                color: 'var(--primary)',
                letterSpacing: '0.10em',
                lineHeight: '1.1',
                marginTop: '2px'
              }}>
                AFTER SCHOOL LEARNING CENTER
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="desktop-nav">
            <ul style={{
              display: 'flex',
              listStyle: 'none',
              alignItems: 'center',
              gap: '4px',
              margin: 0,
              padding: 0
            }}>
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      padding: '8px 12px',
                      border: 'none',
                      background: 'none',
                      fontWeight: currentPage === item.id ? 700 : 500,
                      color: currentPage === item.id ? 'var(--secondary)' : 'var(--primary)',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-body)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid',
                      borderBottomColor: currentPage === item.id ? 'var(--primary)' : 'transparent',
                      transition: 'border-color 0.4s ease, color 0.4s ease'
                    }}
                    onMouseOver={(e) => {
                      if (currentPage !== item.id) {
                        e.target.style.color = 'var(--secondary)';
                        e.target.style.borderBottomColor = 'rgba(122,28,32,0.3)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (currentPage !== item.id) {
                        e.target.style.color = 'var(--primary)';
                        e.target.style.borderBottomColor = 'transparent';
                      }
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <a
              href="tel:0764237821"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.04)',
                color: 'var(--primary)',
                marginLeft: '12px',
                textDecoration: 'none',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.08)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'}
              title="Call Us"
            >
              <Phone size={16} />
            </a>
            <button
              className="btn btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.75rem', marginLeft: '8px', minHeight: '40px' }}
              onClick={() => handleNavClick('admissions')}
            >
              Apply Online
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="mobile-nav-toggle" style={{ display: 'none', alignItems: 'center', gap: '4px' }}>
            <a
              href="tel:0764237821"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                color: 'var(--primary)',
                textDecoration: 'none',
                borderRadius: '8px',
                backgroundColor: 'rgba(0,0,0,0.04)'
              }}
              title="Call Us"
            >
              <Phone size={20} />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                minWidth: '44px',
                minHeight: '44px',
                borderRadius: '8px'
              }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="mobile-drawer animated" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--white)',
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          {/* Drawer Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--white)',
            position: 'sticky',
            top: 0,
            zIndex: 1
          }}>
            <div onClick={() => handleNavClick('home')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <img src="/logo.png" alt="Rose B ALC" style={{ height: '40px', objectFit: 'contain' }} />
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--secondary)' }}>ROSE BREINTJIES</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AFTER SCHOOL LEARNING CENTER</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '8px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav Items */}
          <div style={{ flex: 1, padding: '16px 0' }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  width: '100%',
                  padding: '18px 28px',
                  textAlign: 'left',
                  border: 'none',
                  borderBottom: '1px solid var(--border-color)',
                  background: currentPage === item.id ? 'var(--bg-alt)' : 'none',
                  fontFamily: 'var(--font-body)',
                  fontWeight: currentPage === item.id ? 700 : 500,
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: currentPage === item.id ? 'var(--secondary)' : 'var(--primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '60px'
                }}
              >
                {item.label}
                {currentPage === item.id && (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }}></div>
                )}
              </button>
            ))}
          </div>

          {/* Apply CTA */}
          <div style={{ padding: '24px 28px', borderTop: '3px double var(--secondary)', backgroundColor: 'var(--bg-alt)' }}>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', padding: '16px', fontSize: '0.9rem' }}
              onClick={() => handleNavClick('admissions')}
            >
              Apply Online
            </button>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="tel:0764237821" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>
                <Phone size={14} style={{ color: 'var(--secondary)' }} /> 076 423 7821
              </a>
              <a href="mailto:edwardbreintjies@rosebalc.co.za" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>
                <Mail size={14} style={{ color: 'var(--secondary)' }} /> edwardbreintjies@rosebalc.co.za
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Navigation responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: flex !important;
          }
        }
        @media (max-width: 600px) {
          .nav-utility-bar {
            padding: 6px 16px !important;
            font-size: 0.72rem !important;
          }
          .nav-pill-wrapper {
            padding: 8px 12px 0 !important;
          }
          .nav-logo-img {
            height: 42px !important;
          }
          .nav-brand-text > div:first-child {
            font-size: 1.05rem !important;
          }
          .nav-brand-text > div:last-child {
            display: none !important;
          }
        }
        @media (max-width: 380px) {
          .nav-brand-text > div:first-child {
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </header>
  );
}


