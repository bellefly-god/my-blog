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
    <aside className="lg:pl-8 lg:border-l lg:border-border">
      <h3 className="font-serif text-lg font-semibold mb-4">
        {t("recentFromDB")}
      </h3>
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.slice(0, 10).map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="block group"
            >
              <article className="p-3 rounded-lg hover:bg-card transition-colors">
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
    </aside>
  );
}
