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
      id: 'followpack-001',
      name: JSON.stringify({ en: 'FollowPack', zh: 'FollowPack' }),
      slug: 'followpack',
      description: JSON.stringify({
        en: 'AI meeting follow-up generator. Turn meeting notes into professional follow-up emails in 10 seconds.',
        zh: 'AI 会议跟进邮件生成工具，10 秒完成会议记录到专业跟进包。'
      }),
      manual: JSON.stringify({
        en: 'Paste meeting notes, select meeting type and tone, generate follow-up emails, action items, meeting summary, and CRM notes instantly.',
        zh: '粘贴会议记录，选择会议类型和语气风格，一键生成跟进邮件、行动项、会议摘要和 CRM 笔记。'
      }),
      icon: '📧',
      url: 'https://followpack.pagecleans.com',
    },
    {
      id: 'anytools-001',
      name: JSON.stringify({ en: 'AnyTools', zh: 'AnyTools' }),
      slug: 'anytools',
      description: JSON.stringify({
        en: 'Tool navigation platform with 676 tools across 12 categories. GitHub trending rankings included.',
        zh: '工具导航平台，收录 676 个工具，12 个分类，GitHub 榜单。'
      }),
      manual: JSON.stringify({
        en: 'One-stop tool navigation with AI tools, developer tools, Web3 tools, productivity tools categories, real-time GitHub trending, and AI prompts library.',
        zh: '一站式工具导航，包含 AI 工具、开发工具、Web3 工具、效率工具等分类，实时 GitHub 热门榜单，AI 提示词库。'
      }),
      icon: '🛠️',
      url: 'https://anytools.pagecleans.com',
    },
    {
      id: 'markflow-001',
      name: JSON.stringify({ en: 'MarkFlow', zh: 'MarkFlow' }),
      slug: 'markflow',
      description: JSON.stringify({
        en: 'Document to Markdown converter. Support PDF, Word, PowerPoint, Excel with REST API.',
        zh: '文档转 Markdown 工具，支持 PDF、Word、PowerPoint、Excel，提供 REST API。'
      }),
      manual: JSON.stringify({
        en: 'Upload documents or paste URL to convert to clean Markdown. REST API available for automation. No signup required.',
        zh: '上传文档或粘贴网址，一键转换为干净的 Markdown。提供 REST API 方便自动化集成，无需注册。'
      }),
      icon: '📄',
      url: 'https://markflow.studio.pagecleans.com',
    },
  ];
  
  for (const tool of tools) {
    const success = await insertTool(tool);
    console.log(`${JSON.parse(tool.name).en}: ${success ? '✅' : '❌'}`);
  }
  
  console.log('\nDone!');
}

main().catch(console.error);