'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Rocket, GraduationCap, Users, Building2, Cpu, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { HeroData, AboutData, Product, Case, OPCData } from '@/types';

interface HomeClientProps {
  hero: HeroData;
  about: AboutData;
  products: Product[];
  cases: Case[];
  opc: OPCData;
}

/** OPC 4 个小卡片图标映射（固定） */
const opcIcons = [GraduationCap, Building2, Users, Cpu] as const;

function OPCCardIcon({ idx }: { idx: number }) {
  const Icon = opcIcons[idx] || opcIcons[0];
  return <Icon className="w-5 h-5 text-blue-500" />;
}

export function HomeClient({ hero, about, products, cases, opc }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState(0);

  // 获取行业唯一列表（仅含首页展示案例）
  const homeCases = cases.filter((c) => c.showInHome !== false);
  const industries = Array.from(new Set(homeCases.map((c) => c.industry)));
  const activeCase = homeCases.filter((c) => c.industry === industries[activeTab])[0];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FDFDFD] relative overflow-hidden">
      {/* Global Background Grid — single pass, GPU-friendly */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.35] pointer-events-none z-0" />
      {/* Ambient glow: 减少到 2 层避免移动端 GPU 过载 */}
      <div className="absolute top-[5%] left-[5%] w-[600px] h-[500px] bg-blue-50/60 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px] pointer-events-none z-0" />

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

      {/* 1.5 OPC创业孵化服务 Section */}
      <section className="py-20 md:py-28 relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* 标题 + 描述 - 居中 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight text-balance">
              {opc.sectionTitle}
            </h2>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed mt-5 text-pretty">
              {opc.sectionDescription}
            </p>
          </motion.div>

          {/* 主体：12列网格，左右两列等高 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">

            {/* 左侧：7列，1大 + 4小(2x2) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* 孵化平台 - 顶部大卡片，横跨整个左列宽度 */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] border border-gray-100/80"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="text-xl font-extrabold text-blue-600 mb-3">{opc.platformTitle}</h4>
                <p className="text-base text-gray-600 leading-relaxed">{opc.platformDescription}</p>
              </motion.div>

              {/* 2x2 的 4 个小卡片 - 高度按内容自适应 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {opc.cards.map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: 0.06 + idx * 0.04 }}
                    className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] border border-gray-100/80 h-full"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                      <OPCCardIcon idx={idx} />
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-2">{card.title}</h4>
                    <p className="text-base text-gray-600 leading-relaxed">{card.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 右侧：5列，建筑配图 + 蓝色横幅 */}
            <div className="lg:col-span-5 flex flex-col gap-5 justify-center">
              {/* 建筑图 */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100/80 aspect-[4/3]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={opc.imageUrl}
                  alt={opc.imageAlt}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </motion.div>

              {/* 蓝色横幅 */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl px-5 py-4 flex items-center gap-3.5 shadow-md"
              >
                <div className="w-9 h-9 rounded-lg bg-yellow-400/20 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-yellow-300" />
                </div>
                <p className="text-white text-base leading-snug">
                  <span className="font-bold">{opc.bannerHighlight}</span>{opc.bannerText.split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
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
                    <ul className="space-y-4 text-sm text-gray-600 leading-relaxed mb-8 border-l-2 border-blue-500/30 pl-4">
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
                          <span className="text-sm font-semibold text-blue-600 block mb-3">{activeCase.industry}</span>
                          <span className="text-xs text-slate-500 block mb-2">{activeCase.client}</span>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-5">{activeCase.title}</h3>
                          <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-8">
                            {activeCase.description}
                          </p>
                          <Link
                            href={`/cases#case-${activeCase.id}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
                          >
                            查看完整案例
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
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
