import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getToolBySlug } from "@/lib/d1";

// 强制动态渲染（Cloudflare Workers 不支持 generateStaticParams）
export const dynamic = "force-dynamic";

interface ToolPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

// 生成元数据
export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  
  if (!tool) {
    return { title: "Tool Not Found" };
  }
  
  return {
    title: `${tool.name} - Tools`,
    description: tool.description || `${tool.name} - A useful tool for productivity`,
  };
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const { locale, slug } = await params;
  const tool = await getToolBySlug(slug);
  
  if (!tool) {
    notFound();
  }
  
  // 解析 manual 字段（JSON 格式，支持双语）
  let manualData = {
    features: [] as string[],
    howItWorks: [] as string[],
    perfectFor: [] as string[],
  };
  
  if (tool.manual) {
    try {
      const parsed = JSON.parse(tool.manual);
      // 支持双语格式 { en: {...}, zh: {...} } 或旧格式 { features: [...], ... }
      if (parsed[locale]) {
        manualData = parsed[locale];
      } else if (parsed.en || parsed.features) {
        manualData = parsed[locale] || parsed.en || parsed;
      }
    } catch {
      // 如果解析失败，保持空数据
    }
  }
  
  const t = {
    en: {
      backToTools: "← Back to Tools",
      features: "Features",
      howItWorks: "How It Works",
      perfectFor: "Perfect For",
      getStarted: "Get Started",
      visitSite: "Visit Site",
    },
    zh: {
      backToTools: "← 返回工具列表",
      features: "功能特点",
      howItWorks: "使用方法",
      perfectFor: "适用场景",
      getStarted: "立即使用",
      visitSite: "访问网站",
    },
  }[locale] || {
    backToTools: "← Back to Tools",
    features: "Features",
    howItWorks: "How It Works",
    perfectFor: "Perfect For",
    getStarted: "Get Started",
    visitSite: "Visit Site",
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 返回链接 */}
        <Link
          href={`/${locale}/tools`}
          className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8"
        >
          {t.backToTools}
        </Link>
        
        {/* 工具头部 */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-8">
          <div className="flex items-start gap-6">
            {/* 图标 */}
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl flex-shrink-0">
              {tool.icon || "🔧"}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-3">{tool.name}</h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                {tool.description || "A useful tool for productivity"}
              </p>
            </div>
          </div>
          
          {/* CTA 按钮 */}
          {tool.url && (
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                {t.getStarted}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          )}
        </div>
        
        {/* 功能特点 */}
        {manualData.features.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              {t.features}
            </h2>
            <ul className="space-y-3">
              {manualData.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* 使用方法 */}
        {manualData.howItWorks.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📖</span>
              {t.howItWorks}
            </h2>
            <ol className="space-y-4">
              {manualData.howItWorks.map((step, index) => (
                <li key={index} className="flex items-start gap-4 text-slate-300">
                  <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
        
        {/* 适用场景 */}
        {manualData.perfectFor.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              {t.perfectFor}
            </h2>
            <div className="flex flex-wrap gap-3">
              {manualData.perfectFor.map((item, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-full text-sm border border-slate-600/50"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}