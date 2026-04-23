"use client";

import { useTranslations } from "next-intl";

interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  url: string | null;
}

interface HotToolsLeaderboardProps {
  tools?: Tool[];
  className?: string;
}

export function HotToolsLeaderboard({ tools = [], className }: HotToolsLeaderboardProps) {
  const t = useTranslations("tools");

  return (
    <div className={`bg-card border border-border rounded-xl p-5 ${className}`}>
      <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-xl">🔥</span>
        {t("hotTools")}
      </h3>
      {tools.length > 0 ? (
        <div className="space-y-3">
          {tools.map((tool, index) => (
            <div
              key={tool.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/10 transition-colors cursor-pointer group"
            >
              {/* Rank */}
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0 ${
                  index === 0
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                    : index === 1
                    ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                    : index === 2
                    ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                    : "bg-muted/20 text-muted"
                }`}
              >
                {index + 1}
              </div>
              
              {/* Tool Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate group-hover:text-accent transition-colors">
                  {tool.icon && <span className="mr-1">{tool.icon}</span>}
                  {tool.name}
                </div>
                {tool.description && (
                  <div className="text-xs text-muted mt-0.5 truncate">
                    {tool.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted text-center py-4">No tools yet</p>
      )}
    </div>
  );
}
