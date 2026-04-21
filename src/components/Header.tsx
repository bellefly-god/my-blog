import { useTranslations } from "next-intl";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Link } from "@/navigation";

export function Header() {
  const t = useTranslations("nav");

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
        <nav className="flex items-center gap-5">
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
      </div>
    </header>
  );
}
