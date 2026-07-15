import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const rawData = `2026-07-13T15:50:15.156Z	Ann van Sensie Frederick van Sensie	zeitschke@gmail.com	Parent Name: Ann van Sensie Frederick van Sensie
Email: zeitschke@gmail.com
Phone: 0781029461
Learner Name: zeitschke Van Sensie
Programme: Rewrite / Upgrade
Source: Coming Soon early submission	New Early Submission — Rose B ALC
2026-07-13T13:57:41.772Z	Lee-Anne Hartnick	anishaarries@gmail.com	Parent Name: Lee-Anne Hartnick
Email: anishaarries@gmail.com
Phone: 0738443269
Learner Name: Anisha Arries
Programme: Grade 12 Support
Source: Coming Soon early submission	New Early Submission — Rose B ALC
2026-07-13T11:51:31.275Z	Alton Johannes	altonishaandrews@gmail.com	Parent Name: Alton Johannes
Email: altonishaandrews@gmail.com
Phone: 0601328426
Learner Name: Altonisha Andrews
Programme: Rewrite / Upgrade
Source: Coming Soon early submission	New Early Submission — Rose B ALC
2026-07-13T10:05:33.386Z	Vernicia Andrews	verniciaandrews@gmail.com	Parent Name: Vernicia Andrews
Email: verniciaandrews@gmail.com
Phone: 0728908581
Learner Name: Vernicia Andrews
Programme: Rewrite / Upgrade
Source: Coming Soon early submission	New Early Submission — Rose B ALC
2026-07-13T07:01:54.355Z	Ordea Plaatjies	antheaplaatjies1@gmail.com	Parent Name: Ordea Plaatjies
Email: antheaplaatjies1@gmail.com
Phone: 0659133355
Learner Name: Anthea Plaatjies
Programme: Rewrite / Upgrade
Source: Coming Soon early submission	New Early Submission — Rose B ALC
2026-07-13T05:54:29.738Z	Raylene Gais	gaisraylenebernice@gmail.com	Parent Name: Raylene Gais
Email: gaisraylenebernice@gmail.com
Phone: 0780250688
Learner Name: Rubayne
Programme: Grade 12 Support
Source: Coming Soon early submission	New Early Submission — Rose B ALC`;

async function importData() {
  const blocks = rawData.split('New Early Submission — Rose B ALC').map(s => s.trim()).filter(s => s.length > 0);
  
  const applications = [];

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) continue;

    const parts = lines[0].split('\t');
    if (parts.length < 4) {
      console.log('Could not split line by tab:', lines[0]);
      continue;
    }
    
    const createdAt = parts[0];
    const parentFullName = parts[3].replace('Parent Name:', '').trim();
    let email = '';
    let phone = '';
    let learnerFullName = '';
    let programme = '';

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].startsWith('Email:')) email = lines[i].replace('Email:', '').trim();
      if (lines[i].startsWith('Phone:')) phone = lines[i].replace('Phone:', '').trim();
      if (lines[i].startsWith('Learner Name:')) learnerFullName = lines[i].replace('Learner Name:', '').trim();
      if (lines[i].startsWith('Programme:')) programme = lines[i].replace('Programme:', '').trim();
    }

    const splitName = (fullName) => {
      if (!fullName) return { first: '', last: '' };
      const nParts = fullName.split(' ');
      if (nParts.length === 1) return { first: nParts[0], last: '' };
      const last = nParts.pop();
      return { first: nParts.join(' '), last };
    };

    const parentNameParts = splitName(parentFullName);
    const learnerNameParts = splitName(learnerFullName);

    applications.push({
      created_at: createdAt,
      programme: programme || 'Unknown',
      parent_name: parentNameParts.first,
      parent_surname: parentNameParts.last,
      parent_contact: phone,
      parent_email: email,
      learner_name: learnerNameParts.first,
      learner_surname: learnerNameParts.last,
      consent_terms: true,
      consent_photos: true,
      consent_correct: true,
      signature: parentFullName,
      status: 'Pending'
    });
  }

  console.log(`Parsed ${applications.length} applications.`);
  
  for (const app of applications) {
    console.log(`Inserting: ${app.learner_name} ${app.learner_surname}...`);
    const { error } = await supabase.from('applications').insert([app]);
    if (error) {
      console.error('Error inserting:', error);
    }
  }

  console.log('Import complete.');
}

importData();
