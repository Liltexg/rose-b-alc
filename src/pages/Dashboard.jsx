import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { 
  FileText, Bell, Image, Settings, Users, ArrowRight, Plus, 
  Trash2, Edit, Save, Lock, LogOut, CheckCircle, Search, 
  Download, Printer, AlertTriangle, FileSpreadsheet, Mail, X
} from 'lucide-react';

export default function Dashboard({ setCurrentPage, setIsAdminState }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('admin@rosebalc.co.za');
  const [password, setPassword] = useState('ameera@brose');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('overview');

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
  const [noticeForm, setNoticeForm] = useState({ id: null, title: '', category: 'General', body: '', author: 'E. Bruintjies (Principal)' });
  const [isEditingNotice, setIsEditingNotice] = useState(false);

  // Email modal states
  const [emailModal, setEmailModal] = useState(null); // null = closed, or { app, subject, body }

  // Gallery states
  const [galleryForm, setGalleryForm] = useState({ album: 'Academic Support', url: '', caption: '' });
  const [newAlbumName, setNewAlbumName] = useState('');
  const [availableAlbums, setAvailableAlbums] = useState([]);

  // Check current session on load
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
  }, []);

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

We are pleased to inform you that the application submitted for ${name} for the ${prog} programme at Rose B After School Learning Centre has been ACCEPTED.

Please contact us to arrange for the necessary paperwork and registration formalities at your earliest convenience.

We look forward to welcoming ${app.learnerName} to our centre and supporting their academic journey.

Warm regards,
E. Bruintjies
Principal – Rose B After School Learning Centre
edwardbreintjies@rosebalc.co.za`,
      };
    }

    if (type === 'reject') {
      return {
        subject: `Application Update – ${name} | Rose B ALC`,
        body:
`Dear ${contactName},

Thank you for submitting an application for ${name} for the ${prog} programme at Rose B After School Learning Centre.

After careful consideration, we regret to inform you that we are unable to accommodate the application at this time. This may be due to limited availability or programme capacity.

We encourage you to reach out to us for future intake opportunities.

Kind regards,
E. Bruintjies
Principal – Rose B After School Learning Centre
edwardbreintjies@rosebalc.co.za`,
      };
    }

    // reviewed / pending
    return {
      subject: `Application Under Review – ${name} | Rose B ALC`,
      body:
`Dear ${contactName},

Thank you for applying to Rose B After School Learning Centre on behalf of ${name} for the ${prog} programme.

We would like to inform you that the application is currently under review. We will be in contact with you shortly with a final decision.

Should you have any queries in the meantime, please feel free to reach out.

