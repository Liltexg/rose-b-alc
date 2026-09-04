// Supabase Database Service for Rose B ALC
import { supabase } from './supabaseClient';

const DEFAULT_PRICING = {
  hourlyRate: 50,
  rewriteMonthly: 800,
  rewriteOnceOff: 3500,
  promoBannerActive: true,
  promoBannerText: 'First 20 Applicants: Receive R200 OFF for the first two months!'
};

const DEFAULT_CONTENT = {
  aboutStory: 'Rose Breintjies After School Learning Center (Rose B ALC) is named in honour of Rose Breintjies, the grandmother who raised our founder Mr. Edward Breintjies and gave him something she never had herself: an education. It was her love, prayer, and unwavering belief that carried him through hardship, loss, and adversity to graduate with a Bachelor of Education (B.Ed) from Nelson Mandela Metropolitan University. This center is his answer to her faith, a place where every learner is given the structure, guidance, and endurance to unlock their full academic potential.',
  aboutMission: 'To provide quality academic support that empowers every learner to reach their full potential through dedication, discipline, and academic excellence.',
  aboutVision: 'To become a leading after-school academic support center that develops confident, knowledgeable, and successful learners.',
  founderBio: 'Mr. Edward Breintjies graduated with a Bachelor of Education (B.Ed) in Further Education and Training (FET) from Nelson Mandela Metropolitan University. His journey to that graduation stage was anything but easy, marked by loss, perseverance, and an unshakeable belief that endurance is the key to success. With 10 years of classroom teaching experience in Life Sciences and Mathematical Literacy, Edward Breintjies founded Rose B ALC to honour his grandmother Rose, who raised him and gave him the greatest gift she never had herself: an education. Today, that same endurance shapes every lesson taught at this center.',
  founderQualifications: [
    'Bachelor of Education (B.Ed) - FET Specialization',
    '10 Years Classroom Teaching Experience',
    '3 Years as Jenn Tutor',
    'Excellence in Education Award Nominee (2024)'
  ]
};

const DEFAULT_SETTINGS = {
  contactPhone: '076 423 7821',
  contactEmail: 'edwardbreintjies@rosebalc.co.za',
  contactAddress: '23 Geelhout Avenue, Gamble, Kariega 6229',
  operatingHours: 'Mon – Fri: 13:00 – 18:00 | Sat: 09:00 – 13:00',
  bankName: '',
  bankAccountName: '',
  bankAccountNumber: '',
  bankBranchCode: '',
  bankAccountType: 'Cheque',
  socialFacebook: '',
  socialInstagram: '',
  socialLinkedin: '',
  socialWhatsapp: '',
  seoSiteTitle: 'Rose B ALC | After School Learning Center',
  seoMetaDescription: 'Rose Breintjies After School Learning Center – Quality academic support for Grades 8-12 in Kariega.',
};

const mapPricingToJS = (row) => !row ? null : ({ hourlyRate: row.hourly_rate, rewriteMonthly: row.rewrite_monthly, rewriteOnceOff: row.rewrite_once_off, promoBannerActive: row.promo_banner_active, promoBannerText: row.promo_banner_text });
const mapPricingToDB = (data) => ({ id: 1, hourly_rate: Number(data.hourlyRate), rewrite_monthly: Number(data.rewriteMonthly), rewrite_once_off: Number(data.rewriteOnceOff), promo_banner_active: Boolean(data.promoBannerActive), promo_banner_text: data.promoBannerText });
const mapContentToJS = (row) => !row ? null : ({ aboutStory: row.about_story, aboutMission: row.about_mission, aboutVision: row.about_vision, founderBio: row.founder_bio, founderQualifications: row.founder_qualifications });
const mapContentToDB = (data) => ({ id: 1, about_story: data.aboutStory, about_mission: data.aboutMission, about_vision: data.aboutVision, founder_bio: data.founderBio, founder_qualifications: data.founderQualifications });
const mapSettingsToJS = (row) => !row ? null : ({
  contactPhone: row.contact_phone, contactEmail: row.contact_email,
  contactAddress: row.contact_address, operatingHours: row.operating_hours,
  bankName: row.bank_name, bankAccountName: row.bank_account_name,
  bankAccountNumber: row.bank_account_number, bankBranchCode: row.bank_branch_code,
  bankAccountType: row.bank_account_type,
  socialFacebook: row.social_facebook, socialInstagram: row.social_instagram,
  socialLinkedin: row.social_linkedin, socialWhatsapp: row.social_whatsapp,
  seoSiteTitle: row.seo_site_title, seoMetaDescription: row.seo_meta_description,
});
const mapSettingsToDB = (data) => ({
  id: 1,
  contact_phone: data.contactPhone, contact_email: data.contactEmail,
  contact_address: data.contactAddress, operating_hours: data.operatingHours,
  bank_name: data.bankName, bank_account_name: data.bankAccountName,
  bank_account_number: data.bankAccountNumber, bank_branch_code: data.bankBranchCode,
  bank_account_type: data.bankAccountType,
  social_facebook: data.socialFacebook, social_instagram: data.socialInstagram,
  social_linkedin: data.socialLinkedin, social_whatsapp: data.socialWhatsapp,
  seo_site_title: data.seoSiteTitle, seo_meta_description: data.seoMetaDescription,
});

