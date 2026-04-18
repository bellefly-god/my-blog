import { useTranslations } from "next-intl";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Link } from "@/navigation";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl font-semibold hover:text-accent transition-colors"
        >
          Inkwell
        </Link>
        <nav className="flex items-center gap-6">
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
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
