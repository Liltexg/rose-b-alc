import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { supabase } from '../services/supabaseClient';
import {
  FileText, Bell, Image, Settings, Users, ArrowRight, Plus,
  Trash2, Edit, Save, Lock, LogOut, CheckCircle, Search,
  Download, Printer, AlertTriangle, FileSpreadsheet, Mail, X, KeyRound,
  HelpCircle, BookOpen, Compass, ChevronRight, ChevronLeft, Briefcase
} from 'lucide-react';

export default function Dashboard({ setCurrentPage, setIsAdminState }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Reset & Update Password States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');

  const [isRecoverySession, setIsRecoverySession] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');

  const [activeTab, setActiveTab] = useState('overview');

  // Tutorial Guide Assistant States
  const [showTour, setShowTour] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(
    localStorage.getItem('rosebalc_hide_tutorial_autoplay') === 'true'
  );
  const [guideTab, setGuideTab] = useState('getting-started');

  // Office Suite States
  const [officeSubTab, setOfficeSubTab] = useState('documents');

  // Database states
  const [apps, setApps] = useState([]);
  const [notices, setNotices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [pricing, setPricing] = useState({});
  const [content, setContent] = useState({});

  // CRUD operation states
  const [selectedApp, setSelectedApp] = useState(null);
  const [appSearch, setAppSearch] = useState('');
  const [appFilter, setAppFilter] = useState('All');

  // Notices states
  const [noticeForm, setNoticeForm] = useState({ id: null, title: '', category: 'General', body: '', author: 'E. Breintjies (Principal)' });
  const [isEditingNotice, setIsEditingNotice] = useState(false);

  // Email modal states
  const [emailModal, setEmailModal] = useState(null); // null = closed, or { app, subject, body }

  // Preview letterhead modal state
  const [previewModal, setPreviewModal] = useState(null); // null = closed, or { type: 'app'|'notice', data }

  // Gallery states
  const [galleryForm, setGalleryForm] = useState({ album: 'Academic Support', url: '', caption: '' });
  const [newAlbumName, setNewAlbumName] = useState('');
  const [availableAlbums, setAvailableAlbums] = useState([]);

  // Check current session on load & password recovery link detection
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await db.getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
          setIsAdminState(true);
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoverySession(true);
      }
    });

    if (window.location.hash && (window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token'))) {
      setIsRecoverySession(true);
    }

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Password reset & update handlers
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetSuccess('');
    try {
      await db.resetPassword(resetEmail);
      setResetSuccess(`Password reset link sent to ${resetEmail}. Please check your email inbox.`);
    } catch (err) {
      setResetError(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setUpdateError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setUpdateError('Passwords do not match.');
      return;
    }
    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess('');
    try {
      await db.updatePassword(newPassword);
      setUpdateSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      if (isRecoverySession) {
        setTimeout(() => {
          setIsRecoverySession(false);
          setIsAuthenticated(true);
          setIsAdminState(true);
        }, 1500);
      }
    } catch (err) {
      setUpdateError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      await db.signIn(email, password);
      setIsAuthenticated(true);
      setIsAdminState(true);
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await db.signOut();
    setIsAuthenticated(false);
    setIsAdminState(false);
    setSelectedApp(null);
  };

  // Load data from db service
  const reloadAllData = async () => {
    const appsData = await db.getApplications();
    const noticesData = await db.getNotices();
    const gall = await db.getGallery();
    const pricingData = await db.getPricing();
    const contentData = await db.getContent();

    setApps(appsData);
    setNotices(noticesData);
    setGallery(gall);
    setPricing(pricingData);
    setContent(contentData);

    // Extract unique albums
    const uniqueAlbums = [...new Set(gall.map(item => item.album))];
    setAvailableAlbums(uniqueAlbums);
  };

  useEffect(() => {
    if (isAuthenticated) {
      reloadAllData();
    }
  }, [isAuthenticated]);

  // Handle auto-starting the tutorial tour on login
  useEffect(() => {
    if (isAuthenticated) {
      const hideTour = localStorage.getItem('rosebalc_hide_tutorial_autoplay') === 'true';
      if (!hideTour) {
        setShowTour(true);
        setCurrentTourStep(0);
      }
    } else {
      setShowTour(false);
    }
  }, [isAuthenticated]);

  // ================= APPLICATION OPERATIONS =================
  const updateAppStatus = async (id, status) => {
    await db.updateApplicationStatus(id, status);
    await reloadAllData();
    if (selectedApp?.id === id) {
      setSelectedApp(prev => ({ ...prev, status }));
    }
  };

  const deleteApp = async (id) => {
    if (window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      await db.deleteApplication(id);
      setSelectedApp(null);
      await reloadAllData();
    }
  };

  // ================= EMAIL MODAL =================
  const getEmailTemplate = (app, type) => {
    const name = `${app.learnerName} ${app.learnerSurname}`;
    const prog = app.programme;
    const contact = app.programme === 'Grade 12' ? app.parentContact : app.learnerPhone;
    const contactName = app.programme === 'Grade 12'
      ? `${app.parentName} ${app.parentSurname}`
      : name;

    if (type === 'accept') {
      return {
        subject: `Application Accepted – ${name} | Rose B ALC`,
        body:
          `Dear ${contactName},

We are pleased to inform you that the application submitted for ${name} for the ${prog} programme at Rose B After School Learning Center has been ACCEPTED.

Please contact us to arrange for the necessary paperwork and registration formalities at your earliest convenience.

We look forward to welcoming ${app.learnerName} to our center and supporting their academic journey.

Warm regards,
E. Breintjies
Principal – Rose B After School Learning Center
edwardbreintjies@rosebalc.co.za`,
      };
    }

    if (type === 'reject') {
      return {
        subject: `Application Update – ${name} | Rose B ALC`,
        body:
          `Dear ${contactName},

Thank you for submitting an application for ${name} for the ${prog} programme at Rose B After School Learning Center.

After careful consideration, we regret to inform you that we are unable to accommodate the application at this time. This may be due to limited availability or programme capacity.

We encourage you to reach out to us for future intake opportunities.

Kind regards,
E. Breintjies
Principal – Rose B After School Learning Center
edwardbreintjies@rosebalc.co.za`,
      };
    }

    // reviewed / pending
    return {
      subject: `Application Under Review – ${name} | Rose B ALC`,
      body:
        `Dear ${contactName},

Thank you for applying to Rose B After School Learning Center on behalf of ${name} for the ${prog} programme.

We would like to inform you that the application is currently under review. We will be in contact with you shortly with a final decision.

Should you have any queries in the meantime, please feel free to reach out.

Kind regards,
E. Breintjies
Principal – Rose B After School Learning Center
edwardbreintjies@rosebalc.co.za`,
    };
  };

  const openEmailModal = (app) => {
    const type = app.status === 'Accepted' ? 'accept'
      : app.status === 'Rejected' ? 'reject'
        : 'review';
    const template = getEmailTemplate(app, type);
    setEmailModal({ app, ...template, activeType: type });
  };

  const sendEmail = () => {
    if (!emailModal) return;
    const app = emailModal.app;
    const recipientEmail = app.programme === 'Grade 12'
      ? (app.parentEmail || '')
      : (app.learnerEmail || '');

    // Standard mailto protocol (Zoho Mail supports this if set as the browser's default email handler)
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailModal.subject)}&body=${encodeURIComponent(emailModal.body)}`;
    window.open(mailtoLink, '_blank');
  };

  const exportAppToExcel = async () => {
    try {
      const ExcelJS = (await import('exceljs'));
      const { saveAs } = (await import('file-saver'));

      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Rose B After School Learning Center';
      workbook.created = new Date();
      const ws = workbook.addWorksheet('Applications', {
        pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1 }
      });

      // ── SCHOOL LOGO ──────────────────────────────────────────────
      const logoRes = await fetch('/logo.png');
      const logoBuffer = await logoRes.arrayBuffer();
      const logoId = workbook.addImage({ buffer: logoBuffer, extension: 'png' });

      // Row 1: tall logo header row
      ws.getRow(1).height = 70;
      ws.mergeCells('A1:K1');
      ws.addImage(logoId, { tl: { col: 0, row: 0 }, ext: { width: 130, height: 58 } });

      // ── SCHOOL NAME HEADER ────────────────────────────────────────
      ws.getRow(2).height = 30;
      ws.mergeCells('A2:K2');
      const nameCell = ws.getCell('A2');
      nameCell.value = 'ROSE B AFTER SCHOOL LEARNING CENTER';
      nameCell.font = { bold: true, size: 18, color: { argb: 'FF003366' }, name: 'Calibri' };
      nameCell.alignment = { vertical: 'middle', horizontal: 'center' };
      nameCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8EFF8' } };

      ws.getRow(3).height = 20;
      ws.mergeCells('A3:K3');
      const subCell = ws.getCell('A3');
      subCell.value = 'Official Student Applications Register';
      subCell.font = { italic: true, size: 11, color: { argb: 'FF555555' } };
      subCell.alignment = { vertical: 'middle', horizontal: 'center' };
      subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8EFF8' } };

      ws.getRow(4).height = 16;
      ws.mergeCells('A4:K4');
      const dateCell = ws.getCell('A4');
      dateCell.value = `Generated: ${new Date().toLocaleString('en-ZA')}   |   Total Records: ${apps.length}`;
      dateCell.font = { size: 9, color: { argb: 'FF888888' } };
      dateCell.alignment = { vertical: 'middle', horizontal: 'center' };
      dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8EFF8' } };

      // ── DIVIDER ROW ───────────────────────────────────────────────
      ws.getRow(5).height = 4;
      ws.mergeCells('A5:K5');
      ws.getCell('A5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };

      // ── COLUMN HEADERS ────────────────────────────────────────────
      ws.getRow(6).height = 28;
      const headerTitles = [
        'App ID', 'Date Submitted', 'Programme', 'First Name',
        'Surname', 'Contact', 'Physical Address', 'Grade',
        'Subjects', 'Emergency Contact', 'Status'
      ];
      const headerBorder = {
        top: { style: 'thin', color: { argb: 'FF003366' } },
        left: { style: 'thin', color: { argb: 'FF003366' } },
        bottom: { style: 'thin', color: { argb: 'FF003366' } },
        right: { style: 'thin', color: { argb: 'FF003366' } },
      };
      headerTitles.forEach((title, i) => {
        const col = i + 1;
        const cell = ws.getCell(6, col);
        cell.value = title;
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10, name: 'Calibri' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = headerBorder;
      });

      // ── COLUMN WIDTHS ─────────────────────────────────────────────
      ws.columns = [
        { width: 14 }, // App ID
        { width: 16 }, // Date
        { width: 18 }, // Programme
        { width: 18 }, // First Name
        { width: 18 }, // Surname
        { width: 16 }, // Contact
        { width: 32 }, // Address
        { width: 8 }, // Grade
        { width: 28 }, // Subjects
        { width: 20 }, // Emergency
        { width: 16 }  // Status
      ];

      const whiteFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
      const lightBlueFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F8FD' } };
      const cellBorder = {
        top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        right: { style: 'thin', color: { argb: 'FFDDDDDD' } }
      };

      const statusColors = {
        'Approved': { bg: 'FF059669', fg: 'FFFFFFFF' },
        'Pending': { bg: 'FFF59E0B', fg: 'FFFFFFFF' },
        'Rejected': { bg: 'FFDC2626', fg: 'FFFFFFFF' }
      };

      apps.forEach((app, idx) => {
        const rowNum = 7 + idx;
        const dateStr = new Date(app.dateSubmitted).toLocaleDateString('en-ZA');
        const contact = app.programme === 'Grade 12' ? app.parentContact : app.learnerPhone;
        const address = app.programme === 'Grade 12' ? app.parentAddress : app.learnerAddress;
        const subjects = Array.isArray(app.learnerSubjects) ? app.learnerSubjects.join(', ') : '';

        const rowData = [
          app.id,
          dateStr,
          app.programme,
          app.learnerName,
          app.learnerSurname,
          contact,
          address ? address.replace(/,/g, ' ') : '',
          app.learnerGrade,
          subjects,
          app.emergencyContact || 'N/A',
          app.status,
        ];
        const isEven = idx % 2 === 0;
        const rowFill = isEven ? whiteFill : lightBlueFill;
        const row = ws.getRow(rowNum);
        row.height = 18;
        rowData.forEach((val, ci) => {
          const cell = ws.getCell(rowNum, ci + 1);
          cell.value = val;
          cell.font = { size: 9, name: 'Calibri' };
          cell.alignment = {
            vertical: 'middle', wrapText: true,
            horizontal: ci === 10 ? 'center' : 'left'
          };
          cell.border = cellBorder;
          // Status column coloring
          if (ci === 10 && statusColors[val]) {
            const sc = statusColors[val];
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: sc.bg } };
            cell.font = { size: 9, bold: true, color: { argb: sc.fg }, name: 'Calibri' };
          } else {
            cell.fill = rowFill;
          }
        });
      });

      // ── SUMMARY FOOTER ────────────────────────────────────────────
      const summaryRow = 7 + apps.length + 1;
      ws.getRow(summaryRow).height = 20;
      ws.mergeCells(`A${summaryRow}:K${summaryRow}`);
      const sumCell = ws.getCell(`A${summaryRow}`);
      const pending = apps.filter(a => a.status === 'Pending').length;
      const approved = apps.filter(a => a.status === 'Approved').length;
      const rejected = apps.filter(a => a.status === 'Rejected').length;
      sumCell.value = `SUMMARY  —  Total: ${apps.length}   |   Pending: ${pending}   |   Approved: ${approved}   |   Rejected: ${rejected}`;
      sumCell.font = { bold: true, size: 9, color: { argb: 'FFFFFFFF' } };
      sumCell.alignment = { vertical: 'middle', horizontal: 'center' };
      sumCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };

      // ── OLD-SCHOOL GRAY BOX STAMP (Canvas) ───────────────────────
      const sc = document.createElement('canvas');
      sc.width = 380;
      sc.height = 200;
      const ctx = sc.getContext('2d');
      ctx.clearRect(0, 0, sc.width, sc.height);

      // Shadow for authenticity
      ctx.shadowColor = 'rgba(0,0,0,0.18)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      // Outer thick box
      ctx.strokeStyle = '#5a5a5a';
      ctx.lineWidth = 5;
      ctx.strokeRect(8, 8, 364, 184);

      ctx.shadowColor = 'transparent';

      // Inner thin box (double-border effect)
      ctx.strokeStyle = '#7a7a7a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(16, 16, 348, 168);

      // Top school name
      ctx.fillStyle = '#4a4a4a';
      ctx.font = 'bold 12px "Courier New", Courier, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ROSE B AFTER SCHOOL', 190, 42);
      ctx.fillText('LEARNING CENTER', 190, 58);

      // Separator
      ctx.strokeStyle = '#909090';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(30, 68); ctx.lineTo(350, 68); ctx.stroke();

      // VERIFIED
      ctx.fillStyle = '#3a3a3a';
      ctx.font = 'bold 26px "Courier New", Courier, monospace';
      ctx.fillText('V E R I F I E D', 190, 105);

      // Date
      const stampDate = new Date().toLocaleDateString('en-ZA',
        { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.fillStyle = '#666666';
      ctx.font = '11px "Courier New", Courier, monospace';
      ctx.fillText(stampDate, 190, 128);

      // Separator
      ctx.strokeStyle = '#909090';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(30, 142); ctx.lineTo(350, 142); ctx.stroke();

      // Footer text
      ctx.fillStyle = '#777777';
      ctx.font = '9px "Courier New", Courier, monospace';
      ctx.fillText('OFFICIAL ELECTRONIC DOCUMENT', 190, 160);
      ctx.fillText('Rose B ALC  |  Authorised Export', 190, 176);

      const sd = sc.toDataURL('image/png').split(',')[1];
      const sb = atob(sd);
      const sBytes = new Uint8Array(sb.length);
      for (let i = 0; i < sb.length; i++) sBytes[i] = sb.charCodeAt(i);
      const stampId = workbook.addImage({ buffer: sBytes.buffer, extension: 'png' });

      const stampRow = summaryRow + 2;
      ws.addImage(stampId, {
        tl: { col: 4, row: stampRow - 1 },
        ext: { width: 280, height: 147 }
      });

      // ── DOWNLOAD ──────────────────────────────────────────────────
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const ts = new Date().toLocaleDateString('en-ZA').replace(/\//g, '-');
      saveAs(blob, `RoseB_ALC_Applications_${ts}.xlsx`);
    } catch (err) {
      console.error('Failed to export to Excel:', err);
      alert('Export failed. Please try again.');
    }
  };

  const printApp = (app) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Official Record - ${app.learnerName} ${app.learnerSurname} | Rose B ALC</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600;700&display=swap');
            @page { size: A4; margin: 15mm 15mm 20mm 15mm; }
            body { 
              font-family: 'Inter', sans-serif; 
              color: #1a1a1a; 
              line-height: 1.5; 
              background: #fff; 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box;
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
            .doc-badge-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-left: 4px solid #7A1C20;
              padding: 10px 16px;
              border-radius: 4px;
              margin-bottom: 24px;
            }
            .doc-title {
              font-family: 'Cormorant Garamond', serif;
              font-size: 1.25rem;
              font-weight: 700;
              color: #7A1C20;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .status-badge {
              padding: 4px 14px;
              border-radius: 4px;
              font-size: 0.8rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              border: 1.5px solid #1a1a1a;
            }
            .section-title {
              border-bottom: 1.5px solid #7A1C20;
              padding-bottom: 4px;
              margin-top: 24px;
              margin-bottom: 12px;
              color: #7A1C20;
              font-size: 1.05rem;
              font-family: 'Cormorant Garamond', serif;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              font-weight: 700;
            }
            .field-row {
              display: grid;
              grid-template-columns: 220px 1fr;
              border-bottom: 1px dashed #e2e8f0;
              padding: 8px 0;
              font-size: 0.9rem;
              align-items: center;
              page-break-inside: avoid;
            }
            .field-label {
              font-weight: 600;
              color: #64748b;
              text-transform: uppercase;
              font-size: 0.75rem;
              letter-spacing: 0.05em;
            }
            .field-value { font-weight: 600; color: #0f172a; }
            .signature-img { max-height: 70px; display: block; margin-top: 12px; }
            .signature-box {
              border: 1px dashed #cbd5e1;
              padding: 16px;
              margin-top: 12px;
              font-style: italic;
              background: #f8fafc;
              border-radius: 4px;
              text-align: center;
              color: #334155;
            }
            .stamp-box {
              width: 320px;
              border: 4px double #5a5a5a;
              padding: 10px;
              font-family: "Courier New", Courier, monospace;
              color: #3a3a3a;
              text-align: center;
              margin: 24px auto 0;
            }
            .stamp-title { font-size: 12px; font-weight: bold; color: #222; }
            .stamp-sep { border-top: 1px solid #888; margin: 6px auto; width: 85%; }
            .stamp-verified { font-size: 20px; font-weight: bold; letter-spacing: 3px; color: #7A1C20; margin: 4px 0; }
            .stamp-date { font-size: 11px; color: #555; }
            .stamp-footer { font-size: 9px; color: #666; }
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
              <div><strong>Address:</strong> 23 Geelhout Avenue, Gamble, Kariega 6229</div>
              <div><strong>CIPC Reg No:</strong> 2026/611870/07</div>
              <div><strong>SARS Tax Ref:</strong> 9161805297</div>
            </div>
          </div>

          <div class="doc-badge-row">
            <div>
              <h2 class="doc-title">Official Student Application Record</h2>
              <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">
                Ref ID: <strong style="font-family: monospace; color: #0f172a;">${app.id}</strong> | Date: <strong>${new Date(app.dateSubmitted).toLocaleString('en-ZA')}</strong>
              </div>
            </div>
            <div>
              <span class="status-badge" style="
                background-color: ${app.status === 'Accepted' || app.status === 'Approved' ? '#dcfce7' : app.status === 'Rejected' ? '#fee2e2' : '#fef3c7'};
                color: ${app.status === 'Accepted' || app.status === 'Approved' ? '#15803d' : app.status === 'Rejected' ? '#b91c1c' : '#b45309'};
                border-color: ${app.status === 'Accepted' || app.status === 'Approved' ? '#15803d' : app.status === 'Rejected' ? '#b91c1c' : '#b45309'};
              ">${app.status}</span>
            </div>
          </div>

          <h3 class="section-title">Candidate Details</h3>
          <div class="field-row"><span class="field-label">Candidate Name</span><span class="field-value">${app.learnerName} ${app.learnerSurname}</span></div>
          <div class="field-row"><span class="field-label">Enrolled Programme</span><span class="field-value">${app.programme}</span></div>
          <div class="field-row"><span class="field-label">Current Grade Level</span><span class="field-value">${app.learnerGrade}</span></div>
          <div class="field-row"><span class="field-label">Registered Subjects</span><span class="field-value">${Array.isArray(app.learnerSubjects) ? app.learnerSubjects.join(' • ') : app.learnerSubjects || 'N/A'}</span></div>

          ${app.programme === 'Grade 12' ? `
            <h3 class="section-title">Parent / Guardian Information</h3>
            <div class="field-row"><span class="field-label">Parent / Guardian Name</span><span class="field-value">${app.parentName} ${app.parentSurname}</span></div>
            <div class="field-row"><span class="field-label">Primary Contact Number</span><span class="field-value">${app.parentContact}</span></div>
            <div class="field-row"><span class="field-label">Email Address</span><span class="field-value">${app.parentEmail || 'N/A'}</span></div>
            <div class="field-row"><span class="field-label">Physical Address</span><span class="field-value">${app.parentAddress}</span></div>
          ` : `
            <h3 class="section-title">Candidate Contact Details</h3>
            <div class="field-row"><span class="field-label">Candidate Phone</span><span class="field-value">${app.learnerPhone}</span></div>
            <div class="field-row"><span class="field-label">Candidate Email</span><span class="field-value">${app.learnerEmail || 'N/A'}</span></div>
            <div class="field-row"><span class="field-label">Physical Address</span><span class="field-value">${app.learnerAddress}</span></div>
            <div class="field-row"><span class="field-label">Emergency Contact</span><span class="field-value">${app.emergencyContact}</span></div>
          `}

          <h3 class="section-title">Legal Assents & Consent</h3>
          <div class="field-row"><span class="field-label">Terms & Conditions</span><span class="field-value">✓ Accepted & Acknowledged</span></div>
          <div class="field-row"><span class="field-label">Media & Photo Consent</span><span class="field-value">${app.consentPhotos ? '✓ Consented' : '✗ Declined'}</span></div>
          <div class="field-row"><span class="field-label">Information Accuracy</span><span class="field-value">✓ Confirmed Correct</span></div>

          <h3 class="section-title">Digital Signature Validation</h3>
          ${app.signature && app.signature.startsWith('data:image') ? `
            <img src="${app.signature}" class="signature-img" alt="Digital Signature" />
          ` : `
            <div class="signature-box">${app.signature || 'Digitally Signed'}</div>
          `}

          <div class="stamp-box">
            <div class="stamp-title">ROSE BRUINTJIES AFTER SCHOOL LEARNING CENTER</div>
            <div class="stamp-sep"></div>
            <div class="stamp-verified">V E R I F I E D</div>
            <div class="stamp-date">${new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div class="stamp-sep"></div>
            <div class="stamp-footer">CIPC: 2026/611870/07 | SARS TAX: 9161805297<br/>AUTHORISED ELECTRONIC APPLICATION RECORD</div>
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

  const printNotice = (notice) => {
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
              <div><strong>Address:</strong> 23 Geelhout Avenue, Gamble, Kariega 6229</div>
              <div><strong>CIPC Reg No:</strong> 2026/611870/07</div>
              <div><strong>SARS Tax Ref:</strong> 9161805297</div>
            </div>
          </div>

          <div class="notice-meta-bar">
            <div><strong>OFFICIAL NOTICE</strong> | Category: <strong>${notice.category || 'General'}</strong></div>
            <div>Date: <strong>${new Date(notice.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
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

  // Filter apps
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.learnerName.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.learnerSurname.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.id.toLowerCase().includes(appSearch.toLowerCase());
    const matchesStatus = appFilter === 'All' || app.status === appFilter;
    return matchesSearch && matchesStatus;
  });

  // ================= NOTICE OPERATIONS =================
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.body.trim()) {
      alert("Title and Body are required");
      return;
    }

    if (isEditingNotice) {
      await db.updateNotice(noticeForm.id, {
        title: noticeForm.title,
        category: noticeForm.category,
        body: noticeForm.body,
        author: noticeForm.author
      });
      setIsEditingNotice(false);
    } else {
      await db.addNotice({
        title: noticeForm.title,
        category: noticeForm.category,
        body: noticeForm.body,
        author: noticeForm.author
      });
    }

    setNoticeForm({ id: null, title: '', category: 'General', body: '', author: 'E. Breintjies (Principal)' });
    await reloadAllData();
  };

  const startEditNotice = (notice) => {
    setNoticeForm(notice);
    setIsEditingNotice(true);
  };

  const deleteNotice = async (id) => {
    if (window.confirm("Are you sure you want to delete this notice letter?")) {
      await db.deleteNotice(id);
      await reloadAllData();
    }
  };

  // ================= GALLERY OPERATIONS =================
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!galleryForm.url.trim() || !galleryForm.caption.trim()) {
      alert("URL and Caption are required");
      return;
    }

    await db.addGalleryImage(galleryForm);
    setGalleryForm({ album: 'Academic Support', url: '', caption: '' });
    await reloadAllData();
  };

  // Custom Local File Reader for mock uploads (Reads local file as base64 dataURL)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setGalleryForm(prev => ({
          ...prev,
          url: uploadEvent.target.result // Base64 dataURL representation
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteImage = async (id) => {
    if (window.confirm("Delete this photo from the gallery album?")) {
      await db.deleteGalleryImage(id);
      await reloadAllData();
    }
  };

  const handleAddNewAlbum = (e) => {
    e.preventDefault();
    if (newAlbumName.trim() && !availableAlbums.includes(newAlbumName.trim())) {
      setAvailableAlbums([...availableAlbums, newAlbumName.trim()]);
      setGalleryForm(prev => ({ ...prev, album: newAlbumName.trim() }));
      setNewAlbumName('');
    }
  };

  // ================= SETTINGS OPERATIONS =================
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await db.savePricing(pricing);
    await db.saveContent(content);
    alert("System pricing configurations and static page contents successfully updated!");
    await reloadAllData();
  };

  if (!isAuthenticated) {
    // 1. Recovery mode (User clicked password reset link from email)
    if (isRecoverySession) {
      return (
        <div className="section animated" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ maxWidth: '420px' }}>
            <div className="card" style={{ borderTop: '6px solid var(--secondary)', padding: '40px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <img
                  src="/logo.png"
                  alt="Rose B ALC Logo"
                  style={{ width: '110px', height: 'auto', objectFit: 'contain', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }}
                />
                <h2 style={{ fontSize: '1.6rem' }}>Create New Password</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Enter your new administrator account password.
                </p>
              </div>

              {updateSuccess && (
                <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', color: '#065f46', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', marginBottom: '16px', fontWeight: 600 }}>
                  {updateSuccess} Redirecting to portal...
                </div>
              )}

              {updateError && (
                <div style={{ backgroundColor: 'rgba(179,32,37,0.05)', border: '1px solid rgba(179,32,37,0.2)', color: 'var(--secondary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', marginBottom: '16px', fontWeight: 600 }}>
                  {updateError}
                </div>
              )}

              <form onSubmit={handleUpdatePassword}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    required
                    minLength={6}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={updateLoading}
                  style={{ width: '100%', display: 'flex', gap: '6px', justifyContent: 'center', opacity: updateLoading ? 0.7 : 1 }}
                >
                  {updateLoading ? 'Updating Password...' : <><span>Set New Password</span> <ArrowRight size={16} /></>}
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }

    // 2. Forgot Password Request Mode
    if (isForgotPassword) {
      return (
        <div className="section animated" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ maxWidth: '420px' }}>
            <div className="card" style={{ borderTop: '6px solid var(--secondary)', padding: '40px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <img
                  src="/logo.png"
                  alt="Rose B ALC Logo"
                  style={{ width: '110px', height: 'auto', objectFit: 'contain', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }}
                />
                <h2 style={{ fontSize: '1.6rem' }}>Reset Password</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Enter your registered admin email address to receive password reset instructions.
                </p>
              </div>

              {resetSuccess && (
                <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', color: '#065f46', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', marginBottom: '16px', fontWeight: 600 }}>
                  {resetSuccess}
                </div>
              )}

              {resetError && (
                <div style={{ backgroundColor: 'rgba(179,32,37,0.05)', border: '1px solid rgba(179,32,37,0.2)', color: 'var(--secondary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', marginBottom: '16px', fontWeight: 600 }}>
                  {resetError}
                </div>
              )}

              <form onSubmit={handleResetPassword}>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Admin Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="edwardbreintjies@rosebalc.co.za"
                    required
                    autoComplete="email"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={resetLoading}
                  style={{ width: '100%', display: 'flex', gap: '6px', justifyContent: 'center', opacity: resetLoading ? 0.7 : 1, marginBottom: '16px' }}
                >
                  {resetLoading ? 'Sending Reset Link...' : <><span>Send Password Reset Link</span> <ArrowRight size={16} /></>}
                </button>

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(false); setResetError(''); setResetSuccess(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                  >
                    Back to Staff Portal Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }

    // 3. Standard Login View
    return (
      <div className="section animated" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '420px' }}>
          <div className="card" style={{ borderTop: '6px solid var(--secondary)', padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <img
                src="/logo.png"
                alt="Rose B ALC Logo"
                style={{ width: '110px', height: 'auto', objectFit: 'contain', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }}
              />
              <h2 style={{ fontSize: '1.6rem' }}>Staff Portal Login</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Sign in with your administrator email and password.
              </p>
            </div>

            {loginError && (
              <div style={{
                backgroundColor: 'rgba(179,32,37,0.05)',
                border: '1px solid rgba(179,32,37,0.2)',
                color: 'var(--secondary)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                marginBottom: '16px',
                fontWeight: 600
              }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setResetEmail(email); setLoginError(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-secondary"
                disabled={loginLoading}
                style={{ width: '100%', display: 'flex', gap: '6px', justifyContent: 'center', opacity: loginLoading ? 0.7 : 1 }}
              >
                {loginLoading ? 'Signing In...' : <><span>Sign In</span> <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    /* MAIN ADMIN DASHBOARD INTERFACE */
    <>
      <div className="animated dashboard-layout" style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Sidebar Nav */}
        <div className="dashboard-sidebar">

          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 8px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px' }}>
              <div className="sidebar-logo-container">
                <img
                  src="/logo.png"
                  alt="Rose B ALC Logo"
                  style={{ width: '48px', height: '48px', objectFit: 'contain', display: 'block' }}
                />
              </div>
              <div>
                <h4 className="logo-text">Rose B ALC</h4>
                <span className="logo-subtext">ADMIN PORTAL</span>
              </div>
            </div>

            {/* Nav list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => { setActiveTab('overview'); setSelectedApp(null); }}
                className={`pro-sidebar-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
              >
                <Settings size={18} /> Overview
              </button>

              <button
                onClick={() => { setActiveTab('applications'); }}
                className={`pro-sidebar-nav-btn ${activeTab === 'applications' ? 'active' : ''}`}
              >
                <Users size={18} /> Applications ({apps.length})
              </button>

              <button
                onClick={() => { setActiveTab('notices'); }}
                className={`pro-sidebar-nav-btn ${activeTab === 'notices' ? 'active' : ''}`}
              >
                <Bell size={18} /> Notices ({notices.length})
              </button>

              <button
                onClick={() => { setActiveTab('gallery'); }}
                className={`pro-sidebar-nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
              >
                <Image size={18} /> Gallery ({gallery.length})
              </button>

              <button
                onClick={() => { setActiveTab('office'); }}
                className={`pro-sidebar-nav-btn ${activeTab === 'office' ? 'active' : ''}`}
              >
                <Briefcase size={18} /> Office Suite
              </button>

              <button
                onClick={() => { setActiveTab('settings'); }}
                className={`pro-sidebar-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              >
                <Settings size={18} /> Settings
              </button>

              <button
                onClick={() => { setActiveTab('guide'); }}
                className={`pro-sidebar-nav-btn ${activeTab === 'guide' ? 'active' : ''}`}
              >
                <HelpCircle size={18} /> Help & Guide
              </button>
            </div>
          </div>

          {/* Logout Bottom */}
          <div>
            <button
              onClick={handleLogout}
              className="pro-sidebar-nav-btn logout"
            >
              <LogOut size={18} /> Log Out
            </button>
          </div>
        </div>

        {/* ===== MOBILE TOP BAR (visible < 768px) ===== */}
        <div style={{
          display: 'none',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '12px 16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }} className="dash-mobile-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="Rose B ALC" style={{ height: '32px', objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.4))' }} />
            <div>
              <div style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, lineHeight: 1 }}>Rose B ALC</div>
              <div style={{ color: 'var(--accent)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Admin Portal</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>

        {/* Main Content Area */}
        <div style={{ flexGrow: 1, padding: '40px', backgroundColor: '#F1F5F9', overflowY: 'auto' }} className="dashboard-content">

          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="animated">
              <h2 style={{ marginBottom: '24px' }}>Overview Dashboard</h2>

              {/* Quick Metrics */}
              <div className="grid-3" style={{ marginBottom: '40px' }}>
                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(179,32,37,0.08)', color: 'var(--secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }}>
                    <Users size={24} style={{ margin: 'auto' }} />
                  </div>
                  <div>
                    <h5 style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Admissions</h5>
                    <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{apps.length}</h3>
                  </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(244,197,66,0.15)', color: 'var(--accent-hover)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }}>
                    <Bell size={24} style={{ margin: 'auto' }} />
                  </div>
                  <div>
                    <h5 style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Notice Correspondence</h5>
                    <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{notices.length}</h3>
                  </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(59,59,59,0.06)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }}>
                    <Image size={24} style={{ margin: 'auto' }} />
                  </div>
                  <div>
                    <h5 style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Gallery Images</h5>
                    <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{gallery.length}</h3>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent */}
              <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '32px' }} className="sub-grid-mobile">

                {/* Quick Actions */}
                <div className="card" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Quick Actions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'flex-start', gap: '10px' }}
                      onClick={() => setActiveTab('notices')}
                    >
                      <Plus size={16} /> Create Notice Letter
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ width: '100%', justifyContent: 'flex-start', gap: '10px' }}
                      onClick={() => setActiveTab('applications')}
                    >
                      <Users size={16} /> Manage Applications
                    </button>
                    <button
                      className="btn btn-outline"
                      style={{ width: '100%', justifyContent: 'flex-start', gap: '10px' }}
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings size={16} /> Edit System Fees
                    </button>
                  </div>
                </div>

                {/* Recent Applications */}
                <div className="card" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Recent Applications</h3>
                  {apps.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No applications received yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {apps.slice(0, 4).map(app => (
                        <div key={app.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: '1px solid var(--border-color)',
                          paddingBottom: '8px'
                        }}>
                          <div>
                            <h5 style={{ margin: 0, fontSize: '0.92rem' }}>{app.learnerName} {app.learnerSurname}</h5>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{app.programme}</span>
                          </div>
                          <span style={{
                            backgroundColor: app.status === 'Pending' ? '#FEF3C7' : app.status === 'Accepted' ? '#D1FAE5' : '#FEE2E2',
                            color: app.status === 'Pending' ? '#D97706' : app.status === 'Accepted' ? '#059669' : '#DC2626',
                            padding: '2px 8px',
                            borderRadius: '99px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                          }}>{app.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ================= TAB 2: APPLICATIONS MANAGER ================= */}
          {activeTab === 'applications' && (
            <div className="animated">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h2>Manage Applications ({filteredApps.length})</h2>
                <button
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem' }}
                  onClick={exportAppToExcel}
                >
                  <FileSpreadsheet size={16} /> Export to Excel
                </button>
              </div>

              {/* Filters bar */}
              <div style={{
                display: 'flex',
                gap: '16px',
                backgroundColor: 'var(--white)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                marginBottom: '24px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['All', 'Pending', 'Reviewed', 'Accepted', 'Rejected'].map(status => (
                    <button
                      key={status}
                      className={`btn ${appFilter === status ? 'btn-primary' : 'btn-outline'}`}
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        backgroundColor: appFilter === status ? 'var(--primary)' : 'transparent',
                        borderColor: appFilter === status ? 'var(--primary)' : 'var(--border-color)',
                        color: appFilter === status ? 'var(--white)' : 'var(--text)'
                      }}
                      onClick={() => { setAppFilter(status); setSelectedApp(null); }}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div style={{ position: 'relative', width: '250px', marginLeft: 'auto' }}>
                  <input
                    type="text"
                    placeholder="Search by name/id..."
                    className="form-control"
                    style={{ paddingLeft: '36px', paddingRight: '12px', fontSize: '0.85rem', padding: '8px 12px 8px 36px' }}
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                  />
                  <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              {/* Main Application Interface */}
              <div style={{ display: 'grid', gridTemplateColumns: selectedApp ? '50% 50%' : '1fr', gap: '24px' }} className="sub-grid-mobile">

                {/* Applications Table */}
                <div className="card" style={{ padding: '20px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>
                        <th style={{ padding: '12px 8px' }}>Date</th>
                        <th style={{ padding: '12px 8px' }}>Learner Name</th>
                        <th style={{ padding: '12px 8px' }}>Programme</th>
                        <th style={{ padding: '12px 8px' }}>Status</th>
                        <th style={{ padding: '12px 8px', textRight: true }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApps.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No applications matching criteria.</td>
                        </tr>
                      ) : (
                        filteredApps.map(app => (
                          <tr
                            key={app.id}
                            onClick={() => setSelectedApp(app)}
                            style={{
                              borderBottom: '1px solid var(--border-color)',
                              cursor: 'pointer',
                              backgroundColor: selectedApp?.id === app.id ? 'rgba(179,32,37,0.03)' : 'transparent',
                              fontWeight: selectedApp?.id === app.id ? 700 : 400
                            }}
                            onMouseOver={(e) => { if (selectedApp?.id !== app.id) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                            onMouseOut={(e) => { if (selectedApp?.id !== app.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <td style={{ padding: '12px 8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {new Date(app.dateSubmitted).toLocaleDateString('en-ZA')}
                            </td>
                            <td style={{ padding: '12px 8px' }}>
                              {app.learnerName} {app.learnerSurname}
                            </td>
                            <td style={{ padding: '12px 8px', fontSize: '0.85rem' }}>
                              {app.programme}
                            </td>
                            <td style={{ padding: '12px 8px' }}>
                              <span style={{
                                backgroundColor: app.status === 'Pending' ? '#FEF3C7' : app.status === 'Reviewed' ? '#DBEAFE' : app.status === 'Accepted' ? '#D1FAE5' : '#FEE2E2',
                                color: app.status === 'Pending' ? '#B45309' : app.status === 'Reviewed' ? '#1D4ED8' : app.status === 'Accepted' ? '#047857' : '#B91C1C',
                                padding: '2px 8px',
                                borderRadius: '99px',
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                              }}>{app.status}</span>
                            </td>
                            <td style={{ padding: '12px 8px' }}>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteApp(app.id); }}
                                style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Application Details Panel */}
                {selectedApp && (
                  <div className="card animated" style={{ padding: '28px', borderTop: '6px solid var(--secondary)', position: 'sticky', top: '90px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Application Profile</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reference ID: {selectedApp.id}</span>
                      </div>
                      <button
                        className="tab-btn"
                        style={{ padding: '2px 8px', borderBottom: 'none', margin: 0 }}
                        onClick={() => setSelectedApp(null)}
                      >
                        Close View
                      </button>
                    </div>

                    {/* Detail Grid */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', marginBottom: '24px' }}>
                      <div><strong>Programme:</strong> <span>{selectedApp.programme}</span></div>
                      <div><strong>Learner:</strong> <span>{selectedApp.learnerName} {selectedApp.learnerSurname} ({selectedApp.learnerGrade})</span></div>

                      {selectedApp.programme === 'Grade 12' ? (
                        <>
                          <div><strong>Parent:</strong> <span>{selectedApp.parentName} {selectedApp.parentSurname}</span></div>
                          <div><strong>Contact:</strong> <span>{selectedApp.parentContact}</span></div>
                          <div><strong>Email:</strong> <span>{selectedApp.parentEmail || 'N/A'}</span></div>
                          <div><strong>Address:</strong> <span>{selectedApp.parentAddress}</span></div>
                          <div><strong>Subjects Requested:</strong> <span>{selectedApp.learnerSubjects.join(', ')}</span></div>
                        </>
                      ) : (
                        <>
                          <div><strong>Contact:</strong> <span>{selectedApp.learnerPhone}</span></div>
                          <div><strong>Email:</strong> <span>{selectedApp.learnerEmail || 'N/A'}</span></div>
                          <div><strong>Address:</strong> <span>{selectedApp.learnerAddress}</span></div>
                          <div><strong>Emergency Contact:</strong> <span>{selectedApp.emergencyContact}</span></div>
                        </>
                      )}

                      <div><strong>Submission Date:</strong> <span>{new Date(selectedApp.dateSubmitted).toLocaleString('en-ZA')}</span></div>

                      {/* Status selector */}
                      <div style={{ marginTop: '10px' }}>
                        <strong>Select Status Option:</strong>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                          {['Pending', 'Reviewed', 'Accepted', 'Rejected'].map(st => (
                            <button
                              key={st}
                              onClick={() => updateAppStatus(selectedApp.id, st)}
                              style={{
                                fontSize: '0.75rem',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                border: '1px solid',
                                borderColor: selectedApp.status === st ? 'var(--secondary)' : 'var(--border-color)',
                                backgroundColor: selectedApp.status === st ? 'var(--secondary)' : 'transparent',
                                color: selectedApp.status === st ? 'var(--white)' : 'var(--text)',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Signature Preview */}
                      <div style={{ marginTop: '12px' }}>
                        <strong>Assent Signature:</strong>
                        {selectedApp.signature.startsWith('data:image') ? (
                          <div style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '6px', width: 'fit-content', marginTop: '6px', backgroundColor: '#FFFFFF' }}>
                            <img src={selectedApp.signature} alt="Sign" style={{ maxHeight: '60px', display: 'block' }} />
                          </div>
                        ) : (
                          <div style={{ fontStyle: 'italic', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', marginTop: '6px', backgroundColor: '#FFFFFF' }}>
                            "{selectedApp.signature}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', flexGrow: 1, display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}
                        onClick={() => setPreviewModal({ type: 'app', data: selectedApp })}
                      >
                        <FileText size={14} /> Preview Letterhead
                      </button>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', flexGrow: 1, display: 'flex', gap: '6px', justifyContent: 'center' }}
                        onClick={() => printApp(selectedApp)}
                      >
                        <Printer size={14} /> Print Record
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}
                        onClick={() => openEmailModal(selectedApp)}
                      >
                        <Mail size={14} /> Email Applicant
                      </button>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', color: '#EF4444', borderColor: '#EF4444' }}
                        onClick={() => deleteApp(selectedApp.id)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= EMAIL MODAL ================= */}
          {emailModal && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              backgroundColor: 'rgba(15,23,42,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)', padding: '20px'
            }}>
              <div className="animated" style={{
                background: '#ffffff', borderRadius: '16px',
                width: '100%', maxWidth: '640px', maxHeight: '90vh',
                overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
                border: '1px solid var(--border-color)'
              }}>

                {/* Modal Header */}
                <div style={{
                  padding: '24px 28px 20px',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      backgroundColor: 'rgba(122,28,32,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Mail size={18} color="var(--secondary)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Email Applicant</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                        {emailModal.app.learnerName} {emailModal.app.learnerSurname} &mdash; {emailModal.app.programme}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEmailModal(null)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Template Selector */}
                <div style={{ padding: '20px 28px 0' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Response Template</p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {[
                      { key: 'accept', label: '✓ Acceptance', color: '#059669', bg: '#D1FAE5' },
                      { key: 'reject', label: '✗ Decline', color: '#B91C1C', bg: '#FEE2E2' },
                      { key: 'review', label: '⧖ Under Review', color: '#1D4ED8', bg: '#DBEAFE' },
                    ].map(({ key, label, color, bg }) => (
                      <button
                        key={key}
                        onClick={() => {
                          const t = getEmailTemplate(emailModal.app, key);
                          setEmailModal(prev => ({ ...prev, ...t, activeType: key }));
                        }}
                        style={{
                          padding: '6px 14px', borderRadius: '99px', border: '2px solid',
                          fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                          transition: 'all 0.2s',
                          backgroundColor: emailModal.activeType === key ? color : bg,
                          borderColor: color,
                          color: emailModal.activeType === key ? '#fff' : color,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Subject */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Subject Line</label>
                    <input
                      type="text"
                      className="form-control"
                      value={emailModal.subject}
                      onChange={(e) => setEmailModal(prev => ({ ...prev, subject: e.target.value }))}
                      style={{ fontSize: '0.9rem' }}
                    />
                  </div>

                  {/* Body */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Email Body</label>
                    <textarea
                      className="form-control"
                      rows={12}
                      value={emailModal.body}
                      onChange={(e) => setEmailModal(prev => ({ ...prev, body: e.target.value }))}
                      style={{ fontSize: '0.88rem', lineHeight: '1.7', fontFamily: 'var(--font-body)', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', paddingBottom: '28px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ flexGrow: 1, display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}
                      onClick={sendEmail}
                    >
                      <Mail size={15} /> Open in Zoho Mail
                    </button>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '10px 20px' }}
                      onClick={() => setEmailModal(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PREVIEW LETTERHEAD MODAL ================= */}
          {previewModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 99999, backgroundColor: 'rgba(15, 17, 21, 0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(6px)', padding: '20px'
            }} onClick={() => setPreviewModal(null)}>
              <div className="animated" style={{
                background: '#f8fafc', borderRadius: '16px',
                width: '100%', maxWidth: '860px', maxHeight: '92vh',
                overflowY: 'auto', boxShadow: '0 25px 70px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', flexDirection: 'column'
              }} onClick={(e) => e.stopPropagation()}>
                {/* Modal Top Control Bar */}
                <div style={{
                  padding: '16px 24px',
                  backgroundColor: '#0f172a', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  position: 'sticky', top: 0, zIndex: 10
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={18} color="var(--accent)" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.5px' }}>
                      Official Corporate Letterhead Preview
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center' }}
                      onClick={() => {
                        if (previewModal.type === 'app') printApp(previewModal.data);
                        else printNotice(previewModal.data);
                      }}
                    >
                      <Printer size={14} /> Print Document
                    </button>
                    <button
                      onClick={() => setPreviewModal(null)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                    >
                      <X size={22} />
                    </button>
                  </div>
                </div>

                {/* Printable Sheet Simulation */}
                <div className="sheet-simulation-wrapper" style={{ padding: '24px 16px', flexGrow: 1, backgroundColor: '#cbd5e1' }}>
                  <div className="notice-letter" style={{
                    backgroundColor: '#ffffff',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    padding: '36px',
                    maxWidth: '750px',
                    margin: '0 auto',
                    borderRadius: '2px',
                    color: '#1a1a1a',
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    {/* Top Bar Accent */}
                    <div style={{
                      height: '6px',
                      background: 'linear-gradient(90deg, #7A1C20 0%, #7A1C20 70%, #D4AF37 70%, #D4AF37 100%)',
                      marginBottom: '20px'
                    }}></div>

                    {/* Letterhead Header */}
                    <div className="lh-header-block" style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                      borderBottom: '2px solid #7A1C20', paddingBottom: '16px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'
                    }}>
                      <div className="lh-left-block" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img src="/logo.png" alt="Rose B ALC" className="lh-logo-img" style={{ width: '70px', height: '70px', objectFit: 'contain', flexShrink: 0 }} />
                        <div>
                          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)', fontWeight: 700, color: '#7A1C20', margin: 0, textTransform: 'uppercase' }}>
                            Rose Bruintjies After School Learning Center
                          </h1>
                          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
                            CAPS-Aligned Life Sciences & Academic Upgrade Center
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#333', marginTop: '2px' }}>
                            <strong>Founder & Director:</strong> Mr. Edward Breintjies (B.Ed FET)
                          </div>
                        </div>
                      </div>
                      <div className="lh-right-block" style={{ textAlign: 'right', fontSize: '0.72rem', color: '#444', lineHeight: 1.5, borderLeft: '2px solid #D4AF37', paddingLeft: '12px' }}>
                        <div><strong style={{ color: '#7A1C20' }}>Tel / WhatsApp:</strong> 076 423 7821</div>
                        <div><strong style={{ color: '#7A1C20' }}>Email:</strong> edwardbreintjies@rosebalc.co.za</div>
                        <div><strong style={{ color: '#7A1C20' }}>Location:</strong> Kariega, Eastern Cape</div>
                        <div><strong style={{ color: '#7A1C20' }}>CIPC Reg:</strong> 2026/611870/07</div>
                        <div><strong style={{ color: '#7A1C20' }}>SARS TAX Ref:</strong> 9161805297</div>
                      </div>
                    </div>

                    {/* Dynamic Content: App vs Notice */}
                    {previewModal.type === 'app' ? (
                      <>
                        {/* App Meta */}
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid #7A1C20',
                          padding: '10px 16px', borderRadius: '4px', marginBottom: '24px'
                        }}>
                          <div>
                            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontWeight: 700, color: '#7A1C20', margin: 0, textTransform: 'uppercase' }}>
                              Official Student Application Record
                            </h2>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                              Ref ID: <strong style={{ fontFamily: 'monospace', color: '#0f172a' }}>{previewModal.data.id}</strong> | Date: <strong>{new Date(previewModal.data.dateSubmitted).toLocaleString('en-ZA')}</strong>
                            </div>
                          </div>
                          <div>
                            <span style={{
                              padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', border: '1.5px solid',
                              backgroundColor: previewModal.data.status === 'Accepted' || previewModal.data.status === 'Approved' ? '#dcfce7' : previewModal.data.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                              color: previewModal.data.status === 'Accepted' || previewModal.data.status === 'Approved' ? '#15803d' : previewModal.data.status === 'Rejected' ? '#b91c1c' : '#b45309',
                              borderColor: previewModal.data.status === 'Accepted' || previewModal.data.status === 'Approved' ? '#15803d' : previewModal.data.status === 'Rejected' ? '#b91c1c' : '#b45309'
                            }}>{previewModal.data.status}</span>
                          </div>
                        </div>

                        {/* Candidate Info */}
                        <h3 style={{ borderBottom: '1.5px solid #7A1C20', paddingBottom: '4px', marginTop: '20px', marginBottom: '10px', color: '#7A1C20', fontSize: '0.95rem', fontFamily: "'Cormorant Garamond', serif", textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Candidate Details</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', borderBottom: '1px dashed #e2e8f0', padding: '6px 0', fontSize: '0.85rem' }}><span style={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem' }}>Candidate Name</span><span style={{ fontWeight: 600, color: '#0f172a' }}>{previewModal.data.learnerName} {previewModal.data.learnerSurname}</span></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', borderBottom: '1px dashed #e2e8f0', padding: '6px 0', fontSize: '0.85rem' }}><span style={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem' }}>Programme</span><span style={{ fontWeight: 600, color: '#0f172a' }}>{previewModal.data.programme}</span></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', borderBottom: '1px dashed #e2e8f0', padding: '6px 0', fontSize: '0.85rem' }}><span style={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem' }}>Grade Level</span><span style={{ fontWeight: 600, color: '#0f172a' }}>{previewModal.data.learnerGrade}</span></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', borderBottom: '1px dashed #e2e8f0', padding: '6px 0', fontSize: '0.85rem' }}><span style={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem' }}>Subjects</span><span style={{ fontWeight: 600, color: '#0f172a' }}>{Array.isArray(previewModal.data.learnerSubjects) ? previewModal.data.learnerSubjects.join(' • ') : previewModal.data.learnerSubjects}</span></div>

                        {previewModal.data.programme === 'Grade 12' ? (
                          <>
                            <h3 style={{ borderBottom: '1.5px solid #7A1C20', paddingBottom: '4px', marginTop: '20px', marginBottom: '10px', color: '#7A1C20', fontSize: '0.95rem', fontFamily: "'Cormorant Garamond', serif", textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Parent / Guardian Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', borderBottom: '1px dashed #e2e8f0', padding: '6px 0', fontSize: '0.85rem' }}><span style={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem' }}>Parent Name</span><span style={{ fontWeight: 600, color: '#0f172a' }}>{previewModal.data.parentName} {previewModal.data.parentSurname}</span></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', borderBottom: '1px dashed #e2e8f0', padding: '6px 0', fontSize: '0.85rem' }}><span style={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem' }}>Contact</span><span style={{ fontWeight: 600, color: '#0f172a' }}>{previewModal.data.parentContact}</span></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', borderBottom: '1px dashed #e2e8f0', padding: '6px 0', fontSize: '0.85rem' }}><span style={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem' }}>Email</span><span style={{ fontWeight: 600, color: '#0f172a' }}>{previewModal.data.parentEmail || 'N/A'}</span></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', borderBottom: '1px dashed #e2e8f0', padding: '6px 0', fontSize: '0.85rem' }}><span style={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem' }}>Address</span><span style={{ fontWeight: 600, color: '#0f172a' }}>{previewModal.data.parentAddress}</span></div>
                          </>
                        ) : null}

                        {/* Stamp box */}
                        <div style={{
                          width: '300px', border: '4px double #5a5a5a', padding: '8px',
                          fontFamily: '"Courier New", Courier, monospace', color: '#3a3a3a',
                          textAlign: 'center', margin: '24px auto 0'
                        }}>
                          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#222' }}>ROSE BRUINTJIES AFTER SCHOOL LEARNING CENTER</div>
                          <div style={{ borderTop: '1px solid #888', margin: '5px auto', width: '85%' }}></div>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '3px', color: '#7A1C20', margin: '4px 0' }}>V E R I F I E D</div>
                          <div style={{ fontSize: '10px', color: '#555' }}>{new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                          <div style={{ borderTop: '1px solid #888', margin: '5px auto', width: '85%' }}></div>
                          <div style={{ fontSize: '8.5px', color: '#666' }}>CIPC: 2026/611870/07 | SARS TAX: 9161805297<br/>AUTHORISED ELECTRONIC RECORD</div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Notice Meta */}
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid #D4AF37',
                          padding: '10px 16px', marginBottom: '24px', fontSize: '0.82rem'
                        }}>
                          <div><strong>OFFICIAL NOTICE</strong> | Category: <strong>{previewModal.data.category || 'General'}</strong></div>
                          <div>Date: <strong>{new Date(previewModal.data.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
                        </div>

                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 700, color: '#7A1C20', marginBottom: '16px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                          {previewModal.data.title}
                        </h2>

                        <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-line', minHeight: '220px', marginBottom: '30px' }}>
                          {previewModal.data.body}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed #cbd5e1', paddingTop: '16px' }}>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Authorised Signatory</div>
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginTop: '2px' }}>{previewModal.data.author}</div>
                            <div style={{ fontSize: '0.75rem', color: '#7A1C20' }}>Rose Bruintjies After School Learning Center</div>
                          </div>
                          <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#64748b' }}>
                            Official Notice Document<br/>Verified Broadcast
                          </div>
                        </div>
                      </>
                    )}

                    {/* Letterhead Footer */}
                    <div style={{
                      marginTop: '32px', borderTop: '2px solid #7A1C20', paddingTop: '10px',
                      fontSize: '0.68rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
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
              </div>
            </div>
          )}

          {/* ================= TAB 3: NOTICES EDITOR ================= */}
          {activeTab === 'notices' && (
            <div className="animated">
              <h2>School Notice Correspondence</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '32px', marginTop: '24px' }} className="sub-grid-mobile">

                {/* Notice Creator Form */}
                <div className="card" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
                    {isEditingNotice ? "Modify Notice Letter" : "Create Official Letter"}
                  </h3>
                  <form onSubmit={handleNoticeSubmit}>
                    <div className="form-group">
                      <label className="form-label">Notice Title*</label>
                      <input
                        type="text"
                        className="form-control"
                        value={noticeForm.title}
                        onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                        placeholder="e.g. 2027 Applications Open"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Category*</label>
                      <select
                        className="form-control"
                        value={noticeForm.category}
                        onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                      >
                        <option value="General">General</option>
                        <option value="Academic">Academic</option>
                        <option value="Events">Events</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Author Sign-off*</label>
                      <input
                        type="text"
                        className="form-control"
                        value={noticeForm.author}
                        onChange={(e) => setNoticeForm({ ...noticeForm, author: e.target.value })}
                        placeholder="e.g. E. Breintjies (Principal)"
                        required
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label className="form-label">Notice Body Contents*</label>
                      <textarea
                        className="form-control"
                        rows="6"
                        value={noticeForm.body}
                        onChange={(e) => setNoticeForm({ ...noticeForm, body: e.target.value })}
                        placeholder="Write letter details here. Pacing splits are preserved..."
                        required
                      ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" className="btn btn-secondary" style={{ flexGrow: 1, display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <Save size={16} /> {isEditingNotice ? "Save Changes" : "Publish Notice"}
                      </button>
                      {isEditingNotice && (
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => {
                            setIsEditingNotice(false);
                            setNoticeForm({ id: null, title: '', category: 'General', body: '', author: 'E. Breintjies (Principal)' });
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Published Notices list */}
                <div className="card" style={{ padding: '28px', maxHeight: '600px', overflowY: 'auto' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Published Letterheads</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {notices.map(notice => (
                      <div key={notice.id} style={{
                        borderLeft: '4px solid var(--secondary)',
                        padding: '16px',
                        backgroundColor: 'var(--bg-alt)',
                        borderRadius: '0 8px 8px 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{ maxWidth: '80%' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                            {new Date(notice.date).toLocaleDateString('en-ZA')} | {notice.category}
                          </span>
                          <h4 style={{ margin: '4px 0 8px', fontSize: '1rem', color: 'var(--primary)' }}>{notice.title}</h4>
                          <p style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>{notice.body}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setPreviewModal({ type: 'notice', data: notice })}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--secondary)' }}
                            title="Preview Letterhead Document"
                          >
                            <FileText size={16} />
                          </button>
                          <button
                            onClick={() => printNotice(notice)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text)' }}
                            title="Print Notice"
                          >
                            <Printer size={16} />
                          </button>
                          <button
                            onClick={() => startEditNotice(notice)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                            title="Edit Notice"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteNotice(notice.id)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= TAB 4: GALLERY MANAGER ================= */}
          {activeTab === 'gallery' && (
            <div className="animated">
              <h2>Gallery Album Manager</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '32px', marginTop: '24px' }} className="sub-grid-mobile">

                {/* Photo Uploader */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Upload Photo</h3>
                    <form onSubmit={handleImageUpload}>
                      <div className="form-group">
                        <label className="form-label">Select Album*</label>
                        <select
                          className="form-control"
                          value={galleryForm.album}
                          onChange={(e) => setGalleryForm({ ...galleryForm, album: e.target.value })}
                        >
                          {availableAlbums.map(alb => (
                            <option key={alb} value={alb}>{alb}</option>
                          ))}
                        </select>
                      </div>

                      {/* Local File Reader Input */}
                      <div className="form-group">
                        <label className="form-label">Upload Local Photo File*</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          onChange={handleFileChange}
                          style={{ padding: '8px' }}
                        />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                          Select any image from your computer. It reads locally and renders in the gallery instantly.
                        </span>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Or Image URL*</label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://images.unsplash.com/..."
                          value={galleryForm.url}
                          onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="form-label">Photo Caption*</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Short caption describing the class activity"
                          value={galleryForm.caption}
                          onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                          required
                        />
                      </div>

                      <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
                        Add Photo to Gallery
                      </button>
                    </form>
                  </div>

                  {/* Album Creator */}
                  <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Create New Album</h3>
                    <form onSubmit={handleAddNewAlbum} style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Album name"
                        value={newAlbumName}
                        onChange={(e) => setNewAlbumName(e.target.value)}
                        required
                      />
                      <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px' }}>
                        Create
                      </button>
                    </form>
                  </div>
                </div>

                {/* Photo list */}
                <div className="card" style={{ padding: '28px', maxHeight: '600px', overflowY: 'auto' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Current Gallery Files</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                    {gallery.map(img => (
                      <div key={img.id} style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative',
                        aspectRatio: '1',
                        backgroundColor: 'var(--bg-alt)'
                      }}>
                        <img src={img.url} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                          position: 'absolute',
                          top: '4px',
                          left: '4px',
                          backgroundColor: 'var(--primary)',
                          color: 'var(--white)',
                          fontSize: '0.62rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>
                          {img.album}
                        </div>
                        <button
                          onClick={() => deleteImage(img.id)}
                          style={{
                            position: 'absolute',
                            bottom: '6px',
                            right: '6px',
                            backgroundColor: 'rgba(239, 68, 68, 0.9)',
                            color: 'var(--white)',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= TAB: OFFICE SUITE ================= */}
          {activeTab === 'office' && (
            <div className="animated office-suite-container" style={{ maxWidth: '1000px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>Office Suite</h2>
                <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--surface)', padding: '4px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <button 
                    onClick={() => setOfficeSubTab('documents')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: officeSubTab === 'documents' ? 'var(--primary)' : 'transparent',
                      color: officeSubTab === 'documents' ? 'var(--white)' : 'var(--text)',
                      fontWeight: officeSubTab === 'documents' ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={16} /> Documents
                  </button>
                  <button 
                    onClick={() => setOfficeSubTab('tasks')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: officeSubTab === 'tasks' ? 'var(--primary)' : 'transparent',
                      color: officeSubTab === 'tasks' ? 'var(--white)' : 'var(--text)',
                      fontWeight: officeSubTab === 'tasks' ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <CheckCircle size={16} /> Tasks
                  </button>
                  <button 
                    onClick={() => setOfficeSubTab('directory')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: officeSubTab === 'directory' ? 'var(--primary)' : 'transparent',
                      color: officeSubTab === 'directory' ? 'var(--white)' : 'var(--text)',
                      fontWeight: officeSubTab === 'directory' ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Users size={16} /> Directory
                  </button>
                </div>
              </div>

              {officeSubTab === 'documents' && (
                <div className="animated">
                  <h3>Document Generator</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Select a template to generate an official document.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {['Acceptance Letter', 'Warning Letter', 'Proof of Registration', 'Fee Invoice'].map((doc) => (
                      <div key={doc} style={{
                        backgroundColor: 'var(--white)',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
                      }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '8px', 
                          backgroundColor: 'rgba(122, 28, 32, 0.1)', color: 'var(--secondary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <FileText size={20} />
                        </div>
                        <h4 style={{ margin: 0 }}>{doc}</h4>
                        <button className="btn btn-outline" style={{ marginTop: 'auto', width: '100%', fontSize: '0.9rem', padding: '8px' }}>
                          Generate
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {officeSubTab === 'tasks' && (
                <div className="animated">
                  <h3>Task Board</h3>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {/* To Do Column */}
                    <div style={{ flex: '1', minWidth: '280px', backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '16px' }}>
                      <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', color: 'var(--text-muted)' }}>
                        To Do <span style={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>2</span>
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ backgroundColor: 'var(--white)', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', border: '1px solid var(--border-color)' }}>
                          <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', fontWeight: '500' }}>Review New Grade 12 Applications</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', backgroundColor: 'rgba(122, 28, 32, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>High Priority</span>
                        </div>
                        <div style={{ backgroundColor: 'var(--white)', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', border: '1px solid var(--border-color)' }}>
                          <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', fontWeight: '500' }}>Order new textbooks</p>
                        </div>
                      </div>
                      <button style={{ width: '100%', marginTop: '12px', padding: '8px', backgroundColor: 'transparent', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer' }}>+ Add Task</button>
                    </div>
                    {/* In Progress Column */}
                    <div style={{ flex: '1', minWidth: '280px', backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '16px' }}>
                      <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', color: 'var(--text-muted)' }}>
                        In Progress <span style={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>0</span>
                      </h4>
                    </div>
                    {/* Done Column */}
                    <div style={{ flex: '1', minWidth: '280px', backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '16px' }}>
                      <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', color: 'var(--text-muted)' }}>
                        Done <span style={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>1</span>
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ backgroundColor: 'var(--white)', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', opacity: 0.6 }}>
                          <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', fontWeight: '500', textDecoration: 'line-through' }}>Update Website Notice</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {officeSubTab === 'directory' && (
                <div className="animated">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>Staff Directory</h3>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={16} /> Add Staff</button>
                  </div>
                  <div style={{ backgroundColor: 'var(--white)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border-color)' }}>
                          <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-muted)' }}>Name</th>
                          <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-muted)' }}>Role</th>
                          <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-muted)' }}>Contact</th>
                          <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-muted)' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--secondary)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>EB</div>
                            <div>
                              <div style={{ fontWeight: '500' }}>Elveria Breintjies</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Principal</div>
                            </div>
                          </td>
                          <td style={{ padding: '16px' }}>Administration</td>
                          <td style={{ padding: '16px', fontSize: '0.9rem' }}>078 070 3348</td>
                          <td style={{ padding: '16px' }}><button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit size={16} /></button></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>ST</div>
                            <div>
                              <div style={{ fontWeight: '500' }}>Staff Member</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Teacher</div>
                            </div>
                          </td>
                          <td style={{ padding: '16px' }}>Mathematics</td>
                          <td style={{ padding: '16px', fontSize: '0.9rem' }}>-</td>
                          <td style={{ padding: '16px' }}><button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit size={16} /></button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 5: SYSTEM SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div className="animated" style={{ maxWidth: '800px' }}>
              <h2>System & Website Configuration</h2>

              <form onSubmit={handleSaveSettings}>
                {/* Pricing settings */}
                <div className="card" style={{ padding: '28px', marginTop: '24px' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--secondary)' }}>Tuition Fees & Pricing Structures</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="sub-grid-mobile">
                    <div className="form-group">
                      <label className="form-label">Standard Hourly Rate (R)*</label>
                      <input
                        type="number"
                        className="form-control"
                        value={pricing.hourlyRate || ''}
                        onChange={(e) => setPricing({ ...pricing, hourlyRate: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Rewrite Monthly Installment (R)*</label>
                      <input
                        type="number"
                        className="form-control"
                        value={pricing.rewriteMonthly || ''}
                        onChange={(e) => setPricing({ ...pricing, rewriteMonthly: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="sub-grid-mobile">
                    <div className="form-group">
                      <label className="form-label">Rewrite Once-Off Settlement (R)*</label>
                      <input
                        type="number"
                        className="form-control"
                        value={pricing.rewriteOnceOff || ''}
                        onChange={(e) => setPricing({ ...pricing, rewriteOnceOff: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Activate Promotions Banner?</label>
                      <label className="form-checkbox" style={{ marginTop: '12px' }}>
                        <input
                          type="checkbox"
                          checked={pricing.promoBannerActive || false}
                          onChange={(e) => setPricing({ ...pricing, promoBannerActive: e.target.checked })}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--secondary)' }}
                        />
                        <span style={{ fontWeight: 600 }}>Yes, render promotions banner on homepage</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Promotion Banner Alert Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={pricing.promoBannerText || ''}
                      onChange={(e) => setPricing({ ...pricing, promoBannerText: e.target.value })}
                    />
                  </div>
                </div>

                {/* Content settings */}
                <div className="card" style={{ padding: '28px', marginTop: '24px', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--primary)' }}>Editable Website Text Elements</h3>

                  <div className="form-group">
                    <label className="form-label">Our Story / Philosophy Text</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={content.aboutStory || ''}
                      onChange={(e) => setContent({ ...content, aboutStory: e.target.value })}
                    ></textarea>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="sub-grid-mobile">
                    <div className="form-group">
                      <label className="form-label">Mission Statement</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={content.aboutMission || ''}
                        onChange={(e) => setContent({ ...content, aboutMission: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vision Statement</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={content.aboutVision || ''}
                        onChange={(e) => setContent({ ...content, aboutVision: e.target.value })}
                      ></textarea>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Founder Profile Biography</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={content.founderBio || ''}
                      onChange={(e) => setContent({ ...content, founderBio: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '14px', display: 'flex', gap: '8px', justifyContent: 'center' }}
                >
                  <Save size={18} /> Save Website Configurations
                </button>
              </form>

              {/* Password & Security Section */}
              <div className="card" style={{ padding: '28px', marginTop: '32px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <KeyRound size={20} /> Security & Password Management
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Update your staff portal login password.
                </p>

                {updateSuccess && (
                  <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', color: '#065f46', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 600 }}>
                    {updateSuccess}
                  </div>
                )}

                {updateError && (
                  <div style={{ backgroundColor: 'rgba(179,32,37,0.05)', border: '1px solid rgba(179,32,37,0.2)', color: 'var(--secondary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 600 }}>
                    {updateError}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="sub-grid-mobile">
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-secondary"
                    disabled={updateLoading}
                    style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <KeyRound size={16} /> {updateLoading ? 'Updating Password...' : 'Update Admin Password'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================= TAB 6: TUTORIAL GUIDE ================= */}
          {activeTab === 'guide' && (
            <div className="animated" style={{ maxWidth: '1000px', margin: '0 auto' }}>
              {/* Header Hero Card */}
              <div className="card" style={{
                padding: '36px',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: '#fff',
                marginBottom: '32px',
                borderRadius: 'var(--radius-card)',
                position: 'relative',
                overflow: 'hidden',
                border: 'none',
                boxShadow: 'var(--shadow-card)'
              }}>
                {/* Visual decorative circles */}
                <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', right: '50px', bottom: '-80px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }}></div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    <Compass size={16} /> Portal Assistant
                  </div>
                  <h2 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>
                    Rose B ALC Portal Guide
                  </h2>
                  <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '650px', marginBottom: '24px', lineHeight: '1.6' }}>
                    Welcome to the Admin Portal Guide. Here you will find in-depth instructions on managing applications, publishing notices, updating the gallery, and modifying center details.
                  </p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}>
                    <button
                      onClick={() => {
                        setCurrentTourStep(0);
                        setShowTour(true);
                      }}
                      className="btn btn-secondary"
                      style={{
                        backgroundColor: 'var(--accent)',
                        color: '#0f172a',
                        border: 'none',
                        fontWeight: 600,
                        padding: '12px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(244,197,66,0.25)'
                      }}
                    >
                      <Compass size={16} /> Restart Welcome Tour
                    </button>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', color: '#94a3b8' }}>
                      <input
                        type="checkbox"
                        checked={!dontShowAgain}
                        onChange={(e) => {
                          const val = !e.target.checked;
                          setDontShowAgain(val);
                          if (val) {
                            localStorage.setItem('rosebalc_hide_tutorial_autoplay', 'true');
                          } else {
                            localStorage.removeItem('rosebalc_hide_tutorial_autoplay');
                          }
                        }}
                        style={{ accentColor: 'var(--accent)', width: '16px', height: '16px', borderRadius: '4px' }}
                      />
                      <span>Show tour automatically on login</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Guide Sub Tabs */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '1px', marginBottom: '28px', overflowX: 'auto' }} className="sub-tabs-scroll">
                {[
                  { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
                  { id: 'applications', label: 'Applications', icon: Users },
                  { id: 'notices', label: 'Notices Board', icon: Bell },
                  { id: 'gallery', label: 'Gallery Media', icon: Image },
                  { id: 'settings', label: 'System Config', icon: Settings }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = guideTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setGuideTab(tab.id)}
                      style={{
                        padding: '10px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: isActive ? '#fff' : 'transparent',
                        border: '1px solid ' + (isActive ? 'var(--border-color)' : 'transparent'),
                        borderBottom: isActive ? '1px solid #fff' : 'none',
                        color: isActive ? 'var(--secondary)' : 'var(--text-muted)',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                        marginBottom: '-1px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Sub Tab Content */}
              <div className="card" style={{ padding: '32px', minHeight: '350px' }}>
                {guideTab === 'getting-started' && (
                  <div className="animated">
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--secondary)' }}>Getting Started with the Admin Portal</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.6' }}>
                      The Rose Breintjies ALC Admin Portal is a custom academic management system designed to streamline your daily operations. You can monitor registrations, send confirmation emails, publish announcements, manage gallery photos, and edit website rates.
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }} className="sub-grid-mobile">
                      <div style={{ border: '1px solid #f1f5f9', padding: '20px', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc' }}>
                        <h4 style={{ fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle size={18} style={{ color: 'var(--accent)' }} /> Admin Checklist
                        </h4>
                        <ul style={{ paddingLeft: '18px', fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.45' }}>
                          <li><strong>Daily:</strong> Check for incoming Grade 12 or Rewrite applications.</li>
                          <li><strong>Weekly:</strong> Review and update application admission statuses.</li>
                          <li><strong>Ad-hoc:</strong> Publish notices regarding holidays or academic results.</li>
                          <li><strong>Periodic:</strong> Upload photos to the gallery showing student progress.</li>
                        </ul>
                      </div>
                      
                      <div style={{ border: '1px solid #f1f5f9', padding: '20px', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc' }}>
                        <h4 style={{ fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Lock size={18} style={{ color: 'var(--secondary)' }} /> Security Best Practices
                        </h4>
                        <ul style={{ paddingLeft: '18px', fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.45' }}>
                          <li>Keep your password private and update it in settings if compromised.</li>
                          <li>Log out when using public, shared, or unsecure terminals.</li>
                          <li>Double check the recipient's email address before emailing admission documents.</li>
                          <li>All status changes and notice edits apply in real-time.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {guideTab === 'applications' && (
                  <div className="animated">
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--secondary)' }}>Managing Student Admissions</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.6' }}>
                      All online registrations from the Admissions page appear in the <strong>Applications</strong> tab. Here is how you can manage them:
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem', fontWeight: 600 }}>1</div>
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>Admission Status Workflow</strong>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.5' }}>
                            New submissions default to <strong>Pending</strong>. Review candidate grades and personal details. You can update status to <strong>Accepted</strong> or <strong>Rejected</strong> using the quick actions panel inside the application review window.
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem', fontWeight: 600 }}>2</div>
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>Professional Letterhead & PDF Export</strong>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.5' }}>
                            For every application, click the <strong>"Print Letterhead"</strong> button to open a formal letter view complete with center registration numbers, tax references, and signature lines. You can easily print or save this as a PDF.
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem', fontWeight: 600 }}>3</div>
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>Automated Email Notifications</strong>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.5' }}>
                            Use the <strong>"Send Email"</strong> feature inside the application details dialog to compose template-based letters (e.g. Acceptance or Status Updates). This triggers your mail client with pre-populated, professionally formatted templates.
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem', fontWeight: 600 }}>4</div>
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>Exporting data to Spreadsheet (CSV)</strong>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.5' }}>
                            Need to work locally or back up student directories? Click <strong>"Export Excel/CSV"</strong> from the applications tab header to download the complete directory containing parent details, contact phone numbers, and grades.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {guideTab === 'notices' && (
                  <div className="animated">
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--secondary)' }}>Managing the Announcements Board</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.6' }}>
                      The Notices board is the primary channel for displaying updates to learners and parents on the public website. You can post, edit, or delete notices.
                    </p>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc', marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Plus size={16} /> Creating an Announcement
                      </h4>
                      <ol style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li>Navigate to the <strong>Notices</strong> tab on the sidebar.</li>
                        <li>Fill in the title, and select a category (<strong>General</strong>, <strong>Academic</strong>, <strong>Sport</strong>, or <strong>Holiday</strong>).</li>
                        <li>Write the announcement description. Keep the message clear and readable.</li>
                        <li>Click <strong>Publish Notice</strong>. The notice immediately goes live on the announcements webpage.</li>
                      </ol>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="sub-grid-mobile">
                      <div style={{ padding: '16px', border: '1px dashed #e2e8f0', borderRadius: '6px' }}>
                        <h5 style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: '6px' }}>Editing Notices</h5>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                          Click the yellow <strong>Edit</strong> button next to any notice in the list to populate the creation form with its details. Once edited, click the save button to update the database.
                        </p>
                      </div>
                      <div style={{ padding: '16px', border: '1px dashed #e2e8f0', borderRadius: '6px' }}>
                        <h5 style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: '6px' }}>Removing Notices</h5>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                          Outdated announcements should be cleaned up. Click the red <strong>Delete</strong> button to remove a notice. This will permanently remove the notice from public views.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {guideTab === 'gallery' && (
                  <div className="animated">
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--secondary)' }}>Managing Center Gallery & Media</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.6' }}>
                      Showcase student life, workshops, and school events to prospects. The gallery manager allows cataloging photos into albums.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      <div style={{ padding: '16px', border: '1px solid #f1f5f9', borderRadius: '6px' }}>
                        <strong style={{ display: 'block', color: '#0f172a', marginBottom: '6px' }}>Creating Custom Albums</strong>
                        The database tracks albums dynamically. To create a new album, write the name under "Create New Album" in the form sidebar and hit the save button. It will now be available in the dropdown selector.
                      </div>
                      
                      <div style={{ padding: '16px', border: '1px solid #f1f5f9', borderRadius: '6px' }}>
                        <strong style={{ display: 'block', color: '#0f172a', marginBottom: '6px' }}>Adding Photos</strong>
                        Select the target album, enter a secure image URL (from a file hosting or website directory), write a descriptive caption, and click <strong>"Upload Image"</strong>. The photo immediately renders in the public gallery.
                      </div>

                      <div style={{ padding: '16px', border: '1px solid #f1f5f9', borderRadius: '6px' }}>
                        <strong style={{ display: 'block', color: '#0f172a', marginBottom: '6px' }}>Removing Images</strong>
                        To delete a photo, find the image card in the list view, verify the thumbnail matches the target, and click the red <strong>"Delete"</strong> button. The action takes effect immediately.
                      </div>
                    </div>
                  </div>
                )}

                {guideTab === 'settings' && (
                  <div className="animated">
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--secondary)' }}>System Configuration & Settings</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.6' }}>
                      Perform core system updates to customize rates, manage public page texts, and secure the portal.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }} className="sub-grid-mobile">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                          <h5 style={{ fontSize: '0.88rem', color: '#0f172a', marginBottom: '4px' }}>Tuition Rates</h5>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Edit registration costs, hourly fees, and exam prep pricing. These dynamically calculate quotes on the public Tuition Fee estimator page.</span>
                        </div>
                        <div style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                          <h5 style={{ fontSize: '0.88rem', color: '#0f172a', marginBottom: '4px' }}>Static Texts</h5>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Modify the Principal's welcome note, the mission/vision statement, and about summaries.</span>
                        </div>
                      </div>
                      
                      <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                        <h4 style={{ fontSize: '1rem', color: 'var(--secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <KeyRound size={16} /> Modifying Admin Password
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.4' }}>
                          To change your password, type a new password (minimum 6 characters), confirm it, and submit the password update form. This updates your credentials in Supabase.
                        </p>
                        <div style={{ padding: '10px 14px', borderLeft: '3px solid var(--accent)', backgroundColor: 'rgba(244,197,66,0.08)', fontSize: '0.78rem', color: '#854d0e', borderRadius: '2px' }}>
                          <strong>Note:</strong> Password resets are also supported from the login page screen. Make sure to enter your verified administrator email address to receive instructions.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ===== MOBILE BOTTOM TAB BAR (visible < 768px) ===== */}
      <nav className="dash-bottom-tabs" aria-label="Dashboard navigation">
        <div className="dash-bottom-tabs-inner">
          <button
            className={`dash-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setSelectedApp(null); }}
          >
            <Settings size={20} />
            Overview
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <Users size={20} />
            <span>Apps ({apps.length})</span>
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'notices' ? 'active' : ''}`}
            onClick={() => setActiveTab('notices')}
          >
            <Bell size={20} />
            Notices
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <Image size={20} />
            Gallery
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'office' ? 'active' : ''}`}
            onClick={() => setActiveTab('office')}
          >
            <Briefcase size={20} />
            Office
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            Settings
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
            onClick={() => setActiveTab('guide')}
          >
            <HelpCircle size={20} />
            Guide
          </button>
        </div>
      </nav>

      {/* ================= INTERACTIVE TUTORIAL GUIDE TOUR OVERLAY ================= */}
      {showTour && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px',
          animation: 'fadeIn 0.25s ease'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }} className="animated">
            
            {/* Header Banner */}
            <div style={{
              background: 'linear-gradient(135deg, var(--secondary) 0%, #3e0c0f 100%)',
              padding: '24px 32px',
              color: '#ffffff',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowTour(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              >
                <X size={15} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
                <Compass size={14} /> Interactive Assistant
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '1.5rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', margin: 0 }}>
                {currentTourStep === 0 && "Welcome to Rose B ALC Portal"}
                {currentTourStep === 1 && "Dashboard Overview"}
                {currentTourStep === 2 && "Applications & Admissions"}
                {currentTourStep === 3 && "Notices Board Announcements"}
                {currentTourStep === 4 && "Gallery Control Panel"}
                {currentTourStep === 5 && "System Configurations"}
                {currentTourStep === 6 && "Portal User Manual"}
              </h3>
            </div>

            {/* Tour Body */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Step Illustrations / Icons */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(122, 28, 32, 0.08)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {currentTourStep === 0 && <Compass size={32} />}
                  {currentTourStep === 1 && <Settings size={32} />}
                  {currentTourStep === 2 && <Users size={32} />}
                  {currentTourStep === 3 && <Bell size={32} />}
                  {currentTourStep === 4 && <Image size={32} />}
                  {currentTourStep === 5 && <Settings size={32} />}
                  {currentTourStep === 6 && <HelpCircle size={32} />}
                </div>
              </div>

              {/* Text Description */}
              <div style={{ textAlign: 'center' }}>
                {currentTourStep === 0 && (
                  <>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500, marginBottom: '10px' }}>
                      Welcome, Administrator!
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      We have prepared a short interactive guide to walk you through the key sections of your portal. Let's make sure you get the most out of your admin dashboard.
                    </p>
                  </>
                )}

                {currentTourStep === 1 && (
                  <>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500, marginBottom: '10px' }}>
                      Monitor Stats at a Glance
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      Your <strong>Overview Dashboard</strong> gathers live counts for registered applications, notices, and gallery images, plus lists recent admissions in real-time.
                    </p>
                  </>
                )}

                {currentTourStep === 2 && (
                  <>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500, marginBottom: '10px' }}>
                      Manage admissions efficiently
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      Review registrations in the <strong>Applications</strong> tab. Change applicant status (Accept/Reject), print formal letterheads (PDF-friendly), export database records, and trigger notification emails.
                    </p>
                  </>
                )}

                {currentTourStep === 3 && (
                  <>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500, marginBottom: '10px' }}>
                      Announcements Board
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      Need to notify parents? Use the <strong>Notices</strong> tab to create and publish center news, holiday messages, or academic schedules. These are updated live on the public notices page.
                    </p>
                  </>
                )}

                {currentTourStep === 4 && (
                  <>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500, marginBottom: '10px' }}>
                      Gallery Showcase
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      Publish center activities in the <strong>Gallery</strong> tab. Organize pictures into custom albums, insert image URLs, and add captions to share student life with site visitors.
                    </p>
                  </>
                )}

                {currentTourStep === 5 && (
                  <>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500, marginBottom: '10px' }}>
                      Tuition Rates & Content Updates
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      Configure the tuition fee calculator and update homepage copy (such as the Principal's message) in the <strong>Settings</strong> tab. You can also update your security password here.
                    </p>
                  </>
                )}

                {currentTourStep === 6 && (
                  <>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500, marginBottom: '10px' }}>
                      Full Documentation Available 24/7
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      If you ever need help later, you can find this detailed user guide anytime on the <strong>Help & Guide</strong> tab in the sidebar.
                    </p>
                  </>
                )}
              </div>

              {/* Progress Indicator Dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', margin: '8px 0' }}>
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: currentTourStep === i ? 'var(--secondary)' : '#cbd5e1',
                      transition: 'background-color 0.25s'
                    }}
                  />
                ))}
              </div>

              {/* Footer Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #f1f5f9',
                paddingTop: '20px',
                marginTop: '8px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setDontShowAgain(val);
                      if (val) {
                        localStorage.setItem('rosebalc_hide_tutorial_autoplay', 'true');
                      } else {
                        localStorage.removeItem('rosebalc_hide_tutorial_autoplay');
                      }
                    }}
                    style={{ accentColor: 'var(--secondary)', width: '15px', height: '15px' }}
                  />
                  <span>Don't show on login</span>
                </label>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {currentTourStep > 0 ? (
                    <button
                      onClick={() => {
                        const prevStep = currentTourStep - 1;
                        setCurrentTourStep(prevStep);
                        if (prevStep === 0) setActiveTab('overview');
                        if (prevStep === 1) setActiveTab('overview');
                        if (prevStep === 2) setActiveTab('applications');
                        if (prevStep === 3) setActiveTab('notices');
                        if (prevStep === 4) setActiveTab('gallery');
                        if (prevStep === 5) setActiveTab('settings');
                        if (prevStep === 6) setActiveTab('guide');
                      }}
                      className="btn btn-secondary"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#f1f5f9',
                        color: 'var(--text)',
                        border: '1px solid #cbd5e1',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <ChevronLeft size={14} /> Back
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowTour(false)}
                      className="btn btn-secondary"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        backgroundColor: 'transparent',
                        color: 'var(--text-muted)',
                        border: 'none'
                      }}
                    >
                      Skip Guide
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const nextStep = currentTourStep + 1;
                      if (nextStep <= 6) {
                        setCurrentTourStep(nextStep);
                        if (nextStep === 1) setActiveTab('overview');
                        if (nextStep === 2) setActiveTab('applications');
                        if (nextStep === 3) setActiveTab('notices');
                        if (nextStep === 4) setActiveTab('gallery');
                        if (nextStep === 5) setActiveTab('settings');
                        if (nextStep === 6) setActiveTab('guide');
                      } else {
                        setShowTour(false);
                      }
                    }}
                    className="btn btn-primary"
                    style={{
                      padding: '8px 18px',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'var(--secondary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    {currentTourStep === 0 && <>Get Started <ChevronRight size={14} /></>}
                    {currentTourStep > 0 && currentTourStep < 6 && <>Next <ChevronRight size={14} /></>}
                    {currentTourStep === 6 && <>Finish</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

