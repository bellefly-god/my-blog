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
export async function getAllPosts(locale?: string): Promise<D1Post[]> {
  let sql = "SELECT * FROM posts ORDER BY date DESC";
  let posts = await executeQuery(sql) as D1Post[];
  
  // 根据语言过滤
  if (locale) {
    if (locale === 'zh') {
      // 中文文章：slug 以 -zh 结尾
      posts = posts.filter(post => post.slug.endsWith('-zh'));
    } else {
      // 其他语言文章：slug 不以 -zh 结尾
      posts = posts.filter(post => !post.slug.endsWith('-zh'));
    }
  }
  
  return posts;
}

// 获取单篇文章
export async function getPostBySlug(slug: string, locale?: string): Promise<D1Post | null> {
  // 如果提供了 locale，根据语言调整 slug
  let adjustedSlug = slug;
  if (locale) {
    if (locale === 'zh') {
      // 中文文章：确保 slug 以 -zh 结尾
      if (!slug.endsWith('-zh')) {
        adjustedSlug = `${slug}-zh`;
      }
    } else {
      // 其他语言：移除 -zh 后缀
      adjustedSlug = slug.replace(/-zh$/, '');
    }
  }
  
  const sql = "SELECT * FROM posts WHERE slug = ?";
  const results = await executeQuery(sql, [adjustedSlug]) as D1Post[];
  return results[0] || null;
}

// 获取文章完整内容（包括从 R2 获取）
export async function getPostWithContent(slug: string, locale?: string): Promise<(D1Post & { contentHtml: string }) | null> {
  const post = await getPostBySlug(slug, locale);
  
  if (!post) {
    return null;
  }

  let contentHtml = post.content || "";

  // 如果 content 是一个 R2 对象 key，从 R2 获取
  if (contentHtml.startsWith("posts/")) {
    const r2Content = await fetchFromR2(contentHtml);
    if (r2Content) {
      // 移除 frontmatter
      const contentWithoutFrontmatter = r2Content.replace(/^---\n[\s\S]*?\n---\n?/, '');
      
      // 使用改进的 Markdown 转 HTML
      contentHtml = markdownToHtml(contentWithoutFrontmatter);
    }
  }

  return {
    ...post,
    contentHtml
  };
}

// 改进的 Markdown 转 HTML 函数
function markdownToHtml(markdown: string): string {
  let html = markdown;
  
  // 1. 移除 frontmatter（文件开头的 --- 包围区域）
  html = html.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
  
  // 2. 移除 MDX/JSX 组件（保留文本内容）
  html = html.replace(/<div[^>]*>([\s\S]*?)<\/div>/g, '$1');
  html = html.replace(/<svg[^>]*>[\s\S]*?<\/svg>/g, '');
  html = html.replace(/<[^>]+className="[^"]*"[^>]*>/g, '');
  
  // 3. 代码块（必须在其他转换之前处理）
  html = html.replace(/```(\w*)\r?\n([\s\S]*?)```/g, (_match, lang, code) => {
    const escapedCode = escapeHtml(code.trimEnd());
    return `<pre><code class="language-${lang || 'text'}">${escapedCode}</code></pre>`;
  });
  
  // 4. 表格
  html = html.replace(/(?:^|\n)(\|.+\|)\r?\n(\|[-:| ]+\|)\r?\n((?:\|.+\|\r?\n?)+)/g, (_match, headerLine, _sepLine, bodyBlock) => {
    const headers = headerLine.split('|').filter((h: string) => h.trim()).map((h: string) => `<th>${processInline(h.trim())}</th>`).join('');
    const rows = bodyBlock.trim().split(/\r?\n/).map((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => `<td>${processInline(c.trim())}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `\n<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>\n`;
  });
  
  // 5. 标题（h6 → h1 顺序，避免误替换）
  html = html.replace(/^###### (.*)$/gm, '<h6>$1</h6>');
  html = html.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
  
  // 6. 引用块
  html = html.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');
  // 合并连续引用
  html = html.replace(/<\/blockquote>\r?\n<blockquote>/g, '<br />');
  
  // 7. 水平线
  html = html.replace(/^---+$/gm, '<hr />');
  
  // 8. 无序列表
  html = html.replace(/^- (.*)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\r?\n?)+)/g, '<ul>$1</ul>');
  
  // 9. 有序列表
  html = html.replace(/^\d+\. (.*)$/gm, '<oli>$1</oli>');
  html = html.replace(/((?:<oli>.*<\/oli>\r?\n?)+)/g, (match) => {
    return '<ol>' + match.replace(/<\/?oli>/g, (tag) => tag.replace('oli', 'li')) + '</ol>';
  });
  
  // 10. 行内格式
  html = processInline(html);
  
  // 11. 段落和换行
  // 保护已有的块级元素
  const blockElements = ['<h1', '<h2', '<h3', '<h4', '<h5', '<h6', '<pre', '<table', '<ul', '<ol', '<blockquote', '<hr', '<div', '<p'];
  
  // 按双换行分段
  const blocks = html.split(/\r?\n\r?\n/);
  html = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    // 如果已经是块级元素，不需要再包 <p>
    if (blockElements.some(tag => trimmed.startsWith(tag))) {
      return trimmed;
    }
    // 否则包 <p>，内部单换行转 <br>
    return `<p>${trimmed.replace(/\r?\n/g, '<br />')}</p>`;
  }).join('\n');
  
  return html;
}

// 处理行内 Markdown 语法
function processInline(text: string): string {
  let result = text;
  // 粗体+斜体
  result = result.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  // 粗体
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // 斜体
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // 行内代码
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  // 链接
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return result;
}

// HTML 转义
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
