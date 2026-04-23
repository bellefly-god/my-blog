import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/d1";

const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://blog.pagecleans.com";

export async function GET() {
  // Use default locale 'en' for RSS feed
  const posts = await getAllPosts("en");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jack Wang</title>
    <link>${SITE_URL}</link>
    <description>个人独立开发记录与工具分享</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map((post) => {
        const pubDate = new Date(post.date).toUTCString();
        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/en/posts/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/en/posts/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || "")}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
