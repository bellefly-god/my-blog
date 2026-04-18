// Cloudflare D1 + R2 API 客户端

function getConfig() {
  return {
    accountId: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID,
    databaseId: process.env.NEXT_PUBLIC_CLOUDFLARE_D1_DATABASE_ID || process.env.CLOUDFLARE_D1_DATABASE_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    r2Bucket: process.env.R2_BUCKET_NAME || "blog",
  };
}

function getD1ApiUrl(): string {
  const { accountId, databaseId } = getConfig();
  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
}

function getR2ApiUrl(): string {
  const { accountId, r2Bucket } = getConfig();
  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${r2Bucket}/objects`;
}

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

// 执行 D1 查询
export async function executeQuery(sql: string, params?: unknown[]): Promise<unknown[]> {
  const { accountId, databaseId, apiToken } = getConfig();
  
  if (!accountId || !databaseId || !apiToken) {
    console.warn("D1 configuration missing", { accountId: !!accountId, databaseId: !!databaseId, apiToken: !!apiToken });
    return [];
  }

  const url = getD1ApiUrl();
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("D1 API error:", response.status, errorText);
    throw new Error(`D1 API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    console.error("D1 query failed:", data.errors);
    throw new Error(data.errors?.[0]?.message || "Query failed");
  }

  return data.result?.[0]?.results || [];
}

// 从 R2 获取内容
export async function fetchFromR2(objectKey: string): Promise<string | null> {
  const { accountId, apiToken, r2Bucket } = getConfig();
  
  if (!accountId || !apiToken || !r2Bucket) {
    console.warn("R2 configuration missing");
    return null;
  }

  try {
    const url = `${getR2ApiUrl()}/${objectKey}`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${apiToken}`,
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
      // 简单的 Markdown 转 HTML
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
