import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(process.cwd(), '.env.local') });

const ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID!;
const DATABASE_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_D1_DATABASE_ID!;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
const R2_BUCKET = 'blog';

async function deleteFromD1(slug: string) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql: 'DELETE FROM posts WHERE slug = ?', params: [slug] }),
  });

  const data = await response.json();
  return data.success;
}

async function deleteFromR2(objectKey: string) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${objectKey}`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
    },
  });

  return response.ok;
}

async function main() {
  const slugs = process.argv.slice(2);
  
  if (slugs.length === 0) {
    console.log('Usage: npx tsx scripts/delete-post.ts <slug1> [slug2] ...');
    process.exit(1);
  }
  
  for (const slug of slugs) {
    console.log(`Deleting ${slug}...`);
    
    // Delete from D1
    const d1Result = await deleteFromD1(slug);
    console.log(`  D1: ${d1Result ? '✅' : '❌'}`);
    
    // Delete from R2 (try both en and zh paths)
    for (const locale of ['en', 'zh']) {
      const r2Key = `posts/${locale}/${slug.replace(/-zh$/, '')}.mdx`;
      const r2Result = await deleteFromR2(r2Key);
      console.log(`  R2 (${r2Key}): ${r2Result ? '✅' : '❌ (not found)'}`);
    }
  }
  
  console.log('\nDone!');
}

main().catch(console.error);
