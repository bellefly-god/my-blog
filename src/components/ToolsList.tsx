"use client";

import { useState, useMemo } from "react";
import { ToolsSearch } from "./ToolsSearch";
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
    <div className="space-y-6">
      {/* Search Bar */}
      <ToolsSearch onSearch={setSearchQuery} />

      {/* Tools List */}
      {filteredTools.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
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
  );
}
