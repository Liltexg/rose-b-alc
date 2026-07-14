// Powered by OrbXech Design Studio
// Supabase Database Service for Rose B ALC
import { supabase } from './supabaseClient';

// Initial Seed Data (with corrected spelling "Bruintjies")
const DEFAULT_PRICING = {
  hourlyRate: 50,
  rewriteMonthly: 800,
  rewriteOnceOff: 3500,
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
    title: "2027 Applications Now Open",
    date: "2026-07-01",
    author: "E. Bruintjies (Principal)",
    category: "General",
    body: "Dear Parents and Guardians,\n\nWe are pleased to announce that applications for the 2027 academic year are now officially open. Due to our commitment to maintaining small class sizes and providing personalized attention to each learner, spaces are strictly limited.\n\nWe offer comprehensive Grade 12 Support as well as our intensive Rewrite/Upgrade Programme. We encourage early submission to secure your learner's space.\n\nApplications can be submitted directly online through our new website portal or by visiting our centre. Please ensure all supporting documents and signed consent forms are attached.\n\nSincerely,\nMr. Edward Bruintjies\nFounder & Director, Rose B ALC"
  },
  {
    title: "June Holiday Revision Programme",
    date: "2026-05-15",
    author: "E. Bruintjies (Principal)",
    category: "Academic",
    body: "Dear Grade 12 Parents,\n\nIn preparation for the upcoming mock trials and final examinations, we will be hosting an intensive June Holiday Revision Programme.\n\nThis programme will focus specifically on difficult sections of the Life Sciences curriculum and past exam paper analysis. Attendance is highly recommended for all enrolled students.\n\nDates: 15 June – 26 June\nTime: 09:00 - 13:00 daily\nVenue: Rose B ALC Main Classroom\n\nPlease confirm attendance by replying to this notice or signing the slip sent home with learners.\n\nWarm regards,\nRose B ALC Academic Team"
  },
  {
    title: "Parent Information Evening",
    date: "2026-03-10",
    author: "Management",
    category: "Events",
    body: "Dear Parents,\n\nYou are cordially invited to our Term 1 Parent Information Evening. This is an opportunity to meet our educators, discuss your learner's progress, and align on academic targets for the year.\n\nWe will also outline our exam preparation schedules and CAPS assessment tracking guidelines.\n\nDate: Thursday, 18 March 2026\nTime: 18:00 - 19:30\n\nRefreshments will be served. We look forward to partnering with you for your child's success.\n\nSincerely,\nRose B ALC Management"
  }
];

const DEFAULT_GALLERY = [
  {
    album: "Academic Support",
    url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80",
    caption: "Learners focused during our weekly Life Sciences revision workshop."
  },
  {
    album: "Academic Support",
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
    caption: "Small group collaboration resolving previous NSC exam questions."
  },
  {
    album: "Holiday Classes",
    url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=80",
    caption: "Intensive holiday revision session keeping learners sharp and ahead."
  },
  {
    album: "Awards",
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
    caption: "Celebrating our top-performing learners from the matric class of 2025."
  },
  {
    album: "Events",
    url: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?w=800&auto=format&fit=crop&q=80",
    caption: "Parent Information Evening aligning objectives for academic success."
  },
  {
    album: "Learner Activities",
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
    caption: "Practical biology demonstration exploring cellular structures."
  }
];

const DEFAULT_APPLICATIONS = [
  {
    programme: "Grade 12",
    parentName: "James",
    parentSurname: "Davies",
    parentContact: "082 123 4567",
    parentEmail: "james.davies@example.com",
    parentAddress: "12 Pine Street, Kariega, Eastern Cape",
    learnerName: "Tracy",
    learnerSurname: "Bruintjies",
    learnerGrade: "Grade 12",
    learnerSubjects: ["Life Sciences", "Mathematics", "English FAL"],
    consentTerms: true,
    consentPhotos: true,
    consentCorrect: true,
    signature: "James Davies",
    status: "Pending"
  },
  {
    programme: "Rewrite / Upgrade",
    learnerName: "Amanda",
    learnerSurname: "Naidoo",
    learnerPhone: "073 987 6543",
    learnerEmail: "amanda.naidoo@example.com",
    learnerAddress: "45 Maple Avenue, Randburg",
    emergencyContact: "Devi Naidoo (Mother) - 083 456 7890",
    consentTerms: true,
    consentPhotos: false,
    consentCorrect: true,
    signature: "A. Naidoo",
    status: "Reviewed"
  }
];

