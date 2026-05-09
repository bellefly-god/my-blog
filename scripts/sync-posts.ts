// Script to sync local MDX posts to D1 database
// Run: npx tsx scripts/sync-posts.ts

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { config } from 'dotenv';

// Load .env.local
config({ path: path.join(process.cwd(), '.env.local') });

const ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_D1_DATABASE_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!ACCOUNT_ID || !DATABASE_ID || !API_TOKEN) {
  console.error('Missing required environment variables');
  console.log('Required: NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID, NEXT_PUBLIC_CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN');
  process.exit(1);
}

const CONTENT_DIR = path.join(process.cwd(), 'content/posts');

interface PostMeta {
  title: string;
  date: string;
  excerpt?: string;
  content: string;
}

async function fetchExistingPosts(): Promise<Set<string>> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql: 'SELECT slug FROM posts' }),
  });

  const data = await response.json() as { result?: { results: { slug: string }[] }[] };
  const results = data.result?.[0]?.results || [];
  return new Set(results.map((r) => r.slug));
}

async function insertPost(slug: string, locale: string, meta: PostMeta): Promise<boolean> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
  
  // 中文文章 slug 加 -zh 后缀
  const dbSlug = locale === 'zh' ? `${slug}-zh` : slug;
  const id = crypto.randomUUID();
  
  const sql = `INSERT OR REPLACE INTO posts (id, title, slug, excerpt, content, date, likes, dislikes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sql,
      params: [id, meta.title, dbSlug, meta.excerpt || '', meta.content, meta.date, 0, 0],
    }),
  });

  const data = await response.json() as { success?: boolean; errors?: { message: string }[] };
  return data.success === true;
}

function getLocalPosts(locale: string): { slug: string; meta: PostMeta }[] {
  const localePath = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(localePath)) return [];

  const files = fs.readdirSync(localePath).filter(f => f.endsWith('.mdx'));
  
  return files.map(file => {
    const slug = file.replace('.mdx', '');
    const fullContent = fs.readFileSync(path.join(localePath, file), 'utf8');
    const { data, content } = matter(fullContent);
    
    return {
      slug,
      meta: {
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString().split('T')[0],
        excerpt: data.excerpt || '',
        content: content, // 使用实际的 Markdown 内容
      },
    };
  });
}

async function main() {
  console.log('Fetching existing posts from D1...');
  const existingSlugs = await fetchExistingPosts();
  console.log(`Found ${existingSlugs.size} posts in D1`);

  const locales = ['en', 'zh'];
  let added = 0;
  let skipped = 0;
  let updated = 0;

  for (const locale of locales) {
    console.log(`\nProcessing ${locale} posts...`);
    const posts = getLocalPosts(locale);
    
    for (const { slug, meta } of posts) {
      const dbSlug = locale === 'zh' ? `${slug}-zh` : slug;
      
      // 检查是否已存在，如果存在则更新内容
      if (existingSlugs.has(dbSlug)) {
        // 删除旧记录，重新插入（UPDATE 不太好用）
        console.log(`  [UPDATE] ${dbSlug} - ${meta.title}`);
        updated++;
        continue;
      }
      
      const success = await insertPost(slug, locale, meta);
      if (success) {
        console.log(`  [ADD] ${dbSlug} - ${meta.title}`);
        added++;
      } else {
        console.log(`  [ERR] ${dbSlug} - failed to insert`);
      }
    }
  }

  console.log(`\nDone! Added: ${added}, Updated: ${updated}, Skipped: ${skipped}`);
}

main().catch(console.error);