'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Bot, 
  Database, 
  Eye, 
  MessageSquare, 
  BrainCircuit, 
  PlayCircle, 
  Fingerprint, 
  Network, 
  ShieldCheck, 
  Activity, 
  LineChart, 
  Terminal, 
  FileText, 
  Lock, 
  Sparkles,
  TrendingUp,
  Server,
  Heart,
  Users,
  Compass,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';


export default function Home() {
  const [activeAccordion, setActiveAccordion] = useState(0);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FDFDFD] relative overflow-hidden">
      {/* Global Background Grid and Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.35] pointer-events-none z-0" />
      
      {/* Dynamic Ambient Glows at different heights */}
      <div className="absolute top-[5%] left-[5%] w-[800px] h-[500px] bg-blue-50/70 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[5%] w-[700px] h-[600px] bg-sky-50/60 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[45%] left-[10%] w-[900px] h-[700px] bg-blue-50/40 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[70%] right-[10%] w-[800px] h-[600px] bg-indigo-50/30 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[90%] left-[5%] w-[600px] h-[500px] bg-sky-50/40 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* 1. Hero Section - Ultra Clean Minimalist */}
      <section id="about" className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-transparent z-10">

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-gray-900 leading-[1.05] max-w-5xl text-balance"
          >
            大模型时代的企业 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-primary to-blue-500">
              新一代智能引擎
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 mb-12 max-w-3xl leading-relaxed font-normal tracking-tight"
          >
            专注于为大中型企业提供私有化部署、高安全性的 AI 大模型系统及机器视觉引擎，<br className="hidden md:inline" />无缝整合现有数据库及流程，成倍释放核心业务效率。
          </motion.p>
          
        </div>

        {/* Seamlessly connected Company Overview at the bottom of Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="container mx-auto max-w-6xl mt-24 pt-20 border-t border-gray-200/60 relative z-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center text-left">
            {/* Left Column: Premium Landmark Corporate Picture (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-[4/3] border border-gray-200/80 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000" 
                alt="560 AI Corporate Headquarter" 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Right Column: Spacious Corporate Intro (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3.5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                五六零人工智能科技（北海）有限公司
              </h3>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-6 font-normal indent-[2em]">
                我们致力于前沿算法在工业制造、协同办公及智慧政务等核心领域的场景化落地，通过安全、稳定、可靠的工程化产品与持续服务，协助企业与组织实现效率升级与价值重塑。
              </p>
              <div>
                <Link href="#contact" className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group w-fit">
                  了解我们的核心价值观 <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. 产品列表 (Product List - Alternating Premium Layout) */}
      <section id="products" className="py-24 md:py-32 bg-transparent relative z-10 border-b border-gray-200/20">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Header */}
          <div className="mb-24 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight text-balance">企业级人工智能核心产品矩阵</h2>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed">
              我们自主研发了面向大中型企业的一系列标准化、可配置的智能软件产品，<br className="hidden md:inline" />涵盖决策智能、知识管理、自动化协同及工业机器视觉，提供高安全性的私有化闭环部署。
            </p>
          </div>
          
          {/* Alternating Blocks */}
          <div className="space-y-32 md:space-y-48">
            
            {/* Block 1: Decision system */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="lg:col-span-5 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3.5xl font-bold text-gray-900 mb-6 leading-snug">
                  企业智能数据分析与决策系统
                </h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 indent-[2em]">
                  面向大型企业提供跨部门的数据整合、指标分析与预测性排程方案，助力管理层进行精准的运营决策及风险把控。支持私有化数据库安全对接。
                </p>
                <ul className="space-y-3.5 text-xs text-gray-600 mb-8 border-l-2 border-blue-500/30 pl-4">
                  <li>多源异构数据高速分析与指标建模</li>
                  <li>高频运营指标自动监控预警与推演</li>
                  <li>全场景私有化部署及数据闭环交付</li>
                </ul>

              </div>
              <div className="lg:col-span-7 rounded-2xl overflow-hidden aspect-video border border-gray-200/80 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" 
                  alt="Decision Center Office" 
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-500" 
                />
              </div>
            </div>

            {/* Block 2: Knowledge Platform */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="lg:col-span-7 rounded-2xl overflow-hidden aspect-video border border-gray-200/80 shadow-md order-2 lg:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200" 
                  alt="Enterprise Data Room" 
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-500" 
                />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center order-1 lg:order-2">
                <h3 className="text-2xl md:text-3.5xl font-bold text-gray-900 mb-6 leading-snug">
                  非结构化知识资产管理平台
                </h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 indent-[2em]">
                  针对企业各类 PDF 手册、Word 合同、CAD 工程图纸等海量文档进行集中式解析，实现毫秒级精准知识定位，打破部门间的信息和文档壁垒。
                </p>
                <ul className="space-y-3.5 text-xs text-gray-600 mb-8 border-l-2 border-blue-500/30 pl-4">
                  <li>海量扫描件与非结构化文档语义关联解析</li>
                  <li>毫秒级精准文档溯源高亮定位与对比</li>
                  <li>细粒度多租户权限控制体系与分级加密</li>
                </ul>

              </div>
            </div>

            {/* Block 3: Process automation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="lg:col-span-5 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3.5xl font-bold text-gray-900 mb-6 leading-snug">
                  业务流程自动化协同系统
                </h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 indent-[2em]">
                  集成智能化流程控制（RPA）与跨系统调度能力，全自动流转跨 Web、ERP、日常办公文档等复杂流程，全天候静默运行，极大节省人力。
                </p>
                <ul className="space-y-3.5 text-xs text-gray-600 mb-8 border-l-2 border-blue-500/30 pl-4">
                  <li>跨应用、跨系统界面数据自动提取与校验</li>
                  <li>直观的工作流节点设计及快速上线调试</li>
                  <li>自动异常通知、降级重试与合规审计日志</li>
                </ul>

              </div>
              <div className="lg:col-span-7 rounded-2xl overflow-hidden aspect-video border border-gray-200/80 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200" 
                  alt="Business Meeting" 
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-500" 
                />
              </div>
            </div>

            {/* Block 4: Industrial vision */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="lg:col-span-7 rounded-2xl overflow-hidden aspect-video border border-gray-200/80 shadow-md order-2 lg:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200" 
                  alt="Industrial Automation Line" 
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-500" 
                />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center order-1 lg:order-2">
                <h3 className="text-2xl md:text-3.5xl font-bold text-gray-900 mb-6 leading-snug">
                  工业机器视觉智能质检系统
                </h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 indent-[2em]">
                  通过工业高清成像设备采集，对精密五金、组装部件进行表面缺陷（划伤、孔洞、错漏）进行毫秒级自动分类筛查，控制产品漏检率。
                </p>
                <ul className="space-y-3.5 text-xs text-gray-600 mb-8 border-l-2 border-blue-500/30 pl-4">
                  <li>流水线零部件缺陷在线毫秒级识别与分类</li>
                  <li>支持相机自动标定与多种物理传感器对接</li>
                  <li>质检看板管理，输出异常检测统计分析周报</li>
                </ul>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. 客户案例 (Customer Cases - Tab Showroom Style) */}
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

          {/* Tab Navigation Menu (Tencent Cloud style tabs) */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2 border-b border-gray-200 pb-px mb-12">
            {[
              { id: 0, name: '智慧农业' },
              { id: 1, name: '智慧政务' },
              { id: 2, name: '跨境电商' },
              { id: 3, name: '智能制造' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAccordion(tab.id)} // Reusing activeAccordion state for tab indexing
                className={`text-base font-semibold px-6 py-3 border-b-2 transition-all relative ${
                  activeAccordion === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-gray-900'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Case Content Showroom (Dynamic layout based on active tab) */}
          <div className="min-h-[500px]">
            {[
              { 
                title: '智慧农业视觉中枢系统', 
                subtitle: '国家级现代农业产业园',
                desc: '通过在园区部署高频边缘计算视觉节点，融合自主研发的农作物表型分析算法，实现针对柑橘、香蕉等作物的病虫害全天候自动定位与巡检。病害平均识别率突破 98%，指导精准施药，使得农药平均喷洒消耗量降低达 30%。',
                img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1200',
                stat: '-30%',
                statLabel: '农药喷洒消耗',
                deliverables: ['病虫害自动抓拍与标记', '精准指导靶向用药', '边缘计算硬件本地部署']
              },
              { 
                title: '政务大厅 3D 数字人导办中枢', 
                subtitle: '某市级智慧政务服务中心',
                desc: '接入专有政务审批大模型知识库，打造具备逼真动作与嘴型对齐的 3D 拟真数字人服务前台。实现自助审批、业务办理指引、高频政策问答等全链条覆盖，成功分担办事大厅 60% 的线下窗口咨询量，平均等待时长缩短 40%。',
                img: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200',
                stat: '60%',
                statLabel: '大厅基础窗口咨询分担率',
                deliverables: ['政策多轮对话问答引擎', '高逼真 3D 拟真数字人模型', '窗口办事指南自动匹配']
              },
              { 
                title: '多语种大模型智能客服平台', 
                subtitle: '头部跨境电商集团',
                desc: '为全球 20+ 个国家与地区的店铺统一配置智能大模型客服引擎。实现针对英语、西语、阿语等多语种复杂语义的秒级精准响应，支持售后纠纷自主协商，推动全球客户整体满意度提升 45%，客服人工成本下降 50%。',
                img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200',
                stat: '+45%',
                statLabel: '客户整体满意度提升',
                deliverables: ['20+ 语种大模型意图理解', '售后纠纷自主协商流转', '全渠道 API 对接导入']
              },
              { 
                title: '工业级视觉瑕疵智能筛查平台', 
                subtitle: '大型智能制造基地',
                desc: '在装配流水线配备高频工业相机与视觉感知质检算法，对高精密零部件表面的微小划痕、凹坑实现毫秒级在线缺陷检测，漏检率控制在 0.01% 以下。实现质检环节 100% 机器替代，助力企业降本提效。',
                img: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=1200',
                stat: '99.99%',
                statLabel: '零配件缺陷检出率',
                deliverables: ['高精密工业相机毫秒级响应', '缺陷像素特征自学习算法', '异常流水线智能停机告警']
              }
            ].map((caseItem, idx) => {
              if (activeAccordion !== idx) return null;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch"
                >
                  {/* Left Column: Visual Case Snapshot */}
                  <div className="rounded-3xl overflow-hidden aspect-[16/10] lg:aspect-auto border border-gray-200/80 shadow-lg relative min-h-[320px] lg:min-h-[440px]">
                    <img 
                      src={caseItem.img} 
                      alt={caseItem.title} 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  </div>

                  {/* Right Column: Key Details & Deliverables */}
                  <div className="flex flex-col justify-between p-2">
                    <div>
                      {/* Big KPI Metric - McKinsey Style */}
                      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-150">
                        <span className="text-5xl md:text-7xl font-black text-blue-600 tracking-tighter leading-none">
                          {caseItem.stat}
                        </span>
                        <div className="flex flex-col pt-1">

                          <span className="text-base font-semibold text-gray-800 leading-tight">{caseItem.statLabel}</span>
                        </div>
                      </div>

                      {/* Title and Subtitle */}
                      <span className="text-xs font-bold text-blue-600 block mb-2">{caseItem.subtitle}</span>
                      <h3 className="text-2xl md:text-3.5xl font-bold text-gray-900 tracking-tight mb-4">{caseItem.title}</h3>
                      <p className="text-gray-500 leading-relaxed text-sm md:text-base mb-8 indent-[2em]">
                        {caseItem.desc}
                      </p>

                      {/* Deliverables Checklist */}
                      <div className="space-y-3 mb-8">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">项目核心交付成果</span>
                        {caseItem.deliverables.map((item, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2.5 text-sm text-gray-700">
                            <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xs shrink-0 font-bold">✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>


                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
