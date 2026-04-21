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
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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
