import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPostWithContent } from "@/lib/d1";
import { formatDate } from "@/lib/utils";
import { ReactionButtons } from "@/components/ReactionButtons";
import { SocialShare } from "@/components/SocialShare";
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
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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

export async function generateMetadata({ params }: PostPageProps) {
  const { slug, locale } = await params;
  const post = await getPostWithContent(slug, locale);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  // Determine article language
  const isZh = post.slug.endsWith("-zh");
  const articleLocale = isZh ? "zh" : "en";
  const canonicalSlug = isZh ? post.slug.replace("-zh", "") : post.slug;
  const canonicalUrl = `https://blog.pagecleans.com/${articleLocale}/posts/${canonicalSlug}`;

  // Generate keywords based on article content
  const keywords = [
    post.title,
    ...(post.excerpt?.split(" ").slice(0, 5) || []),
    "AnyTools",
    "tool navigation",
    "AI tools",
    "developer tools",
    "productivity",
    "indie developer",
  ];

  const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://blog.pagecleans.com"}/api/og?title=${encodeURIComponent(post.title)}&excerpt=${encodeURIComponent(post.excerpt || "")}&date=${encodeURIComponent(post.date)}`;

  return {
    title: post.title,
    description: post.excerpt || "",
    keywords: keywords,
    authors: [{ name: "Jack Wang", url: "https://blog.pagecleans.com" }],
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
      publishedTime: post.date,
      authors: ["Jack Wang"],
      locale: articleLocale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: articleLocale === "zh" ? "en_US" : "zh_CN",
      url: canonicalUrl,
      siteName: "Jack Wang's Blog - AnyTools",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `https://blog.pagecleans.com/en/posts/${canonicalSlug}`,
        zh: `https://blog.pagecleans.com/zh/posts/${canonicalSlug}`,
      },
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const post = await getPostWithContent(slug, locale);

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
      
      <div className="prose max-w-none">
        {post.contentHtml ? (
          <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        ) : (
          <p className="text-muted italic">
            Full article content coming soon...
          </p>
        )}
      </div>
      
      <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <SocialShare
          title={post.title}
          url={`https://blog.pagecleans.com/${locale}/posts/${slug}`}
        />
      </div>

      <div className="mt-8 pt-8 border-t border-border">
        <ReactionButtons
          slug={slug}
          initialLikes={reactions.likes}
          initialDislikes={reactions.dislikes}
          initialUserReaction={reactions.userReaction}
        />
      </div>
    </article>
  );
}
