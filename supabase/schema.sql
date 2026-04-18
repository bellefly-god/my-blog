-- Database Schema for Inkwell Blog
-- Run this in Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- reactions table (for like/dislike)
CREATE TABLE reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reaction_type TEXT CHECK (reaction_type IN ('like', 'dislike')),
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, ip_hash)
);

-- tools table
CREATE TABLE tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  manual TEXT,
  icon TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_date ON posts(date DESC);
CREATE INDEX idx_reactions_post_id ON reactions(post_id);
CREATE INDEX idx_tools_slug ON tools(slug);

-- Row Level Security (RLS) policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Posts: Allow public read access
CREATE POLICY "Allow public read access on posts" ON posts
  FOR SELECT USING (true);

-- Posts: Allow insert/update/delete only for authenticated users (optional)
-- For now, we'll manage posts through Supabase dashboard
-- CREATE POLICY "Allow authenticated users to manage posts" ON posts
--   FOR ALL USING (auth.role() = 'authenticated');

-- Reactions: Allow public read and insert
CREATE POLICY "Allow public read access on reactions" ON reactions
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on reactions" ON reactions
  FOR INSERT WITH CHECK (true);

-- Tools: Allow public read access
CREATE POLICY "Allow public read access on tools" ON tools
  FOR SELECT USING (true);

-- ============================================
-- Sample Data (Optional - uncomment to use)
-- ============================================

-- Insert sample posts
-- INSERT INTO posts (title, slug, excerpt, content, cover_image, date) VALUES
-- ('Getting Started with Next.js 15', 'getting-started-nextjs-15', 'Learn how to build modern web applications with Next.js 15', 'Full content here...', '/images/nextjs.jpg', '2024-03-14'),
-- ('Understanding React Server Components', 'understanding-rsc', 'Deep dive into React Server Components and their benefits', 'Full content here...', '/images/rsc.jpg', '2024-03-10');

-- Insert sample tools
-- INSERT INTO tools (name, slug, description, manual, icon, url) VALUES
-- ('Color Palette Generator', 'color-palette', 'Generate beautiful color palettes for your designs', '## How to use\n\n1. Select a base color\n2. Click generate\n3. Copy the palette', 'palette', 'https://colors.example.com'),
-- ('Markdown Editor', 'markdown-editor', 'A simple yet powerful markdown editor', '## Features\n\n- Live preview\n- Export to PDF\n- Syntax highlighting', 'edit', 'https://md.example.com');
