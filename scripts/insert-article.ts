// Script to insert FollowPack article into D1 database
// Run with environment variables:
// CLOUDFLARE_ACCOUNT_ID=xxx CLOUDFLARE_D1_DATABASE_ID=xxx CLOUDFLARE_API_TOKEN=xxx npx tsx scripts/insert-article.ts

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!ACCOUNT_ID || !DATABASE_ID || !API_TOKEN) {
  console.error('Missing required environment variables');
  console.log('Required: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN');
  process.exit(1);
}

const ZH_ARTICLE = {
  id: crypto.randomUUID(),
  title: 'FollowPack：一键将会议记录转化为专业跟进包',
  slug: 'followup-ai-introduction-zh',
  excerpt: '告别繁琐的手动整理，让 AI 为你完成从会议记录到完整跟进方案的所有工作。10 秒内完成从会议记录到完整跟进包的转化。',
  date: '2026-04-19',
  likes: 0,
  dislikes: 0,
};

const EN_ARTICLE = {
  id: crypto.randomUUID(),
  title: 'FollowPack: Turn Meeting Notes into Professional Follow-ups in Seconds',
  slug: 'followup-ai-introduction',
  excerpt: 'Say goodbye to tedious manual organization. Let AI do all the work from meeting notes to complete follow-up packages in just 10 seconds.',
  date: '2026-04-19',
  likes: 0,
  dislikes: 0,
};

async function insertPost(post: typeof ZH_ARTICLE) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
  
  const sql = `INSERT INTO posts (id, title, slug, excerpt, date, likes, dislikes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sql,
      params: [post.id, post.title, post.slug, post.excerpt, post.date, post.likes, post.dislikes],
    }),
  });

  const data = await response.json();
  console.log(`Insert ${post.slug}:`, data.success ? 'Success' : data.errors);
  return data;
}

async function main() {
  console.log('Inserting Chinese article...');
  await insertPost(ZH_ARTICLE);
  
  console.log('Inserting English article...');
  await insertPost(EN_ARTICLE);
  
  console.log('Done!');
}

main().catch(console.error);