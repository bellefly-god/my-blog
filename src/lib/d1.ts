// Cloudflare D1 API 客户端
// 使用 REST API 访问 D1 数据库

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_D1_DATABASE_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_D1_DATABASE_ID || process.env.CLOUDFLARE_D1_DATABASE_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

const D1_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_D1_DATABASE_ID}/query`;

export interface D1Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  date: string;
  likes: number;
  dislikes: number;
  created_at: string;
}

export interface D1Reaction {
  id: string;
  post_id: string;
  reaction_type: "like" | "dislike";
  ip_hash: string;
  created_at: string;
}

export interface D1Tool {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  manual: string | null;
  icon: string | null;
  url: string | null;
  created_at: string;
}

// 执行 SQL 查询
export async function executeQuery(sql: string, params?: unknown[]): Promise<unknown[]> {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_D1_DATABASE_ID || !CLOUDFLARE_API_TOKEN) {
    console.warn("D1 configuration missing");
    return [];
  }

  const response = await fetch(D1_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`D1 API error: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.errors?.[0]?.message || "Query failed");
  }

  return data.result?.[0]?.results || [];
}

// Posts
export async function getAllPosts(): Promise<D1Post[]> {
  const sql = "SELECT * FROM posts ORDER BY date DESC";
  return await executeQuery(sql) as D1Post[];
}

export async function getPostBySlug(slug: string): Promise<D1Post | null> {
  const sql = "SELECT * FROM posts WHERE slug = ?";
  const results = await executeQuery(sql, [slug]) as D1Post[];
  return results[0] || null;
}

// Alias for use in page components
export const getPostBySlugFromD1 = getPostBySlug;

// Reactions
export async function getReactions(postId: string): Promise<D1Reaction[]> {
  const sql = "SELECT * FROM reactions WHERE post_id = ?";
  return await executeQuery(sql, [postId]) as D1Reaction[];
}

export async function addReaction(postId: string, reactionType: "like" | "dislike", ipHash: string): Promise<void> {
  const id = crypto.randomUUID();
  const sql = "INSERT OR REPLACE INTO reactions (id, post_id, reaction_type, ip_hash, created_at) VALUES (?, ?, ?, ?, datetime('now'))";
  await executeQuery(sql, [id, postId, reactionType, ipHash]);
}

// Tools
export async function getAllTools(): Promise<D1Tool[]> {
  const sql = "SELECT * FROM tools ORDER BY created_at DESC";
  return await executeQuery(sql) as D1Tool[];
}

export async function getToolBySlug(slug: string): Promise<D1Tool | null> {
  const sql = "SELECT * FROM tools WHERE slug = ?";
  const results = await executeQuery(sql, [slug]) as D1Tool[];
  return results[0] || null;
}
