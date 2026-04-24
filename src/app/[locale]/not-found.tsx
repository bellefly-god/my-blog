"use client";

import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-6">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold gradient-text leading-none">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-purple-500/10 blur-3xl -z-10" />
        </div>
        
        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          {t("home.heroTitle")}
        </h2>
        <p className="text-muted text-lg mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-medium rounded-full hover:shadow-lg hover:shadow-accent/25 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border rounded-full hover:border-accent hover:text-accent transition-colors"
          >
            Browse Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
