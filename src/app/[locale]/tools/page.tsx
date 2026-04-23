import { setRequestLocale, getTranslations } from "next-intl/server";
import { ToolsList } from "@/components/ToolsList";
import { getAllTools } from "@/lib/d1";

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const tools = await getAllTools();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Page Header */}
      <section className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-6">
          {t("tools.title")}
        </h1>
        <p className="text-lg text-muted max-w-2xl leading-relaxed">
          {t("tools.description")}
        </p>
      </section>

      {/* Tools Content with Search and List */}
      <ToolsList tools={tools} />
    </div>
  );
}