const mapApplicationToJS = (row) => !row ? null : ({
  id: row.id, dateSubmitted: row.created_at, programme: row.programme,
  parentName: row.parent_name || '', parentSurname: row.parent_surname || '',
  parentContact: row.parent_contact || '', parentEmail: row.parent_email || '',
  parentAddress: row.parent_address || '', learnerName: row.learner_name,
  learnerSurname: row.learner_surname, learnerPhone: row.learner_phone || '',
  learnerEmail: row.learner_email || '', learnerAddress: row.learner_address || '',
  emergencyContact: row.emergency_contact || '', learnerGrade: row.learner_grade || '',
  learnerSubjects: row.learner_subjects || [], consentTerms: row.consent_terms,
  consentPhotos: row.consent_photos, consentCorrect: row.consent_correct,
  signature: row.signature, status: row.status
});

const mapApplicationToDB = (data) => ({
  programme: data.programme,
  parent_name: data.parentName || null, parent_surname: data.parentSurname || null,
  parent_contact: data.parentContact || null, parent_email: data.parentEmail || null,
  parent_address: data.parentAddress || null, learner_name: data.learnerName,
  learner_surname: data.learnerSurname, learner_phone: data.learnerPhone || null,
  learner_email: data.learnerEmail || null, learner_address: data.learnerAddress || null,
  emergency_contact: data.emergencyContact || null, learner_grade: data.learnerGrade || null,
  learner_subjects: data.learnerSubjects || null,
  consent_terms: Boolean(data.consentTerms), consent_photos: Boolean(data.consentPhotos),
  consent_correct: Boolean(data.consentCorrect), signature: data.signature,
  status: data.status || 'Pending'
});

