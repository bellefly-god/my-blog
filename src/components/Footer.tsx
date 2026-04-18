import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>
            &copy; {new Date().getFullYear()} Inkwell. All rights reserved.
          </p>
          <p>
            {t("poweredBy")}{" "}
            <a
              href="https://nextjs.org"
              className="hover:text-accent transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
