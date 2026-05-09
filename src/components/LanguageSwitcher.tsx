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
    // 如果在文章页面，切换语言时跳转到首页而不是保持当前路径
    // 因为文章可能没有对应语言的版本
    if (pathname.includes("/posts/")) {
      router.push("/", { locale: newLocale as "en" | "zh" | "ja" | "ko" });
    } else {
      router.replace(pathname, { locale: newLocale as "en" | "zh" | "ja" | "ko" });
    }
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
