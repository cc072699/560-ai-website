import { getProducts } from '@/lib/data';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export const revalidate = 30;

export default async function ProductsPage() {
  const products = await getProducts();
  
  // Group products by category
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FDFDFD] relative overflow-hidden pt-28 pb-24">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.25] pointer-events-none z-0" />
      <div className="absolute top-[10%] left-[5%] w-[600px] h-[400px] bg-blue-50/70 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[5%] w-[700px] h-[500px] bg-sky-50/60 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            产品中心
          </h1>
          <p className="text-lg text-gray-500 font-normal">
            探索五六零人工智能自主研发的核心软件产品矩阵，为大中型企业提供高安全性、高效率的数字化协同与智能决策方案。
          </p>
        </div>

        {/* Categories Sections */}
        <div className="space-y-24">
          {categories.map((category) => {
            const catProducts = products.filter((p) => p.category === category);
            return (
              <div key={category} className="border-t border-gray-150 pt-16 first:border-0 first:pt-0">
                {/* Category Header */}
                <div className="mb-10 text-left">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                    {category}
                  </h2>
                  <div className="w-12 h-1.5 bg-blue-600 rounded-full" />
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {catProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl border border-gray-150 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col h-full text-left"
                    >
                      {/* Image */}
                      <div className="aspect-[16/10] overflow-hidden relative border-b border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.imageUrl}
                          alt={product.imageAlt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-gray-100 px-3 py-1 rounded-full text-[11px] font-bold text-blue-600">
                          {product.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-xs text-blue-600/95 font-semibold mb-4 leading-normal">
                          {product.tagline}
                        </p>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">
                          {product.description}
                        </p>

                        {/* Features Preview */}
                        <ul className="space-y-2 mb-6 border-t border-gray-100 pt-4">
                          {product.features.slice(0, 2).map((feat, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                              <Check className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA Link */}
                        <Link
                          href={`/products/${product.id}`}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group/link mt-auto w-fit"
                        >
                          了解产品详情 
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
