'use client';

import { useState } from 'react';
import {
  Check,
  Flame,
  MessageSquare,
  Building2,
  Sprout,
  Landmark,
  Globe,
  Cpu,
  Zap,
  ShieldAlert,
  Car,
  Workflow,
  TrendingUp,
  Coins,
  ShieldCheck,
  HeartHandshake,
  Database,
  ArrowRight,
  Clock,
  Layers,
  Award,
  MapPin,
  Bot,
  Home
} from 'lucide-react';
import Link from 'next/link';
import type { Case } from '@/types';
import DetailSectionsRenderer from '@/components/DetailSectionsRenderer';


interface CasesClientProps {
  initialCases: Case[];
}

export default function CasesClient({ initialCases }: CasesClientProps) {
  const [activeTab, setActiveTab] = useState<string>('5'); // Default to Smart Property (id: "5")
  const [activeSceneTab, setActiveSceneTab] = useState<string>('meter'); // Scene sub-tab for Smart Property

  // Find the selected case
  const activeCase = initialCases.find(c => c.id === activeTab) || initialCases[0];

  // Icons helper for main categories
  const getCategoryIcon = (industry: string) => {
    switch (industry) {
      case '智慧物业':
        return <Building2 className="w-5 h-5" />;
      case '智慧农业':
        return <Sprout className="w-5 h-5" />;
      case '智慧政务':
        return <Landmark className="w-5 h-5" />;
      case '跨境电商':
        return <Globe className="w-5 h-5" />;
      case '智能制造':
        return <Cpu className="w-5 h-5" />;
      case '智慧文旅':
        return <MapPin className="w-5 h-5" />;
      case '数字展厅':
        return <Bot className="w-5 h-5" />;
      case '智慧民宿':
        return <Home className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  // Color theme helper for tabs and accents
  const getThemeColor = (industry: string) => {
    switch (industry) {
      case '智慧物业':
        return {
          primary: 'text-indigo-600',
          bg: 'bg-indigo-50 border-indigo-100',
          gradient: 'from-indigo-600 to-blue-600',
          glow: 'bg-indigo-400/10',
          badge: 'text-indigo-600 bg-indigo-50 border-indigo-100'
        };
      case '智慧农业':
        return {
          primary: 'text-emerald-600',
          bg: 'bg-emerald-50 border-emerald-100',
          gradient: 'from-emerald-600 to-teal-600',
          glow: 'bg-emerald-400/10',
          badge: 'text-emerald-600 bg-emerald-50 border-emerald-100'
        };
      case '智慧政务':
        return {
          primary: 'text-blue-600',
          bg: 'bg-blue-50 border-blue-100',
          gradient: 'from-blue-600 to-sky-600',
          glow: 'bg-blue-400/10',
          badge: 'text-blue-600 bg-blue-50 border-blue-100'
        };
      case '跨境电商':
        return {
          primary: 'text-amber-600',
          bg: 'bg-amber-50 border-amber-100',
          gradient: 'from-amber-600 to-orange-600',
          glow: 'bg-amber-400/10',
          badge: 'text-amber-600 bg-amber-50 border-amber-100'
        };
      case '智能制造':
        return {
          primary: 'text-cyan-600',
          bg: 'bg-cyan-50 border-cyan-100',
          gradient: 'from-cyan-600 to-blue-600',
          glow: 'bg-cyan-400/10',
          badge: 'text-cyan-600 bg-cyan-50 border-cyan-100'
        };
      case '智慧文旅':
        return {
          primary: 'text-teal-600',
          bg: 'bg-teal-50 border-teal-100',
          gradient: 'from-teal-600 to-emerald-600',
          glow: 'bg-teal-400/10',
          badge: 'text-teal-600 bg-teal-50 border-teal-100'
        };
      case '数字展厅':
        return { primary: 'text-violet-600', bg: 'bg-violet-50 border-violet-100', gradient: 'from-violet-600 to-purple-600', glow: 'bg-violet-400/10', badge: 'text-violet-600 bg-violet-50 border-violet-100' };
      case '智慧民宿':
        return { primary: 'text-orange-600', bg: 'bg-orange-50 border-orange-100', gradient: 'from-orange-600 to-amber-600', glow: 'bg-orange-400/10', badge: 'text-orange-600 bg-orange-50 border-orange-100' };
      default:
        return {
          primary: 'text-blue-600',
          bg: 'bg-blue-50 border-blue-100',
          gradient: 'from-blue-600 to-indigo-600',
          glow: 'bg-blue-400/10',
          badge: 'text-blue-600 bg-blue-50 border-blue-100'
        };
    }
  };

  const currentTheme = getThemeColor(activeCase.industry);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FAFAFC] relative overflow-hidden pt-28 pb-20">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.2] pointer-events-none z-0" />
      <div className="absolute top-[5%] left-[5%] w-[800px] h-[500px] bg-blue-50/50 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[50%] right-[2%] w-[800px] h-[600px] bg-indigo-50/40 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 uppercase tracking-widest mb-4 inline-block">
            标杆数字化转型实践
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            客户案例中心
          </h1>
          <p className="text-base md:text-lg text-gray-500 font-normal leading-relaxed">
            深入真实行业痛点，见证数字化升级成果。我们携手各行各业的先锋企业与组织，以大模型和机器视觉算法，沉淀为高产出的标杆案例。
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-1.5 bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200/80 shadow-sm">
            {initialCases.map((c) => {
              const isActive = activeTab === c.id;
              const theme = getThemeColor(c.industry);
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveTab(c.id);
                    setActiveSceneTab('meter'); // Reset subscene to meter
                  }}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-300 ${
                    isActive
                      ? `bg-white border-gray-200 shadow-md ${theme.primary} font-bold scale-[1.02]`
                      : 'bg-transparent border-transparent hover:bg-white/40 text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-2 rounded-lg mb-1.5 transition-colors ${
                    isActive ? theme.bg : 'bg-gray-100 text-gray-400 group-hover:text-gray-600'
                  }`}>
                    {getCategoryIcon(c.industry)}
                  </div>
                  <span className="text-xs font-bold block leading-none">{c.industry}</span>
                  <span className="text-[10px] text-gray-400 font-normal mt-1 max-w-[120px] truncate hidden sm:block">
                    {c.client}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Showcase Panel */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/60 p-6 md:p-12 lg:p-16 shadow-lg hover:shadow-xl transition-all duration-300">
          {activeCase.detailSections && activeCase.detailSections.length > 0 ? (
            <DetailSectionsRenderer 
              sections={activeCase.detailSections} 
              productId={`case-${activeCase.id}`} 
              productName={activeCase.title} 
            />
          ) : (
            <>
              {/* Default Cases Layout (Agricultural, Government, E-Commerce, Manufacturing) */}
              {activeTab !== '5' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center text-left">
              {/* Left Column: Info and Metrics */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <span className={`px-3.5 py-1 rounded-full text-xs font-bold border ${currentTheme.badge}`}>
                    {activeCase.industry}
                  </span>
                  <span className="text-sm font-bold text-gray-400">
                    客户：{activeCase.client}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                  {activeCase.title}
                </h2>

                {/* Big Stat Banner */}
                <div className={`flex items-center gap-5 p-5 rounded-2xl border ${currentTheme.bg} relative overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-24 h-24 ${currentTheme.glow} rounded-full blur-xl`} />
                  <span className={`text-4xl md:text-5xl font-black ${currentTheme.primary} tracking-tight shrink-0`}>
                    {activeCase.stat}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700 leading-tight">
                      {activeCase.statLabel}
                    </span>
                    <span className="text-xs text-gray-400 font-medium mt-1">
                      核心效益提升指标
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">
                    方案概述
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed font-normal indent-[2em]">
                    {activeCase.description}
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                    交付核心成果
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {activeCase.deliverables.map((deliv, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <Check className={`w-4 h-4 ${currentTheme.primary} shrink-0 mt-0.5`} />
                        <span className="text-xs text-gray-700 font-medium leading-relaxed">{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Case Image */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden aspect-video lg:aspect-square border border-gray-200 shadow-md relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeCase.imageUrl}
                    alt={activeCase.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* Deep Content Layout: AI Smart Property Case Study */}
          {activeTab === '5' && (
            <div className="space-y-12 text-left">
              {/* Header and Background Info */}
              <div className="flex flex-col lg:flex-row gap-8 items-start border-b border-gray-100 pb-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3.5 py-1 rounded-full text-xs font-bold border ${currentTheme.badge}`}>
                      {activeCase.industry}
                    </span>
                    <span className="text-sm font-bold text-gray-400">
                      客户：{activeCase.client}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                    {activeCase.title}
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed font-normal indent-[2em]">
                    北海市高新技术开发区是北海市重点产业园区，入驻企业百余家，涵盖科技研发、智能制造、海洋经济等多个领域。园区总建筑面积超50万平方米，涉及办公楼宇、标准厂房、地下停车场等多种物业类型。作为北海市产业集聚的核心载体，园区物业管理长期面临效率低、成本高、响应慢的挑战。560-AI深入调研痛点后，为其量身打造了基于AI技术的智慧物业管理体系。
                  </p>
                </div>
                
                {/* Image Section */}
                <div className="w-full lg:w-96 shrink-0 rounded-2xl overflow-hidden aspect-video border border-gray-200 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeCase.imageUrl}
                    alt={activeCase.imageAlt}
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Core Challenges (三大痛点) */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 text-center">
                  园区物业管理三大核心痛点
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pain point 1 */}
                  <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-100/60 relative overflow-hidden flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-600 font-black text-sm">
                          01
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm">电表管理低效</h4>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-normal">
                        企业租户众多且电表分散，物业每月抄表、核算分摊费时耗力。抄表滞后及人为计算错误容易引发租户纠纷，且电费回收周期长达 15-30 天，占用大量流动资金。
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-rose-100/40 text-[10px] text-rose-600 font-bold">
                      回收周期：15-30天
                    </div>
                  </div>

                  {/* Pain point 2 */}
                  <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-100/60 relative overflow-hidden flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-600 font-black text-sm">
                          02
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm">安防监控被动</h4>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-normal">
                        依赖保安人工值守数十个监控屏，易因疲劳导致漏报。可疑人员入侵、通道占用、电动车上楼等异常通常在事后翻查录像才确认，安防响应存在数小时至数天的空白。
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-rose-100/40 text-[10px] text-rose-600 font-bold">
                      预警响应滞后：存在监管空白期
                    </div>
                  </div>

                  {/* Pain point 3 */}
                  <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-100/60 relative overflow-hidden flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-600 font-black text-sm">
                          03
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm">停车管理混乱</h4>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-normal">
                        “一车位多车牌”违规占用车位频发，外来车辆侵占内部员工车位；访客入场后盲目巡游寻找空车位，车牌识别系统功能单一无法引导，停车纠纷多，月均投诉达 15 起以上。
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-rose-100/40 text-[10px] text-rose-600 font-bold">
                      服务纠纷多：月均投诉 15起+
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Scenarios Console */}
              <div className="space-y-6 bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200/50">
                <div className="text-center max-w-xl mx-auto mb-6">
                  <h3 className="text-lg font-black text-slate-900">
                    560-AI "3+1" 智慧物业体系核心场景
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    在不更换原有监控与设备的前提下，通过叠加AI分析层与IoT设备实现“利旧升级”
                  </p>
                </div>

                {/* Sub-tab Bar */}
                <div className="flex justify-center border-b border-slate-200 mb-6">
                  <div className="flex gap-2 -mb-px">
                    <button
                      onClick={() => setActiveSceneTab('meter')}
                      className={`flex items-center gap-2 pb-3 px-4 text-xs md:text-sm font-bold border-b-2 transition-all ${
                        activeSceneTab === 'meter'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>电表智能管理</span>
                    </button>
                    <button
                      onClick={() => setActiveSceneTab('security')}
                      className={`flex items-center gap-2 pb-3 px-4 text-xs md:text-sm font-bold border-b-2 transition-all ${
                        activeSceneTab === 'security'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>AI安防行为识别</span>
                    </button>
                    <button
                      onClick={() => setActiveSceneTab('parking')}
                      className={`flex items-center gap-2 pb-3 px-4 text-xs md:text-sm font-bold border-b-2 transition-all ${
                        activeSceneTab === 'parking'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Car className="w-4 h-4" />
                      <span>智慧停车管理</span>
                    </button>
                  </div>
                </div>

                {/* Sub-tab Content Panels */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all duration-300">
                  {activeSceneTab === 'meter' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-8 space-y-5 text-left">
                        <div>
                          <span className="text-[10px] font-bold text-rose-500 uppercase bg-rose-50 px-2.5 py-1 rounded border border-rose-100">痛点回顾</span>
                          <p className="text-xs text-slate-600 mt-2">
                            人工抄表分摊费时耗力、分摊计算易出错。电费回收周期长达 15-30 天，物业垫资和资金周转压力大，且频遭租户对核算误差的质疑。
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">AI解决方案</span>
                          <ul className="mt-3.5 space-y-2 text-xs text-slate-700">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>自动数据采集</strong>：对接智能电表系统与电网API，消除人工抄录，全自动秒级读取并同步数据。</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>“资金池”自动充值机制</strong>：企业在线预存电费至专用资金池，AI智能体实时监控余额，低于安全阈值自动触发充值，实现“电费不停机”。</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>自动核算与缴费单下发</strong>：AI基于面积、用量、时段等多维度核算，一键生成明细并推送给租户。</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>用电异常监测</strong>：AI趋势引擎自动检测设备漏电或线路老化故障，主动推送预警规避火灾。</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="lg:col-span-4 bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center space-y-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">实施效益</span>
                        <div className="space-y-4">
                          <div className="text-center">
                            <span className="text-3xl font-black text-indigo-600">90%</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">电费抄收效率提升</span>
                          </div>
                          <div className="border-t border-slate-200/60 my-2" />
                          <div className="text-center">
                            <span className="text-lg font-black text-gray-800">40工时 → 4工时</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">物业每月人工投入降低</span>
                          </div>
                          <div className="border-t border-slate-200/60 my-2" />
                          <div className="text-center">
                            <span className="text-3xl font-black text-emerald-600">95%</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">用电故障与异常识别率</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSceneTab === 'security' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-8 space-y-5 text-left">
                        <div>
                          <span className="text-[10px] font-bold text-rose-500 uppercase bg-rose-50 px-2.5 py-1 rounded border border-rose-100">痛点回顾</span>
                          <p className="text-xs text-slate-600 mt-2">
                            园区占地广、监控画面杂多，人工值守极易因疲劳导致漏报。可疑入侵、违停等安全事件发现滞后，且消控室离岗、睡岗行为难以监管。
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">AI解决方案</span>
                          <ul className="mt-3.5 space-y-2 text-xs text-slate-700">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>多类行为实时识别</strong>：直接接入监控 RTSP 视频流，利用 <strong>YOLOv8 + ST-GCN</strong> 姿态识别与目标检测算法，实时精准识别入侵、消防堵塞、电动车进梯、翻墙等 8 类事件。</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>消控室岗态识别</strong>：专用边缘摄像头实时进行姿态分析，秒级识别人离岗、打瞌睡、玩手机，并触发震动语音提醒。</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>AI 24小时无人化巡检</strong>：AI 代替人工循环轮巡，异常事件秒级推送至保安手机与消控大屏，由定期巡逻转为精准定向警务响应。</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="lg:col-span-4 bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center space-y-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">实施效益</span>
                        <div className="space-y-4">
                          <div className="text-center">
                            <span className="text-3xl font-black text-indigo-600">95%+</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">安全事件实时抓拍率</span>
                          </div>
                          <div className="border-t border-slate-200/60 my-2" />
                          <div className="text-center">
                            <span className="text-3xl font-black text-indigo-600">60%</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">保安日常巡检人力节省</span>
                          </div>
                          <div className="border-t border-slate-200/60 my-2" />
                          <div className="text-center">
                            <span className="text-3xl font-black text-emerald-600">80%</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">消控室值守违规违纪下降</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSceneTab === 'parking' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-8 space-y-5 text-left">
                        <div>
                          <span className="text-[10px] font-bold text-rose-500 uppercase bg-rose-50 px-2.5 py-1 rounded border border-rose-100">痛点回顾</span>
                          <p className="text-xs text-slate-600 mt-2">
                            一车位多车牌绑定抢占车位，外来车霸占内部专属车位。访客无序转圈、找位折腾。老旧道闸仅车牌录入，无精细分类，纠纷频发，月均投诉高居不下。
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">AI解决方案</span>
                          <ul className="mt-3.5 space-y-2 text-xs text-slate-700">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>一车位一车牌限制</strong>：系统锁定“一位一车”，自动识别同一车位第二台绑定车并按临停收费，后台大数据捕捉高频违规车辆。</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>员工专区智能防侵占</strong>：联动道闸与白名单识别。外来车擅入会有红灯警告及AI实时上报。</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>AI 动态车位引导指示</strong>：IoT指示灯绿色（空闲）、黄色（紧张）、红色（占满）三色联动，关键通道和道闸屏幕实时播报找车位指令。</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="lg:col-span-4 bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center space-y-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">实施效益</span>
                        <div className="space-y-4">
                          <div className="text-center">
                            <span className="text-3xl font-black text-indigo-600">35%</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">车位资源利用率提升</span>
                          </div>
                          <div className="border-t border-slate-200/60 my-2" />
                          <div className="text-center">
                            <span className="text-lg font-black text-gray-800">8分钟 → 2分钟</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">访客寻找车位平均用时</span>
                          </div>
                          <div className="border-t border-slate-200/60 my-2" />
                          <div className="text-center">
                            <span className="text-3xl font-black text-emerald-600">&lt; 1起/月</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">停车投诉事件（原15起+）</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Highlights (技术架构亮点) */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 text-center">
                  技术架构亮点
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start text-left space-y-3">
                    <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <Workflow className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900">边缘计算 + 云端协同</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-normal">
                      视频分析处理在边缘计算盒本地极速完成，保障毫秒级低时延与隐私安全；统计数据汇聚至云端处理，保障强扩展性。
                    </p>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start text-left space-y-3">
                    <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900">AI 智能体大脑</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-normal">
                      资金充值、报表核算、异常告警流转等核心流程由 560-AI 自研智能体自主联动决策，达成“感知-决策-执行”的无缝闭环。
                    </p>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start text-left space-y-3">
                    <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900">“利旧升级”策略</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-normal">
                      直接适配复用园区现有的摄像头、道闸与传统电表，仅叠加轻量级 AI 分析算法软件，最大化保障既有投资。
                    </p>
                  </div>
                  {/* Card 4 */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start text-left space-y-3">
                    <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <Database className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900">统一数据大脑</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-normal">
                      打通安防、车位、电表孤立数据池，开展跨场景的深度交叉分析，彻底消除数据孤岛，助力高效精细运营。
                    </p>
                  </div>
                </div>
              </div>

              {/* Client Value Summary (客户价值) */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 text-center">
                  客户商业价值总结
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Value 1 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left flex flex-col justify-between shadow-sm">
                    <div className="space-y-2">
                      <TrendingUp className="w-6 h-6 text-indigo-600" />
                      <h4 className="font-bold text-xs text-gray-900">管理效率飞跃</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-normal">
                        物业综合管理运营效率提升 80%+，人工投入成本缩减 50% 以上，实现管理模式的根本转变。
                      </p>
                    </div>
                    <span className="text-xs font-black text-indigo-600 mt-4 block">效率提升 80%+</span>
                  </div>

                  {/* Value 2 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left flex flex-col justify-between shadow-sm">
                    <div className="space-y-2">
                      <Coins className="w-6 h-6 text-indigo-600" />
                      <h4 className="font-bold text-xs text-gray-900">资金效益显著</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-normal">
                        自动结算回收，每年减少流动资金占用超百万元，池化预存机制彻底清空了电费坏账隐患。
                      </p>
                    </div>
                    <span className="text-xs font-black text-indigo-600 mt-4 block">释放资金 100万+</span>
                  </div>

                  {/* Value 3 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left flex flex-col justify-between shadow-sm">
                    <div className="space-y-2">
                      <ShieldCheck className="w-6 h-6 text-indigo-600" />
                      <h4 className="font-bold text-xs text-gray-900">安全保障升级</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-normal">
                        24小时AI自动闭环巡查，填补人工巡视空白期，异常事件实时发现防患于未然。
                      </p>
                    </div>
                    <span className="text-xs font-black text-indigo-600 mt-4 block">实时发现率 95%+</span>
                  </div>

                  {/* Value 4 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left flex flex-col justify-between shadow-sm">
                    <div className="space-y-2">
                      <HeartHandshake className="w-6 h-6 text-indigo-600" />
                      <h4 className="font-bold text-xs text-gray-900">服务体验优化</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-normal">
                        租户实现缴费查询一网通办，访客找车位更舒心，推动物业综合满意度大涨 40 个百分点。
                      </p>
                    </div>
                    <span className="text-xs font-black text-indigo-600 mt-4 block">满意度提升 40%</span>
                  </div>

                  {/* Value 5 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left flex flex-col justify-between shadow-sm">
                    <div className="space-y-2">
                      <Database className="w-6 h-6 text-indigo-600" />
                      <h4 className="font-bold text-xs text-gray-900">数据资产沉淀</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-normal">
                        全面积累园区物联运营全维度大数据，形成“数据-洞察-优化”的良性驱动体系。
                      </p>
                    </div>
                    <span className="text-xs font-black text-indigo-600 mt-4 block">智慧园区基石</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Deep Content Layout: Guangxi Yiku Industrial Case Study */}
          {activeTab === '6' && (
            <div className="space-y-12 text-left">
              {/* Header and Background Info */}
              <div className="flex flex-col lg:flex-row gap-8 items-start border-b border-gray-100 pb-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3.5 py-1 rounded-full text-xs font-bold border ${currentTheme.badge}`}>
                      {activeCase.industry}
                    </span>
                    <span className="text-sm font-bold text-gray-400">
                      客户：{activeCase.client}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                    {activeCase.title}
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed font-normal indent-[2em]">
                    广西亿库光养硅藻环保科技有限公司是一家专注于海洋硅藻功能性板材研发与生产的高新技术企业，核心产品涵盖功能性硅藻板材、地板、复合过滤新材料等。配套自主研发的硅藻板全套加工装备，拥有压平设备、覆膜设备等多项自有专利。随着产能不断扩张，传统的目检质检与设备参数经验盲调模式已成为制约产能和良品率的核心瓶颈。560-AI团队为其量身打造了“视觉质检+参数调优”双轮驱动AI解决方案。
                  </p>
                </div>
                
                {/* Image Section */}
                <div className="w-full lg:w-96 shrink-0 rounded-2xl overflow-hidden aspect-video border border-gray-200 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeCase.imageUrl}
                    alt={activeCase.imageAlt}
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Core Challenges (四大痛点) */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 text-center">
                  生产线四大核心挑战
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Pain point 1 */}
                  <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100/60 relative overflow-hidden flex flex-col justify-between shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-600 font-black text-sm">
                          01
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm">质检方式落后</h4>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-normal">
                        依赖人工目视进行色差与条纹质检，覆盖范围有限。人眼容易疲劳，且主观判断标准不一，致使产品出厂漏检率和一致性难以持续得到把控。
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-rose-100/40 text-[10px] text-rose-600 font-bold">
                      人眼极限：容易疲劳漏检
                    </div>
                  </div>

                  {/* Pain point 2 */}
                  <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100/60 relative overflow-hidden flex flex-col justify-between shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-600 font-black text-sm">
                          02
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm">数据非结构化</h4>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-normal">
                        生产数据以纸质本或本地工控机零散存储，无统一的数据系统。历史质量数据无法追溯，操作工的优秀工艺经验难以沉淀和实现传承。
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-rose-100/40 text-[10px] text-rose-600 font-bold">
                      经验资产流失：工艺传承困难
                    </div>
                  </div>

                  {/* Pain point 3 */}
                  <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100/60 relative overflow-hidden flex flex-col justify-between shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-600 font-black text-sm">
                          03
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm">设备参数盲调</h4>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-normal">
                        混料比例、成型压力和冷却速度等关键工序参数调整无可靠数据模型做决策支撑，工艺波动明显，高规格的一等品比率难以持续提升。
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-rose-100/40 text-[10px] text-rose-600 font-bold">
                      经验盲调：良品率较难稳定
                    </div>
                  </div>

                  {/* Pain point 4 */}
                  <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100/60 relative overflow-hidden flex flex-col justify-between shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-600 font-black text-sm">
                          04
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm">IT基础薄弱</h4>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-normal">
                        厂区无服务器，数字化升级预算有限。方案设计必须在极其有限的基础设施下进行轻量化部署，实现低成本且免运维的快速落地。
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-rose-100/40 text-[10px] text-rose-600 font-bold">
                      约束条件：无服务器设施投入
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Scenarios Console */}
              <div className="space-y-6 bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200/50">
                <div className="text-center max-w-xl mx-auto mb-6">
                  <h3 className="text-lg font-black text-slate-900">
                    广西亿库 "双轮驱动" AI 智能化场景
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    工控机本地一体化轻量部署，PLC 与 AI 自动联动推荐调优的最优生产闭环
                  </p>
                </div>

                {/* Sub-tab Bar */}
                <div className="flex justify-center border-b border-slate-200 mb-6">
                  <div className="flex gap-2 -mb-px">
                    <button
                      onClick={() => setActiveSceneTab('yiku_vision')}
                      className={`flex items-center gap-2 pb-3 px-4 text-xs md:text-sm font-bold border-b-2 transition-all ${
                        activeSceneTab === 'yiku_vision'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Cpu className="w-4 h-4" />
                      <span>AI视觉巡检系统</span>
                    </button>
                    <button
                      onClick={() => setActiveSceneTab('yiku_tuning')}
                      className={`flex items-center gap-2 pb-3 px-4 text-xs md:text-sm font-bold border-b-2 transition-all ${
                        activeSceneTab === 'yiku_tuning'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>设备参数智能调优</span>
                    </button>
                  </div>
                </div>

                {/* Sub-tab Content Panels */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all duration-300">
                  {activeSceneTab === 'yiku_vision' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-8 space-y-5 text-left">
                        <div>
                          <span className="text-[10px] font-bold text-rose-500 uppercase bg-rose-50 px-2.5 py-1 rounded border border-rose-100">痛点回顾</span>
                          <p className="text-xs text-slate-600 mt-2">
                            人工质检目测耗时5-8秒，容易出现漏检与主观偏差。同时，质检人工速度难以匹配生产设备不断升级的全负荷运行速度节拍。
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">AI解决方案</span>
                          <ul className="mt-3.5 space-y-2 text-xs text-slate-700">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>自动色差与条纹缺陷检测</strong>：出板口配备高频工业相机与边缘计算设备，实时进行色差与条纹检测，耗时低于 50 毫秒/块。</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>分拣机构联动剔除</strong>：自动按照缺陷标准输出一等品、二等品、不合格品定级。联动三色警示灯，不合格红灯产品自动分选剔除。</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>一品一档质量归档</strong>：将检测图像和定级结果存入轻量数据库，实现每块板材品质的数字化可追溯性。</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="lg:col-span-4 bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center space-y-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">实施成效</span>
                        <div className="space-y-4">
                          <div className="text-center">
                            <span className="text-3xl font-black text-indigo-600">98% / 95%</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">色差 / 条纹缺陷自动检出率</span>
                          </div>
                          <div className="border-t border-slate-200/60 my-2" />
                          <div className="text-center">
                            <span className="text-lg font-black text-gray-800">5-8秒 → &lt;50ms</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">单块硅藻板视觉质检耗时</span>
                          </div>
                          <div className="border-t border-slate-200/60 my-2" />
                          <div className="text-center">
                            <span className="text-3xl font-black text-emerald-600">75%↓</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">质检用工（2人减至0.5人复核）</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSceneTab === 'yiku_tuning' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-8 space-y-5 text-left">
                        <div>
                          <span className="text-[10px] font-bold text-rose-500 uppercase bg-rose-50 px-2.5 py-1 rounded border border-rose-100">痛点回顾</span>
                          <p className="text-xs text-slate-600 mt-2">
                            混料、挤出、冷却各个设备的工艺参数完全基于人工经验摸索盲调，产品批次一致性低，出现缺陷后连续产出次品的返工浪费大。
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">AI解决方案</span>
                          <ul className="mt-3.5 space-y-2 text-xs text-slate-700">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>PLC 工控数据秒级网关</strong>：自动读取挤出温度、进料速度、冷却水压等二十多项设备状态参数。</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>“参数-质量”关联模型</strong>：建立算法模型寻找参数组合和缺陷的内在映射，固化优秀老员工经验为推荐数学模型。</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span><strong>最优工艺参数秒级推荐</strong>：缺陷连发时，算法调取历史一等品生产参数包，推送调机提示以确保新手也能达到最佳水准。</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="lg:col-span-4 bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center space-y-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">实施成效</span>
                        <div className="space-y-4">
                          <div className="text-center">
                            <span className="text-3xl font-black text-indigo-600">12%+</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">产线一等品出板率稳定提升</span>
                          </div>
                          <div className="border-t border-slate-200/60 my-2" />
                          <div className="text-center">
                            <span className="text-3xl font-black text-indigo-600">80%↓</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">参数故障引起的连续次品数降幅</span>
                          </div>
                          <div className="border-t border-slate-200/60 my-2" />
                          <div className="text-center">
                            <span className="text-lg font-black text-emerald-600">数小时 → 秒级</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">操作工进行调优排故寻参时长</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Highlights (技术架构亮点) */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 text-center">
                  技术架构亮点
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start text-left space-y-3">
                    <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <Workflow className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900">边缘智能 + 轻量部署</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-normal">
                      视觉缺陷推理在出板口工控机完成，零专用服务器投入，完美适配数字化资源较薄弱的小型制造工厂。
                    </p>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start text-left space-y-3">
                    <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900">视觉模型极致加速</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-normal">
                      缺陷检测模型经过工业级优化与量化裁剪，推理速度达50毫秒/帧以内，不降速支持超高速出料板节拍。
                    </p>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start text-left space-y-3">
                    <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900">双系统自适应闭环</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-normal">
                      AI视觉识别质量数据秒级回传PLC，工艺调机参数秒级推荐，实现“感知-诊断-寻优-调配”的自迭代。
                    </p>
                  </div>
                  {/* Card 4 */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start text-left space-y-3">
                    <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <Database className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900">工艺资产数据化</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-normal">
                      将难以文字表述的“老技工经验”抽象提取并参数化为 AI 模型推荐权重，确保工艺知识传承无损。
                    </p>
                  </div>
                </div>
              </div>

              {/* Client Value Summary (客户价值) */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 text-center">
                  客户商业价值总结
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Value 1 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left flex flex-col justify-between shadow-sm">
                    <div className="space-y-2">
                      <TrendingUp className="w-6 h-6 text-indigo-600" />
                      <h4 className="font-bold text-xs text-gray-900">质量跨越</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-normal">
                        质检识别率超98%，一等品比率提升 12% 以上，板材色差与缺陷标准全流程数字化，彻底消除定级偏差。
                      </p>
                    </div>
                    <span className="text-xs font-black text-indigo-600 mt-4 block">良品率大幅提高</span>
                  </div>

                  {/* Value 2 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left flex flex-col justify-between shadow-sm">
                    <div className="space-y-2">
                      <Clock className="w-6 h-6 text-indigo-600" />
                      <h4 className="font-bold text-xs text-gray-900">效率跃升</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-normal">
                        质检响应缩至毫秒级，设备调参数寻优决策期由几小时削减至秒级，大幅降低停机摸索时间。
                      </p>
                    </div>
                    <span className="text-xs font-black text-indigo-600 mt-4 block">决策寻参秒级响应</span>
                  </div>

                  {/* Value 3 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left flex flex-col justify-between shadow-sm">
                    <div className="space-y-2">
                      <ShieldCheck className="w-6 h-6 text-indigo-600" />
                      <h4 className="font-bold text-xs text-gray-900">知识固化</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-normal">
                        操机骨干的宝贵排故与参数设定被无缝存储至系统经验库，有效杜绝核心人才流动流失带来的工艺损失。
                      </p>
                    </div>
                    <span className="text-xs font-black text-indigo-600 mt-4 block">经验沉淀固化 100%</span>
                  </div>

                  {/* Value 4 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left flex flex-col justify-between shadow-sm">
                    <div className="space-y-2">
                      <Coins className="w-6 h-6 text-indigo-600" />
                      <h4 className="font-bold text-xs text-gray-900">降本优势</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-normal">
                        产品残次率大减，回料返工比例降幅显著。无需额外昂贵 IT 机房设备资产，实现低成本数智升级。
                      </p>
                    </div>
                    <span className="text-xs font-black text-indigo-600 mt-4 block">零机房服务器投资</span>
                  </div>

                  {/* Value 5 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left flex flex-col justify-between shadow-sm">
                    <div className="space-y-2">
                      <Database className="w-6 h-6 text-indigo-600" />
                      <h4 className="font-bold text-xs text-gray-900">资产沉淀</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-normal">
                        全面积累每一批板材、每一秒的工艺参数与品质追溯数据，为未来厂区全面数字化打下结实的大数据基础。
                      </p>
                    </div>
                    <span className="text-xs font-black text-indigo-600 mt-4 block">工业数据网格基础</span>
                  </div>
                </div>
              </div>
            </div>
          )}

            </>
          )}
        </div>

        {/* Customized solutions section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl shadow-blue-500/10">
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
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 text-blue-600 font-bold rounded-xl transition-all shadow-lg text-sm"
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
