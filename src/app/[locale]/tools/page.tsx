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
      <section className="mb-12 animate-float-slow">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-6">
          {t("tools.title")}
        </h1>
        <p className="text-lg text-muted max-w-2xl leading-relaxed">
          {t("tools.description")}
        </p>
      </section>

      {/* Stats Overview */}
      <section className="mb-12">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value gradient-text">{tools.length}</div>
            <div className="stat-label">Tools Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-value gradient-text">1.2K+</div>
            <div className="stat-label">Total Downloads</div>
          </div>
          <div className="stat-card">
            <div className="stat-value gradient-text">4.8</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-value gradient-text">500+</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>
      </section>

      {/* Charts Section - Placeholder for future data */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Usage Trend Chart */}
          <div className="chart-container">
            <div className="chart-title">📈 Usage Trend (Last 7 Days)</div>
            <div className="chart-placeholder">
              <span>Chart data will be connected here</span>
            </div>
          </div>
          
          {/* Download Stats Chart */}
          <div className="chart-container">
            <div className="chart-title">📊 Monthly Downloads</div>
            <div className="chart-placeholder">
              <span>Chart data will be connected here</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Content with Search, Leaderboard, and List */}
      <ToolsList tools={tools} />
    </div>
  );
}
