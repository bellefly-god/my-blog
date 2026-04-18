-- D1 Database Schema for My Blog
-- Converted from Supabase PostgreSQL schema

-- posts table
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  date TEXT DEFAULT (datetime('now')),
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- reactions table (for like/dislike)
CREATE TABLE IF NOT EXISTS reactions (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  ip_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE(post_id, ip_hash)
);

-- tools table
CREATE TABLE IF NOT EXISTS tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  manual TEXT,
  icon TEXT,
  url TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);

-- ============================================
-- Sample Data (Optional - uncomment to use)
-- ============================================

-- Insert sample tools
INSERT OR IGNORE INTO tools (id, name, slug, description, manual, icon, url) VALUES
  (lower(hex(randomblob(16))), 'Color Palette Generator', 'color-palette', 'Generate beautiful color palettes for your designs', '## How to use\n\n1. Select a base color\n2. Click generate\n3. Copy the palette', 'palette', 'https://colors.example.com'),
  (lower(hex(randomblob(16))), 'Markdown Editor', 'markdown-editor', 'A simple yet powerful markdown editor', '## Features\n\n- Live preview\n- Export to PDF\n- Syntax highlighting', 'edit', 'https://md.example.com');
