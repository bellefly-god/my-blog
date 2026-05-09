import { getAllPosts, getAllTools } from "@/lib/d1";

const SITE_URL = "https://blog.pagecleans.com";
const LOCALES = ["en", "zh"];

export async function GET() {
  const posts = await getAllPosts();
  const tools = await getAllTools();
  
  const entries: string[] = [];
  const seenUrls = new Set<string>();
  
  function addEntry(url: string, priority: number, changefreq: string, lastmod?: string) {
    if (seenUrls.has(url)) return;
    seenUrls.add(url);
    
    const lastmodTag = lastmod 
      ? `<lastmod>${new Date(lastmod).toISOString().split("T")[0]}</lastmod>` 
      : "";
    entries.push(`  <url>
    <loc>${url}</loc>
    ${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
  }
  
  // Homepage - highest priority
  for (const locale of LOCALES) {
    addEntry(`${SITE_URL}/${locale}`, 1.0, "daily");
  }
  
  // Tools page - for AnyTools
  for (const locale of LOCALES) {
    addEntry(`${SITE_URL}/${locale}/tools`, 0.9, "weekly");
  }
  
  // Blog page
  for (const locale of LOCALES) {
    addEntry(`${SITE_URL}/${locale}/posts`, 0.8, "daily");
  }
  
  // Articles with proper language mapping
  for (const post of posts) {
    const isZh = post.slug.endsWith("-zh");
    const locale = isZh ? "zh" : "en";
    const baseSlug = isZh ? post.slug.replace("-zh", "") : post.slug;
    
    // Skip if same article in both languages exists (avoid duplicate)
    const altSlug = isZh ? post.slug.replace("-zh", "") : `${post.slug}-zh`;
    const altExists = posts.some(p => p.slug === altSlug);
    
    if (altExists && isZh) continue; // Only add zh version if en exists
    
    addEntry(
      `${SITE_URL}/${locale}/posts/${baseSlug}`, 
      0.7, 
      "monthly", 
      post.date
    );
  }
  
  // Tool details - for AnyTools tool listings
  for (const tool of tools) {
    addEntry(`${SITE_URL}/zh/tools/${tool.slug}`, 0.6, "monthly");
    addEntry(`${SITE_URL}/en/tools/${tool.slug}`, 0.6, "monthly");
  }
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries.join("\n")}
</urlset>`;
  
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}