// Mapping helper functions
const mapPricingToJS = (row) => row ? {
  hourlyRate: row.hourly_rate,
  rewriteMonthly: row.rewrite_monthly,
  rewriteOnceOff: row.rewrite_once_off,
  promoBannerActive: row.promo_banner_active,
  promoBannerText: row.promo_banner_text
} : null;

const mapPricingToDB = (data) => ({
  id: 1,
  hourly_rate: Number(data.hourlyRate),
  rewrite_monthly: Number(data.rewriteMonthly),
  rewrite_once_off: Number(data.rewriteOnceOff),
  promo_banner_active: Boolean(data.promoBannerActive),
  promo_banner_text: data.promoBannerText
});

const mapContentToJS = (row) => row ? {
  aboutStory: row.about_story,
  aboutMission: row.about_mission,
  aboutVision: row.about_vision,
  founderBio: row.founder_bio,
  founderQualifications: row.founder_qualifications
} : null;

const mapContentToDB = (data) => ({
  id: 1,
  about_story: data.aboutStory,
  about_mission: data.aboutMission,
  about_vision: data.aboutVision,
  founder_bio: data.founderBio,
  founder_qualifications: data.founderQualifications
});

const mapApplicationToJS = (row) => row ? {
  id: row.id,
  dateSubmitted: row.created_at,
  programme: row.programme,
  parentName: row.parent_name || '',
  parentSurname: row.parent_surname || '',
  parentContact: row.parent_contact || '',
  parentEmail: row.parent_email || '',
  parentAddress: row.parent_address || '',
  learnerName: row.learner_name,
  learnerSurname: row.learner_surname,
  learnerPhone: row.learner_phone || '',
  learnerEmail: row.learner_email || '',
  learnerAddress: row.learner_address || '',
  emergencyContact: row.emergency_contact || '',
  learnerGrade: row.learner_grade || '',
  learnerSubjects: row.learner_subjects || [],
  consentTerms: row.consent_terms,
  consentPhotos: row.consent_photos,
  consentCorrect: row.consent_correct,
  signature: row.signature,
  status: row.status
} : null;

const mapApplicationToDB = (data) => ({
  programme: data.programme,
  parent_name: data.parentName || null,
  parent_surname: data.parentSurname || null,
  parent_contact: data.parentContact || null,
  parent_email: data.parentEmail || null,
  parent_address: data.parentAddress || null,
  learner_name: data.learnerName,
  learner_surname: data.learnerSurname,
  learner_phone: data.learnerPhone || null,
  learner_email: data.learnerEmail || null,
  learner_address: data.learnerAddress || null,
  emergency_contact: data.emergencyContact || null,
  learner_grade: data.learnerGrade || null,
  learner_subjects: data.learnerSubjects || null,
  consent_terms: Boolean(data.consentTerms),
  consent_photos: Boolean(data.consentPhotos),
  consent_correct: Boolean(data.consentCorrect),
  signature: data.signature,
  status: data.status || 'Pending'
});

