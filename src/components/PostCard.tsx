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
    <article className="group card-hover">
      <Link
        href={`/posts/${post.slug}`}
        locale={locale}
        className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-all"
      >
        {/* Post Image */}
        <div className="flex-shrink-0 w-full sm:w-40 md:w-48">
          <div className="aspect-[16/10] sm:aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        
        {/* Post Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h2 className="font-serif text-lg md:text-xl font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h2>
          <time
            dateTime={post.date}
            className="text-sm text-muted mb-2"
          >
            {formatDate(post.date)}
          </time>
          <p className="text-muted text-sm md:text-base leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
