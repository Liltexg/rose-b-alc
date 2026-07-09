import React, { useState } from 'react';
import { Menu, X, Phone, Mail, Clock, ShieldAlert, GraduationCap } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage, isAdmin, setIsAdmin }) {
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
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
      {/* Top Utility Bar - Solid Slate Charcoal (UJ Style) */}
      <div style={{
        backgroundColor: 'var(--primary)',
        color: 'var(--white)',
        fontSize: '0.78rem',
        padding: '8px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        fontFamily: 'var(--font-body)',
        letterSpacing: '0.03em'
      }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)' }}>
            <Phone size={12} style={{ color: 'var(--accent)' }} /> 081 529 3764
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)' }}>
            <Mail size={12} style={{ color: 'var(--accent)' }} /> info@rosebalc.co.za
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)' }} className="hide-mobile-top">
            <Clock size={12} style={{ color: 'var(--accent)' }} /> Mon-Fri: 14:00 - 18:00 | Sat: 08:30 - 13:00
          </span>
        </div>
        <div>
          <button 
            onClick={() => setCurrentPage(isAdmin ? 'home' : 'admin')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '2px 8px',
              transition: 'all var(--transition-fast)'
            }}
            onMouseOver={(e) => e.target.style.color = 'var(--white)'}
            onMouseOut={(e) => e.target.style.color = 'var(--accent)'}
          >
            <GraduationCap size={13} />
            {isAdmin ? 'Exit Dashboard' : 'Staff Portal'}
          </button>
        </div>
      </div>

      {/* Main Header - Clean White with Slate bottom border */}
      <nav style={{
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--white)',
        borderBottom: '3px double var(--primary)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Brand Logo and Title */}
        <div 
          onClick={() => handleNavClick('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
        >
          <img 
            src="/logo.png" 
            alt="Rose B ALC Logo" 
            style={{
              height: '72px',
              objectFit: 'contain',
              flexShrink: 0
            }}
          />
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.65rem',
              lineHeight: '1.0',
              color: 'var(--secondary)',
              letterSpacing: '0.01em'
            }}>
              ROSE BRUINTJIES
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '0.72rem',
              color: 'var(--primary)',
              letterSpacing: '0.12em',
              lineHeight: '1.1',
              marginTop: '2px'
            }}>
              ACADEMIC CENTRE
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="desktop-nav">
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            alignItems: 'center',
            gap: '8px',
            margin: 0,
            padding: 0
          }}>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    padding: '8px 14px',
                    border: 'none',
                    background: 'none',
                    fontWeight: currentPage === item.id ? 700 : 500,
                    color: currentPage === item.id ? 'var(--secondary)' : 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    borderBottom: '2px solid',
                    borderBottomColor: currentPage === item.id ? 'var(--secondary)' : 'transparent',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseOver={(e) => {
                    if (currentPage !== item.id) {
                      e.target.style.color = 'var(--secondary)';
                      e.target.style.borderBottomColor = 'rgba(229, 91, 19, 0.4)';
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
          <button 
            className="btn btn-secondary" 
            style={{ padding: '10px 24px', fontSize: '0.8rem', marginLeft: '12px' }}
            onClick={() => handleNavClick('admissions')}
          >
            Apply Online
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="mobile-nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px'
          }}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="animated" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'var(--white)',
          borderBottom: '3px solid var(--secondary)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 0',
          gap: '4px',
          zIndex: 999
        }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                width: '100%',
                padding: '14px 28px',
                textAlign: 'left',
                border: 'none',
                background: currentPage === item.id ? 'var(--bg-alt)' : 'none',
                fontFamily: 'var(--font-body)',
                fontWeight: currentPage === item.id ? 700 : 500,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: currentPage === item.id ? 'var(--secondary)' : 'var(--primary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {item.label}
            </button>
          ))}
          <div style={{ padding: '16px 28px' }}>
            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', padding: '12px' }}
              onClick={() => handleNavClick('admissions')}
            >
              Apply Online
            </button>
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
          .hide-mobile-top {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
