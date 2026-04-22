import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border bg-secondary/30 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="font-serif text-xl font-semibold hover:text-accent transition-colors">
              Jack Wang
            </Link>
            <p className="mt-3 text-sm text-muted max-w-xs">
              个人独立开发者，分享开发经验与实用工具。
            </p>
          </div>
          
          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-muted hover:text-accent transition-colors">
                Home
              </Link>
              <Link href="/tools" className="block text-sm text-muted hover:text-accent transition-colors">
                Tools
              </Link>
              <Link href="/rss.xml" className="block text-sm text-muted hover:text-accent transition-colors">
                RSS Feed
              </Link>
            </div>
          </div>
          
          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex items-center gap-4">
              <a
                href="https://blog.pagecleans.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                aria-label="Blog"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
              <a
                href="mailto:ariflim813@gmail.com"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                aria-label="Email"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a
                href="/rss.xml"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                aria-label="RSS"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>
            &copy; {new Date().getFullYear()} Jack Wang. All rights reserved.
          </p>
          <p>
            {t("poweredBy")}{' '}
            <a
              href="https://nextjs.org"
              className="hover:text-accent transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js
            </a>
            {' & '}
            <a
              href="https://www.cloudflare.com"
              className="hover:text-accent transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflare
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