Kind regards,
E. Bruintjies
Principal – Rose B After School Learning Centre
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
        top:    { style: 'thin', color: { argb: 'FF003366' } },
        left:   { style: 'thin', color: { argb: 'FF003366' } },
        bottom: { style: 'thin', color: { argb: 'FF003366' } },
        right:  { style: 'thin', color: { argb: 'FF003366' } },
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
        { width: 8  }, // Grade
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
        'Pending':  { bg: 'FFF59E0B', fg: 'FFFFFFFF' },
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
          cell.font  = { size: 9, name: 'Calibri' };
          cell.alignment = { vertical: 'middle', wrapText: true,
            horizontal: ci === 10 ? 'center' : 'left' };
          cell.border = cellBorder;
          // Status column coloring
          if (ci === 10 && statusColors[val]) {
            const sc = statusColors[val];
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: sc.bg } };
            cell.font  = { size: 9, bold: true, color: { argb: sc.fg }, name: 'Calibri' };
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
      const pending  = apps.filter(a => a.status === 'Pending').length;
      const approved = apps.filter(a => a.status === 'Approved').length;
      const rejected = apps.filter(a => a.status === 'Rejected').length;
      sumCell.value = `SUMMARY  —  Total: ${apps.length}   |   Pending: ${pending}   |   Approved: ${approved}   |   Rejected: ${rejected}`;
      sumCell.font  = { bold: true, size: 9, color: { argb: 'FFFFFFFF' } };
      sumCell.alignment = { vertical: 'middle', horizontal: 'center' };
      sumCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };

      // ── OLD-SCHOOL GRAY BOX STAMP (Canvas) ───────────────────────
      const sc = document.createElement('canvas');
      sc.width  = 380;
      sc.height = 200;
      const ctx = sc.getContext('2d');
      ctx.clearRect(0, 0, sc.width, sc.height);

      // Shadow for authenticity
      ctx.shadowColor   = 'rgba(0,0,0,0.18)';
      ctx.shadowBlur    = 6;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      // Outer thick box
      ctx.strokeStyle = '#5a5a5a';
      ctx.lineWidth   = 5;
      ctx.strokeRect(8, 8, 364, 184);

      ctx.shadowColor = 'transparent';

      // Inner thin box (double-border effect)
      ctx.strokeStyle = '#7a7a7a';
      ctx.lineWidth   = 1.5;
      ctx.strokeRect(16, 16, 348, 168);

      // Top school name
      ctx.fillStyle = '#4a4a4a';
      ctx.font      = 'bold 12px "Courier New", Courier, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ROSE B AFTER SCHOOL', 190, 42);
      ctx.fillText('LEARNING CENTER', 190, 58);

      // Separator
      ctx.strokeStyle = '#909090';
      ctx.lineWidth   = 1;
      ctx.beginPath(); ctx.moveTo(30, 68); ctx.lineTo(350, 68); ctx.stroke();

      // VERIFIED
      ctx.fillStyle = '#3a3a3a';
      ctx.font      = 'bold 26px "Courier New", Courier, monospace';
      ctx.fillText('V E R I F I E D', 190, 105);

      // Date
      const stampDate = new Date().toLocaleDateString('en-ZA',
        { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.fillStyle = '#666666';
      ctx.font      = '11px "Courier New", Courier, monospace';
      ctx.fillText(stampDate, 190, 128);

      // Separator
      ctx.strokeStyle = '#909090';
      ctx.lineWidth   = 1;
      ctx.beginPath(); ctx.moveTo(30, 142); ctx.lineTo(350, 142); ctx.stroke();

      // Footer text
      ctx.fillStyle = '#777777';
      ctx.font      = '9px "Courier New", Courier, monospace';
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
      const blob   = new Blob([buffer], {
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
          <title>Application Record - ${app.learnerName} ${app.learnerSurname}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
            @page { size: A4; margin: 0; }
            body { 
              font-family: 'Inter', sans-serif; 
              padding: 20mm; 
              color: #1a1a1a; 
              line-height: 1.6; 
              max-width: 100%; 
              margin: 0 auto; 
              background: #fff; 
              position: relative; 
              box-sizing: border-box;
            }
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              opacity: 0.04;
              width: 500px;
              z-index: -2;
              pointer-events: none;
            }
            .header-container { 
              display: flex; 
              align-items: center; 
              border-bottom: 3px solid #7A1C20; 
              padding-bottom: 24px; 
              margin-bottom: 32px; 
            }
            .header-logo { 
              width: 100px; 
              height: 100px; 
              object-fit: contain; 
              margin-right: 24px; 
            }
            .header-text { flex-grow: 1; }
            .header-text h2 { 
              margin: 0 0 4px 0; 
              color: #7A1C20; 
              font-family: 'Cormorant Garamond', serif; 
              font-size: 2.8rem; 
              letter-spacing: 0.02em; 
              font-weight: 700; 
              text-transform: uppercase; 
            }
            .header-text p { 
              margin: 0; 
              color: #555; 
              font-size: 1rem; 
              letter-spacing: 1px; 
              text-transform: uppercase; 
              font-weight: 600; 
            }
            .status-badge { 
              padding: 6px 16px; 
              border-radius: 4px; 
              font-size: 0.9rem; 
              font-weight: 700; 
              text-transform: uppercase; 
              letter-spacing: 1px; 
              border: 2px solid #1a1a1a; 
            }
            .section-title { 
              border-bottom: 2px solid #7A1C20; 
              padding-bottom: 6px; 
              margin-top: 32px; 
              margin-bottom: 16px; 
              color: #7A1C20; 
              font-size: 1.3rem; 
              font-family: 'Cormorant Garamond', serif; 
              text-transform: uppercase; 
              letter-spacing: 1.5px; 
              font-weight: 700; 
            }
            .field-row { 
              display: grid; 
              grid-template-columns: 240px 1fr; 
              border-bottom: 1px solid #eee; 
              padding: 12px 0; 
              font-size: 1rem; 
              align-items: center; 
              page-break-inside: avoid; 
            }
            .field-label { 
              font-weight: 600; 
              color: #555; 
              text-transform: uppercase; 
              font-size: 0.85rem; 
              letter-spacing: 0.05em; 
            }
            .field-value { font-weight: 500; color: #000; }
            .signature-box { 
              border: 1px solid #ccc; 
              padding: 24px; 
              margin-top: 16px; 
              min-height: 80px; 
              font-style: italic; 
              background: #fff; 
              border-radius: 4px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: #555; 
              page-break-inside: avoid; 
            }
            .signature-img { 
              max-height: 80px; 
              display: block; 
              margin-top: 16px; 
              page-break-inside: avoid; 
            }
            .footer-stamp { 
              margin-top: 60px; 
              padding-top: 20px; 
              border-top: 1px solid #ccc; 
              text-align: center; 
              color: #555; 
              font-size: 0.85rem; 
              font-weight: 500; 
              position: relative; 
              page-break-inside: avoid; 
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .css-stamp-box {
              width: 320px;
              border: 5px solid #5a5a5a;
              padding: 4px;
              font-family: "Courier New", Courier, monospace;
              color: #3a3a3a;
              text-align: center;
              background: transparent;
            }
            .css-stamp-inner {
              border: 1.5px solid #7a7a7a;
              padding: 12px;
            }
            .css-stamp-title {
              font-size: 14px;
              font-weight: bold;
              color: #4a4a4a;
              line-height: 1.2;
            }
            .css-stamp-separator {
              border-top: 1px solid #909090;
              margin: 8px auto;
              width: 80%;
            }
            .css-stamp-verified {
              font-size: 24px;
              font-weight: bold;
              margin: 10px 0;
              letter-spacing: 2px;
            }
            .css-stamp-date {
              font-size: 12px;
              color: #666;
              margin-bottom: 10px;
            }
            .css-stamp-footer {
              font-size: 10px;
              color: #777;
              line-height: 1.2;
            }
            @media print { 
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .header-text h2, .section-title { color: #000 !important; border-color: #000 !important; }
              .header-container { border-color: #000 !important; }
              .watermark { opacity: 0.04 !important; }
            }
          </style>
        </head>
        <body>
          <img src="/logo.png" class="watermark" alt="" />
          <div class="header-container">
            <img src="/logo.png" class="header-logo" alt="School Logo" />
            <div class="header-text">
              <h2>Rose B ALC</h2>
              <p>Official Application Record • Confidential</p>
            </div>
            <div>
              <span class="status-badge">${app.status}</span>
            </div>
          </div>

          <div class="field-row">
            <span class="field-label">Reference ID</span>
            <span class="field-value" style="font-family: monospace; font-size: 1.1rem;">${app.id}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Date Submitted</span>
            <span class="field-value">${new Date(app.dateSubmitted).toLocaleString('en-ZA')}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Enrolled Programme</span>
            <span class="field-value"><strong style="font-size: 1.1rem;">${app.programme}</strong></span>
          </div>

          <h3 class="section-title">Candidate Details</h3>
          <div class="field-row"><span class="field-label">First Name</span><span class="field-value">${app.learnerName}</span></div>
          <div class="field-row"><span class="field-label">Surname</span><span class="field-value">${app.learnerSurname}</span></div>
          <div class="field-row"><span class="field-label">Grade Level</span><span class="field-value">${app.learnerGrade}</span></div>
          <div class="field-row"><span class="field-label">Tutoring Subjects</span><span class="field-value">${app.learnerSubjects.join(' • ')}</span></div>

          ${app.programme === 'Grade 12' ? `
            <h3 class="section-title">Parent / Guardian Information</h3>
            <div class="field-row"><span class="field-label">Full Name</span><span class="field-value">${app.parentName} ${app.parentSurname}</span></div>
            <div class="field-row"><span class="field-label">Contact Number</span><span class="field-value">${app.parentContact}</span></div>
            <div class="field-row"><span class="field-label">Physical Address</span><span class="field-value">${app.parentAddress}</span></div>
          ` : `
            <h3 class="section-title">Contact & Emergency Details</h3>
            <div class="field-row"><span class="field-label">Candidate Contact</span><span class="field-value">${app.learnerPhone}</span></div>
            <div class="field-row"><span class="field-label">Physical Address</span><span class="field-value">${app.learnerAddress}</span></div>
            <div class="field-row"><span class="field-label">Emergency Contact</span><span class="field-value">${app.emergencyContact}</span></div>
          `}

          <h3 class="section-title">Legal Assents</h3>
          <div class="field-row"><span class="field-label">Accepts Terms & Conditions</span><span class="field-value">✓ Acknowledged</span></div>
          <div class="field-row"><span class="field-label">Marketing Photos Consent</span><span class="field-value">${app.consentPhotos ? '✓ Consented' : '✗ Declined'}</span></div>
          <div class="field-row"><span class="field-label">Affirms Information Accuracy</span><span class="field-value">✓ Verified</span></div>
          
          <h3 class="section-title">Digital Signature Validation</h3>
          ${app.signature.startsWith('data:image') ? `
            <img src="${app.signature}" class="signature-img" />
          ` : `
            <div class="signature-box">${app.signature}</div>
          `}

          <div class="footer-stamp">
            <div class="css-stamp-box">
              <div class="css-stamp-inner">
                <div class="css-stamp-title">ROSE B AFTER SCHOOL<br/>LEARNING CENTER</div>
                <div class="css-stamp-separator"></div>
                <div class="css-stamp-verified">V E R I F I E D</div>
                <div class="css-stamp-date">${new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="css-stamp-separator"></div>
                <div class="css-stamp-footer">OFFICIAL ELECTRONIC DOCUMENT<br/>Rose B ALC | Authorised Export</div>
              </div>
            </div>
            <div style="margin-top: 20px;">
              Document generated electronically from the Rose B ALC Administration System.<br/>
              This is an official record. Do not alter or duplicate without authorization.
            </div>
          </div>

          <script>
            // Wait for images to load before printing
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500);
            };
            // Fallback if onload doesn't fire
            setTimeout(() => {
              window.print();
            }, 1500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const printNotice = (notice) => {
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
            @media print { 
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
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

    setNoticeForm({ id: null, title: '', category: 'General', body: '', author: 'E. Bruintjies (Principal)' });
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
    /* MOCK AUTH LOGIN VIEW */
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
                  placeholder="admin@rosebalc.co.za"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Password</label>
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
              onClick={() => { setActiveTab('settings'); }}
              className={`pro-sidebar-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            >
              <Settings size={18} /> Settings
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
                      placeholder="e.g. E. Bruintjies (Principal)"
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
                          setNoticeForm({ id: null, title: '', category: 'General', body: '', author: 'E. Bruintjies (Principal)' });
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
                      onChange={(e) => setPricing({...pricing, hourlyRate: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rewrite Monthly Installment (R)*</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={pricing.rewriteMonthly || ''}
                      onChange={(e) => setPricing({...pricing, rewriteMonthly: parseInt(e.target.value) || 0})}
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
                      onChange={(e) => setPricing({...pricing, rewriteOnceOff: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Activate Promotions Banner?</label>
                    <label className="form-checkbox" style={{ marginTop: '12px' }}>
                      <input 
                        type="checkbox"
                        checked={pricing.promoBannerActive || false}
                        onChange={(e) => setPricing({...pricing, promoBannerActive: e.target.checked})}
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
                    onChange={(e) => setPricing({...pricing, promoBannerText: e.target.value})}
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
                    onChange={(e) => setContent({...content, aboutStory: e.target.value})}
                  ></textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="sub-grid-mobile">
                  <div className="form-group">
                    <label className="form-label">Mission Statement</label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      value={content.aboutMission || ''}
                      onChange={(e) => setContent({...content, aboutMission: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vision Statement</label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      value={content.aboutVision || ''}
                      onChange={(e) => setContent({...content, aboutVision: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Founder Profile Biography</label>
                  <textarea 
                    className="form-control"
                    rows="4"
                    value={content.founderBio || ''}
                    onChange={(e) => setContent({...content, founderBio: e.target.value})}
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
          </div>
        )}

      </div>
    </div>
  );
}

