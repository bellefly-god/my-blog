"use client";

import { useTranslations } from "next-intl";

interface HotTool {
  rank: number;
  name: string;
  downloads: string;
  rating: number;
}

// Mock data for hot tools leaderboard
const hotTools: HotTool[] = [
  { rank: 1, name: "AI Code Assistant", downloads: "12.5K", rating: 4.9 },
  { rank: 2, name: "Markdown Editor Pro", downloads: "8.2K", rating: 4.8 },
  { rank: 3, name: "API Testing Kit", downloads: "6.7K", rating: 4.7 },
  { rank: 4, name: "Design System Builder", downloads: "5.1K", rating: 4.6 },
  { rank: 5, name: "CLI Toolkit", downloads: "4.3K", rating: 4.5 },
];

interface HotToolsLeaderboardProps {
  className?: string;
}

export function HotToolsLeaderboard({ className }: HotToolsLeaderboardProps) {
  const t = useTranslations("tools");

  return (
    <div className={`bg-card border border-border rounded-xl p-5 ${className}`}>
      <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-xl">🔥</span>
        {t("hotTools")}
      </h3>
      <div className="space-y-3">
        {hotTools.map((tool) => (
          <div
            key={tool.rank}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/10 transition-colors cursor-pointer group"
          >
            {/* Rank */}
            <div
              className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0 ${
                tool.rank === 1
                  ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                  : tool.rank === 2
                  ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                  : tool.rank === 3
                  ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                  : "bg-muted/20 text-muted"
              }`}
            >
              {tool.rank}
            </div>
            
            {/* Tool Info */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate group-hover:text-accent transition-colors">
                {tool.name}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted mt-0.5">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {tool.downloads}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {tool.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
