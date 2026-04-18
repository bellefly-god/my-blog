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

// Statistics data
const stats = [
  { value: "5000+", label: "Monthly Readers", icon: "📖" },
  { value: "120+", label: "Articles Published", icon: "✍️" },
  { value: "50+", label: "Topics Covered", icon: "🎯" },
  { value: "4.9", label: "Reader Rating", icon: "⭐" },
];

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
      <section className="mb-16 animate-float-slow">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t("home.heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-2xl leading-relaxed mb-6">
              {t("home.heroDescription")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a
                href="#posts"
                className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                {t("home.explorePosts")}
              </a>
              <a
                href="/tools"
                className="inline-flex items-center px-6 py-3 border border-border rounded-lg hover:bg-card transition-colors"
              >
                {t("home.exploreTools")}
              </a>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 relative animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-3xl rotate-6"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-pink-500/10 rounded-3xl -rotate-3"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-accent/30 to-orange-400/30 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-accent/20">
                <span className="text-6xl md:text-7xl lg:text-8xl">✨</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="mb-16 py-12 px-6 bg-card/50 rounded-2xl border border-border">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-center mb-10">
          {t("home.achievements")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center animate-float-delay-${(index % 3) + 1}`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-8" id="posts">
        <div>
          <section>
            <h2 className="font-serif text-2xl font-semibold mb-8">
              {t("home.recentPosts")}
            </h2>
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post: D1Post, index: number) => (
                  <div
                    key={post.slug}
                    className={`animate-float-delay-${(index % 3) + 1}`}
                  >
                    <PostCard post={post} locale={locale as "en" | "zh" | "ja" | "ko"} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted py-8">
                {t("home.noPosts")}
              </p>
            )}
          </section>
        </div>

        <div className="lg:mt-16">
          <Sidebar posts={posts} />
        </div>
      </div>
    </div>
  );
}
