import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, ArrowRight, KeyRound } from 'lucide-react';
import { db } from '../services/db';

export default function Navbar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteSettings, setSiteSettings] = useState({
    contactPhone: '076 423 7821',
    contactEmail: 'edwardbreintjies@rosebalc.co.za',
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    db.getSettings().then((s) => { if (s) setSiteSettings(s); });
  }, []);

  const navItems = [
    { id: 'home',       label: 'Home' },
    { id: 'about',      label: 'About Us' },
    { id: 'programmes', label: 'Programmes' },
    { id: 'admissions', label: 'Admissions 2027' },
    { id: 'fees',       label: 'Tuition Fees' },
    { id: 'notices',    label: 'Notices & Circulars' },
    { id: 'gallery',    label: 'Gallery' },
    { id: 'contact',    label: 'Contact Us' },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>

      {/* Main Navigation Bar */}
      <div className="nav-main-bar">
        <div className="nav-main-container">

          {/* Brand */}
          <div onClick={() => handleNavClick('home')} className="nav-brand">
            <div className="brand-logo-frame">
              <img src="/logo.png" alt="Rose B ALC Logo" className="nav-logo" />
            </div>
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

            <a href={`tel:${(siteSettings.contactPhone || '076 423 7821').replace(/\s/g, '')}`} className="nav-phone-btn" title="Call Us">
              <Phone size={16} />
            </a>

            <button
              className="btn btn-secondary nav-cta-btn"
              onClick={() => handleNavClick('admissions')}
            >
              Apply Online
            </button>
          </div>

          {/* Mobile Actions Cluster */}
          <div className="nav-mobile-toggle-wrapper">
            <a href={`tel:${(siteSettings.contactPhone || '076 423 7821').replace(/\s/g, '')}`} className="nav-phone-btn-mobile" title="Call Us">
              <Phone size={16} />
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="nav-menu-toggle-human"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Academic Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="nav-drawer-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Full-Screen Drawer */}
          <div className="nav-mobile-drawer human-academic-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu">

            {/* Drawer Header */}
            <div className="human-drawer-header">
              <div onClick={() => handleNavClick('home')} className="nav-brand" style={{ cursor: 'pointer' }}>
                <img src="/logo.png" alt="Rose B ALC" className="nav-logo" style={{ height: '36px' }} />
                <div className="nav-brand-text">
                  <span className="brand-title" style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>ROSE BREINTJIES</span>
                  <span className="brand-subtitle" style={{ color: 'var(--secondary)' }}>AFTER SCHOOL LEARNING CENTER</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="human-drawer-close"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav Links List */}
            <div className="human-drawer-content">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`human-drawer-item ${isActive ? 'active' : ''}`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={16} className="human-item-arrow" />
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="human-drawer-footer">

              {/* Primary Intake CTA */}
              <button
                className="btn btn-secondary human-drawer-cta"
                onClick={() => handleNavClick('admissions')}
              >
                <span>Apply for 2027 Academic Intake</span>
                <ArrowRight size={16} />
              </button>

              {/* Contact Info Row */}
              <div className="human-drawer-contact-row">
                <a href={`tel:${(siteSettings.contactPhone || '076 423 7821').replace(/\s/g, '')}`} className="human-contact-item">
                  <Phone size={14} />
                  <span>{siteSettings.contactPhone}</span>
                </a>
                <a href={`mailto:${siteSettings.contactEmail}`} className="human-contact-item">
                  <Mail size={14} />
                  <span>{siteSettings.contactEmail}</span>
                </a>
              </div>

              {/* Staff Portal Link */}
              <div className="human-portal-row">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="human-portal-btn"
                >
                  <KeyRound size={13} />
                  <span>Staff & Administration Portal</span>
                </button>
              </div>

            </div>
          </div>
        </>
      )}
    </header>
  );
}
