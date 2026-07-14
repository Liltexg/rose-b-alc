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
    status TEXT NOT NULL DEFAULT 'Pending'
);

-- Enable RLS (Row Level Security) - optional but recommended, or keep public for simplicity during initial deployment.
-- For simplicity, since the client utilizes the public anon key for direct read/write, we can either write policies or disable RLS.
-- Here we'll disable RLS or grant access so the client can query it directly.
ALTER TABLE pricing DISABLE ROW LEVEL SECURITY;
ALTER TABLE content DISABLE ROW LEVEL SECURITY;
ALTER TABLE notices DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
