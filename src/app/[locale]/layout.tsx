import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Header, Footer } from "@/components";
import Script from "next/script";
import "../globals.css";
import { routing } from "@/routing";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const descriptions: Record<string, string> = {
    en: "Documenting my journey as an independent developer. Sharing useful tools, web development insights, and the joy of building products from idea to launch.",
    zh: "个人独立开发记录与工具分享",
  };

  return {
    title: {
      default: "Jack Wang",
      template: "%s | Jack Wang",
    },
    description: descriptions[locale] || descriptions.en,
    keywords: ["developer", "blog", "tools", "web development", "independent developer", "独立开发", "开发工具"],
    authors: [{ name: "Jack Wang", url: "https://blog.pagecleans.com" }],
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url: "https://blog.pagecleans.com",
      siteName: "Jack Wang",
      title: "Jack Wang - Indie Developer",
      description: descriptions[locale] || descriptions.en,
    },
    twitter: {
      card: "summary_large_image",
      title: "Jack Wang - Indie Developer",
      description: descriptions.en,
      site: "@jackwang",
    },
    alternates: {
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FM59K4E1YJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FM59K4E1YJ');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
