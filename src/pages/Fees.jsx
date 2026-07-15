import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { Check, ShieldAlert, ChevronRight } from 'lucide-react';

export default function Fees({ setCurrentPage }) {
  const [pricing, setPricing] = useState({});

  useEffect(() => {
    const fetchPricing = async () => {
      const data = await db.getPricing();
      setPricing(data);
    };
    fetchPricing();
  }, []);

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
          <span className="meta-tag">[ SEC. 01 / TUITION INVESTMENT ]</span>
          <h1 style={{ fontSize: '2.8rem', margin: 0, color: 'var(--primary)' }}>Fees & Rates</h1>
          <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--secondary)', margin: '12px auto 0' }}></div>
        </div>
      </section>

      {/* Promo Banner block */}
      {pricing.promoBannerActive && (
        <section style={{ padding: '48px 0 0 0' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <div style={{
              backgroundColor: 'var(--secondary)',
              border: '1px solid var(--secondary)',
              borderRadius: 'var(--radius-sm)',
              padding: '32px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)',
              position: 'relative'
            }}>
              <span style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--primary)',
                padding: '4px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '12px'
              }}>Special Introductory Offer</span>

              <h3 style={{ color: 'var(--white)', fontSize: '1.65rem', marginBottom: '8px' }}>
                First 20 Upgrade Applicants
              </h3>

              <p style={{
                color: 'var(--white)',
                fontWeight: 500,
                fontSize: '1.1rem',
                maxWidth: '600px',
                margin: '0 auto',
                opacity: 0.95
              }}>
                {pricing.promoBannerText || "Receive R200 OFF for the first two months of enrollment!"}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Rates Grid */}
      <section className="section">
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div className="grid-2">

            {/* Standard Tuition Card */}
            <div className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '3px double var(--primary)',
              padding: '44px'
            }}>
              <div>
                <span className="tag tag-secondary" style={{ marginBottom: '16px', display: 'inline-block' }}>
                  Standard Support
                </span>

                <h3 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Standard Tuition</h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '2.8rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                    R{pricing.hourlyRate || 50}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>/ hour</span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '28px', lineHeight: '1.65' }}>
                  Ideal for regular after-school homework consolidation, topic explanation revision, and continuous study.
                </p>

                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '32px'
                }}>
                  {["Pay only for attended hours", "Grade-specific support", "CAPS ATP synchronization", "Direct educator feedback"].map((f, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                      <Check size={15} style={{ color: 'var(--secondary)' }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className="btn btn-outline"
                style={{ width: '100%' }}
                onClick={() => setCurrentPage('admissions')}
              >
                Apply for Support
              </button>
            </div>

            {/* Rewrite Card */}
            <div className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '3px double var(--secondary)',
              padding: '44px',
              position: 'relative'
            }}>
              <span className="tag tag-accent" style={{ position: 'absolute', top: '24px', right: '28px' }}>
                BEST VALUE
              </span>

              <div>
                <span className="tag tag-secondary" style={{ marginBottom: '16px', display: 'inline-block' }}>
                  NSC Upgrade
                </span>

                <h3 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Rewrite Programme</h3>

                {/* UJ styled matrix card */}
                <div style={{
                  backgroundColor: 'var(--bg-alt)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '24px',
                  marginBottom: '24px'
                }}>
                  {/* Row 1 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '12px',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <h5 style={{ fontSize: '0.92rem', marginBottom: '2px', fontWeight: 600 }}>Monthly Installment</h5>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Paid across six months</span>
                    </div>
                    <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>
                      R{pricing.rewriteMonthly || 800}<span style={{ fontSize: '0.8rem', fontWeight: 500 }}>/mo</span>
                    </span>
                  </div>

                  {/* Row 2 */}
                  <div style={{ display: 'flex', justify: 'space-between', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h5 style={{ fontSize: '0.92rem', marginBottom: '2px', fontWeight: 600 }}>Once-Off Package (Optional)</h5>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Upfront single payment</span>
                    </div>
                    <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--secondary)' }}>
                      R{pricing.rewriteOnceOff || 3500}<span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through', display: 'block', textAlign: 'right', fontWeight: 500 }}>R4 800</span>
                    </span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '28px', lineHeight: '1.65' }}>
                  Intensive structured program focusing specifically on exam rewrites, past papers, diagnostic feedback, and Paper 1 & 2 preparation.
                </p>

                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '32px'
                }}>
                  {["Complete curriculum coverage", "Paper 1 & 2 diagnostic assessments", "Save up to R1300 with once-off"].map((f, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                      <Check size={15} style={{ color: 'var(--accent-hover)' }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => setCurrentPage('admissions')}
              >
                Apply for Upgrade
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Policies Block */}
      <section className="section-alt" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card" style={{ padding: '40px', borderTop: '3px double var(--primary)' }}>
            <h4 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--primary)',
              marginBottom: '24px'
            }}>
              <ShieldAlert size={20} style={{ color: 'var(--secondary)' }} /> Important Billing Policies
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
              fontSize: '0.88rem',
              color: 'var(--text)',
              lineHeight: '1.65'
            }} className="policies-grid">
              <div>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li><strong>Monthly Deadlines:</strong> Fees are due strictly in advance, between the end of the previous month and the 6th day of the current month.</li>
                  <li><strong>Commitment:</strong> Upgrading candidates commit to the full 6-month revision duration.</li>
                  <li><strong>Refunds:</strong> Payments are non-refundable to maintain our fixed seat allocations.</li>
                </ul>
              </div>
              <div>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li><strong>Forfeiture:</strong> Missed sessions due to learner absence are the learner's responsibility.</li>
                  <li><strong>Cancellations:</strong> If Rose B ALC has to cancel a class, a replacement time slot will be formally scheduled.</li>
                  <li><strong>Exceptions:</strong> Absences due to serious medical issues are evaluated upon doctor's certificate.</li>
                </ul>
              </div>
            </div>

            <div style={{
              marginTop: '32px',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '24px',
              textAlign: 'center'
            }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--secondary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
                onClick={() => setCurrentPage('terms')}
              >
                Read Full Contract Conditions <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 600px) {
          .policies-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

