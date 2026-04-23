"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Link } from "@/navigation";

export function Header() {
  const t = useTranslations("nav");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl font-semibold hover:text-accent transition-colors flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white text-sm font-bold">
            J
          </span>
          Jack Wang
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          <Link
            href="/"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            {t("home")}
          </Link>
          <Link
            href="/tools"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            {t("tools")}
          </Link>
          <Link
            href="/rss.xml"
            className="text-sm text-muted hover:text-foreground transition-colors"
            target="_blank"
          >
            {t("rss")}
          </Link>
          <div className="w-px h-5 bg-border" />
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted hover:text-foreground transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm text-muted hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("home")}
            </Link>
            <Link
              href="/tools"
              className="text-sm text-muted hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("tools")}
            </Link>
            <Link
              href="/rss.xml"
              className="text-sm text-muted hover:text-foreground transition-colors py-2"
              target="_blank"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("rss")}
            </Link>
            <div className="flex items-center gap-4 pt-2 border-t border-border">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
