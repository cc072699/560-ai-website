import type { Metadata } from 'next';
import { getProductById, getProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import type { PageSection } from '@/types';
import dynamic from 'next/dynamic';

// 按需加载：只有访问产品详情页时才下载此 86KB 的组件
const DetailSectionsRenderer = dynamic(
  () => import('@/components/DetailSectionsRenderer'),
  { ssr: true }
);

import { ProductCTAButtons } from '@/components/ProductCTAButtons';

export const revalidate = 30;

// Enable static pre-rendering for product routes
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return {};
  return {
    title: `${product.title} — 五六零人工智能`,
    description: product.tagline
      ? `${product.tagline} ${product.description?.slice(0, 80) || ''}`
      : product.description?.slice(0, 120) || '',
  };
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
                <ProductCTAButtons productId={product.id} productName={product.title} />
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
          {/* Map and render components */}
          <DetailSectionsRenderer 
            sections={product.detailSections!} 
            productId={product.id} 
            productName={product.title} 
          />
        </div>
      )}
    </div>
  );
}
