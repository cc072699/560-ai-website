import { getProductById, getProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronRight, PhoneCall, Send, Image as ImageIcon, Workflow, Play } from 'lucide-react';
import type { PageSection } from '@/types';

export const revalidate = 30;

// Enable static pre-rendering for product routes
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({
    id: p.id,
  }));
}

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const hasCustomDesign = product.detailSections && product.detailSections.length > 0;

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FDFDFD] relative overflow-hidden pt-28 pb-20">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.25] pointer-events-none z-0" />
      
      {!hasCustomDesign ? (
        /* Fallback Default Static Template */
        <div className="container mx-auto px-6 relative z-10 max-w-5xl text-left">
          {/* Breadcrumbs / Back button */}
          <div className="mb-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>返回产品中心</span>
            </Link>
          </div>

          {/* Hero Section: Product Title, Description, Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
            {/* Text Info */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 mb-4 w-fit">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
                {product.title}
              </h1>
              <p className="text-base md:text-lg font-bold text-blue-600 mb-6 leading-relaxed">
                {product.tagline}
              </p>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 indent-[2em]">
                {product.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/10 hover:scale-[1.01]"
                >
                  <span>申请试用</span>
                  <Send className="w-4 h-4" />
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-blue-200 text-gray-700 hover:text-blue-600 font-semibold rounded-xl transition-all"
                >
                  <span>联系专家</span>
                  <PhoneCall className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Product Image */}
            <div className="lg:col-span-6 rounded-2xl overflow-hidden aspect-video border border-gray-200/80 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Features Matrix */}
          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight text-center mb-12">
              核心功能与服务优势
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-150 p-6 shadow-sm flex flex-col items-start text-left"
                >
                  <div className="text-blue-600 mb-4 bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    核心模块 {index + 1}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-normal">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Deployment Details */}
          <div className="bg-gray-50/70 border border-gray-150 rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center gap-8 text-left">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">部署与安全保障</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">
                支持企业级本地私有化部署、高安全物理隔离环境以及跨源异构数据库对接。我们提供端到端的数据合规交付和 24/7 技术团队全程支持。
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <ChevronRight className="w-4 h-4 text-blue-500" />
                <span>支持私有云/私有化本地部署</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <ChevronRight className="w-4 h-4 text-blue-500" />
                <span>多层级细粒度数据加密体系</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <ChevronRight className="w-4 h-4 text-blue-500" />
                <span>支持定制化数据源高速对接</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Dynamic Modular Page Layout */
        <div className="w-full relative z-10">
          {/* Breadcrumb banner */}
          <div className="container mx-auto px-6 max-w-5xl text-left mb-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>返回产品中心</span>
            </Link>
          </div>

          {/* Map and render components */}
          <div className="flex flex-col w-full">
            {product.detailSections!.map((section) => {
              if (section.type === 'hero') return <DetailHero key={section.id} section={section} />;
              if (section.type === 'capabilities') return <DetailCapabilities key={section.id} section={section} />;
              if (section.type === 'scenarios') return <DetailScenarios key={section.id} section={section} />;
              if (section.type === 'architecture') return <DetailArchitecture key={section.id} section={section} />;
              if (section.type === 'cta') return <DetailCta key={section.id} section={section} />;
              if (section.type === 'video') return <DetailVideo key={section.id} section={section} />;
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponents for dynamic sections
function DetailHero({ section }: { section: PageSection }) {
  const hero = section.hero;
  if (!hero) return null;
  return (
    <div className="relative w-full aspect-[16/7] md:aspect-[21/9] min-h-[450px] bg-slate-900 flex items-center justify-center overflow-hidden">
      {hero.bgType === 'video' ? (
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
          <source src={hero.bgUrl} type="video/mp4" />
        </video>
      ) : hero.bgUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={hero.bgUrl} alt="Hero background" className="absolute inset-0 w-full h-full object-cover opacity-45" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/20 via-gray-950/40 to-gray-950/80" />
      <div className="relative z-10 text-center text-white px-6 max-w-4xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">{hero.title}</h1>
        {hero.subtitle && (
          <p className="text-base md:text-xl text-slate-200/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            {hero.subtitle}
          </p>
        )}
        <div className="pt-4 flex justify-center gap-4">
          <Link href="/#contact" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:scale-[1.01]">
            申请试用
          </Link>
          <Link href="/#contact" className="px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all backdrop-blur-sm">
            联系专家
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailCapabilities({ section }: { section: PageSection }) {
  const caps = section.capabilities;
  if (!caps) return null;
  return (
    <div className="py-24 bg-white relative overflow-hidden border-b border-gray-100">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">核心能力</h2>
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>
        <div className="space-y-24">
          {caps.map((cap, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                <div className={`lg:col-span-5 flex flex-col justify-center text-left ${isLeft ? '' : 'order-1 lg:order-2'}`}>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-snug">{cap.title}</h3>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed indent-[2em]">{cap.description}</p>
                </div>
                <div className={`lg:col-span-7 rounded-2xl overflow-hidden aspect-video border border-gray-200/80 shadow-lg relative bg-slate-50 ${isLeft ? '' : 'order-2 lg:order-1'}`}>
                  {cap.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cap.imageUrl} alt={cap.title} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2 bg-gray-55">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <span className="text-sm font-semibold">暂无展示图片</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DetailScenarios({ section }: { section: PageSection }) {
  const sc = section.scenarios;
  if (!sc) return null;
  return (
    <div className="py-24 bg-slate-50/50 border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{sc.title || '应用场景'}</h2>
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sc.items.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full text-left">
              <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden border-b border-gray-100">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1 bg-gray-50">
                    <ImageIcon className="w-6 h-6 opacity-40" />
                    <span className="text-xs">无场景图片</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-500 leading-relaxed font-normal">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailArchitecture({ section }: { section: PageSection }) {
  const arch = section.architecture;
  if (!arch) return null;
  return (
    <div className="py-24 bg-white relative overflow-hidden border-b border-gray-100">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{arch.title || '产品架构图'}</h2>
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>
        <div className="border border-gray-200/80 rounded-2xl overflow-hidden shadow-lg bg-slate-50 relative aspect-[21/9] flex items-center justify-center mb-10">
          {arch.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={arch.imageUrl} alt={arch.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2 bg-slate-50">
              <Workflow className="w-10 h-10 opacity-45 animate-pulse" />
              <span className="text-sm font-semibold">请上传架构大图</span>
            </div>
          )}
        </div>
        {arch.description && (
          <p className="text-sm md:text-base text-gray-500 max-w-3xl mx-auto leading-relaxed text-center italic font-normal">
            “ {arch.description} ”
          </p>
        )}
      </div>
    </div>
  );
}

function DetailCta({ section }: { section: PageSection }) {
  const cta = section.cta;
  if (!cta) return null;
  return (
    <section className="bg-gradient-to-r from-blue-700 to-indigo-850 text-white text-center py-20 px-6 relative overflow-hidden">
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[300px] bg-blue-600/30 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">{cta.title}</h2>
        <p className="text-sm md:text-base text-slate-200/90 font-light leading-relaxed max-w-xl mx-auto">{cta.description}</p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/#contact" className="px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl shadow-md hover:bg-slate-50 hover:scale-[1.01] transition-all">
            {cta.primaryText}
          </Link>
          <Link href="/#contact" className="px-8 py-3.5 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
            {cta.secondaryText}
          </Link>
        </div>
      </div>
    </section>
  );
}

function getEmbedUrl(url: string): { type: 'iframe' | 'video'; src: string } {
  if (!url) return { type: 'video', src: '' };
  // Matches Bilibili links: https://www.bilibili.com/video/BV1rxjo6zEg1?t=10.3
  const biliRegex = /(?:bilibili\.com\/video\/|bvid=)(BV[a-zA-Z0-9]+)/i;
  const match = url.match(biliRegex);
  if (match && match[1]) {
    return {
      type: 'iframe',
      src: `https://player.bilibili.com/player.html?bvid=${match[1]}&high_quality=1&as_wide=1&danmaku=0`
    };
  }
  if (url.includes('player.bilibili.com') || url.includes('youtube.com/embed')) {
    return { type: 'iframe', src: url };
  }
  return { type: 'video', src: url };
}

function DetailVideo({ section }: { section: PageSection }) {
  const video = section.video;
  if (!video) return null;

  const { type, src } = getEmbedUrl(video.videoUrl);

  return (
    <div className="py-24 bg-slate-50/50 border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
        <div className="max-w-2xl mx-auto space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{video.title}</h2>
          {video.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-xl mx-auto font-normal">
              {video.subtitle}
            </p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>
        
        <div className="max-w-3xl mx-auto border border-gray-200/80 rounded-2xl overflow-hidden shadow-2xl bg-slate-950 relative aspect-video flex items-center justify-center">
          {!video.videoUrl ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2 bg-slate-950">
              <Play className="w-12 h-12 opacity-50 text-slate-200 animate-pulse" />
              <span className="text-sm font-semibold">请配置视频播放源链接</span>
            </div>
          ) : type === 'iframe' ? (
            <iframe
              src={src}
              scrolling="no"
              frameBorder="no"
              allowFullScreen={true}
              className="w-full h-full aspect-video border-0"
            />
          ) : (
            <video src={src} poster={video.coverUrl} controls className="w-full h-full object-contain" />
          )}
        </div>
      </div>
    </div>
  );
}
