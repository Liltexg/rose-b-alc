-- Supabase Database Schema for Rose B ALC
-- Run this script in the Supabase SQL Editor to set up the necessary tables.

-- 1. Pricing Table (Single row configuration)
CREATE TABLE IF NOT EXISTS pricing (
    id INT PRIMARY KEY DEFAULT 1,
    hourly_rate INT NOT NULL,
    rewrite_monthly INT NOT NULL,
    rewrite_once_off INT NOT NULL,
    promo_banner_active BOOLEAN NOT NULL,
    promo_banner_text TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT one_row CHECK (id = 1)
);

-- 2. Content Table (Single row configuration)
CREATE TABLE IF NOT EXISTS content (
    id INT PRIMARY KEY DEFAULT 1,
    about_story TEXT NOT NULL,
    about_mission TEXT NOT NULL,
    about_vision TEXT NOT NULL,
    founder_bio TEXT NOT NULL,
    founder_qualifications JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT one_row CHECK (id = 1)
);

-- 3. Notices Table
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album TEXT NOT NULL,
    url TEXT NOT NULL,
    caption TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    programme TEXT NOT NULL,
    parent_name TEXT,
    parent_surname TEXT,
    parent_contact TEXT,
    parent_email TEXT,
    parent_address TEXT,
    learner_name TEXT NOT NULL,
    learner_surname TEXT NOT NULL,
    learner_phone TEXT,
    learner_email TEXT,
    learner_address TEXT,
    emergency_contact TEXT,
    learner_grade TEXT,
    learner_subjects JSONB,
    consent_terms BOOLEAN NOT NULL,
    consent_photos BOOLEAN NOT NULL,
    consent_correct BOOLEAN NOT NULL,
    signature TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    source TEXT DEFAULT NULL
);

-- Enable RLS (Row Level Security) - optional but recommended, or keep public for simplicity during initial deployment.
-- For simplicity, since the client utilizes the public anon key for direct read/write, we can either write policies or disable RLS.
-- Here we'll disable RLS or grant access so the client can query it directly.
ALTER TABLE pricing DISABLE ROW LEVEL SECURITY;
ALTER TABLE content DISABLE ROW LEVEL SECURITY;
ALTER TABLE notices DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- 6. Tasks Table (Office Suite)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'To Do', -- 'To Do', 'In Progress', 'Done'
    priority TEXT NOT NULL DEFAULT 'Normal', -- 'High', 'Normal', 'Low'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Staff Table (Office Suite)
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    contact TEXT,
    initials TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;

-- 8. Settings Table (Single row - dynamic site-wide configuration)
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY DEFAULT 1,
    -- Contact Information
    contact_phone TEXT NOT NULL DEFAULT '076 423 7821',
    contact_email TEXT NOT NULL DEFAULT 'edwardbreintjies@rosebalc.co.za',
    contact_address TEXT NOT NULL DEFAULT '23 Geelhout Avenue, Gamble, Kariega 6229',
    operating_hours TEXT NOT NULL DEFAULT 'Mon – Fri: 13:00 – 18:00 | Sat: 09:00 – 13:00',
    -- Banking & Payment Details
    bank_name TEXT NOT NULL DEFAULT '',
    bank_account_name TEXT NOT NULL DEFAULT '',
    bank_account_number TEXT NOT NULL DEFAULT '',
    bank_branch_code TEXT NOT NULL DEFAULT '',
    bank_account_type TEXT NOT NULL DEFAULT 'Cheque',
    -- Social Media Links
    social_facebook TEXT NOT NULL DEFAULT '',
    social_instagram TEXT NOT NULL DEFAULT '',
    social_linkedin TEXT NOT NULL DEFAULT '',
    social_whatsapp TEXT NOT NULL DEFAULT '',
    -- SEO & Metadata
    seo_site_title TEXT NOT NULL DEFAULT 'Rose B ALC | After School Learning Center',
    seo_meta_description TEXT NOT NULL DEFAULT 'Rose Breintjies After School Learning Center – Quality academic support for Grades 8-12 in Kariega.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT settings_one_row CHECK (id = 1)
);

ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
