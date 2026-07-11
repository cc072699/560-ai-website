import { getProductById, getProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronRight, PhoneCall, Send, Image as ImageIcon, Workflow, Play, Download, Award, MapPin, Images, Check, Monitor, Layers } from 'lucide-react';
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
            <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-gray-200/80 shadow-lg bg-slate-50 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.imageAlt}
                className="w-full h-auto max-h-[500px] object-contain"
              />
            </div>
          </div>

          {/* Product Features Matrix */}
            <div className="mb-20">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight text-center mb-12">
              核心功能与服务优势
            </h2>
            <div className={`grid grid-cols-1 ${product.features.length === 1 ? 'md:grid-cols-1' : product.features.length === 2 ? 'md:grid-cols-2' : product.features.length === 4 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>

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
              if (section.type === 'timeline') return <DetailTimeline key={section.id} section={section} />;
              if (section.type === 'features') return <DetailFeatures key={section.id} section={section} />;
              if (section.type === 'faq') return <DetailFaq key={section.id} section={section} />;
              if (section.type === 'comparison') return <DetailComparison key={section.id} section={section} />;
              if (section.type === 'testimonials') return <DetailTestimonials key={section.id} section={section} />;
              if (section.type === 'metrics') return <DetailMetrics key={section.id} section={section} />;
              if (section.type === 'canvas') return <DetailCanvas key={section.id} section={section} />;
              if (section.type === 'richText') return <DetailRichText key={section.id} section={section} />;
              if (section.type === 'partners') return <DetailPartners key={section.id} section={section} />;
              if (section.type === 'carousel') return <DetailCarousel key={section.id} section={section} />;
              if (section.type === 'downloads') return <DetailDownloads key={section.id} section={section} />;
              if (section.type === 'certificates') return <DetailCertificates key={section.id} section={section} />;
              if (section.type === 'coverage') return <DetailCoverage key={section.id} section={section} />;
              if (section.type === 'consultation') return <DetailConsultation key={section.id} section={section} />;
              if (section.type === 'multiDevice') return <DetailMultiDevice key={section.id} section={section} />;
              if (section.type === 'hardwareSpec') return <DetailHardwareSpec key={section.id} section={section} />;
              if (section.type === 'techStack') return <DetailTechStack key={section.id} section={section} />;
              if (section.type === 'sandbox') return <DetailSandbox key={section.id} section={section} />;
              if (section.type === 'signalWave') return <DetailSignalWave key={section.id} section={section} />;
              if (section.type === 'bentoGrid') return <DetailBentoGrid key={section.id} section={section} />;
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
        <img src={hero.bgUrl} alt="Hero background" className="absolute inset-0 w-full h-full object-cover object-center opacity-45" />
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
                <div className={`lg:col-span-7 rounded-2xl overflow-hidden border border-gray-200/80 shadow-lg relative bg-slate-100 flex items-center justify-center min-h-[300px] ${isLeft ? '' : 'order-2 lg:order-1'}`}>
                  {cap.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cap.imageUrl} alt={cap.title} className="w-full h-auto max-h-[600px] object-contain hover:scale-[1.02] transition-transform duration-500" />
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
  const itemCount = sc.items.length;
  const gridCols = itemCount === 1 ? 'md:grid-cols-1' : itemCount === 2 ? 'md:grid-cols-2' : itemCount === 4 ? 'md:grid-cols-2 lg:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="py-24 bg-slate-50/50 border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{sc.title || '应用场景'}</h2>
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>
        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
          {sc.items.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full text-left">
              <div className="bg-slate-100 relative overflow-hidden border-b border-gray-100 flex items-center justify-center min-h-[180px]">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.title} className="w-full h-auto max-h-[350px] object-contain hover:scale-[1.02] transition-transform duration-500" />
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
        <div className="border border-gray-200/80 rounded-2xl overflow-hidden shadow-lg bg-slate-100 relative flex items-center justify-center min-h-[300px] mb-10">
          {arch.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={arch.imageUrl} alt={arch.title} className="w-full h-auto max-h-[700px] object-contain" />
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

function DetailTimeline({ section }: { section: PageSection }) {
  const timeline = section.timeline;
  if (!timeline) return null;
  return (
    <div className="py-24 bg-white border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{timeline.title}</h2>
          {timeline.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{timeline.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className="relative mt-12">
          <div className="absolute top-12 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 hidden md:block" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {timeline.steps.map((step, idx) => (
              <div key={idx} className="group flex flex-col text-left space-y-4 relative bg-white p-6 rounded-2xl border border-gray-150/70 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {step.duration || `阶段 ${idx + 1}`}
                  </span>
                  <span className="text-sm font-extrabold text-gray-300 group-hover:text-blue-500/30 transition-colors">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailFeatures({ section }: { section: PageSection }) {
  const feats = section.features;
  if (!feats) return null;
  const itemCount = feats.items.length;
  const gridCols = itemCount === 1 ? 'md:grid-cols-1' : itemCount === 2 ? 'md:grid-cols-2' : itemCount === 4 ? 'md:grid-cols-2 lg:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="py-24 bg-slate-50/50 border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{feats.title}</h2>
          {feats.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{feats.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {feats.items.map((item, idx) => (
            <div key={idx} className="group relative bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:border-blue-200 hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-left">
              {item.highlightText && (
                <span className="absolute top-4 right-4 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                  {item.highlightText}
                </span>
              )}
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-[17px] font-bold text-gray-900 mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailFaq({ section }: { section: PageSection }) {
  const faq = section.faq;
  if (!faq) return null;
  return (
    <div className="py-24 bg-white border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{faq.title}</h2>
          {faq.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{faq.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className="space-y-4">
          {faq.items.map((item, idx) => (
            <details
              key={idx}
              className="group border border-gray-200/80 rounded-2xl p-5 bg-white shadow-sm hover:shadow hover:border-blue-200 transition-all duration-300 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between font-bold text-gray-800 cursor-pointer list-none text-base select-none text-left">
                <span>{item.question}</span>
                <span className="p-1 bg-slate-50 text-slate-400 group-open:bg-blue-50 group-open:text-blue-600 rounded-lg transition-colors duration-300">
                  <svg className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              <div className="mt-3.5 text-sm text-gray-500 leading-relaxed font-medium border-t border-slate-100/60 pt-3 text-left">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailComparison({ section }: { section: PageSection }) {
  const comp = section.comparison;
  if (!comp) return null;
  return (
    <div className="py-24 bg-slate-50/50 border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{comp.title}</h2>
          {comp.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{comp.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className="overflow-x-auto rounded-3xl border border-gray-200/80 bg-white shadow-xl max-w-4xl mx-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-gray-200 text-gray-700">
                {comp.headers.map((hdr, idx) => (
                  <th key={idx} className="px-6 py-4 font-bold tracking-tight first:pl-8">{hdr}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comp.rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b last:border-b-0 border-gray-100 hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 bg-slate-50/10 pl-8">{row.label}</td>
                  {row.values.map((val, vIdx) => {
                    const isHighlighted = row.highlightIndex === (vIdx + 1);
                    return (
                      <td key={vIdx} className={`px-6 py-4 ${
                        isHighlighted 
                          ? 'bg-blue-50/30 font-semibold text-blue-700 border-l border-r border-blue-100/50 first:border-l-0 last:border-r-0' 
                          : 'text-gray-500 font-normal'
                      }`}>
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DetailTestimonials({ section }: { section: PageSection }) {
  const test = section.testimonials;
  if (!test) return null;
  return (
    <div className="py-24 bg-white border-b border-gray-100 relative overflow-hidden">
      {/* Decorative quotes background */}
      <div className="absolute -top-10 -right-10 text-[180px] font-serif text-slate-100 select-none pointer-events-none opacity-50 font-bold">
        “
      </div>
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{test.title}</h2>
          {test.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{test.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {test.items.map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-white to-slate-50/30 rounded-3xl border border-gray-150 p-8 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6 relative hover:-translate-y-0.5">
              <p className="text-gray-600 text-sm md:text-base leading-relaxed font-medium italic relative z-10">
                “ {item.quote} ”
              </p>
              <div className="flex items-center gap-4 border-t border-gray-100 pt-4 z-10">
                {item.avatarUrl ? (
                  <img src={item.avatarUrl} alt={item.author} className="w-11 h-11 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-sm">
                    {item.author[0]}
                  </div>
                )}
                <div className="text-left">
                  <h4 className="font-extrabold text-gray-900 text-sm">{item.author}</h4>
                  <p className="text-xs text-gray-450 font-semibold mt-0.5">
                    {item.role} · {item.company}
                  </p>
                </div>
                {item.logoUrl && (
                  <img src={item.logoUrl} alt="Company logo" className="h-5 max-w-[80px] object-contain ml-auto opacity-80" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailMetrics({ section }: { section: PageSection }) {
  const met = section.metrics;
  if (!met) return null;
  return (
    <div className="py-24 bg-slate-50/50 border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{met.title}</h2>
          {met.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{met.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        {/* 动态网格：1个=1列，2个=2列，3个=3列，4个=2列（2x2），5个以上=3列（3x2...） */}
        <div className={`grid grid-cols-1 ${met.items.length === 1 ? 'md:grid-cols-1' : met.items.length === 2 ? 'md:grid-cols-2' : met.items.length === 4 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-8 ${met.items.length === 4 ? 'max-w-2xl' : 'max-w-4xl'} mx-auto`}>
          {met.items.map((item, idx) => (
            <div key={idx} className="bg-white/95 backdrop-blur rounded-3xl border border-gray-150 p-8 shadow-sm hover:shadow-md transition-all text-center space-y-3">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-650 bg-clip-text text-transparent tracking-tight">
                {item.value}
              </div>
              <h4 className="font-extrabold text-gray-900 text-sm md:text-base">{item.label}</h4>
              {item.description && (
                <p className="text-xs text-gray-500 leading-relaxed font-normal">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailCanvas({ section }: { section: PageSection }) {
  const canv = section.canvas;
  if (!canv) return null;
  return (
    <div className="py-24 bg-white border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{canv.title}</h2>
          {canv.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{canv.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Panel: High Fidelity macOS screenshot wrapper */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
            {/* macOS Window Controls */}
            <div className="bg-slate-955 px-4 py-3 flex gap-1.5 items-center border-b border-slate-800 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex-grow relative bg-slate-950 flex items-center justify-center min-h-[300px] max-h-[600px]">
              {canv.imageUrl ? (
                <img src={canv.imageUrl} alt={canv.imageAlt || canv.title} className="w-full h-auto max-h-[600px] object-contain" />
              ) : (
                <div className="text-slate-500 flex flex-col items-center gap-2">
                  <ImageIcon className="w-10 h-10 opacity-30 text-slate-300 animate-pulse" />
                  <span className="text-xs font-semibold">企业级控制面板大图展示区</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Functional highlights */}
          <div className="lg:col-span-5 text-left space-y-6">
            {canv.description && (
              <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium border-l-2 border-blue-600 pl-4">
                {canv.description}
              </p>
            )}
            <div className="space-y-6 pt-2">
              {canv.features.map((feat, idx) => (
                <div key={idx} className="group space-y-1 bg-slate-50/50 hover:bg-blue-50/10 border border-transparent hover:border-blue-100/50 p-4 rounded-2xl transition-all">
                  <div className="text-base font-extrabold text-gray-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    <span>{feat.title}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed pl-4 font-normal">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRichText({ section }: { section: PageSection }) {
  const rt = section.richText;
  if (!rt) return null;
  const hasImage = !!rt.imageUrl;
  return (
    <div className="py-24 bg-slate-50/30 border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{rt.title}</h2>
          {rt.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{rt.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className={`grid grid-cols-1 ${hasImage ? 'lg:grid-cols-12 gap-12 lg:gap-16' : 'max-w-3xl mx-auto'} items-center`}>
          <div className={`${hasImage ? 'lg:col-span-7' : 'w-full'} ${rt.align === 'center' ? 'text-center' : 'text-left'} space-y-4 ${
            hasImage && rt.imagePosition === 'left' ? 'lg:order-2' : ''
          }`}>
            <div className="text-gray-500 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium indent-[2em]">
              {rt.content}
            </div>
          </div>
          {hasImage && (
            <div className={`lg:col-span-5 rounded-2xl overflow-hidden border border-gray-200/80 shadow-lg relative bg-white flex items-center justify-center ${
              rt.imagePosition === 'left' ? 'lg:order-1' : ''
            }`}>
              <img src={rt.imageUrl} alt="rich text side graphic" className="w-full h-auto max-h-[450px] object-contain" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function DetailPartners({ section }: { section: PageSection }) {
  const part = section.partners;
  if (!part) return null;
  return (
    <div className="py-16 bg-white border-b border-gray-100 text-center relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10 space-y-8">
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">{part.title}</h3>
          {part.subtitle && <p className="text-xs text-gray-450 font-semibold">{part.subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 pt-2 max-w-4xl mx-auto">
          {part.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300">
              {item.logoUrl ? (
                <img src={item.logoUrl} alt={item.name} className="h-6 md:h-8 max-w-[120px] object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              ) : (
                <div className="text-xs font-bold text-gray-400 bg-slate-50 border border-gray-150 px-4 py-2 rounded-xl shadow-sm">
                  {item.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailCarousel({ section }: { section: PageSection }) {
  const caro = section.carousel;
  if (!caro || !caro.items || caro.items.length === 0) return null;
  return (
    <div className="py-24 bg-slate-50/50 border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{caro.title}</h2>
          {caro.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{caro.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {caro.items.map((item, idx) => (
            <div key={idx} className="group bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="bg-slate-900 overflow-hidden relative flex items-center justify-center min-h-[200px] max-h-[400px]">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.caption || 'Product Slide'} className="w-full h-auto max-h-[400px] object-contain group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-slate-500 flex flex-col items-center gap-2">
                    <Images className="w-8 h-8 opacity-30 text-slate-350" />
                    <span className="text-xs font-semibold">演示大图 {idx + 1}</span>
                  </div>
                )}
              </div>
              <div className="p-6 text-left space-y-2">
                <h3 className="font-extrabold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                  {item.caption || `演示模块 ${idx + 1}`}
                </h3>
                {item.description && (
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-normal">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailDownloads({ section }: { section: PageSection }) {
  const dls = section.downloads;
  if (!dls || !dls.items || dls.items.length === 0) return null;
  return (
    <div className="py-24 bg-white border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{dls.title}</h2>
          {dls.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{dls.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {dls.items.map((item, idx) => (
            <div key={idx} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-gray-200/80 rounded-2xl bg-slate-50/20 hover:bg-slate-50/5 hover:border-blue-200 transition-all duration-300 gap-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-extrabold text-xs uppercase tracking-wider shrink-0 shadow-inner">
                  {item.fileType || 'DOC'}
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm md:text-base leading-tight group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  {item.fileSize && (
                    <span className="text-xs text-gray-450 font-semibold mt-1 block">{item.fileSize}</span>
                  )}
                </div>
              </div>
              <a
                href={item.fileUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white border border-gray-200 text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 text-xs font-bold rounded-xl shadow-sm hover:shadow flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> 立即下载
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailCertificates({ section }: { section: PageSection }) {
  const certs = section.certificates;
  if (!certs || !certs.items || certs.items.length === 0) return null;
  return (
    <div className="py-24 bg-slate-50/50 border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{certs.title}</h2>
          {certs.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{certs.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {certs.items.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-gray-150 p-6 flex flex-col items-center justify-between gap-5 text-center shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-20 h-28 bg-slate-50 border border-gray-200/80 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden relative shadow-inner">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                ) : (
                  <Award className="w-8 h-8 opacity-25 text-amber-600" />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-gray-900 text-sm leading-snug">{item.name}</h4>
                {item.issuingBody && (
                  <p className="text-xs text-gray-450 font-semibold">{item.issuingBody}</p>
                )}
                {item.date && (
                  <p className="text-[10px] text-gray-400 font-semibold">{item.date}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailCoverage({ section }: { section: PageSection }) {
  const cov = section.coverage;
  if (!cov || !cov.items || cov.items.length === 0) return null;
  return (
    <div className="py-24 bg-white border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{cov.title}</h2>
          {cov.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{cov.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          {cov.items.map((item, idx) => (
            <div key={idx} className="group p-6 border border-gray-150 rounded-3xl bg-slate-50/20 hover:bg-blue-50/5 hover:border-blue-150 transition-all duration-300 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="font-extrabold text-gray-900 text-base flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>{item.region}</span>
                </div>
                {item.address && (
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium pl-7">
                    {item.address}
                  </p>
                )}
              </div>
              <div className="border-t border-slate-100/60 pt-4 mt-4 text-xs text-gray-500 space-y-1 pl-7 font-medium">
                {item.phone && <div>联系电话: <span className="font-bold text-gray-800">{item.phone}</span></div>}
                {item.email && <div>服务邮箱: <span className="font-bold text-gray-800">{item.email}</span></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailConsultation({ section }: { section: PageSection }) {
  const cons = section.consultation;
  if (!cons) return null;
  return (
    <div className="py-24 bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-b border-gray-100 text-center relative overflow-hidden">
      {/* Visual background circle accents */}
      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-blue-500/10 blur-[100px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full bg-indigo-500/10 blur-[100px] -translate-y-1/2" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10 space-y-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            {cons.title}
          </h2>
          {cons.subtitle && (
            <p className="text-sm md:text-base text-slate-300 max-w-lg mx-auto font-light leading-relaxed">
              {cons.subtitle}
            </p>
          )}
        </div>

        <div className="flex justify-center pt-2">
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] text-white text-sm md:text-base font-extrabold rounded-2xl shadow-xl shadow-blue-900/40 cursor-pointer transition-all duration-300">
            {cons.ctaText}
          </button>
        </div>

        {cons.benefits && cons.benefits.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pt-6 text-xs md:text-sm text-slate-300 border-t border-white/5 max-w-xl mx-auto">
            {cons.benefits.map((bf, idx) => (
              <span key={idx} className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-blue-500 shrink-0" /> {bf}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailMultiDevice({ section }: { section: PageSection }) {
  const md = section.multiDevice;
  if (!md) return null;
  return (
    <div className="py-24 bg-white border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{md.title}</h2>
          {md.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{md.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Devices layers (Left side) */}
          <div className="lg:col-span-7 flex justify-center items-end relative min-h-[260px] md:min-h-[360px] bg-slate-50/50 rounded-3xl border border-gray-100 p-8">
            {/* Desktop Mockup */}
            <div className="w-[80%] max-w-[440px] bg-slate-900 rounded-2xl border border-slate-700/80 shadow-2xl p-2 select-none z-10 transition-transform hover:scale-[1.01] duration-300">
              <div className="aspect-[16/10] bg-slate-950 rounded-lg flex items-center justify-center text-xs text-slate-500 overflow-hidden relative border border-slate-800">
                {md.desktopUrl ? (
                  <img src={md.desktopUrl} alt="Desktop display" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Monitor className="w-8 h-8 opacity-40" />
                    <span>电脑端自适应截图</span>
                  </div>
                )}
              </div>
              <div className="h-1.5 bg-slate-700 rounded-b mt-2 w-16 mx-auto" />
            </div>

            {/* Tablet Mockup */}
            <div className="w-[38%] max-w-[200px] bg-slate-900 rounded-xl border border-slate-700/85 shadow-2xl p-1.5 select-none absolute right-4 bottom-4 z-20 transition-transform hover:translate-y-[-4px] duration-300">
              <div className="aspect-[3/4] bg-slate-955 rounded-md flex items-center justify-center text-[10px] text-slate-500 overflow-hidden relative border border-slate-800">
                {md.tabletUrl ? (
                  <img src={md.tabletUrl} alt="Tablet display" className="w-full h-full object-contain" />
                ) : (
                  <span>平板端</span>
                )}
              </div>
            </div>

            {/* Mobile Mockup */}
            <div className="w-[22%] max-w-[120px] bg-slate-900 rounded-xl border border-slate-700/90 shadow-2xl p-1 select-none absolute left-6 bottom-4 z-30 transition-transform hover:translate-y-[-4px] duration-300">
              <div className="aspect-[9/16] bg-slate-960 rounded-lg flex items-center justify-center text-[8px] text-slate-550 overflow-hidden relative border border-slate-800">
                {md.mobileUrl ? (
                  <img src={md.mobileUrl} alt="Mobile display" className="w-full h-full object-contain" />
                ) : (
                  <span>手机端</span>
                )}
              </div>
            </div>
          </div>

          {/* Details points (Right side) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {md.features.map((feat, idx) => (
              <div key={idx} className="bg-slate-50/60 border border-gray-100 p-6 rounded-2xl space-y-2 hover:shadow-md transition-shadow">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0" />
                  {feat.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed pl-5 font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailHardwareSpec({ section }: { section: PageSection }) {
  const hw = section.hardwareSpec;
  if (!hw) return null;
  return (
    <div className="py-24 bg-slate-950 text-white border-b border-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{hw.title}</h2>
          {hw.subtitle && (
            <p className="text-sm md:text-base text-slate-400 leading-relaxed font-light">{hw.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        {/* Central exploded spec container */}
        <div className="max-w-3xl mx-auto bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative flex items-center justify-center overflow-hidden">
          {hw.imageUrl ? (
            <img src={hw.imageUrl} alt="Core specification architecture" className="w-full h-auto max-h-[600px] object-contain rounded-2xl" />
          ) : (
            <div className="text-slate-500 flex flex-col items-center gap-3">
              <Workflow className="w-12 h-12 opacity-20 text-slate-300 animate-pulse" />
              <span className="text-xs tracking-wider">系统核心引擎工艺架构图</span>
            </div>
          )}

          {/* Absolute hotspot coordinates */}
          {hw.annotations.map((ann, idx) => (
            <div
              key={idx}
              className="absolute group z-20 cursor-pointer"
              style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
            >
              {/* Radar ring indicator */}
              <span className="relative flex h-5 w-5 justify-center items-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600 border border-white shadow"></span>
              </span>

              {/* Tooltip annotations popup */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-8 bg-slate-900/95 border border-slate-700 p-4 rounded-xl text-left shadow-2xl w-[220px] scale-0 group-hover:scale-100 transition-all duration-300 origin-bottom pointer-events-none">
                <h4 className="text-xs font-black text-white leading-snug">{ann.title}</h4>
                <p className="text-[10px] text-slate-405 leading-relaxed mt-1 font-medium">{ann.desc}</p>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900" />
              </div>
            </div>
          ))}
        </div>

        {/* Flat backup lists for mobile view */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12 text-left border-t border-slate-800/60 pt-8">
          {hw.annotations.map((ann, idx) => (
            <div key={idx} className="bg-slate-900/30 border border-slate-800 p-5 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900/50 border border-blue-500 text-[10px] font-black text-blue-400 flex items-center justify-center">
                  0{idx + 1}
                </span>
                <h4 className="text-sm font-bold text-white">{ann.title}</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-light pl-7">{ann.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailTechStack({ section }: { section: PageSection }) {
  const ts = section.techStack;
  if (!ts) return null;
  return (
    <div className="py-24 bg-white border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{ts.title}</h2>
          {ts.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{ts.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {ts.items.map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-gray-150/80 p-5 rounded-2xl flex flex-col justify-between text-left hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                  {item.logoUrl ? (
                    <img src={item.logoUrl} alt={item.name} className="w-full h-full object-contain" />
                  ) : (
                    <Layers className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-900 block truncate">{item.name}</h4>
                  <p className="text-xs text-gray-400 font-semibold">{item.version || '稳定发行版'}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 bg-blue-50 border border-blue-150 text-blue-600 rounded-md w-fit mt-4">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailSandbox({ section }: { section: PageSection }) {
  const sb = section.sandbox;
  if (!sb || !sb.tabs || sb.tabs.length === 0) return null;
  return (
    <div className="py-24 bg-slate-50/50 border-b border-gray-100">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{sb.title}</h2>
          {sb.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{sb.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        {/* Pure CSS tabbed interactive console switcher */}
        <div className="max-w-3xl mx-auto border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xl flex flex-col text-left">
          {/* Peer selector radio inputs */}
          {sb.tabs.map((tab, idx) => (
            <input
              key={idx}
              type="radio"
              id={`sbtab-${section.id}-${idx}`}
              name={`sandbox-${section.id}`}
              className={`peer/sbtab${idx} hidden`}
              defaultChecked={idx === 0}
            />
          ))}

          {/* Navigation Bar */}
          <div className="bg-slate-55/70 border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
            <div className="flex gap-2">
              {sb.tabs.map((tab, idx) => (
                <label
                  key={idx}
                  htmlFor={`sbtab-${section.id}-${idx}`}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all select-none border border-transparent
                    ${idx === 0 ? 'peer-checked/sbtab0:bg-white peer-checked/sbtab0:text-blue-650 peer-checked/sbtab0:border-gray-200 peer-checked/sbtab0:shadow-sm' : ''}
                    ${idx === 1 ? 'peer-checked/sbtab1:bg-white peer-checked/sbtab1:text-blue-650 peer-checked/sbtab1:border-gray-200 peer-checked/sbtab1:shadow-sm' : ''}
                    ${idx === 2 ? 'peer-checked/sbtab2:bg-white peer-checked/sbtab2:text-blue-650 peer-checked/sbtab2:border-gray-200 peer-checked/sbtab2:shadow-sm' : ''}
                    ${idx === 3 ? 'peer-checked/sbtab3:bg-white peer-checked/sbtab3:text-blue-650 peer-checked/sbtab3:border-gray-200 peer-checked/sbtab3:shadow-sm' : ''}
                    ${idx === 4 ? 'peer-checked/sbtab4:bg-white peer-checked/sbtab4:text-blue-650 peer-checked/sbtab4:border-gray-200 peer-checked/sbtab4:shadow-sm' : ''}
                    ${idx === 5 ? 'peer-checked/sbtab5:bg-white peer-checked/sbtab5:text-blue-650 peer-checked/sbtab5:border-gray-200 peer-checked/sbtab5:shadow-sm' : ''}
                    text-slate-500 hover:bg-slate-200/50
                  `}
                >
                  {tab.label}
                </label>
              ))}
            </div>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
          </div>

          {/* Sandbox code blocks */}
          {sb.tabs.map((tab, idx) => (
            <div
              key={idx}
              className={`hidden flex-col
                ${idx === 0 ? 'peer-checked/sbtab0:flex' : ''}
                ${idx === 1 ? 'peer-checked/sbtab1:flex' : ''}
                ${idx === 2 ? 'peer-checked/sbtab2:flex' : ''}
                ${idx === 3 ? 'peer-checked/sbtab3:flex' : ''}
                ${idx === 4 ? 'peer-checked/sbtab4:flex' : ''}
                ${idx === 5 ? 'peer-checked/sbtab5:flex' : ''}
              `}
            >
              <div className="p-6 bg-slate-900 text-slate-300 font-mono text-xs leading-relaxed whitespace-pre overflow-x-auto select-all max-h-[280px] border-b border-gray-800">
                {tab.code}
              </div>
              {tab.description && (
                <div className="p-5 text-sm text-gray-500 font-medium leading-relaxed bg-slate-50 border-t border-gray-100 flex items-start gap-2.5">
                  <span className="text-blue-600 font-bold">接入指南:</span>
                  <p className="flex-1">{tab.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailSignalWave({ section }: { section: PageSection }) {
  const sw = section.signalWave;
  if (!sw) return null;
  return (
    <div className="py-24 bg-slate-900 text-white border-b border-gray-950 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-450 bg-clip-text text-transparent">{sw.title}</h2>
          {sw.subtitle && (
            <p className="text-sm md:text-base text-slate-455 leading-relaxed font-light">{sw.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-8">
          <div className="p-6 border border-slate-800 rounded-2xl bg-slate-950/40 space-y-3 relative select-none">
            <span className="text-xs font-black text-slate-500 block uppercase tracking-widest">{sw.leftLabel}</span>
            <div className="text-2xl md:text-3xl font-black text-slate-400">{sw.leftValue}</div>
            <div className="w-full h-8 flex items-center justify-between gap-1 opacity-25">
              {[...Array(20)].map((_, i) => (
                <span
                  key={i}
                  className="w-1 bg-slate-400 rounded-full"
                  style={{ height: `${Math.sin(i) * 15 + 20}px` }}
                />
              ))}
            </div>
          </div>

          <div className="p-6 border border-blue-900/60 rounded-2xl bg-blue-950/15 space-y-3 relative select-none shadow-2xl">
            <span className="text-xs font-black text-blue-400 block uppercase tracking-widest">{sw.rightLabel}</span>
            <div className="text-2xl md:text-3xl font-black text-blue-500">{sw.rightValue}</div>
            {/* Pulsing signal waveform */}
            <div className="w-full h-8 flex items-center justify-between gap-1 opacity-80">
              {[...Array(20)].map((_, i) => (
                <span
                  key={i}
                  className="w-1 bg-blue-500 rounded-full animate-pulse"
                  style={{
                    height: `${Math.sin(i * 2) * 5 + 8}px`,
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm md:text-base text-slate-350 max-w-2xl mx-auto font-medium leading-relaxed italic border-t border-slate-800/60 pt-6">
          “ {sw.description} ”
        </p>
      </div>
    </div>
  );
}

function DetailBentoGrid({ section }: { section: PageSection }) {
  const bg = section.bentoGrid;
  if (!bg || !bg.items || bg.items.length === 0) return null;
  return (
    <div className="py-24 bg-slate-50/50 border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{bg.title}</h2>
          {bg.subtitle && (
            <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">{bg.subtitle}</p>
          )}
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          {bg.items.map((item, idx) => {
            const isLarge = item.size === 'large';
            const isTall = item.size === 'tall';
            return (
              <div
                key={idx}
                className={`p-8 rounded-3xl border border-gray-150/70 shadow-sm flex flex-col justify-between overflow-hidden relative min-h-[160px] md:min-h-[200px] hover:shadow-lg transition-all duration-300 ${
                  item.colorBg || 'bg-white text-slate-850'
                } ${
                  isLarge ? 'md:col-span-2' : isTall ? 'md:row-span-2' : 'col-span-1'
                }`}
              >
                <div className="space-y-2 z-10">
                  <h4 className="text-lg md:text-xl font-black leading-snug">{item.title}</h4>
                  {item.subtitle && <p className="text-xs opacity-80 leading-relaxed font-medium">{item.subtitle}</p>}
                </div>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute right-4 bottom-4 opacity-15 w-24 md:w-32 object-contain pointer-events-none hover:scale-105 transition-transform duration-500"
                  />
                )}
                <span className="text-[10px] opacity-40 font-bold uppercase tracking-widest mt-8 block">
                  特性 0{idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
