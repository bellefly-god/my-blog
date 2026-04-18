export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

// Database types for Supabase
export interface DBPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  date: string;
  likes: number;
  dislikes: number;
  created_at: string;
}

export interface DBReaction {
  id: string;
  post_id: string;
  reaction_type: "like" | "dislike";
  ip_hash: string;
  created_at: string;
}

export interface DBTool {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  manual: string | null;
  icon: string | null;
  url: string | null;
  created_at: string;
}

// API response types
export interface PostWithReactions extends DBPost {
  userReaction?: "like" | "dislike" | null;
}

export interface Tool extends DBTool {}
