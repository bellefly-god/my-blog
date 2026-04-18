"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface ToolsSearchProps {
  onSearch: (query: string) => void;
}

export function ToolsSearch({ onSearch }: ToolsSearchProps) {
  const [query, setQuery] = useState("");
  const t = useTranslations("tools");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={t("searchPlaceholder")}
          className="w-full px-5 py-4 pl-12 text-base border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {query && (
          <button
            onClick={() => {
              setQuery("");
              onSearch("");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
