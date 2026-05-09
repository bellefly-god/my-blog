import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(process.cwd(), '.env.local') });

const ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID!;
const DATABASE_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_D1_DATABASE_ID!;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;

async function updatePost(slug: string, title: string, excerpt: string) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      sql: 'UPDATE posts SET title = ?, excerpt = ? WHERE slug = ?', 
      params: [title, excerpt, slug] 
    }),
  });

  const data = await response.json();
  return data.success;
}

async function main() {
  // Update AnyTools articles with better SEO titles
  await updatePost('anytools-introduction', 'AnyTools: Discover the Best Tools - 676 AI, Developer & Productivity Tools', 'AnyTools is a curated tool navigation platform with 676 tools across 12 categories including AI tools, developer tools, Web3 tools, productivity tools.');
  await updatePost('anytools-introduction-zh', 'AnyTools：发现最好的工具 - 676 个 AI 工具、开发工具、效率工具导航', 'AnyTools 是一站式工具导航平台，收录 676 个优质工具，涵盖 AI 工具、开发工具、Web3 工具、效率工具等 12 个分类。');
  
  console.log('Done!');
}

main().catch(console.error);
