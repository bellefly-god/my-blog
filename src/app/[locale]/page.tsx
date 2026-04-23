import { setRequestLocale, getTranslations } from "next-intl/server";
import { PostCard } from "@/components";
import { D1Post, getAllPosts } from "@/lib/d1";
import { Sidebar } from "@/components/Sidebar";

async function getDBPosts(locale: string): Promise<D1Post[]> {
  try {
    // 优先使用 D1 数据库，根据语言过滤
    const posts = await getAllPosts(locale);
    if (posts.length > 0) {
      return posts;
    }
  } catch (error) {
    console.error("Failed to fetch from D1:", error);
  }
  
  // 如果 D1 不可用，尝试使用 API
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts?locale=${locale}`, {
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // ignore
  }
  
  return [];
}

// Statistics data - dynamically computed
function getStats(postCount: number) {
  return [
    { value: String(postCount), label: "Articles Published", icon: "✍️" },
    { value: "2", label: "Tools Available", icon: "🛠" },
  ];
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const posts = await getDBPosts(locale);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="mb-20 relative">
        {/* Gradient Orbs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-accent/20 to-purple-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute -top-10 right-20 w-96 h-96 bg-gradient-to-bl from-orange-400/15 to-pink-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 py-8">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {t("home.heroBadge") || "Writing & Tools"}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              <span className="gradient-text">{t("home.heroTitle")}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-xl leading-relaxed mb-8 mx-auto lg:mx-0">
              {t("home.heroDescription")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href="#posts"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-full hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 transition-all"
              >
                {t("home.explorePosts")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border rounded-full hover:border-accent hover:text-accent transition-colors"
              >
                {t("home.exploreTools")}
              </Link>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="flex-shrink-0 relative">
            <div className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-purple-500/30 rounded-3xl rotate-6 animate-float" />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-pink-500/20 rounded-3xl -rotate-3 animate-float-slow" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-accent/20">
                <img
                  src="/avatar.png"
                  alt="Jack Wang"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {getStats(posts.length).map((stat, index) => (
            <div
              key={index}
              className="relative group p-6 rounded-2xl bg-card border border-border hover:border-accent/40 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted">{stat.label}</div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-12" id="posts">
        <div>
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-accent to-purple-500 rounded-full" />
              <h2 className="font-serif text-2xl font-semibold">
                {t("home.recentPosts")}
              </h2>
            </div>
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post: D1Post, index: number) => (
                  <PostCard key={post.slug} post={post} locale={locale as "en" | "zh" | "ja" | "ko"} />
                ))}
              </div>
            ) : (
              <p className="text-muted py-8">
                {t("home.noPosts")}
              </p>
            )}
          </section>
        </div>

        <div className="lg:mt-0">
          <Sidebar posts={posts} />
        </div>
      </div>
    </div>
  );
}
