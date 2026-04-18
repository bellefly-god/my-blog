"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { routing } from "@/routing";

const languages = [
  { code: "en" as const, name: "English" },
  { code: "zh" as const, name: "中文" },
  { code: "ja" as const, name: "日本語" },
  { code: "ko" as const, name: "한국어" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as "en" | "zh" | "ja" | "ko" });
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-transparent text-sm text-muted hover:text-foreground transition-colors border border-border rounded px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
