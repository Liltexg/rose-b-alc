// Powered by OrbXech Design Studio
import React from 'react';
import { ShieldCheck, ScrollText } from 'lucide-react';

export default function Terms() {
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
          }}>Legal Framework</span>
          <h1 style={{ fontSize: '2.8rem', margin: 0, color: 'var(--primary)' }}>Terms & Conditions</h1>
          <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--secondary)', margin: '12px auto 0' }}></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card" style={{ padding: '48px', lineHeight: '1.8' }}>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderBottom: '3px double var(--primary)',
              paddingBottom: '16px',
              marginBottom: '28px'
            }}>
              <ScrollText size={28} style={{ color: 'var(--secondary)' }} />
              <h3 style={{ margin: 0 }}>Rose B ALC Academic Contract</h3>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Last updated: July 2026. These terms govern the relationship between Rose Bruintjies After School Learning Center (referred to as "Rose B ALC") and the parent, guardian, or adult learner applying for academic support.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>1. Upgrade Commitment</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text)' }}>
                  Enrollment in the Rewrite Upgrade Programme requires an intensive **six-month commitment**. This duration is established to guarantee complete curriculum coverage and past-paper mock trials. Early withdrawals do not absolve the obligor of monthly fees.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>2. Tuition Fees & Due Dates</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text)' }}>
                  All fees are payable strictly in advance. Payments must be settled between the **last day of the previous month** and the **6th day of the current month**. A late payment interest rate may apply if fees remain unpaid.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>3. No Refund Policy</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text)' }}>
                  To maintain small class sizes, we reserve seat space exclusively for enrolled learners. Consequently, all fees paid to Rose B ALC are **non-refundable**.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>4. Attendance & Missed Sessions</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text)' }}>
                  Regular attendance is compulsory for academic progression. If a learner misses a scheduled session, the session is forfeited, and make-up classes are not guaranteed. However, in cases of severe medical emergency, accommodations will be evaluated upon submission of a valid medical practitioner's certificate.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>5. Class Cancellations by the Center</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text)' }}>
                  In the rare event that Rose B ALC has to cancel a class due to educator illness or force majeure (such as utility blackouts), a replacement class slot will be arranged at no additional cost.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>6. Photograph & Media Usage</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text)' }}>
                  Parents/guardians grant Rose B ALC permission to take photographs or record video during classroom activities. These materials may be used solely for educational marketing, notice newsletters, and official website updates.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>7. POPIA Compliance & Privacy</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text)' }}>
                  In accordance with the Protection of Personal Information Act (POPIA) of South Africa, Rose B ALC is committed to protecting applicant privacy. All information submitted on this website is encrypted and processed securely. It will be used solely for internal academic evaluation, billing, and direct parental communication, and will never be shared with third parties.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>8. Learner Code of Conduct</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text)' }}>
                  Learners are expected to maintain respect, discipline, and academic honesty. Disruptive behavior, failure to complete homework, or academic dishonesty will result in disciplinary reviews and potential suspension from the center.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>9. Payment Methods & Banking details</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text)' }}>
                  Payments can be made via Electronic Funds Transfer (EFT) or cash deposit. Official banking details will be provided in writing to parents during the formal intake interview meeting.
                </p>
              </div>
            </div>

            <div style={{
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <ShieldCheck size={24} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                By submitting an online application, you legally agree to adhere to these academic conditions.
              </span>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

