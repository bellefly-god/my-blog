import { formatDate } from "@/lib/utils";
import { DBPost } from "@/lib/types";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

interface SidebarProps {
  posts: DBPost[];
}

export function Sidebar({ posts }: SidebarProps) {
  const t = useTranslations("sidebar");

  return (
    <aside className="lg:sticky lg:top-8 space-y-6">
      {/* Recent Posts Card */}
      <div className="p-5 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-serif text-lg font-semibold">
            {t("recentFromDB")}
          </h3>
        </div>
        {posts.length > 0 ? (
          <div className="space-y-2">
            {posts.slice(0, 8).map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="block group"
              >
                <article className="p-3 rounded-xl hover:bg-secondary transition-colors">
                  <h4 className="font-medium text-sm group-hover:text-accent transition-colors line-clamp-2 mb-1">
                    {post.title}
                  </h4>
                  <time
                    dateTime={post.date}
                    className="text-xs text-muted"
                  >
                    {formatDate(post.date)}
                  </time>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            No posts yet.
          </p>
        )}
      </div>
      
      {/* Quick Links Card */}
      <div className="p-5 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <h3 className="font-serif text-lg font-semibold">Quick Links</h3>
        </div>
        <div className="space-y-2">
          <Link href="/tools" className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors text-sm">
            <span>🛠</span> Tools
          </Link>
          <Link href="/rss.xml" className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors text-sm">
            <span>📡</span> RSS Feed
          </Link>
        </div>
      </div>
    </aside>
  );
}