export const db = {
  seedConfigIfEmpty: async () => {
    try {
      const { data, error } = await supabase.from('pricing').select('id').limit(1);
      if (error) { console.error('Seed check error:', error); return; }
      if (data.length === 0) {
        await supabase.from('pricing').insert([mapPricingToDB(DEFAULT_PRICING)]);
        await supabase.from('content').insert([mapContentToDB(DEFAULT_CONTENT)]);
        await supabase.from('settings').insert([mapSettingsToDB(DEFAULT_SETTINGS)]);
        console.log('Default site config seeded.');
      }
    } catch (err) { console.error('Config seed error:', err); }
  },

  getPricing: async () => {
    await db.seedConfigIfEmpty();
    const { data, error } = await supabase.from('pricing').select('*').eq('id', 1).maybeSingle();
    if (error) { console.error('Error fetching pricing:', error); return DEFAULT_PRICING; }
    return mapPricingToJS(data) || DEFAULT_PRICING;
  },

  savePricing: async (pricing) => {
    const { error } = await supabase.from('pricing').upsert(mapPricingToDB(pricing));
    if (error) { console.error('Error saving pricing:', error); return false; }
    return true;
  },

  getContent: async () => {
    await db.seedConfigIfEmpty();
    const { data, error } = await supabase.from('content').select('*').eq('id', 1).maybeSingle();
    if (error) { console.error('Error fetching content:', error); return DEFAULT_CONTENT; }
    return mapContentToJS(data) || DEFAULT_CONTENT;
  },

  saveContent: async (content) => {
    const { error } = await supabase.from('content').upsert(mapContentToDB(content));
    if (error) { console.error('Error saving content:', error); return false; }
    return true;
  },

  getApplications: async () => {
    const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    if (error) { console.error('Error fetching applications:', error); return []; }
    return data.map(mapApplicationToJS);
  },

  addApplication: async (app) => {
    try {
      const { data, error } = await supabase.from('applications').insert([mapApplicationToDB(app)]).select().single();
      if (!error && data) {
        return mapApplicationToJS(data);
      }
      console.warn('Supabase application insert warning:', error?.message);
    } catch (err) {
      console.warn('Supabase insert application exception:', err);
    }
    return {
      id: `APP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      dateSubmitted: new Date().toISOString(),
      status: 'Pending',
      ...app
    };
  },

  updateApplicationStatus: async (id, status) => {
    const { error } = await supabase.from('applications').update({ status }).eq('id', id);
    if (error) { console.error('Error updating status:', error); return false; }
    return true;
  },

  deleteApplication: async (id) => {
    const { error } = await supabase.from('applications').delete().eq('id', id);
    if (error) { console.error('Error deleting application:', error); return false; }
    return true;
  },

  getNotices: async () => {
    const { data, error } = await supabase.from('notices').select('*').order('date', { ascending: false });
    if (error) { console.error('Error fetching notices:', error); return []; }
    return data;
  },

  addNotice: async (notice) => {
    const { data, error } = await supabase.from('notices').insert([{
      title: notice.title, date: notice.date || new Date().toISOString().split('T')[0],
      author: notice.author, category: notice.category, body: notice.body
    }]).select().single();
    if (error) { console.error('Error adding notice:', error); throw error; }
    return data;
  },

  updateNotice: async (id, notice) => {
    const { error } = await supabase.from('notices').update({ title: notice.title, author: notice.author, category: notice.category, body: notice.body }).eq('id', id);
    if (error) { console.error('Error updating notice:', error); return false; }
    return true;
  },

  deleteNotice: async (id) => {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) { console.error('Error deleting notice:', error); return false; }
    return true;
  },

  getGallery: async () => {
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (error) { console.error('Error fetching gallery:', error); return []; }
    return data;
  },

  addGalleryImage: async (photo) => {
    const { data, error } = await supabase.from('gallery').insert([{ album: photo.album, url: photo.url, caption: photo.caption }]).select().single();
    if (error) { console.error('Error adding gallery image:', error); throw error; }
    return data;
  },

  deleteGalleryImage: async (id) => {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) { console.error('Error deleting gallery image:', error); return false; }
    return true;
  },

  // --- Office Suite: Tasks ---
  getTasks: async () => {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (error) { console.error('Error fetching tasks:', error); return []; }
    return data;
  },

  addTask: async (task) => {
    const { data, error } = await supabase.from('tasks').insert([{ title: task.title, status: task.status || 'To Do', priority: task.priority || 'Normal' }]).select().single();
    if (error) { console.error('Error adding task:', error); throw error; }
    return data;
  },

  updateTaskStatus: async (id, status) => {
    const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
    if (error) { console.error('Error updating task status:', error); return false; }
    return true;
  },

  deleteTask: async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) { console.error('Error deleting task:', error); return false; }
    return true;
  },

  // --- Office Suite: Staff Directory ---
  getStaff: async () => {
    const { data, error } = await supabase.from('staff').select('*').order('created_at', { ascending: true });
    if (error) { console.error('Error fetching staff:', error); return []; }
    return data;
  },

  addStaff: async (staff) => {
    const { data, error } = await supabase.from('staff').insert([{ name: staff.name, role: staff.role, department: staff.department, contact: staff.contact, initials: staff.initials }]).select().single();
    if (error) { console.error('Error adding staff:', error); throw error; }
    return data;
  },

  updateStaff: async (id, staff) => {
    const { error } = await supabase.from('staff').update({ name: staff.name, role: staff.role, department: staff.department, contact: staff.contact, initials: staff.initials }).eq('id', id);
    if (error) { console.error('Error updating staff:', error); return false; }
    return true;
  },

  deleteStaff: async (id) => {
    const { error } = await supabase.from('staff').delete().eq('id', id);
    if (error) { console.error('Error deleting staff:', error); return false; }
    return true;
  },

  // --- Site Settings ---
  getSettings: async () => {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    if (error) { console.error('Error fetching settings:', error); return DEFAULT_SETTINGS; }
    return mapSettingsToJS(data) || DEFAULT_SETTINGS;
  },

  saveSettings: async (settings) => {
    const { error } = await supabase.from('settings').upsert(mapSettingsToDB(settings));
    if (error) { console.error('Error saving settings:', error); return false; }
    return true;
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    if (error) throw error;
    return true;
  },

  updatePassword: async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return true;
  }
};
