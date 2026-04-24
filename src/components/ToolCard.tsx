"use client";

import { Link } from "@/navigation";
import { useLocale } from "next-intl";

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    url: string | null;
  };
}

// Default images for tools
const defaultToolImages = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
];

// 解析双语字段
function parseLocalized(jsonStr: string, locale: string): string {
  try {
    const parsed = JSON.parse(jsonStr);
    return parsed[locale] || parsed.en || jsonStr;
  } catch {
    return jsonStr;
  }
}

export function ToolCard({ tool }: ToolCardProps) {
  const locale = useLocale();
  
  // 解析双语 name 和 description
  const toolName = parseLocalized(tool.name, locale);
  const toolDescription = tool.description ? parseLocalized(tool.description, locale) : null;
  
  // Use tool slug to deterministically pick an image
  const imageIndex = tool.slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % defaultToolImages.length;
  const imageUrl = defaultToolImages[imageIndex];

  return (
    <article className="group card-hover">
      <Link
        href={`/tools/${tool.slug}`}
        className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-all"
      >
        {/* Tool Image */}
        <div className="flex-shrink-0 w-full sm:w-48 md:w-56">
          <div className="aspect-[16/10] sm:aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            {tool.icon ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-purple-500/20">
                <span className="text-5xl">{tool.icon}</span>
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={toolName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>
        </div>
        
        {/* Tool Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h2 className="font-serif text-xl md:text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">
            {toolName}
          </h2>
          {toolDescription && (
            <p className="text-muted text-sm md:text-base leading-relaxed line-clamp-3 mb-3">
              {toolDescription}
            </p>
          )}
          {tool.url && (
            <div className="flex items-center gap-2 text-sm text-accent">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="truncate">{tool.url}</span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
