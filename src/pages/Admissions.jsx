import React, { useState, useRef, useEffect } from 'react';
import { db } from '../services/db';
import { AlertCircle, CheckCircle, ArrowRight, RotateCcw, FileSignature } from 'lucide-react';

const WEB3FORMS_KEY = '068cd66b-3f71-4347-9986-fedf727330aa';

export default function Admissions({ setCurrentPage }) {
  const [programme, setProgramme] = useState('Grade 12');
  const [formData, setFormData] = useState({
    parentName: '',
    parentSurname: '',
    parentContact: '',
    parentEmail: '',
    parentAddress: '',
    learnerName: '',
    learnerSurname: '',
    learnerPhone: '',
    learnerEmail: '',
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
  const [submitLoading, setSubmitLoading] = useState(false);
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
    { label: "Life Sciences", available: true },
    { label: "Mathematical Literacy", available: false },
    { label: "Mathematics", available: false },
    { label: "Physical Sciences", available: false },
    { label: "English First Additional Language (FAL)", available: false }
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (programme === 'Grade 12') {
      if (!formData.parentName.trim()) errors.push("Parent First Name is required");
      if (!formData.parentSurname.trim()) errors.push("Parent Surname is required");
      if (!formData.parentContact.trim()) errors.push("Parent Contact Number is required");
      if (!formData.parentEmail.trim()) errors.push("Parent Email Address is required");
      else if (!emailRegex.test(formData.parentEmail)) errors.push("Please enter a valid parent email address");

      if (!formData.learnerName.trim()) errors.push("Learner First Name is required");
      if (!formData.learnerSurname.trim()) errors.push("Learner Surname is required");
      if (formData.learnerSubjects.length === 0) errors.push("Select at least one subject for tutoring");
    } else {
      if (!formData.learnerName.trim()) errors.push("Candidate First Name is required");
      if (!formData.learnerSurname.trim()) errors.push("Candidate Surname is required");
      if (!formData.learnerPhone.trim()) errors.push("Candidate Contact Number is required");
      if (!formData.learnerEmail.trim()) errors.push("Candidate Email Address is required");
      else if (!emailRegex.test(formData.learnerEmail)) errors.push("Please enter a valid candidate email address");
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

  const handleSubmit = async (e) => {
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
      parentEmail: programme === 'Grade 12' ? formData.parentEmail : '',
      parentAddress: programme === 'Grade 12' ? formData.parentAddress : '',
      learnerName: formData.learnerName,
      learnerSurname: formData.learnerSurname,
      learnerPhone: programme === 'Rewrite / Upgrade' ? formData.learnerPhone : '',
      learnerEmail: programme === 'Rewrite / Upgrade' ? formData.learnerEmail : '',
      learnerAddress: programme === 'Rewrite / Upgrade' ? formData.learnerAddress : '',
      emergencyContact: programme === 'Rewrite / Upgrade' ? formData.emergencyContact : '',
      learnerGrade: programme === 'Grade 12' ? formData.learnerGrade : 'FET Rewrite',
      learnerSubjects: programme === 'Grade 12' ? formData.learnerSubjects : ['Matric Rewrite Syllabus'],
      consentTerms: formData.consentTerms,
      consentPhotos: formData.consentPhotos,
      consentCorrect: formData.consentCorrect,
      signature: signatureRepresentation
    };

    setSubmitLoading(true);

    try {
      const applicantEmail = programme === 'Grade 12' ? formData.parentEmail : formData.learnerEmail;
      const emailContent = `New Admission Application — ${programme}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPLICANT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Learner: ${applicationRecord.learnerName} ${applicationRecord.learnerSurname}
Grade: ${applicationRecord.learnerGrade}
Programme: ${programme}
Subjects: ${applicationRecord.learnerSubjects.join(', ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${programme === 'Grade 12' ? 'PARENT / GUARDIAN DETAILS' : 'CANDIDATE CONTACT DETAILS'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${programme === 'Grade 12'
          ? `Name: ${formData.parentName} ${formData.parentSurname}\nPhone: ${formData.parentContact}\nEmail: ${formData.parentEmail}\nAddress: ${formData.parentAddress}`
          : `Phone: ${formData.learnerPhone}\nEmail: ${formData.learnerEmail}\nAddress: ${formData.learnerAddress}\nEmergency Contact: ${formData.emergencyContact}`
        }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONSENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Terms & Conditions: Yes
Media/Photos: ${applicationRecord.consentPhotos ? 'Yes' : 'No'}
Information Correct: Yes
Signature: ${signatureType === 'type' ? applicationRecord.signature : '[Drawn — Image Data]'}`;

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Application: ${applicationRecord.learnerName} ${applicationRecord.learnerSurname} — ${programme}`,
          name: `${applicationRecord.learnerName} ${applicationRecord.learnerSurname}`,
          email: applicantEmail,
          message: emailContent
        })
      });

      const data = await res.json();

      if (data.success) {
        const saved = await db.addApplication(applicationRecord);
        setSubmittedDetails(saved);
        setSubmitSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setFormErrors(['Failed to send application. Please try again.']);
        window.scrollTo({ top: 200, behavior: 'smooth' });
      }
    } catch {
      setFormErrors(['Network error. Please check your connection.']);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } finally {
      setSubmitLoading(false);
    }
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
                      parentName: '', parentSurname: '', parentContact: '', parentEmail: '', parentAddress: '',
                      learnerName: '', learnerSurname: '', learnerPhone: '', learnerEmail: '', learnerAddress: '',
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
            <form onSubmit={handleSubmit} className="card admissions-form-card" style={{ padding: '48px', borderTop: '4px solid var(--secondary)' }}>

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
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        placeholder="Sarah"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Parent Surname*</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.parentSurname}
                        onChange={(e) => setFormData({ ...formData, parentSurname: e.target.value })}
                        placeholder="Carelse"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="sub-grid-mobile">
                    <div className="form-group">
                      <label className="form-label">Parent Contact Number*</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.parentContact}
                        onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
                        placeholder="082 123 4567"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Parent Email Address*</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.parentEmail}
                        onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                        placeholder="parent@email.com"
                      />
                    </div>
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
                        onChange={(e) => setFormData({ ...formData, learnerName: e.target.value })}
                        placeholder="Sipho"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Learner Surname*</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.learnerSurname}
                        onChange={(e) => setFormData({ ...formData, learnerSurname: e.target.value })}
                        placeholder="Fortuin"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Grade level*</label>
                    <select
                      className="form-control"
                      value={formData.learnerGrade}
                      onChange={(e) => setFormData({ ...formData, learnerGrade: e.target.value })}
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
                        <label key={idx} className="form-checkbox" style={{
                          fontWeight: 500,
                          opacity: subj.available ? 1 : 0.55,
                          cursor: subj.available ? 'pointer' : 'not-allowed'
                        }}>
                          <input
                            type="checkbox"
                            checked={formData.learnerSubjects.includes(subj.label)}
                            onChange={() => subj.available && handleSubjectChange(subj.label)}
                            disabled={!subj.available}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {subj.label}
                            {!subj.available && (
                              <span style={{
                                fontSize: '0.62rem',
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                backgroundColor: 'var(--secondary)',
                                color: 'var(--white)',
                                padding: '2px 8px',
                                borderRadius: '4px'
                              }}>
                                Coming Soon
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                      Coming soon subjects are not yet available. You will be notified when they open for enrolment.
                    </p>
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
                        onChange={(e) => setFormData({ ...formData, learnerName: e.target.value })}
                        placeholder="Amanda"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Candidate Surname*</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.learnerSurname}
                        onChange={(e) => setFormData({ ...formData, learnerSurname: e.target.value })}
                        placeholder="Naidoo"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="sub-grid-mobile">
                    <div className="form-group">
                      <label className="form-label">Candidate Contact Number*</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.learnerPhone}
                        onChange={(e) => setFormData({ ...formData, learnerPhone: e.target.value })}
                        placeholder="073 987 6543"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Candidate Email Address*</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.learnerEmail}
                        onChange={(e) => setFormData({ ...formData, learnerEmail: e.target.value })}
                        placeholder="candidate@email.com"
                      />
                    </div>
                  </div>



                  <div className="form-group">
                    <label className="form-label">Emergency Contact Name &amp; Phone*</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      placeholder="Devi Naidoo (Mother) - 083 456 7890"
                    />
                  </div>
                </div>
              )}
              <div style={{
                marginTop: '48px',
                border: '1px solid var(--border-color)',
                borderTop: '3px solid var(--primary)'
              }}>
                {/* Contract Header */}
                <div style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--white)',
                  padding: '20px 28px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.7, marginBottom: '4px' }}>Rose Bruintjies After School Learning Centre</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>ENROLMENT AGREEMENT AND CONSENT DECLARATION</div>
                  </div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.6, textAlign: 'right' }}>
                    <div>Document Ref: RB-ALC/ENR</div>
                    <div>Rev. 2025.1</div>
                  </div>
                </div>

                {/* Preamble */}
                <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-alt)' }}>
                  <p style={{ fontSize: '0.82rem', lineHeight: '1.75', color: 'var(--text-muted)', margin: 0 }}>
                    This Agreement is entered into between <strong style={{ color: 'var(--text)' }}>Rose Bruintjies After School Learning Centre</strong> (hereinafter referred to as "the Centre") and the parent/guardian and/or learner completing this application form (hereinafter referred to as "the Applicant"). By submitting this application, the Applicant agrees to be bound by the terms and conditions set out herein.
                  </p>
                </div>

                {/* Clauses */}
                <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px', borderBottom: '1px solid var(--border-color)' }}>

                  <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: '12px', alignItems: 'start' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--secondary)', paddingTop: '2px' }}>1.</span>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Commitment Period</div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
                        The Applicant acknowledges and agrees to a minimum enrolment commitment of six (6) consecutive months from the date of acceptance. Early withdrawal does not negate outstanding fees accrued during the committed term.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: '12px', alignItems: 'start' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--secondary)', paddingTop: '2px' }}>2.</span>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment and Billing</div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
                        Tuition fees are due on or before the 1st of each calendar month. The Centre reserves the right to suspend access to sessions in the event that payment is not received within seven (7) days of the due date. A written reminder will be issued before suspension is enacted.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: '12px', alignItems: 'start' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--secondary)', paddingTop: '2px' }}>3.</span>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Refund Policy</div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
                        All fees paid are non-refundable once a session has commenced. In the event of a documented medical emergency, the Centre may, at its sole discretion, consider a credit carried forward to a future billing period.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: '12px', alignItems: 'start' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--secondary)', paddingTop: '2px' }}>4.</span>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Use of Photographic Material</div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
                        The Applicant consents to the Centre capturing and using photographs and/or video recordings of the learner for lawful academic, promotional, and institutional communication purposes, including but not limited to newsletters, the Centre's website, and social media platforms.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: '12px', alignItems: 'start' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--secondary)', paddingTop: '2px' }}>5.</span>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accuracy of Information</div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
                        The Applicant warrants that all information submitted in this application is true, accurate, and complete to the best of their knowledge. Any material misrepresentation may result in the immediate cancellation of the enrolment without refund.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: '12px', alignItems: 'start' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--secondary)', paddingTop: '2px' }}>6.</span>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Governing Law</div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
                        This Agreement shall be governed by and construed in accordance with the laws of the Republic of South Africa. Any dispute arising from this Agreement shall be subject to the jurisdiction of the Magistrates Court of the relevant district.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Acknowledgement Checkboxes */}
                <div style={{ padding: '20px 28px', backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '14px' }}>Applicant Acknowledgements</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label className="form-checkbox" style={{ fontSize: '0.8rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.consentTerms}
                        onChange={(e) => setFormData({ ...formData, consentTerms: e.target.checked })}
                        style={{ width: '15px', height: '15px', flexShrink: 0 }}
                      />
                      <span>I have read, understood, and agree to all terms set out in Clauses 1, 2, and 3 above, including the six-month commitment period, monthly billing obligations, and the non-refund policy. <strong>*</strong></span>
                    </label>
                    <label className="form-checkbox" style={{ fontSize: '0.8rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.consentPhotos}
                        onChange={(e) => setFormData({ ...formData, consentPhotos: e.target.checked })}
                        style={{ width: '15px', height: '15px', flexShrink: 0 }}
                      />
                      <span>I grant consent for the use of photographic material as described in Clause 4 of this Agreement.</span>
                    </label>
                    <label className="form-checkbox" style={{ fontSize: '0.8rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.consentCorrect}
                        onChange={(e) => setFormData({ ...formData, consentCorrect: e.target.checked })}
                        style={{ width: '15px', height: '15px', flexShrink: 0 }}
                      />
                      <span>I confirm under Clause 5 that all information submitted in this application is accurate and complete to the best of my knowledge. <strong>*</strong></span>
                    </label>
                  </div>
                </div>

                {/* Execution Block */}
                <div style={{ padding: '24px 28px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '16px' }}>Execution</div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
                    By signing below, the Applicant confirms that they have read this Agreement in full, understand its contents, and agree to be bound by its terms. This electronic signature shall have the same legal force and effect as a handwritten signature.
                  </p>

                  {/* Signature toggle */}
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <button
                      type="button"
                      className={`btn ${signatureType === 'draw' ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '8px 16px', fontSize: '0.75rem' }}
                      onClick={() => setSignatureType('draw')}
                    >
                      Draw Signature
                    </button>
                    <button
                      type="button"
                      className={`btn ${signatureType === 'type' ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '8px 16px', fontSize: '0.75rem' }}
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
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sign within the box using your mouse or touchpad.</span>
                        <button
                          type="button"
                          onClick={clearCanvas}
                          style={{
                            background: 'none', border: 'none',
                            color: 'var(--secondary)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center',
                            gap: '4px', fontSize: '0.75rem', fontWeight: 600
                          }}
                        >
                          <RotateCcw size={12} /> Clear
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
                        placeholder="Type full legal name (e.g. Amelia Rose Fortuin)"
                        style={{ fontStyle: 'italic', fontFamily: 'var(--font-heading)' }}
                      />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                        Entering your full legal name constitutes a binding electronic signature under this Agreement.
                      </span>
                    </div>
                  )}

                  {/* Signature line divider */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '28px' }}>
                    <div>
                      <div style={{ borderBottom: '1px solid var(--text-muted)', height: '32px' }} />
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Signature of Parent / Guardian / Applicant</div>
                    </div>
                    <div>
                      <div style={{ borderBottom: '1px solid var(--text-muted)', height: '32px', display: 'flex', alignItems: 'flex-end', paddingBottom: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-secondary"
                disabled={submitLoading}
                style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center', padding: '14px', marginTop: '24px', opacity: submitLoading ? 0.7 : 1 }}
              >
                {submitLoading ? 'Submitting...' : 'Submit Application'} {!submitLoading && <ArrowRight size={16} />}
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
          .admissions-form-card {
            padding: 28px 20px !important;
          }
        }
        @media (max-width: 480px) {
          .admissions-success-btns {
            flex-direction: column !important;
          }
          .admissions-success-btns .btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}

