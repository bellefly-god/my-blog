import { PostMeta, DBPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Locale } from "@/lib/posts";
import { Link } from "@/navigation";

interface PostCardProps {
  post: PostMeta | DBPost;
  locale: Locale;
}

// Default images for posts (can be overridden in post frontmatter)
const defaultImages = [
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=400&h=250&fit=crop",
];

export function PostCard({ post, locale }: PostCardProps) {
  // Use post image or default based on slug hash
  const imageIndex = post.slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % defaultImages.length;
  const imageUrl = (post as any).image || defaultImages[imageIndex];
  
  return (
    <article className="group">
      <Link
        href={`/posts/${post.slug}`}
        locale={locale}
        className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl bg-card border border-border hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all"
      >
        {/* Post Image */}
        <div className="flex-shrink-0 w-full sm:w-44 md:w-52">
          <div className="aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
        
        {/* Post Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
          <h2 className="font-serif text-lg md:text-xl font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h2>
          <time
            dateTime={post.date}
            className="text-sm text-muted mb-3 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.date)}
          </time>
          <p className="text-muted text-sm md:text-base leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
          <div className="mt-3 inline-flex items-center gap-1 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Read more
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}
