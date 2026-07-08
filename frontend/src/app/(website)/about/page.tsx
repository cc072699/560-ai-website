import { getAboutData } from '@/lib/data';
import { Target, Eye, ShieldCheck, Milestone } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 30;

export default async function AboutPage() {
  const about = await getAboutData();

  const timelineMilestones = [
    {
      year: '2024.03',
      title: '公司创立与算法孵化',
      description: '五六零人工智能科技在广西北海成立，由多位资深 AI 算法科学家及工业软件专家联合创办，核心团队组建完毕。',
    },
    {
      year: '2024.11',
      title: '首代智能决策系统上线',
      description: '发布第一代“企业智能数据决策系统”，并在大型制造集团与现代物流园区成功试点，验证了商业落地可行性。',
    },
    {
      year: '2025.06',
      title: '产品矩阵扩张与产业深耕',
      description: '“非结构化文档知识管理平台”与“工业机器视觉质检系统”双管齐下，全面切入智能制造、智慧政务及智慧农业等核心场景。',
    },
    {
      year: '2026.01',
      title: '大模型应用全面商用化',
      description: 'AI 多模态大模型预测舱、公文与合同审查助手全面升级并实现标准化部署，为百余家大中型企业数字化转型保驾护航。',
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FDFDFD] relative overflow-hidden pt-28 pb-20">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.25] pointer-events-none z-0" />
      <div className="absolute top-[10%] left-[5%] w-[800px] h-[500px] bg-blue-50/70 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[50%] right-[10%] w-[700px] h-[600px] bg-sky-50/60 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            关于我们
          </h1>
          <p className="text-lg text-gray-500 font-normal leading-relaxed">
            {about.tagline}
          </p>
        </div>

        {/* Corporate Profile Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center text-left mb-24">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden aspect-[4/3] border border-gray-200/80 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={about.imageUrl}
              alt={about.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
              {about.title}
            </h2>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-6 font-normal indent-[2em]">
              {about.description}
            </p>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed font-normal indent-[2em]">
              作为一个全栈算法与系统提供商，五六零科技坚持技术自研，致力于通过工程化、标准化的交付，让大模型及机器视觉能力真正赋能实体经济。
            </p>
          </div>
        </div>

        {/* Core Values grid */}
        <div className="mb-24">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight text-center mb-12">
            核心价值观与愿景
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-gray-150 p-8 shadow-sm text-left flex flex-col items-start">
              <div className="text-blue-600 mb-5 bg-blue-50 p-3 rounded-xl border border-blue-100">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">企业使命</h4>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">
                用人工智能技术，驱动实体产业的数字化与智能化转型，协助企业与组织实现效率飞跃。
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-150 p-8 shadow-sm text-left flex flex-col items-start">
              <div className="text-blue-600 mb-5 bg-blue-50 p-3 rounded-xl border border-blue-100">
                <Eye className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">企业愿景</h4>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">
                成为大中型企业最信赖的私有化、工程化算法与智能系统服务伙伴，建立可持续发展的产业生态。
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-150 p-8 shadow-sm text-left flex flex-col items-start">
              <div className="text-blue-600 mb-5 bg-blue-50 p-3 rounded-xl border border-blue-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">核心价值观</h4>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">
                安全为先、求实敬业、客户至上、持续创新。坚持以稳定、可靠的工程化产品为第一交付标准。
              </p>
            </div>
          </div>
        </div>

        {/* Timeline milestones */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2.5 mb-10 justify-center">
            <Milestone className="w-6 h-6 text-blue-600 animate-pulse" />
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              发展历程与大事记
            </h3>
          </div>

          <div className="relative border-l border-gray-200 ml-4 md:ml-32 space-y-12">
            {timelineMilestones.map((ms, index) => (
              <div key={index} className="relative pl-8 md:pl-10">
                {/* Year Badge */}
                <div className="absolute top-0.5 -left-[9px] w-4.5 h-4.5 rounded-full border-4 border-blue-600 bg-white shadow-sm" />
                
                {/* Left side year indicator (only on desktop) */}
                <div className="hidden md:block absolute top-0 -left-36 w-28 text-right font-extrabold text-lg text-blue-600 leading-none">
                  {ms.year}
                </div>

                {/* Content card */}
                <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm hover:border-blue-200 transition-all duration-300">
                  <span className="block md:hidden font-extrabold text-sm text-blue-600 mb-1.5 leading-none">
                    {ms.year}
                  </span>
                  <h4 className="text-base font-bold text-gray-900 mb-2">
                    {ms.title}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-normal">
                    {ms.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 border-t border-gray-150 pt-12 text-center">
          <p className="text-gray-400 text-sm mb-6">了解更多或获取产品试用演示？</p>
          <Link
            href="/#contact"
            className="inline-flex items-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/10 hover:scale-[1.01]"
          >
            与我们的技术专家联系 →
          </Link>
        </div>
      </div>
    </div>
  );
}
