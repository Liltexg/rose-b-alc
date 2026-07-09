// Powered by OrbXech Design Studio
// Local Storage Database Service for Rose B ALC

const STORAGE_KEYS = {
  APPLICATIONS: 'rose_b_alc_applications',
  NOTICES: 'rose_b_alc_notices',
  GALLERY: 'rose_b_alc_gallery',
  PRICING: 'rose_b_alc_pricing',
  CONTENT: 'rose_b_alc_content'
};

// Initial Seed Data
const DEFAULT_PRICING = {
  hourlyRate: 50,
  rewriteMonthly: 800,
  rewriteOnceOff: 2500,
  promoBannerActive: true,
  promoBannerText: "First 20 Applicants: Receive R200 OFF for the first two months!"
};

const DEFAULT_CONTENT = {
  aboutStory: "Rose Bruintjies After School Learning Centre (Rose B ALC) was founded with a singular, powerful vision: to provide a structured, disciplined, and nurturing environment where learners can unlock their full academic potential. Located in our local community, we serve as a bridge between classroom instruction and academic mastery. We believe that with the right guidance, focused support, and dedication, every student can achieve excellence. Our centre follows the standard CAPS curriculum closely, ensuring that our lessons align perfectly with what students are tested on in school, giving them the confidence to excel in their National Senior Certificate (NSC) examinations.",
  aboutMission: "To provide quality academic support that empowers every learner to reach their full potential through dedication, discipline, and academic excellence.",
  aboutVision: "To become a leading after-school academic support centre that develops confident, knowledgeable, and successful learners.",
  founderBio: "Edward Bruintjies is a highly dedicated educator with over 15 years of classroom teaching experience. Having taught in both private and public school settings, Edward established the After School Learning Centre to address the individual needs of learners that are often overlooked in large classrooms. Holding a Bachelor of Education (B.Ed) degree in Senior Phase and FET teaching, specializing in Life Sciences and Mathematics, Edward is committed to instilling discipline, self-belief, and rigorous academic work ethic in every student. His subjects taught include FET Life Sciences and General Sciences, with a track record of helping over 95% of his students improve their grades.",
  founderQualifications: [
    "Bachelor of Education (B.Ed) - FET Specialization",
    "15+ Years Classroom Teaching Experience",
    "Excellence in Education Award Nominee (2024)",
    "Certified Exam Assessor"
  ]
};

const DEFAULT_NOTICES = [
  {
    id: 'n-1',
    title: "2027 Applications Now Open",
    date: "2026-07-01",
    author: "E. Bruintjies (Principal)",
    category: "General",
    body: "Dear Parents and Guardians,\n\nWe are pleased to announce that applications for the 2027 academic year are now officially open. Due to our commitment to maintaining small class sizes and providing personalized attention to each learner, spaces are strictly limited.\n\nWe offer comprehensive Grade 12 Support as well as our intensive Rewrite/Upgrade Programme. We encourage early submission to secure your learner's space.\n\nApplications can be submitted directly online through our new website portal or by visiting our centre. Please ensure all supporting documents and signed consent forms are attached.\n\nSincerely,\nMr. Edward Bruintjies\nFounder & Director, Rose B ALC"
  },
  {
    id: 'n-2',
    title: "June Holiday Revision Programme",
    date: "2026-05-15",
    author: "E. Bruintjies (Principal)",
    category: "Academic",
    body: "Dear Grade 12 Parents,\n\nIn preparation for the upcoming mock trials and final examinations, we will be hosting an intensive June Holiday Revision Programme.\n\nThis programme will focus specifically on difficult sections of the Life Sciences curriculum and past exam paper analysis. Attendance is highly recommended for all enrolled students.\n\nDates: 15 June â€“ 26 June\nTime: 09:00 - 13:00 daily\nVenue: Rose B ALC Main Classroom\n\nPlease confirm attendance by replying to this notice or signing the slip sent home with learners.\n\nWarm regards,\nRose B ALC Academic Team"
  },
  {
    id: 'n-3',
    title: "Parent Information Evening",
    date: "2026-03-10",
    author: "Management",
    category: "Events",
    body: "Dear Parents,\n\nYou are cordially invited to our Term 1 Parent Information Evening. This is an opportunity to meet our educators, discuss your learner's progress, and align on academic targets for the year.\n\nWe will also outline our exam preparation schedules and CAPS assessment tracking guidelines.\n\nDate: Thursday, 18 March 2026\nTime: 18:00 - 19:30\n\nRefreshments will be served. We look forward to partnering with you for your child's success.\n\nSincerely,\nRose B ALC Management"
  }
];

const DEFAULT_GALLERY = [
  {
    id: 'g-1',
    album: "Academic Support",
    url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80",
    caption: "Learners focused during our weekly Life Sciences revision workshop."
  },
  {
    id: 'g-2',
    album: "Academic Support",
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
    caption: "Small group collaboration resolving previous NSC exam questions."
  },
  {
    id: 'g-3',
    album: "Holiday Classes",
    url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=80",
    caption: "Intensive holiday revision session keeping learners sharp and ahead."
  },
  {
    id: 'g-4',
    album: "Awards",
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
    caption: "Celebrating our top-performing learners from the matric class of 2025."
  },
  {
    id: 'g-5',
    album: "Events",
    url: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?w=800&auto=format&fit=crop&q=80",
    caption: "Parent Information Evening aligning objectives for academic success."
  },
  {
    id: 'g-6',
    album: "Learner Activities",
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
    caption: "Practical biology demonstration exploring cellular structures."
  }
];

