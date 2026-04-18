// Cloudflare D1 + R2 API 客户端

const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_D1_DATABASE_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_D1_DATABASE_ID || process.env.CLOUDFLARE_D1_DATABASE_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "blog";

const D1_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_D1_DATABASE_ID}/query`;
const R2_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/r2/buckets/${R2_BUCKET_NAME}/objects`;

export interface D1Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;  // R2 object key 或实际内容
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

// 执行 D1 查询
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
    throw new Error(`D1 API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.errors?.[0]?.message || "Query failed");
  }

  return data.result?.[0]?.results || [];
}

// 从 R2 获取内容
export async function fetchFromR2(objectKey: string): Promise<string | null> {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN || !R2_BUCKET_NAME) {
    return null;
  }

  try {
    const url = `${R2_API_URL}/${objectKey}`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error(`R2 fetch error: ${response.status}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.error("R2 fetch error:", error);
    return null;
  }
}

// 获取文章列表
export async function getAllPosts(): Promise<D1Post[]> {
  const sql = "SELECT * FROM posts ORDER BY date DESC";
  return await executeQuery(sql) as D1Post[];
}

// 获取单篇文章
export async function getPostBySlug(slug: string): Promise<D1Post | null> {
  const sql = "SELECT * FROM posts WHERE slug = ?";
  const results = await executeQuery(sql, [slug]) as D1Post[];
  return results[0] || null;
}

// 获取文章完整内容（包括从 R2 获取）
export async function getPostWithContent(slug: string): Promise<(D1Post & { contentHtml: string }) | null> {
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return null;
  }

  let contentHtml = post.content || "";

  // 如果 content 是一个 R2 对象 key，从 R2 获取
  if (contentHtml.startsWith("posts/")) {
    const r2Content = await fetchFromR2(contentHtml);
    if (r2Content) {
      // 简单的 Markdown 转 HTML (实际项目中建议使用更完善的库)
      contentHtml = r2Content
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
        .replace(/^\- (.*$)/gm, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
      contentHtml = `<p>${contentHtml}</p>`;
    }
  }

  return {
    ...post,
    contentHtml
  };
}

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

// Alias for page components
export const getPostBySlugFromD1 = getPostBySlug;
