// Script to upload MDX posts to R2
// Run: npx tsx scripts/upload-to-r2.ts

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config({ path: path.join(process.cwd(), '.env.local') });

const ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID!;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
const R2_BUCKET = 'blog';

const CONTENT_DIR = path.join(process.cwd(), 'content/posts');

async function uploadToR2(objectKey: string, content: string): Promise<boolean> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${objectKey}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'text/plain',
    },
    body: content,
  });

  return response.ok;
}

function getLocalPosts(locale: string): { slug: string; content: string }[] {
  const localePath = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(localePath)) return [];

  const files = fs.readdirSync(localePath).filter(f => f.endsWith('.mdx'));
  
  return files.map(file => {
    const slug = file.replace('.mdx', '');
    const content = fs.readFileSync(path.join(localePath, file), 'utf8');
    return { slug, content };
  });
}

async function main() {
  const locales = ['en', 'zh'];
  
  for (const locale of locales) {
    console.log(`\nUploading ${locale} posts...`);
    const posts = getLocalPosts(locale);
    
    for (const { slug, content } of posts) {
      const objectKey = `posts/${locale}/${slug}.mdx`;
      const success = await uploadToR2(objectKey, content);
      if (success) {
        console.log(`  ✅ ${objectKey}`);
      } else {
        console.log(`  ❌ ${objectKey} - failed`);
      }
    }
  }
  
  console.log('\n🎉 Done!');
}

main().catch(console.error);
