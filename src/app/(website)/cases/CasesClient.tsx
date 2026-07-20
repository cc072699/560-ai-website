'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Sprout,
  Landmark,
  Globe,
  Cpu,
  MapPin,
  Bot,
  Home,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Case } from '@/types';
import DetailSectionsRenderer from '@/components/DetailSectionsRenderer';

interface CasesClientProps {
  initialCases: Case[];
}

const getCategoryIcon = (industry: string) => {
  switch (industry) {
    case '智慧物业': return <Building2 className="w-5 h-5" />;
    case '智慧农业': return <Sprout className="w-5 h-5" />;
    case '智慧政务': return <Landmark className="w-5 h-5" />;
    case '跨境电商': return <Globe className="w-5 h-5" />;
    case '智能制造': return <Cpu className="w-5 h-5" />;
    case '智慧文旅': return <MapPin className="w-5 h-5" />;
    case '数字展厅': return <Bot className="w-5 h-5" />;
    case '智慧民宿': return <Home className="w-5 h-5" />;
    default: return <Building2 className="w-5 h-5" />;
  }
};

export default function CasesClient({ initialCases }: CasesClientProps) {
  const [activeTab, setActiveTab] = useState<string>('5');

  const activeCase = initialCases.find(c => c.id === activeTab) || initialCases[0];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FAFAFC]">
      {/* ===== 1. Hero Section ===== */}
      <section className="relative w-full h-[70vh] min-h-[580px] md:h-[78vh] md:min-h-[680px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${activeCase.imageUrl || ""}')`,
            backgroundPosition: 'center 35%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/45 to-transparent z-10" />

        <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-20 max-w-[1440px] text-left w-full pt-16 md:pt-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-6 leading-none"
          >
            {activeCase.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg lg:text-xl text-slate-200/90 max-w-2xl leading-relaxed font-normal mb-10"
          >
            {activeCase.description}
          </motion.p>
        </div>
      </section>

      {/* ===== 2. Tab Navigation ===== */}
      <section className="relative z-10 -mt-px mb-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex flex-wrap border-t border-slate-200">
            {initialCases.map((c) => {
              const isActive = activeTab === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveTab(c.id)}
                  className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 bg-slate-50 text-slate-900'
                      : 'border-transparent bg-white text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                    {getCategoryIcon(c.industry)}
                  </span>
                  <div className="flex flex-col items-start text-left">
                    <span className={`text-sm font-semibold leading-tight ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                      {c.industry}
                    </span>
                    <span className={`text-xs leading-tight ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                      {c.client}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 3. Case Content via DetailSectionsRenderer ===== */}
      <section id="case-content" className="relative z-10 pb-16 md:pb-24">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {activeCase.detailSections && activeCase.detailSections.length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/60 p-5 md:p-8 shadow-sm">
              <DetailSectionsRenderer
                sections={activeCase.detailSections}
                productId={'case-' + activeCase.id}
                productName={activeCase.title}
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200/60 p-8 md:p-10 text-center shadow-sm">
              <p className="text-gray-500 text-base">案例详情正在整理中...</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== 4. Bottom CTA ===== */}
      <section className="bg-slate-900 py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl text-center">
          <h3 className="text-2xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            需要为您的行业定制数字化方案？
          </h3>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            我们的顾问与算法科学家团队拥有丰富的跨行业交付经验，能够针对您的具体业务痛点提供定制化模型开发与本地集成服务。
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>预约免费方案沟通</span>
          </Link>
        </div>
      </section>
    </div>
  );
}