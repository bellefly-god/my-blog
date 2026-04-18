import { setRequestLocale, getTranslations } from "next-intl/server";
import { ToolsList } from "@/components/ToolsList";
import { DBTool } from "@/lib/types";

async function getTools(): Promise<DBTool[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/tools`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const tools = await getTools();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Page Header */}
      <section className="mb-12 animate-float-slow">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-6">
          {t("tools.title")}
        </h1>
        <p className="text-lg text-muted max-w-2xl leading-relaxed">
          {t("tools.description")}
        </p>
      </section>

      {/* Tools Content with Search, Leaderboard, and List */}
      <ToolsList tools={tools} />
    </div>
  );
}
