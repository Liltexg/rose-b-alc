import React, { useState } from "react";
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
import Dashboard from "./pages/Dashboard";
import ComingSoon from "./pages/ComingSoon";

const SHOW_COMING_SOON = true;

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);

  if (SHOW_COMING_SOON) {
    return <ComingSoon />;
  }

  // Render current page component
  const renderPage = () => {
    if (isAdmin || currentPage === "admin") {
      return <Dashboard setCurrentPage={setCurrentPage} setIsAdminState={setIsAdmin} />;
    }

    switch (currentPage) {
      case "home":
        return <Home setCurrentPage={setCurrentPage} />;
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
      <Navbar 
        currentPage={currentPage === 'admin' ? 'home' : currentPage} 
        setCurrentPage={setCurrentPage} 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin} 
      />
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
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <h4 style={{ color: 'var(--accent)', fontSize: '1rem', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>Rose B ALC</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '16px' }}>
              Premium CAPS-aligned after-school academic support and upgrade centre empowering students to achieve excellence.
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
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.8' }}>
              📍 88 President Street, Johannesburg<br />
              📞 Phone: 081 529 3764<br />
              📧 Email: info@rosebalc.co.za
            </p>
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
          <span>
            &copy; {new Date().getFullYear()} Rose Bruintjies After School Learning Centre. All Rights Reserved. | Powered by{' '}
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
            Terms & Conditions
          </button>
        </div>
      </footer>
    </div>
  );
}
