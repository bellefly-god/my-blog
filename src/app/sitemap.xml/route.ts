import { getAllPosts, getAllTools } from "@/lib/d1";

const SITE_URL = "https://blog.pagecleans.com";
const LOCALES = ["en", "zh", "ja", "ko"];

export async function GET() {
  // 获取所有文章和工具
  const posts = await getAllPosts();
  const tools = await getAllTools();
  
  // 生成 sitemap 条目
  const entries: string[] = [];
  
  // 首页 - 各语言版本
  for (const locale of LOCALES) {
    entries.push(generateEntry(`/${locale}`, 1.0, "daily"));
  }
  
  // 工具列表页 - 各语言版本
  for (const locale of LOCALES) {
    entries.push(generateEntry(`/${locale}/tools`, 0.8, "weekly"));
  }
  
  // 文章页 - 根据语言过滤
  for (const post of posts) {
    // 判断文章语言
    const isZh = post.slug.endsWith("-zh");
    const locale = isZh ? "zh" : "en";
    const baseSlug = isZh ? post.slug.replace("-zh", "") : post.slug;
    entries.push(generateEntry(`/${locale}/posts/${baseSlug}`, 0.7, "monthly", post.date));
  }
  
  // 工具详情页 - 各语言版本
  for (const tool of tools) {
    for (const locale of LOCALES) {
      entries.push(generateEntry(`/${locale}/tools/${tool.slug}`, 0.6, "monthly"));
    }
  }
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;
  
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function generateEntry(
  path: string,
  priority: number,
  changefreq: string,
  lastmod?: string
): string {
  const lastmodTag = lastmod 
    ? `<lastmod>${new Date(lastmod).toISOString().split("T")[0]}</lastmod>` 
    : "";
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    ${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}
