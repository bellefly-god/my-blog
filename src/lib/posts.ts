import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, PostMeta } from "./types";

export type Locale = "en" | "zh" | "ja" | "ko";

const postsDirectory = path.join(process.cwd(), "content/posts");

export function getPostSlugs(locale: Locale): string[] {
  const localePath = path.join(postsDirectory, locale);
  if (!fs.existsSync(localePath)) {
    return [];
  }
  return fs.readdirSync(localePath).filter((file) => file.endsWith(".mdx"));
}

export function getPostBySlug(slug: string, locale: Locale): Post | null {
  const realSlug = slug.replace(/\.mdx$/, "");
  const localePath = path.join(postsDirectory, locale);
  const fullPath = path.join(localePath, `${realSlug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title || "Untitled",
    date: data.date || new Date().toISOString(),
    excerpt: data.excerpt || "",
    content,
  };
}

export function getAllPosts(locale: Locale): Post[] {
  const slugs = getPostSlugs(locale);
  const posts = slugs
    .map((slug) => getPostBySlug(slug.replace(/\.mdx$/, ""), locale))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  return posts;
}

export function getAllPostMeta(locale: Locale): PostMeta[] {
  const posts = getAllPosts(locale);
  return posts.map(({ content, ...meta }) => meta);
}

// Get all unique slugs across all locales (for static generation)
export function getAllPostSlugs(): { slug: string; locale: Locale }[] {
  const locales: Locale[] = ["en", "zh", "ja", "ko"];
  const result: { slug: string; locale: Locale }[] = [];

  for (const locale of locales) {
    const slugs = getPostSlugs(locale);
    for (const slug of slugs) {
      result.push({ slug: slug.replace(/\.mdx$/, ""), locale });
    }
  }

  return result;
}
