import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { 
  FileText, Bell, Image, Settings, Users, ArrowRight, Plus, 
  Trash2, Edit, Save, Lock, LogOut, CheckCircle, Search, 
  Download, Printer, AlertTriangle, FileSpreadsheet 
} from 'lucide-react';

export default function Dashboard({ setCurrentPage, setIsAdminState }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('admin123'); // Pre-filled for user convenience
  const [loginError, setLoginError] = useState('');
  
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

  // Gallery states
  const [galleryForm, setGalleryForm] = useState({ album: 'Academic Support', url: '', caption: '' });
  const [newAlbumName, setNewAlbumName] = useState('');
  const [availableAlbums, setAvailableAlbums] = useState([]);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setIsAdminState(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Password. Use the default: admin123');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminState(false);
    setSelectedApp(null);
  };

  // Load data from db service
  const reloadAllData = () => {
    setApps(db.getApplications());
    setNotices(db.getNotices());
    const gall = db.getGallery();
    setGallery(gall);
    setPricing(db.getPricing());
    setContent(db.getContent());

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
  const updateAppStatus = (id, status) => {
    db.updateApplicationStatus(id, status);
    reloadAllData();
    if (selectedApp?.id === id) {
      setSelectedApp(prev => ({ ...prev, status }));
    }
  };

  const deleteApp = (id) => {
    if (window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      db.deleteApplication(id);
      setSelectedApp(null);
      reloadAllData();
    }
  };

  const exportAppToCSV = () => {
    // Generate CSV contents
    const headers = ["Application ID", "Date Submitted", "Programme", "Candidate Name", "Candidate Surname", "Phone/Contact", "Physical Address", "Grade", "Subjects", "Emergency Contact", "Status"];
    const rows = apps.map(app => {
      const contact = app.programme === 'Grade 12' ? app.parentContact : app.learnerPhone;
      const address = app.programme === 'Grade 12' ? app.parentAddress : app.learnerAddress;
      const subjects = app.learnerSubjects ? app.learnerSubjects.join('; ') : '';
      return [
        app.id,
        new Date(app.dateSubmitted).toLocaleDateString('en-ZA'),
        app.programme,
        app.learnerName,
        app.learnerSurname,
        contact,
        address.replace(/,/g, ' '),
        app.learnerGrade,
        subjects,
        app.emergencyContact || 'N/A',
        app.status
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rose_b_alc_applications_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printApp = (app) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Application Printout - ${app.learnerName} ${app.learnerSurname}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #2B2B2B; line-height: 1.6; }
            .badge { background: #B32025; color: white; padding: 4px 12px; border-radius: 99px; font-size: 0.8rem; font-weight: bold; }
            .section-title { border-bottom: 2px solid #3B3B3B; padding-bottom: 8px; margin-top: 30px; color: #3B3B3B; font-size: 1.1rem; }
            .field-row { display: grid; grid-template-columns: 200px 1fr; border-bottom: 1px solid #EEEEEE; padding: 8px 0; font-size: 0.95rem; }
            .field-label { font-weight: bold; }
            .signature-box { border: 1px solid #CCCCCC; padding: 16px; margin-top: 10px; min-height: 60px; font-style: italic; }
          </style>
        </head>
        <body>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h2>Rose B ALC - Official Application Record</h2>
            <span class="badge">${app.status}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Application ID:</span>
            <span>${app.id}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Date Submitted:</span>
            <span>${new Date(app.dateSubmitted).toLocaleString('en-ZA')}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Enrolled Programme:</span>
            <span><strong>${app.programme}</strong></span>
          </div>

          <h3 class="section-title">Candidate details</h3>
          <div class="field-row"><span class="field-label">First Name:</span><span>${app.learnerName}</span></div>
          <div class="field-row"><span class="field-label">Surname:</span><span>${app.learnerSurname}</span></div>
          <div class="field-row"><span class="field-label">Grade Level:</span><span>${app.learnerGrade}</span></div>
          <div class="field-row"><span class="field-label">Tutoring Subjects:</span><span>${app.learnerSubjects.join(', ')}</span></div>

          ${app.programme === 'Grade 12' ? `
            <h3 class="section-title">Parent / Guardian Information</h3>
            <div class="field-row"><span class="field-label">Parent Name:</span><span>${app.parentName} ${app.parentSurname}</span></div>
            <div class="field-row"><span class="field-label">Contact Number:</span><span>${app.parentContact}</span></div>
            <div class="field-row"><span class="field-label">Physical Address:</span><span>${app.parentAddress}</span></div>
          ` : `
            <h3 class="section-title">Contact & Emergency details</h3>
            <div class="field-row"><span class="field-label">Candidate Contact:</span><span>${app.learnerPhone}</span></div>
            <div class="field-row"><span class="field-label">Physical Address:</span><span>${app.learnerAddress}</span></div>
            <div class="field-row"><span class="field-label">Emergency Contact:</span><span>${app.emergencyContact}</span></div>
          `}

          <h3 class="section-title">Legal Assents</h3>
          <div class="field-row"><span class="field-label">Accepts Terms:</span><span>Yes (Checked)</span></div>
          <div class="field-row"><span class="field-label">Marketing Photos Consent:</span><span>${app.consentPhotos ? 'Yes' : 'No'}</span></div>
          <div class="field-row"><span class="field-label">Affirms Accuracy:</span><span>Yes (Checked)</span></div>
          
          <h3 class="section-title">Digital Signature</h3>
          ${app.signature.startsWith('data:image') ? `
            <img src="${app.signature}" style="max-height: 80px; border: 1px solid #CCCCCC; display:block; margin-top:10px;" />
          ` : `
            <div class="signature-box">${app.signature}</div>
          `}

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
  const handleNoticeSubmit = (e) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.body.trim()) {
      alert("Title and Body are required");
      return;
    }

    if (isEditingNotice) {
      db.updateNotice(noticeForm.id, {
        title: noticeForm.title,
        category: noticeForm.category,
        body: noticeForm.body,
        author: noticeForm.author
      });
      setIsEditingNotice(false);
    } else {
      db.addNotice({
        title: noticeForm.title,
        category: noticeForm.category,
        body: noticeForm.body,
        author: noticeForm.author
      });
    }

    setNoticeForm({ id: null, title: '', category: 'General', body: '', author: 'E. Bruintjies (Principal)' });
    reloadAllData();
  };

  const startEditNotice = (notice) => {
    setNoticeForm(notice);
    setIsEditingNotice(true);
  };

  const deleteNotice = (id) => {
    if (window.confirm("Are you sure you want to delete this notice letter?")) {
      db.deleteNotice(id);
      reloadAllData();
    }
  };

  // ================= GALLERY OPERATIONS =================
  const handleImageUpload = (e) => {
    e.preventDefault();
    if (!galleryForm.url.trim() || !galleryForm.caption.trim()) {
      alert("URL and Caption are required");
      return;
    }

    db.addGalleryImage(galleryForm);
    setGalleryForm({ album: 'Academic Support', url: '', caption: '' });
    reloadAllData();
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

  const deleteImage = (id) => {
    if (window.confirm("Delete this photo from the gallery album?")) {
      db.deleteGalleryImage(id);
      reloadAllData();
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
  const handleSaveSettings = (e) => {
    e.preventDefault();
    db.savePricing(pricing);
    db.saveContent(content);
    alert("System pricing configurations and static page contents successfully updated!");
    reloadAllData();
  };

  if (!isAuthenticated) {
    /* MOCK AUTH LOGIN VIEW */
    return (
      <div className="section animated" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '420px' }}>
          <div className="card" style={{ borderTop: '6px solid var(--secondary)', padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'var(--primary)',
                color: 'var(--accent)',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Lock size={26} />
              </div>
              <h2 style={{ fontSize: '1.6rem' }}>Staff Portal Login</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Enter the administrator password to access the dashboard.
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
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Administrator Password</label>
                <input 
                  type="password" 
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                  Default Password: <strong>admin123</strong>
                </span>
              </div>

              <button 
                type="submit" 
                className="btn btn-secondary" 
                style={{ width: '100%', display: 'flex', gap: '6px', justifyContent: 'center' }}
              >
                Sign In <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    /* MAIN ADMIN DASHBOARD INTERFACE */
    <div className="animated" style={{ display: 'flex', minHeight: '80vh' }} className="dashboard-layout">
      
      {/* Sidebar Nav */}
      <div style={{
        width: '260px',
        backgroundColor: 'var(--primary)',
        color: 'var(--white)',
        padding: '24px 12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0
      }} className="dashboard-sidebar">
        
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 12px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
            <div style={{
              width: '32px',
              height: '38px',
              backgroundColor: 'var(--secondary)',
              border: '1px solid var(--accent)',
              borderRadius: '0 0 8px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'var(--white)',
              fontSize: '0.9rem'
            }}>R</div>
            <div>
              <h4 style={{ color: 'var(--white)', fontSize: '0.9rem', margin: 0 }}>Rose B ALC</h4>
              <span style={{ color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 600 }}>ADMIN PORTAL</span>
            </div>
          </div>

          {/* Nav list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button 
              onClick={() => { setActiveTab('overview'); setSelectedApp(null); }}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                border: 'none',
                background: activeTab === 'overview' ? 'rgba(255,255,255,0.1)' : 'none',
                color: 'var(--white)',
                cursor: 'pointer',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: activeTab === 'overview' ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Settings size={18} /> Overview
            </button>

            <button 
              onClick={() => { setActiveTab('applications'); }}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                border: 'none',
                background: activeTab === 'applications' ? 'rgba(255,255,255,0.1)' : 'none',
                color: 'var(--white)',
                cursor: 'pointer',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: activeTab === 'applications' ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Users size={18} /> Applications ({apps.length})
            </button>

            <button 
              onClick={() => { setActiveTab('notices'); }}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                border: 'none',
                background: activeTab === 'notices' ? 'rgba(255,255,255,0.1)' : 'none',
                color: 'var(--white)',
                cursor: 'pointer',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: activeTab === 'notices' ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Bell size={18} /> Notices ({notices.length})
            </button>

            <button 
              onClick={() => { setActiveTab('gallery'); }}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                border: 'none',
                background: activeTab === 'gallery' ? 'rgba(255,255,255,0.1)' : 'none',
                color: 'var(--white)',
                cursor: 'pointer',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: activeTab === 'gallery' ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Image size={18} /> Gallery ({gallery.length})
            </button>

            <button 
              onClick={() => { setActiveTab('settings'); }}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                border: 'none',
                background: activeTab === 'settings' ? 'rgba(255,255,255,0.1)' : 'none',
                color: 'var(--white)',
                cursor: 'pointer',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: activeTab === 'settings' ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Settings size={18} /> Settings
            </button>
          </div>
        </div>

        {/* Logout Bottom */}
        <div>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px 16px',
              textAlign: 'left',
              border: 'none',
              background: 'rgba(179,32,37,0.15)',
              color: '#FF6B6B',
              cursor: 'pointer',
              borderRadius: '8px',
              fontSize: '0.92rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all var(--transition-fast)'
            }}
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
                onClick={exportAppToCSV}
              >
                <FileSpreadsheet size={16} /> Export to Excel (CSV)
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
                        <div><strong>Address:</strong> <span>{selectedApp.parentAddress}</span></div>
                        <div><strong>Subjects Requested:</strong> <span>{selectedApp.learnerSubjects.join(', ')}</span></div>
                      </>
                    ) : (
                      <>
                        <div><strong>Contact:</strong> <span>{selectedApp.learnerPhone}</span></div>
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
                  <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '0.82rem', flexGrow: 1, display: 'flex', gap: '6px', justifyContent: 'center' }}
                      onClick={() => printApp(selectedApp)}
                    >
                      <Printer size={14} /> Print Record
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
                          onClick={() => startEditNotice(notice)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary)' }}
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
