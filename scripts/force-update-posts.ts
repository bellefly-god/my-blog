// Force update all posts content
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { config } from 'dotenv';

config({ path: path.join(process.cwd(), '.env.local') });

const ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_D1_DATABASE_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

const CONTENT_DIR = path.join(process.cwd(), 'content/posts');

async function updatePost(slug: string, title: string, excerpt: string, content: string, date: string): Promise<boolean> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
  
  const sql = `UPDATE posts SET title = ?, excerpt = ?, content = ?, date = ? WHERE slug = ?`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sql,
      params: [title, excerpt, content, date, slug],
    }),
  });

  const data = await response.json() as { success?: boolean };
  return data.success === true;
}

async function main() {
  const locales = ['en', 'zh'];
  
  for (const locale of locales) {
    const localePath = path.join(CONTENT_DIR, locale);
    const files = fs.readdirSync(localePath).filter(f => f.endsWith('.mdx'));
    
    console.log(`\nUpdating ${locale} posts...`);
    
    for (const file of files) {
      const slug = file.replace('.mdx', '');
      const dbSlug = locale === 'zh' ? `${slug}-zh` : slug;
      
      const fullContent = fs.readFileSync(path.join(localePath, file), 'utf8');
      const { data, content } = matter(fullContent);
      
      const success = await updatePost(
        dbSlug,
        data.title || 'Untitled',
        data.excerpt || '',
        content,
        data.date || new Date().toISOString().split('T')[0]
      );
      
      console.log(`  ${success ? '✅' : '❌'} ${dbSlug}`);
    }
  }
  
  console.log('\nDone!');
}

main().catch(console.error);