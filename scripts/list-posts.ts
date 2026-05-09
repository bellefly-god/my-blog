import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(process.cwd(), '.env.local') });

const ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID!;
const DATABASE_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_D1_DATABASE_ID!;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;

async function listPosts() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql: 'SELECT slug, title, date FROM posts ORDER BY date DESC' }),
  });

  const data = await response.json();
  const results = data.result?.[0]?.results || [];
  
  console.log(`Total posts in D1: ${results.length}\n`);
  results.forEach((post: any, i: number) => {
    console.log(`${i + 1}. ${post.slug} - ${post.title} (${post.date})`);
  });
}

listPosts().catch(console.error);
