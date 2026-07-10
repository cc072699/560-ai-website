import { getCases } from '@/lib/data';
import { Check, Flame, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 30;

export default async function CasesPage() {
  const cases = await getCases();

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FDFDFD] relative overflow-hidden pt-28 pb-20">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.25] pointer-events-none z-0" />
      <div className="absolute top-[10%] left-[5%] w-[800px] h-[500px] bg-blue-50/70 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[60%] right-[5%] w-[750px] h-[550px] bg-sky-50/60 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            客户案例
          </h1>
          <p className="text-lg text-gray-500 font-normal leading-relaxed">
            深入真实行业场景，见证数字化升级成果。我们携手各行各业的先锋企业与组织，以大模型和机器视觉算法，沉淀为高产出的标杆案例。
          </p>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 gap-12 lg:gap-16">
          {cases.map((c, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={c.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white/80 backdrop-blur-md rounded-3xl border border-gray-150 p-6 md:p-8 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 items-center text-left"
              >
                {/* Image */}
                <div
                  className={`lg:col-span-6 rounded-2xl overflow-hidden aspect-video border border-gray-200/80 shadow-md ${
                    isEven ? '' : 'lg:order-2'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.imageUrl}
                    alt={c.imageAlt}
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>

                {/* Info Content */}
                <div className={`lg:col-span-6 flex flex-col justify-center ${isEven ? '' : 'lg:order-1'}`}>
                  {/* Category and Client */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 uppercase tracking-wider">
                      {c.industry}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      {c.client}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight">
                    {c.title}
                  </h3>

                  {/* Stat Card */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/40 mb-6 text-left">
                    <span className="text-4xl md:text-5xl font-black text-blue-600 tracking-tighter leading-none">
                      {c.stat}
                    </span>
                    <div className="flex flex-col pt-0.5">
                      <span className="text-xs font-bold text-slate-700 leading-tight">
                        {c.statLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium leading-none mt-1">
                        核心效益指标
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 font-normal indent-[2em]">
                    {c.description}
                  </p>

                  {/* Deliverables checklist */}
                  <div className="border-t border-gray-100 pt-5 space-y-3">
                    <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider mb-1">
                      交付核心成果
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {c.deliverables.map((deliv, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                          <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Customized solutions section */}
        <div className="mt-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl shadow-blue-500/10">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-3 rounded-full border border-white/20">
              <Flame className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl md:text-4xl font-extrabold mb-4 tracking-tight">
            需要为您的行业定制数字化方案？
          </h3>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-8 font-normal">
            我们的顾问与算法科学家团队拥有丰富的跨行业交付经验，能够针对您的具体业务痛点提供定制化模型开发与本地集成服务。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 text-blue-600 font-bold rounded-xl transition-all shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>预约免费方案沟通</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