const DEFAULT_APPLICATIONS = [
  {
    id: 'app-1',
    dateSubmitted: "2026-07-06T14:32:00Z",
    programme: "Grade 12",
    parentName: "John",
    parentSurname: "Dube",
    parentContact: "082 123 4567",
    parentAddress: "12 Pine Street, Rosebank, Johannesburg",
    learnerName: "Sipho",
    learnerSurname: "Dube",
    learnerGrade: "Grade 12",
    learnerSubjects: ["Life Sciences", "Mathematics", "English FAL"],
    consentTerms: true,
    consentPhotos: true,
    consentCorrect: true,
    signature: "John Dube",
    status: "Pending"
  },
  {
    id: 'app-2',
    dateSubmitted: "2026-07-07T10:15:00Z",
    programme: "Rewrite / Upgrade",
    learnerName: "Amanda",
    learnerSurname: "Naidoo",
    learnerPhone: "073 987 6543",
    learnerAddress: "45 Maple Avenue, Randburg",
    emergencyContact: "Devi Naidoo (Mother) - 083 456 7890",
    consentTerms: true,
    consentPhotos: false,
    consentCorrect: true,
    signature: "A. Naidoo",
    status: "Reviewed"
  }
];

// Helper functions for local storage
const loadData = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.error(`Failed to load data for key ${key}:`, e);
    return fallback;
  }
};

const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(`Failed to save data for key ${key}:`, e);
    return false;
  }
};

export const db = {
  // Pricing Settings
  getPricing: () => loadData(STORAGE_KEYS.PRICING, DEFAULT_PRICING),
  savePricing: (pricing) => saveData(STORAGE_KEYS.PRICING, pricing),

  // Content Settings
  getContent: () => loadData(STORAGE_KEYS.CONTENT, DEFAULT_CONTENT),
  saveContent: (content) => saveData(STORAGE_KEYS.CONTENT, content),

  // Applications
  getApplications: () => loadData(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS),
  saveApplications: (apps) => saveData(STORAGE_KEYS.APPLICATIONS, apps),
  addApplication: (app) => {
    const apps = db.getApplications();
    const newApp = {
      ...app,
      id: `app-${Date.now()}`,
      dateSubmitted: new Date().toISOString(),
      status: 'Pending'
    };
    apps.unshift(newApp);
    db.saveApplications(apps);
    return newApp;
  },
  updateApplicationStatus: (id, status) => {
    const apps = db.getApplications();
    const index = apps.findIndex(a => a.id === id);
    if (index !== -1) {
      apps[index].status = status;
      db.saveApplications(apps);
      return true;
    }
    return false;
  },
  deleteApplication: (id) => {
    const apps = db.getApplications();
    const filtered = apps.filter(a => a.id !== id);
    db.saveApplications(filtered);
    return true;
  },

  // Notices
  getNotices: () => loadData(STORAGE_KEYS.NOTICES, DEFAULT_NOTICES),
  saveNotices: (notices) => saveData(STORAGE_KEYS.NOTICES, notices),
  addNotice: (notice) => {
    const notices = db.getNotices();
    const newNotice = {
      ...notice,
      id: `n-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    notices.unshift(newNotice);
    db.saveNotices(notices);
    return newNotice;
  },
  updateNotice: (id, updatedNotice) => {
    const notices = db.getNotices();
    const index = notices.findIndex(n => n.id === id);
    if (index !== -1) {
      notices[index] = { ...notices[index], ...updatedNotice };
      db.saveNotices(notices);
      return true;
    }
    return false;
  },
  deleteNotice: (id) => {
    const notices = db.getNotices();
    const filtered = notices.filter(n => n.id !== id);
    db.saveNotices(filtered);
    return true;
  },

  // Gallery
  getGallery: () => loadData(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY),
  saveGallery: (photos) => saveData(STORAGE_KEYS.GALLERY, photos),
  addGalleryImage: (photo) => {
    const gallery = db.getGallery();
    const newPhoto = {
      ...photo,
      id: `g-${Date.now()}`
    };
    gallery.unshift(newPhoto);
    db.saveGallery(gallery);
    return newPhoto;
  },
  deleteGalleryImage: (id) => {
    const gallery = db.getGallery();
    const filtered = gallery.filter(g => g.id !== id);
    db.saveGallery(filtered);
    return true;
  },
  
  // Seed database utility
  resetDatabase: () => {
    saveData(STORAGE_KEYS.PRICING, DEFAULT_PRICING);
    saveData(STORAGE_KEYS.CONTENT, DEFAULT_CONTENT);
    saveData(STORAGE_KEYS.NOTICES, DEFAULT_NOTICES);
    saveData(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    saveData(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS);
    return true;
  }
};

