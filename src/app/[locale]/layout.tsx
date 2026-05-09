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
    en: "Jack Wang's Blog - Discover the best AI tools, developer tools, Web3 tools, and productivity tools. AnyTools helps you find the right tools faster. 676 curated tools across 12 categories.",
    zh: "Jack Wang 的博客 - 发现最好的 AI 工具、开发工具、Web3 工具和效率工具。AnyTools 帮你快速找到最适合的工具。收录 676 个工具，12 个分类。",
  };

  const titles: Record<string, string> = {
    en: "Jack Wang - AnyTools: Discover the Best Tools",
    zh: "Jack Wang - AnyTools：发现最好的工具",
  };

  return {
    title: {
      default: titles[locale] || titles.en,
      template: "%s | Jack Wang's Blog",
    },
    description: descriptions[locale] || descriptions.en,
    keywords: [
      "AnyTools",
      "tool navigation",
      "AI tools",
      "developer tools",
      "Web3 tools",
      "productivity tools",
      "GitHub trending",
      "tool discovery",
      "工具导航",
      "AI 工具",
      "开发工具",
      "效率工具",
      "独立开发",
      "indie developer",
      "blog",
    ],
    authors: [{ name: "Jack Wang", url: "https://blog.pagecleans.com" }],
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url: "https://blog.pagecleans.com",
      siteName: "Jack Wang's Blog - AnyTools",
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      images: [
        {
          url: "https://blog.pagecleans.com/og-image.png",
          width: 1200,
          height: 630,
          alt: "AnyTools - Discover the Best Tools",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      site: "@FairyZhang1214",
      images: ["https://blog.pagecleans.com/og-image.png"],
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
