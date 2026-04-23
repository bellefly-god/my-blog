"use client";

import { useState, useMemo } from "react";
import { ToolsSearch } from "./ToolsSearch";
import { HotToolsLeaderboard } from "./HotToolsLeaderboard";
import { ToolCard } from "./ToolCard";
import { useTranslations } from "next-intl";

interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  url: string | null;
}

interface ToolsListProps {
  tools: Tool[];
}

export function ToolsList({ tools }: ToolsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("tools");

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    
    const query = searchQuery.toLowerCase();
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description?.toLowerCase().includes(query)
    );
  }, [tools, searchQuery]);

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8">
      {/* Left Sidebar - Hot Tools Leaderboard */}
      <div className="order-2 lg:order-1">
        <div className="lg:sticky lg:top-8">
          <HotToolsLeaderboard tools={tools} className="animate-float-slow" />
        </div>
      </div>

      {/* Right Content - Search + Tools List */}
      <div className="order-1 lg:order-2">
        {/* Search Bar */}
        <ToolsSearch onSearch={setSearchQuery} />

        {/* Tools List */}
        {filteredTools.length > 0 ? (
          <div className="space-y-4">
            {filteredTools.map((tool, index) => (
              <div
                key={tool.id}
                className={`animate-float-delay-${(index % 3) + 1}`}
              >
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-muted">
              {searchQuery
                ? t("noResults")
                : t("noTools")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