export const db = {
  // Database Seeding Logic
  seedDatabaseIfEmpty: async () => {
    try {
      // Check if pricing is empty
      const { data: pricingData, error: pricingErr } = await supabase.from('pricing').select('*').limit(1);
      if (pricingErr) {
        console.error('Error querying pricing for seed check:', pricingErr);
        return false;
      }

      if (pricingData.length === 0) {
        console.log('Database appears empty. Seeding default data...');
        
        // 1. Seed Pricing
        const { error: pErr } = await supabase.from('pricing').insert([mapPricingToDB(DEFAULT_PRICING)]);
        if (pErr) console.error('Failed to seed pricing:', pErr);

        // 2. Seed Content
        const { error: cErr } = await supabase.from('content').insert([mapContentToDB(DEFAULT_CONTENT)]);
        if (cErr) console.error('Failed to seed content:', cErr);

        // 3. Seed Notices
        const { error: nErr } = await supabase.from('notices').insert(DEFAULT_NOTICES);
        if (nErr) console.error('Failed to seed notices:', nErr);

        // 4. Seed Gallery
        const { error: gErr } = await supabase.from('gallery').insert(DEFAULT_GALLERY);
        if (gErr) console.error('Failed to seed gallery:', gErr);

        // 5. Seed Applications
        const dbApps = DEFAULT_APPLICATIONS.map(mapApplicationToDB);
        const { error: aErr } = await supabase.from('applications').insert(dbApps);
        if (aErr) console.error('Failed to seed applications:', aErr);

        console.log('Database seeded successfully!');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Unexpected error during database seed check:', err);
      return false;
    }
  },

  // Pricing Settings
  getPricing: async () => {
    await db.seedDatabaseIfEmpty();
    const { data, error } = await supabase.from('pricing').select('*').eq('id', 1).maybeSingle();
    if (error) {
      console.error('Error fetching pricing:', error);
      return DEFAULT_PRICING;
    }
    return mapPricingToJS(data) || DEFAULT_PRICING;
  },

  savePricing: async (pricing) => {
    const { error } = await supabase.from('pricing').upsert(mapPricingToDB(pricing));
    if (error) {
      console.error('Error saving pricing:', error);
      return false;
    }
    return true;
  },

  // Content Settings
  getContent: async () => {
    await db.seedDatabaseIfEmpty();
    const { data, error } = await supabase.from('content').select('*').eq('id', 1).maybeSingle();
    if (error) {
      console.error('Error fetching content:', error);
      return DEFAULT_CONTENT;
    }
    return mapContentToJS(data) || DEFAULT_CONTENT;
  },

  saveContent: async (content) => {
    const { error } = await supabase.from('content').upsert(mapContentToDB(content));
    if (error) {
      console.error('Error saving content:', error);
      return false;
    }
    return true;
  },

  // Applications
  getApplications: async () => {
    const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
    return data.map(mapApplicationToJS);
  },

  addApplication: async (app) => {
    const dbApp = mapApplicationToDB(app);
    const { data, error } = await supabase.from('applications').insert([dbApp]).select().single();
    if (error) {
      console.error('Error adding application:', error);
      throw error;
    }
    return mapApplicationToJS(data);
  },

  updateApplicationStatus: async (id, status) => {
    const { error } = await supabase.from('applications').update({ status }).eq('id', id);
    if (error) {
      console.error('Error updating application status:', error);
      return false;
    }
    return true;
  },

  deleteApplication: async (id) => {
    const { error } = await supabase.from('applications').delete().eq('id', id);
    if (error) {
      console.error('Error deleting application:', error);
      return false;
    }
    return true;
  },

  // Notices
  getNotices: async () => {
    await db.seedDatabaseIfEmpty();
    const { data, error } = await supabase.from('notices').select('*').order('date', { ascending: false });
    if (error) {
      console.error('Error fetching notices:', error);
      return [];
    }
    return data;
  },

  addNotice: async (notice) => {
    const { data, error } = await supabase.from('notices').insert([{
      title: notice.title,
      date: notice.date || new Date().toISOString().split('T')[0],
      author: notice.author,
      category: notice.category,
      body: notice.body
    }]).select().single();

    if (error) {
      console.error('Error adding notice:', error);
      throw error;
    }
    return data;
  },

  updateNotice: async (id, updatedNotice) => {
    const { error } = await supabase.from('notices').update({
      title: updatedNotice.title,
      author: updatedNotice.author,
      category: updatedNotice.category,
      body: updatedNotice.body
    }).eq('id', id);

    if (error) {
      console.error('Error updating notice:', error);
      return false;
    }
    return true;
  },

  deleteNotice: async (id) => {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) {
      console.error('Error deleting notice:', error);
      return false;
    }
    return true;
  },

  // Gallery
  getGallery: async () => {
    await db.seedDatabaseIfEmpty();
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching gallery images:', error);
      return [];
    }
    return data;
  },

  addGalleryImage: async (photo) => {
    const { data, error } = await supabase.from('gallery').insert([{
      album: photo.album,
      url: photo.url,
      caption: photo.caption
    }]).select().single();

    if (error) {
      console.error('Error adding gallery image:', error);
      throw error;
    }
    return data;
  },

  deleteGalleryImage: async (id) => {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) {
      console.error('Error deleting gallery image:', error);
      return false;
    }
    return true;
  },

  resetDatabase: async () => {
    try {
      await supabase.from('pricing').delete().neq('id', 0);
      await supabase.from('content').delete().neq('id', 0);
      await supabase.from('notices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('gallery').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('applications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      await db.seedDatabaseIfEmpty();
      return true;
    } catch (e) {
      console.error('Error resetting database:', e);
      return false;
    }
  }
};
