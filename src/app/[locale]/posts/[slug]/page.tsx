import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPostBySlug, getAllPostSlugs, Locale } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ReactionButtons } from "@/components/ReactionButtons";
import { Link } from "@/navigation";

interface PostPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

interface ReactionData {
  likes: number;
  dislikes: number;
  userReaction: "like" | "dislike" | null;
}

async function getReactions(slug: string): Promise<ReactionData> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/posts/${slug}/reactions`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return { likes: 0, dislikes: 0, userReaction: null };
    }
    return res.json();
  } catch {
    return { likes: 0, dislikes: 0, userReaction: null };
  }
}

export async function generateStaticParams() {
  const allSlugs = getAllPostSlugs();
  return allSlugs.map(({ slug, locale }) => ({
    locale,
    slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug, locale as Locale);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const post = getPostBySlug(slug, locale as Locale);

  if (!post) {
    notFound();
  }

  const reactions = await getReactions(slug);

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <Link
          href="/"
          className="text-sm text-muted hover:text-accent transition-colors mb-8 inline-block"
        >
          {t("post.backToPosts")}
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
          {post.title}
        </h1>
        <time dateTime={post.date} className="text-sm text-muted">
          {formatDate(post.date)}
        </time>
      </header>
      <div className="prose">
        <MDXRemote source={post.content} />
      </div>
      <ReactionButtons
        slug={slug}
        initialLikes={reactions.likes}
        initialDislikes={reactions.dislikes}
        initialUserReaction={reactions.userReaction}
      />
    </article>
  );
}
