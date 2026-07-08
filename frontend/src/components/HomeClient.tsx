'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { HeroData, AboutData, Product, Case } from '@/types';

interface HomeClientProps {
  hero: HeroData;
  about: AboutData;
  products: Product[];
  cases: Case[];
}

export function HomeClient({ hero, about, products, cases }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState(0);

  // 获取行业唯一列表
  const industries = Array.from(new Set(cases.map((c) => c.industry)));
  const activeCase = cases.filter((c) => c.industry === industries[activeTab])[0];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FDFDFD] relative overflow-hidden">
      {/* Global Background Grid and Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.35] pointer-events-none z-0" />
      <div className="absolute top-[5%] left-[5%] w-[800px] h-[500px] bg-blue-50/70 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[5%] w-[700px] h-[600px] bg-sky-50/60 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[45%] left-[10%] w-[900px] h-[700px] bg-blue-50/40 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[70%] right-[10%] w-[800px] h-[600px] bg-indigo-50/30 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[90%] left-[5%] w-[600px] h-[500px] bg-sky-50/40 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* 1. Hero Section */}
      <section id="about" className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-transparent z-10">
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-gray-900 leading-[1.05] max-w-5xl text-balance"
          >
            {hero.headline} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-primary to-blue-500">
              {hero.headlineHighlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 mb-12 max-w-3xl leading-relaxed font-normal tracking-tight"
          >
            {hero.description}
          </motion.p>
        </div>

        {/* Company Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="container mx-auto max-w-6xl mt-24 pt-20 border-t border-gray-200/60 relative z-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center text-left">
            <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-[4/3] border border-gray-200/80 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={about.imageUrl}
                alt={about.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
                {about.title}
              </h3>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-6 font-normal indent-[2em]">
                {about.description}
              </p>
              <div>
                <Link href={about.ctaHref} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group w-fit">
                  {about.ctaText} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Products Section */}
      <section id="products" className="py-24 md:py-32 bg-transparent relative z-10 border-b border-gray-200/20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-24 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight text-balance">企业级人工智能核心产品矩阵</h2>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed">
              我们自主研发了面向大中型企业的一系列标准化、可配置的智能软件产品，<br className="hidden md:inline" />涵盖决策智能、知识管理、自动化协同及工业机器视觉，提供高安全性的私有化闭环部署。
            </p>
          </div>

          <div className="space-y-32 md:space-y-48">
            {products.filter(p => p.showInHome).map((product) => {
              const isTextLeft = product.layout === 'text-left';
              return (
                <div key={product.id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                  {/* Text column */}
                  <div className={`lg:col-span-5 flex flex-col justify-center ${isTextLeft ? '' : 'order-1 lg:order-2'}`}>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-snug">
                      {product.title}
                    </h3>
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 indent-[2em]">
                      {product.description}
                    </p>
                    <ul className="space-y-3.5 text-xs text-gray-600 mb-8 border-l-2 border-blue-500/30 pl-4">
                      {product.features.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                  {/* Image column */}
                  <div className={`lg:col-span-7 rounded-2xl overflow-hidden aspect-video border border-gray-200/80 shadow-md ${isTextLeft ? '' : 'order-2 lg:order-1'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.imageAlt}
                      className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Cases Section */}
      <section id="cases" className="py-24 md:py-32 relative bg-transparent z-10 border-t border-gray-200/20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight text-balance">深入行业，见证实效</h2>
            </div>
            <p className="text-gray-500 text-base md:text-lg font-normal max-w-md text-pretty">
              五六零科技致力于将前沿大模型与视觉算法沉淀为标准行业方案，已在多个领域联合标杆客户取得突破性效益。
            </p>
          </div>

          {/* Industry Tabs */}
          {industries.length > 0 && (
            <>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 border-b border-gray-200 pb-px mb-12">
                {industries.map((industry, idx) => (
                  <button
                    key={industry}
                    onClick={() => setActiveTab(idx)}
                    className={`text-base font-semibold px-6 py-3 border-b-2 transition-all relative ${
                      activeTab === idx
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>

              <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                  {activeCase && (
                    <motion.div
                      key={activeCase.id}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch"
                    >
                      {/* Image */}
                      <div className="rounded-3xl overflow-hidden aspect-[16/10] lg:aspect-auto border border-gray-200/80 shadow-lg relative min-h-[320px] lg:min-h-[440px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeCase.imageUrl}
                          alt={activeCase.imageAlt}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Details */}
                      <div className="flex flex-col justify-between p-2">
                        <div>
                          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-150">
                            <span className="text-5xl md:text-7xl font-black text-blue-600 tracking-tighter leading-none">
                              {activeCase.stat}
                            </span>
                            <div className="flex flex-col pt-1">
                              <span className="text-base font-semibold text-gray-800 leading-tight">{activeCase.statLabel}</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-blue-600 block mb-2">{activeCase.client}</span>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-4">{activeCase.title}</h3>
                          <p className="text-gray-500 leading-relaxed text-sm md:text-base mb-8 indent-[2em]">
                            {activeCase.description}
                          </p>
                          <div className="space-y-3 mb-8">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">项目核心交付成果</span>
                            {activeCase.deliverables.map((item, dIdx) => (
                              <div key={dIdx} className="flex items-center gap-2.5 text-sm text-gray-700">
                                <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xs shrink-0 font-bold">✓</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
