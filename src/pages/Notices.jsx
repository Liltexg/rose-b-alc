// Powered by OrbXech Design Studio
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
      <html>
        <head>
          <title>${notice.title}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #2B2B2B; line-height: 1.6; }
            .letter { border: 1px solid #CCCCCC; padding: 40px; max-width: 700px; margin: 0 auto; position:relative; }
            .letter::before { content:''; position:absolute; top:0; left:0; right:0; height:6px; background-color:#E55B13; }
            .header { border-bottom: 3px double #1E2022; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
            .title { text-align: center; text-transform: uppercase; font-size: 1.4rem; margin-bottom: 24px; text-decoration: underline; font-weight: bold; }
            .body { white-space: pre-line; margin-bottom: 40px; font-size: 0.95rem; }
            .footer { border-top: 1px solid #EEEEEE; padding-top: 20px; font-size: 0.9rem; color: #666666; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="letter">
            <div class="header">
              <div>
                <h2 style="margin: 0; color: #1E2022; font-size: 1.3rem; font-family:'Cormorant Garamond';">ROSE BRUINTJIES</h2>
                <h4 style="margin: 0; color: #E55B13; font-size: 0.75rem; letter-spacing: 1px;">AFTER SCHOOL LEARNING CENTER</h4>
              </div>
              <div style="text-align: right; font-size: 0.8rem; color:#666666;">
                <strong>Date:</strong> ${new Date(notice.date).toLocaleDateString('en-ZA')}<br>
                <strong>Ref:</strong> NOTICE-${notice.id.toUpperCase()}
              </div>
            </div>
            <div class="title">${notice.title}</div>
            <div class="body">${notice.body}</div>
            <div class="footer">
              <div><strong>Issued by:</strong> ${notice.author}</div>
              <div>Rose B ALC Board</div>
            </div>
          </div>
          <script>window.print();</script>
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
                        <div className="notice-letter" style={{ boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-sm)' }}>
                          {/* Letterhead Logo Header */}
                          <div className="notice-letter-header">
                            <div className="notice-letter-logo">
                              <img src="/logo.png" alt="Rose B ALC" style={{ height: '48px', objectFit: 'contain' }} />
                              <div>
                                <h3 style={{ fontSize: '1.2rem', lineHeight: '1.1', color: 'var(--primary)' }}>ROSE BRUINTJIES</h3>
                                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--secondary)', letterSpacing: '0.05em' }}>AFTER SCHOOL LEARNING CENTER</span>
                              </div>
                            </div>
                            
                            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              <strong>Date:</strong> {new Date(notice.date).toLocaleDateString('en-ZA')}<br />
                              <strong>Ref:</strong> NOTICE-{notice.id.toUpperCase()}
                            </div>
                          </div>

                          {/* Letter Title */}
                          <div className="notice-letter-title">
                            {notice.title}
                          </div>

                          {/* Letter Content */}
                          <div className="notice-letter-body">
                            {notice.body}
                          </div>

                          {/* Letter Footer */}
                          <div className="notice-letter-footer">
                            <div>
                              <strong>Issued By:</strong> {notice.author}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <strong>Rose B ALC Board</strong><br />
                              Academic Registry
                            </div>
                          </div>
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

