import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(process.cwd(), '.env.local') });

const ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID!;
const DATABASE_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_D1_DATABASE_ID!;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;

async function insertTool(tool: {
  id: string;
  name: string;
  slug: string;
  description: string;
  manual: string;
  icon: string;
  url: string;
}) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
  
  const sql = `INSERT OR REPLACE INTO tools (id, name, slug, description, manual, icon, url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sql,
      params: [tool.id, tool.name, tool.slug, tool.description, tool.manual, tool.icon, tool.url],
    }),
  });

  const data = await response.json();
  return data.success;
}

async function main() {
  const tools = [
    {
      id: crypto.randomUUID(),
      name: 'FollowPack',
      slug: 'followpack',
      description: 'AI 会议跟进邮件生成工具，10 秒完成会议记录到专业跟进包',
      manual: '粘贴会议记录，选择会议类型和语气风格，一键生成跟进邮件、行动项、会议摘要和 CRM 笔记。',
      icon: '📧',
      url: 'https://followpack.pagecleans.com',
    },
    {
      id: crypto.randomUUID(),
      name: 'AnyTools',
      slug: 'anytools',
      description: '工具导航平台，收录 676 个工具，12 个分类，GitHub 榜单',
      manual: '一站式工具导航，包含 AI 工具、开发工具、Web3 工具、效率工具等分类，实时 GitHub 热门榜单，AI 提示词库。',
      icon: '🛠️',
      url: 'https://anytools.pagecleans.com',
    },
  ];
  
  for (const tool of tools) {
    const success = await insertTool(tool);
    console.log(`${tool.name}: ${success ? '✅' : '❌'}`);
  }
  
  console.log('\nDone!');
}

main().catch(console.error);
