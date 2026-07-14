// Powered by OrbXech Design Studio
import React, { useState } from "react";
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

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Programmes from "./pages/Programmes";
import Admissions from "./pages/Admissions";
import Fees from "./pages/Fees";
import Notices from "./pages/Notices";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import ComingSoon from "./pages/ComingSoon";

const SHOW_COMING_SOON = true;

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [movieMode, setMovieMode] = useState(false);

  if (SHOW_COMING_SOON) {
    return <ComingSoon />;
  }

  // Render current page component
  const renderPage = () => {

    switch (currentPage) {
      case "home":
        return <Home setCurrentPage={setCurrentPage} setMovieMode={setMovieMode} />;
      case "about":
        return <About />;
      case "programmes":
        return <Programmes setCurrentPage={setCurrentPage} />;
      case "admissions":
        return <Admissions setCurrentPage={setCurrentPage} />;
      case "fees":
        return <Fees setCurrentPage={setCurrentPage} />;
      case "notices":
        return <Notices />;
      case "gallery":
        return <Gallery />;
      case "contact":
        return <Contact />;
      case "terms":
        return <Terms />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        opacity: movieMode ? 0 : 1,
        transform: movieMode ? 'translateY(-100%)' : 'translateY(0)',
        pointerEvents: movieMode ? 'none' : 'auto'
      }}>
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
        />
      </div>
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
      
      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--primary)',
        color: 'var(--white)',
        padding: '60px 40px 30px',
        borderTop: '5px double var(--secondary)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.85rem'
      }}>
        <div className="container footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <h4 style={{ color: 'var(--accent)', fontSize: '1rem', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>Rose B ALC</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '16px' }}>
              Premium CAPS-aligned after-school academic support and upgrade center empowering students to achieve excellence.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--accent)', fontSize: '1rem', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button onClick={() => setCurrentPage('about')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('programmes')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                  Our Programmes
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('admissions')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                  Admissions
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('fees')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                  Tuition Fees
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--accent)', fontSize: '1rem', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>Contact Info</h4>
            <div style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PhoneCall size={16} style={{ color: 'var(--accent)' }} /> 
                <span style={{ fontSize: '0.9rem' }}>076 423 7821 (Call)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <WhatsAppIcon size={16} color="#25D366" /> 
                <span style={{ fontSize: '0.9rem' }}>076 423 7821 (WhatsApp)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} style={{ color: 'var(--accent)' }} /> 
                <span style={{ fontSize: '0.9rem' }}>edwardbreintjies@rosebalc.co.za</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '20px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center'
        }}>
          <span style={{ textAlign: 'left', lineHeight: '1.5' }}>
            &copy; {new Date().getFullYear()} Rose Bruintjies After School Learning Center. All Rights Reserved. | Powered by{' '}
            <a 
              href="https://www.orbxech.co.za" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
              OrbXech Design Studio
            </a>
          </span>
          <button onClick={() => setCurrentPage('terms')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
            Terms &amp; Conditions
          </button>
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
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          footer {
            padding: 40px 20px 24px !important;
          }
        }
        @media (max-width: 480px) {
          .fab-container {
            bottom: 16px !important;
            right: 14px !important;
          }
          .fab-btn {
            width: 46px !important;
            height: 46px !important;
          }
        }
      `}</style>
    </div>
  );
}

