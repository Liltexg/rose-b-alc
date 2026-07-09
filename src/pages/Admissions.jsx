// Powered by OrbXech Design Studio
import React, { useState, useRef, useEffect } from 'react';
import { db } from '../services/db';
import { AlertCircle, CheckCircle, ArrowRight, RotateCcw, FileSignature } from 'lucide-react';

export default function Admissions({ setCurrentPage }) {
  const [programme, setProgramme] = useState('Grade 12');
  const [formData, setFormData] = useState({
    parentName: '',
    parentSurname: '',
    parentContact: '',
    parentAddress: '',
    learnerName: '',
    learnerSurname: '',
    learnerPhone: '',
    learnerAddress: '',
    emergencyContact: '',
    learnerGrade: 'Grade 12',
    learnerSubjects: [],
    consentTerms: false,
    consentPhotos: false,
    consentCorrect: false
  });

  const [signatureType, setSignatureType] = useState('draw'); // 'draw' or 'type'
  const [typedSignature, setTypedSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasHasDrawing, setCanvasHasDrawing] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState(null);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    if (signatureType === 'draw' && canvasRef.current && !submitSuccess) {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement.clientWidth || 400;
      canvas.height = 150;
      
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#1E2022';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctxRef.current = ctx;
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [signatureType, submitSuccess]);

  const subjectOptions = [
    "Life Sciences",
    "Physical Sciences",
    "Mathematics",
    "English First Additional Language (FAL)"
  ];

  const handleSubjectChange = (subject) => {
    const current = [...formData.learnerSubjects];
    if (current.includes(subject)) {
      setFormData({
        ...formData,
        learnerSubjects: current.filter(s => s !== subject)
      });
    } else {
      setFormData({
        ...formData,
        learnerSubjects: [...current, subject]
      });
    }
  };

  const startDrawing = (e) => {
    if (!ctxRef.current) return;
    setIsDrawing(true);
    const coords = getCanvasCoords(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(coords.x, coords.y);
  };

  const draw = (e) => {
    if (!isDrawing || !ctxRef.current) return;
    const coords = getCanvasCoords(e);
    ctxRef.current.lineTo(coords.x, coords.y);
    ctxRef.current.stroke();
    setCanvasHasDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const clearCanvas = () => {
    if (!canvasRef.current || !ctxRef.current) return;
    const canvas = canvasRef.current;
    ctxRef.current.fillStyle = '#FFFFFF';
    ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
    setCanvasHasDrawing(false);
  };

  const validateForm = () => {
    const errors = [];
    
    if (programme === 'Grade 12') {
      if (!formData.parentName.trim()) errors.push("Parent First Name is required");
      if (!formData.parentSurname.trim()) errors.push("Parent Surname is required");
      if (!formData.parentContact.trim()) errors.push("Parent Contact Number is required");
      if (!formData.parentAddress.trim()) errors.push("Parent Physical Address is required");
      if (!formData.learnerName.trim()) errors.push("Learner First Name is required");
      if (!formData.learnerSurname.trim()) errors.push("Learner Surname is required");
      if (formData.learnerSubjects.length === 0) errors.push("Select at least one subject for tutoring");
    } else {
      if (!formData.learnerName.trim()) errors.push("Candidate First Name is required");
      if (!formData.learnerSurname.trim()) errors.push("Candidate Surname is required");
      if (!formData.learnerPhone.trim()) errors.push("Candidate Contact Number is required");
      if (!formData.learnerAddress.trim()) errors.push("Candidate Physical Address is required");
      if (!formData.emergencyContact.trim()) errors.push("Emergency Contact Details are required");
    }

    if (!formData.consentTerms) errors.push("You must accept the Terms and Conditions to proceed");
    if (!formData.consentCorrect) errors.push("You must confirm that the provided information is correct");

    if (signatureType === 'draw' && !canvasHasDrawing) {
      errors.push("Please draw your signature in the designated box");
    } else if (signatureType === 'type' && !typedSignature.trim()) {
      errors.push("Please type your electronic signature");
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }

    let signatureRepresentation = '';
    if (signatureType === 'draw') {
      try {
        signatureRepresentation = canvasRef.current.toDataURL('image/png');
      } catch (err) {
        signatureRepresentation = 'Drawn Signature (Image)';
      }
    } else {
      signatureRepresentation = typedSignature;
    }

    const applicationRecord = {
      programme,
      parentName: programme === 'Grade 12' ? formData.parentName : '',
      parentSurname: programme === 'Grade 12' ? formData.parentSurname : '',
      parentContact: programme === 'Grade 12' ? formData.parentContact : '',
      parentAddress: programme === 'Grade 12' ? formData.parentAddress : '',
      learnerName: formData.learnerName,
      learnerSurname: formData.learnerSurname,
      learnerPhone: programme === 'Rewrite / Upgrade' ? formData.learnerPhone : '',
      learnerAddress: programme === 'Rewrite / Upgrade' ? formData.learnerAddress : '',
      emergencyContact: programme === 'Rewrite / Upgrade' ? formData.emergencyContact : '',
      learnerGrade: programme === 'Grade 12' ? formData.learnerGrade : 'FET Rewrite',
      learnerSubjects: programme === 'Grade 12' ? formData.learnerSubjects : ['Matric Rewrite Syllabus'],
      consentTerms: formData.consentTerms,
      consentPhotos: formData.consentPhotos,
      consentCorrect: formData.consentCorrect,
      signature: signatureRepresentation
    };

    const saved = db.addApplication(applicationRecord);
    setSubmittedDetails(saved);
    setSubmitSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <span style={{
            color: 'var(--secondary)',
            fontWeight: 700,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '6px'
          }}>Admissions</span>
          <h1 style={{ fontSize: '2.8rem', margin: 0, color: 'var(--primary)' }}>Online Application</h1>
          <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--secondary)', margin: '12px auto 0' }}></div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          
          {submitSuccess ? (
            /* Success confirmation card */
            <div className="card animated" style={{
              borderTop: '6px solid var(--secondary)',
              padding: '48px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(229, 91, 19, 0.08)',
                color: 'var(--secondary)',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <CheckCircle size={36} />
              </div>
              
              <h2 style={{ marginBottom: '16px', fontSize: '2.2rem' }}>Application Submitted</h2>
              <p style={{ color: 'var(--text)', fontSize: '1.05rem', marginBottom: '8px', fontWeight: 600 }}>
                Thank you, {submittedDetails?.programme === 'Grade 12' ? submittedDetails.parentName : submittedDetails?.learnerName}.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px', lineHeight: '1.65' }}>
                Your application for the <strong>{submittedDetails?.programme}</strong> is successfully received. 
                Our admissions hub will review and contact you within 2 working days.
              </p>

              {/* Summary details */}
              <div style={{
                backgroundColor: 'var(--bg-alt)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '28px',
                textAlign: 'left',
                marginBottom: '32px'
              }}>
                <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '14px' }}>
                  Application Record:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '10px', fontSize: '0.9rem' }}>
                  <strong>Reference ID:</strong> <span>{submittedDetails?.id}</span>
                  <strong>Programme:</strong> <span>{submittedDetails?.programme}</span>
                  <strong>Learner Name:</strong> <span>{submittedDetails?.learnerName} {submittedDetails?.learnerSurname}</span>
                  {submittedDetails?.programme === 'Grade 12' && (
                    <>
                      <strong>Parent Phone:</strong> <span>{submittedDetails?.parentContact}</span>
                      <strong>Subjects:</strong> <span>{submittedDetails?.learnerSubjects.join(', ')}</span>
                    </>
                  )}
                  {submittedDetails?.programme === 'Rewrite / Upgrade' && (
                    <>
                      <strong>Candidate Phone:</strong> <span>{submittedDetails?.learnerPhone}</span>
                      <strong>Emergency details:</strong> <span>{submittedDetails?.emergencyContact}</span>
                    </>
                  )}
                  <strong>Submission Date:</strong> <span>{new Date(submittedDetails?.dateSubmitted).toLocaleString('en-ZA')}</span>
                  <strong>Status:</strong> <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{submittedDetails?.status}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setCurrentPage('home')}
                >
                  Return Home
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={() => {
                    setSubmitSuccess(false);
                    setCanvasHasDrawing(false);
                    setFormData({
                      parentName: '', parentSurname: '', parentContact: '', parentAddress: '',
                      learnerName: '', learnerSurname: '', learnerPhone: '', learnerAddress: '',
                      emergencyContact: '', learnerGrade: 'Grade 12', learnerSubjects: [],
                      consentTerms: false, consentPhotos: false, consentCorrect: false
                    });
                  }}
                >
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            /* Application Form Wizard */
            <form onSubmit={handleSubmit} className="card" style={{ padding: '48px', borderTop: '4px solid var(--secondary)' }}>
              
              {/* Errors container */}
              {formErrors.length > 0 && (
                <div style={{
                  backgroundColor: 'rgba(229, 91, 19, 0.05)',
                  border: '1px solid rgba(229, 91, 19, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 20px',
                  marginBottom: '32px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', fontWeight: 700, marginBottom: '8px', fontSize: '0.9rem' }}>
                    <AlertCircle size={16} />
                    <span>Please correct the following fields:</span>
                  </div>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.82rem', color: 'var(--secondary)' }}>
                    {formErrors.map((err, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Program selection radio buttons */}
              <div className="form-group" style={{ marginBottom: '40px' }}>
                <span className="form-label">Choose Enrolling Programme*</span>
                <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
                  <label className="form-radio">
                    <input 
                      type="radio" 
                      name="programme" 
                      checked={programme === 'Grade 12'} 
                      onChange={() => setProgramme('Grade 12')}
                      style={{ accentColor: 'var(--secondary)', width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: programme === 'Grade 12' ? 700 : 400 }}>Grade 12 Support</span>
                  </label>
                  <label className="form-radio">
                    <input 
                      type="radio" 
                      name="programme" 
                      checked={programme === 'Rewrite / Upgrade'} 
                      onChange={() => setProgramme('Rewrite / Upgrade')}
                      style={{ accentColor: 'var(--secondary)', width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: programme === 'Rewrite / Upgrade' ? 700 : 500 }}>Rewrite Upgrade</span>
                  </label>
                </div>
              </div>

              {/* ================= GRADE 12 SUPPORT FORM FIELDS ================= */}
              {programme === 'Grade 12' && (
                <div className="animated">
                  <h4 style={{ color: 'var(--secondary)', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    Parent / Guardian Information
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="sub-grid-mobile">
                    <div className="form-group">
                      <label className="form-label">Parent First Name*</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.parentName}
                        onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                        placeholder="John"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Parent Surname*</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.parentSurname}
                        onChange={(e) => setFormData({...formData, parentSurname: e.target.value})}
                        placeholder="Dube"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Parent Contact Number*</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      value={formData.parentContact}
                      onChange={(e) => setFormData({...formData, parentContact: e.target.value})}
                      placeholder="082 123 4567"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Physical Address*</label>
                    <textarea 
                      className="form-control" 
                      rows="2"
                      value={formData.parentAddress}
                      onChange={(e) => setFormData({...formData, parentAddress: e.target.value})}
                      placeholder="Street name, suburb, city"
                    ></textarea>
                  </div>

                  <h4 style={{ color: 'var(--secondary)', marginTop: '32px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    Learner Information
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="sub-grid-mobile">
                    <div className="form-group">
                      <label className="form-label">Learner First Name*</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.learnerName}
                        onChange={(e) => setFormData({...formData, learnerName: e.target.value})}
                        placeholder="Sipho"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Learner Surname*</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.learnerSurname}
                        onChange={(e) => setFormData({...formData, learnerSurname: e.target.value})}
                        placeholder="Dube"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Grade level*</label>
                    <select 
                      className="form-control" 
                      value={formData.learnerGrade}
                      onChange={(e) => setFormData({...formData, learnerGrade: e.target.value})}
                    >
                      <option value="Grade 12">Grade 12 (Matric)</option>
                      <option value="Grade 11">Grade 11 (FET Entry)</option>
                      <option value="Grade 10">Grade 10</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Select Subjects Requiring Support (Select all)*</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                      {subjectOptions.map((subj, idx) => (
                        <label key={idx} className="form-checkbox" style={{ fontWeight: 500 }}>
                          <input 
                            type="checkbox" 
                            checked={formData.learnerSubjects.includes(subj)}
                            onChange={() => handleSubjectChange(subj)}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span>{subj}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= REWRITE / UPGRADE FORM FIELDS ================= */}
              {programme === 'Rewrite / Upgrade' && (
                <div className="animated">
                  <h4 style={{ color: 'var(--secondary)', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    Candidate Information (NSC Upgrader)
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="sub-grid-mobile">
                    <div className="form-group">
                      <label className="form-label">Candidate First Name*</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.learnerName}
                        onChange={(e) => setFormData({...formData, learnerName: e.target.value})}
                        placeholder="Amanda"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Candidate Surname*</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.learnerSurname}
                        onChange={(e) => setFormData({...formData, learnerSurname: e.target.value})}
                        placeholder="Naidoo"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Candidate Contact Number*</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      value={formData.learnerPhone}
                      onChange={(e) => setFormData({...formData, learnerPhone: e.target.value})}
                      placeholder="073 987 6543"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Physical Address*</label>
                    <textarea 
                      className="form-control" 
                      rows="2"
                      value={formData.learnerAddress}
                      onChange={(e) => setFormData({...formData, learnerAddress: e.target.value})}
                      placeholder="Street name, suburb, city"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Emergency Contact Name & Phone*</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      placeholder="Devi Naidoo (Mother) - 083 456 7890"
                    />
                  </div>
                </div>
              )}

              {/* ================= CONSENTS ================= */}
              <h4 style={{ color: 'var(--secondary)', marginTop: '36px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                Consent & Contract
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
                <label className="form-checkbox">
                  <input 
                    type="checkbox" 
                    checked={formData.consentTerms}
                    onChange={(e) => setFormData({...formData, consentTerms: e.target.checked})}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>I accept the <a onClick={() => setCurrentPage('terms')} style={{ cursor: 'pointer' }}>Terms and Conditions</a> (six-month commitment, billing rules, no-refunds).*</span>
                </label>

                <label className="form-checkbox">
                  <input 
                    type="checkbox" 
                    checked={formData.consentPhotos}
                    onChange={(e) => setFormData({...formData, consentPhotos: e.target.checked})}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>I give permission for Rose B ALC to use photos of the learner for marketing and notices.</span>
                </label>

                <label className="form-checkbox">
                  <input 
                    type="checkbox" 
                    checked={formData.consentCorrect}
                    onChange={(e) => setFormData({...formData, consentCorrect: e.target.checked})}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>I confirm the information provided is correct.*</span>
                </label>
              </div>

              {/* ================= DIGITAL SIGNATURE ================= */}
              <div className="form-group" style={{ marginBottom: '40px' }}>
                <span className="form-label">Digital Signature Assent*</span>
                
                {/* Toggle option */}
                <div style={{ display: 'flex', gap: '16px', margin: '8px 0 16px' }}>
                  <button 
                    type="button" 
                    className={`btn ${signatureType === 'draw' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '8px 18px', fontSize: '0.78rem' }}
                    onClick={() => setSignatureType('draw')}
                  >
                    Draw Signature
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${signatureType === 'type' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '8px 18px', fontSize: '0.78rem' }}
                    onClick={() => setSignatureType('type')}
                  >
                    Type Signature
                  </button>
                </div>

                {signatureType === 'draw' ? (
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                      touchAction: 'none'
                    }}>
                      <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        style={{ display: 'block', width: '100%', cursor: 'crosshair' }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Use mouse or touch pad to sign inside the border.</span>
                      <button 
                        type="button" 
                        onClick={clearCanvas}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.78rem',
                          fontWeight: 600
                        }}
                      >
                        <RotateCcw size={12} /> Clear Canvas
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input 
                      type="text" 
                      className="form-control"
                      value={typedSignature}
                      onChange={(e) => setTypedSignature(e.target.value)}
                      placeholder="Type full legal name (e.g. John Albert Dube)"
                      style={{ fontStyle: 'italic', fontFamily: 'var(--font-heading)' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                      Typing your name serves as a binding electronic affirmation.
                    </span>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-secondary" 
                style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center', padding: '14px' }}
              >
                Submit Application <ArrowRight size={16} />
              </button>
            </form>
          )}

        </div>
      </section>

      <style>{`
        @media (max-width: 600px) {
          .sub-grid-mobile {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

