import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Search, Calendar, ChevronDown, ChevronUp, Printer } from 'lucide-react';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedNoticeId, setExpandedNoticeId] = useState('n-1');

  useEffect(() => {
    const fetchNotices = async () => {
      const data = await db.getNotices();
      setNotices(data);
    };
    fetchNotices();
  }, []);

  const categories = ['All', 'General', 'Academic', 'Events'];

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notice.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || notice.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleNotice = (id) => {
    setExpandedNoticeId(expandedNoticeId === id ? null : id);
  };

  const handlePrint = (notice) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${notice.title} | Rose B ALC Official Notice</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600;700&display=swap');
            @page { size: A4; margin: 15mm 15mm 20mm 15mm; }
            body { 
              font-family: 'Inter', sans-serif; 
              color: #1a1a1a; 
              line-height: 1.6; 
              background: #fff; 
              margin: 0; 
              padding: 0; 
            }
            .letterhead-top-bar {
              height: 6px;
              background: linear-gradient(90deg, #7A1C20 0%, #7A1C20 70%, #D4AF37 70%, #D4AF37 100%);
              margin-bottom: 20px;
            }
            .letterhead-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #7A1C20;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .lh-left {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            .lh-logo {
              width: 85px;
              height: 85px;
              object-fit: contain;
            }
            .lh-company-title {
              font-family: 'Cormorant Garamond', serif;
              font-size: 1.65rem;
              font-weight: 700;
              color: #7A1C20;
              margin: 0;
              line-height: 1.1;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .lh-company-sub {
              font-size: 0.75rem;
              font-weight: 600;
              color: #555;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-top: 4px;
            }
            .lh-director {
              font-size: 0.75rem;
              color: #333;
              margin-top: 4px;
              font-weight: 500;
            }
            .lh-right {
              text-align: right;
              font-size: 0.75rem;
              color: #444;
              line-height: 1.6;
              border-left: 2px solid #D4AF37;
              padding-left: 14px;
            }
            .lh-right strong {
              color: #7A1C20;
            }
            .notice-meta-bar {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-left: 4px solid #D4AF37;
              padding: 10px 16px;
              margin-bottom: 28px;
              font-size: 0.85rem;
            }
            .notice-title {
              font-family: 'Cormorant Garamond', serif;
              font-size: 1.8rem;
              font-weight: 700;
              color: #7A1C20;
              margin-bottom: 20px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 12px;
            }
            .notice-body {
              font-size: 1rem;
              line-height: 1.85;
              color: #334155;
              white-space: pre-line;
              min-height: 300px;
              margin-bottom: 40px;
            }
            .notice-signoff {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-top: 1px dashed #cbd5e1;
              padding-top: 20px;
              margin-top: 40px;
            }
            .letterhead-footer {
              margin-top: 40px;
              border-top: 2px solid #7A1C20;
              padding-top: 12px;
              font-size: 0.7rem;
              color: #64748b;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .letterhead-bottom-bar {
              height: 4px;
              background: #7A1C20;
              margin-top: 8px;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="letterhead-top-bar"></div>

          <div class="letterhead-header">
            <div class="lh-left">
              <img src="/logo.png" class="lh-logo" alt="Rose B ALC Logo" />
              <div>
                <h1 class="lh-company-title">Rose Bruintjies After School Learning Center</h1>
                <div class="lh-company-sub">CAPS-Aligned Life Sciences & Academic Upgrade Center</div>
                <div class="lh-director"><strong>Founder & Director:</strong> Mr. Edward Breintjies (B.Ed FET)</div>
              </div>
            </div>
            <div class="lh-right">
              <div><strong>Tel / WhatsApp:</strong> 076 423 7821</div>
              <div><strong>Email:</strong> edwardbreintjies@rosebalc.co.za</div>
              <div><strong>Address:</strong> Kariega, Eastern Cape, 6229</div>
              <div><strong>CIPC Reg No:</strong> 2026/611870/07</div>
              <div><strong>SARS Tax Ref:</strong> 9161805297</div>
            </div>
          </div>

          <div class="notice-meta-bar">
            <div><strong>OFFICIAL NOTICE</strong> | Category: <strong>${notice.category || 'General'}</strong></div>
            <div>Date: <strong>${new Date(notice.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</strong> | Ref: <strong style="font-family: monospace">NOTICE-${notice.id.toUpperCase()}</strong></div>
          </div>

          <h2 class="notice-title">${notice.title}</h2>
          <div class="notice-body">${notice.body}</div>

          <div class="notice-signoff">
            <div>
              <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Authorised Signatory</div>
              <div style="font-weight: 700; font-size: 1.05rem; color: #0f172a; margin-top: 4px;">${notice.author}</div>
              <div style="font-size: 0.8rem; color: #7A1C20;">Rose Bruintjies After School Learning Center</div>
            </div>
            <div style="text-align: right; font-size: 0.75rem; color: #64748b;">
              Official Notice Document<br/>
              Verified Broadcast
            </div>
          </div>

          <div class="letterhead-footer">
            <div>
              <strong>Rose Bruintjies After School Learning Center (Pty) Ltd</strong><br/>
              CIPC Reg No: 2026/611870/07 | SARS Tax Ref: 9161805297
            </div>
            <div style="text-align: center;">
              Kariega, Eastern Cape<br/>
              Tel / WhatsApp: 076 423 7821
            </div>
            <div style="text-align: right;">
              Confidential Academic Document<br/>
              Official System Record
            </div>
          </div>
          <div class="letterhead-bottom-bar"></div>

          <script>
            window.onload = () => { setTimeout(() => { window.print(); }, 500); };
            setTimeout(() => { window.print(); }, 1500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
          <span className="meta-tag">[ SEC. 01 / CORRESPONDENCE ]</span>
          <h1 style={{ fontSize: '2.8rem', margin: 0, color: 'var(--primary)' }}>Official Notices</h1>
          <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--secondary)', margin: '12px auto 0' }}></div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section style={{ padding: '36px 0 0 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            backgroundColor: 'var(--bg-alt)',
            padding: '16px 24px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }} className="filters-wrapper">
            
            {/* Category Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`btn ${activeCategory === cat ? 'btn-secondary' : 'btn-outline'}`}
                  style={{
                    padding: '8px 18px',
                    fontSize: '0.78rem',
                    backgroundColor: activeCategory === cat ? 'var(--secondary)' : 'transparent',
                    borderColor: activeCategory === cat ? 'var(--secondary)' : 'var(--border-color)',
                    color: activeCategory === cat ? 'var(--white)' : 'var(--primary)'
                  }}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
              <input 
                type="text"
                placeholder="Search notice letters..."
                className="form-control"
                style={{ paddingLeft: '40px', paddingRight: '16px', fontSize: '0.85rem', padding: '10px 16px 10px 40px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={14} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
            </div>

          </div>
        </div>
      </section>

      {/* Notice List */}
      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          {filteredNotices.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 24px',
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                No notice correspondence found matching parameters.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {filteredNotices.map((notice) => {
                const isExpanded = expandedNoticeId === notice.id;
                return (
                  <div key={notice.id} style={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-sm)',
                    overflow: 'hidden',
                    transition: 'all var(--transition-normal)'
                  }}>
                    {/* Notice Toggle Header */}
                    <div 
                      onClick={() => toggleNotice(notice.id)}
                      style={{
                        padding: '24px 32px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        backgroundColor: isExpanded ? 'var(--bg-alt)' : 'transparent',
                        borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span className={`tag ${notice.category === 'Academic' ? 'tag-secondary' : notice.category === 'Events' ? 'tag-accent' : ''}`}>
                            {notice.category}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={13} />
                            {new Date(notice.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 600 }}>
                          {notice.title}
                        </h3>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrint(notice);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all var(--transition-fast)'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary)'}
                          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                          title="Print Letter"
                        >
                          <Printer size={18} />
                        </button>
                        <div>
                          {isExpanded ? <ChevronUp size={22} style={{ color: 'var(--secondary)' }} /> : <ChevronDown size={22} />}
                        </div>
                      </div>
                    </div>

                    {/* Notice Letter Box (Body) */}
                    {isExpanded && (
                      <div style={{ padding: '36px', backgroundColor: 'var(--bg-alt)' }} className="animated">
                        <div className="notice-letter" style={{ boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-sm)', padding: '40px', backgroundColor: '#ffffff' }}>
                          {/* Top Accent Bar */}
                          <div style={{
                            height: '6px',
                            background: 'linear-gradient(90deg, #7A1C20 0%, #7A1C20 70%, #D4AF37 70%, #D4AF37 100%)',
                            marginBottom: '20px'
                          }}></div>

                          {/* Letterhead Header */}
                          <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                            borderBottom: '2px solid #7A1C20', paddingBottom: '16px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <img src="/logo.png" alt="Rose B ALC" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
                              <div>
                                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 700, color: '#7A1C20', margin: 0, textTransform: 'uppercase' }}>
                                  Rose Bruintjies After School Learning Center
                                </h3>
                                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
                                  CAPS-Aligned Life Sciences & Academic Upgrade Center
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#333', marginTop: '2px' }}>
                                  <strong>Founder & Director:</strong> Mr. Edward Breintjies (B.Ed FET)
                                </div>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#444', lineHeight: 1.5, borderLeft: '2px solid #D4AF37', paddingLeft: '12px' }}>
                              <div><strong style={{ color: '#7A1C20' }}>Tel / WhatsApp:</strong> 076 423 7821</div>
                              <div><strong style={{ color: '#7A1C20' }}>Email:</strong> edwardbreintjies@rosebalc.co.za</div>
                              <div><strong style={{ color: '#7A1C20' }}>Location:</strong> Kariega, Eastern Cape</div>
                              <div><strong style={{ color: '#7A1C20' }}>CIPC Reg No:</strong> 2026/611870/07</div>
                              <div><strong style={{ color: '#7A1C20' }}>SARS Tax Ref:</strong> 9161805297</div>
                            </div>
                          </div>

                          {/* Notice Meta Bar */}
                          <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid #D4AF37',
                            padding: '10px 16px', marginBottom: '24px', fontSize: '0.82rem', flexWrap: 'wrap', gap: '8px'
                          }}>
                            <div><strong>OFFICIAL NOTICE</strong> | Category: <strong>{notice.category || 'General'}</strong></div>
                            <div>Date: <strong>{new Date(notice.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</strong> | Ref: <strong style={{ fontFamily: 'monospace' }}>NOTICE-{notice.id.toUpperCase()}</strong></div>
                          </div>

                          {/* Letter Title */}
                          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 700, color: '#7A1C20', marginBottom: '16px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                            {notice.title}
                          </h2>

                          {/* Letter Content */}
                          <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-line', minHeight: '200px', marginBottom: '30px' }}>
                            {notice.body}
                          </div>

                          {/* Letter Signoff */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed #cbd5e1', paddingTop: '16px', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Issued By</div>
                              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginTop: '2px' }}>{notice.author}</div>
                              <div style={{ fontSize: '0.75rem', color: '#7A1C20' }}>Rose Bruintjies After School Learning Center</div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#64748b' }}>
                              Rose B ALC Board<br />Academic Registry
                            </div>
                          </div>

                          {/* Letterhead Footer */}
                          <div style={{
                            marginTop: '32px', borderTop: '2px solid #7A1C20', paddingTop: '10px',
                            fontSize: '0.68rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
                          }}>
                            <div>
                              <strong>Rose Bruintjies After School Learning Center (Pty) Ltd</strong><br/>
                              CIPC Reg No: 2026/611870/07 | SARS Tax Ref: 9161805297
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              Kariega, Eastern Cape<br/>
                              Tel / WhatsApp: 076 423 7821
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              Confidential Academic Document<br/>
                              Official System Record
                            </div>
                          </div>
                          <div style={{ height: '4px', background: '#7A1C20', marginTop: '6px' }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 600px) {
          .filters-wrapper {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 12px 16px !important;
          }
          .filters-wrapper > div:last-child {
            width: 100% !important;
          }
          .filters-wrapper input {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

