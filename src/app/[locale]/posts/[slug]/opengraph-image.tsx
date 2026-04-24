import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/d1";

export const runtime = "edge";
export const alt = "Blog Post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface PostOGImageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function Image({ params }: PostOGImageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  const title = post?.title || "Blog Post";
  const date = post?.date 
    ? new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          fontFamily: "system-ui",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
          }}
        />
        
        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", zIndex: 10 }}>
          {/* Site name */}
          <p style={{ fontSize: "24px", color: "#6366f1", marginBottom: "24px" }}>
            blog.pagecleans.com
          </p>
          
          {/* Title */}
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.2,
              marginBottom: "24px",
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>
          
          {/* Date */}
          {date && (
            <p style={{ fontSize: "22px", color: "#94a3b8" }}>
              {date}
            </p>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
