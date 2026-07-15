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
    <header className="site-header">
      {/* Top Utility Bar */}
      <div className="nav-utility-bar">
        <div className="nav-utility-container">
          <div className="nav-utility-left">
            <span className="nav-utility-item">
              <Phone size={12} className="nav-utility-icon" />
              <a href="tel:0764237821">076 423 7821</a>
            </span>
            <span className="nav-utility-item">
              <Mail size={12} className="nav-utility-icon" />
              <a href="mailto:edwardbreintjies@rosebalc.co.za">edwardbreintjies@rosebalc.co.za</a>
            </span>
          </div>
          <div className="nav-utility-right hide-mobile">
            <span className="nav-utility-item">
              <Clock size={12} className="nav-utility-icon" />
              Sat - Sun Support Available
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="nav-main-bar">
        <div className="nav-main-container">
          {/* Brand Logo and Title */}
          <div
            onClick={() => handleNavClick('home')}
            className="nav-brand"
          >
            <img
              src="/logo.png"
              alt="Rose B ALC Logo"
              className="nav-logo"
            />
            <div className="nav-brand-text">
              <span className="brand-title">ROSE BRUINTJIES</span>
              <span className="brand-subtitle">AFTER SCHOOL LEARNING CENTER</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="nav-desktop-menu-wrapper">
            <nav className="nav-desktop-menu">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            
            <a
              href="tel:0764237821"
              className="nav-phone-btn"
              title="Call Us"
            >
              <Phone size={16} />
            </a>

            <button
              className="btn btn-secondary nav-cta-btn"
              onClick={() => handleNavClick('admissions')}
            >
              Apply Online
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="nav-mobile-toggle-wrapper">
            <a
              href="tel:0764237821"
              className="nav-phone-btn-mobile"
              title="Call Us"
            >
              <Phone size={18} />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="nav-menu-toggle"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="nav-mobile-drawer">
          <div className="nav-drawer-header">
            <div onClick={() => handleNavClick('home')} className="nav-brand">
              <img src="/logo.png" alt="Rose B ALC" className="nav-logo" />
              <div className="nav-brand-text">
                <span className="brand-title">ROSE BRUINTJIES</span>
                <span className="brand-subtitle">AFTER SCHOOL LEARNING CENTER</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="nav-drawer-close"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="nav-drawer-content">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-drawer-link ${currentPage === item.id ? 'active' : ''}`}
              >
                {item.label}
                {currentPage === item.id && (
                  <span className="nav-drawer-active-dot" />
                )}
              </button>
            ))}
          </div>

          <div className="nav-drawer-footer">
            <button
              className="btn btn-secondary nav-drawer-cta"
              onClick={() => handleNavClick('admissions')}
            >
              Apply Online
            </button>
            <div className="nav-drawer-contact">
              <a href="tel:0764237821" className="nav-drawer-contact-item">
                <Phone size={14} /> 076 423 7821
              </a>
              <a href="mailto:edwardbreintjies@rosebalc.co.za" className="nav-drawer-contact-item">
                <Mail size={14} /> edwardbreintjies@rosebalc.co.za
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
