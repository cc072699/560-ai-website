'use client';

import {
  Sparkles,
  Image as ImageIcon,
  Layers,
  Workflow,
  Play,
  Share2,
  BookOpen,
  ArrowRight,
  Eye,
  FileCode,
  Clock,
  HelpCircle,
  Check
} from 'lucide-react';

export default function TemplatesIntroPage() {
  const templates = [
    {
      id: 'hero',
      name: '巨幕模块 (Hero Block)',
      desc: '用于产品详情页首屏的宽幅多媒体巨幕，提供高度吸睛的大图/视频背景与行动召集按钮，传递核心卖点价值。',
      icon: ImageIcon,
      fields: ['主标题 (Title)', '副文本/描述 (Subtitle)', '背景类型 (bgType: 图片/视频)', '背景媒体 URL (bgUrl)'],
      color: 'from-blue-600 to-indigo-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-slate-900 rounded-2xl aspect-[21/9] flex items-center justify-center p-4 relative overflow-hidden shadow-inner select-none">
          <div className="absolute inset-0 bg-blue-500/10 blur-xl pointer-events-none" />
          <div className="relative z-10 text-center text-white space-y-2">
            <div className="text-[14px] font-black tracking-tight">「 主标题 - 非结构化知识资产管理平台 」</div>
            <div className="text-[9px] text-slate-350 max-w-sm mx-auto scale-95 font-medium leading-normal">
              副标题 - 海量企业文档语义解析与毫秒级智能知识定位平台
            </div>
            <div className="pt-2 flex justify-center gap-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-[8px] font-bold rounded-lg shadow">申请试用</span>
              <span className="px-3 py-1 border border-white/20 text-white text-[8px] font-bold rounded-lg">联系专家</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'capabilities',
      name: '核心能力交替模块 (Capabilities Block)',
      desc: '支持图片与文字左右镜像交替排版的能力模块，适合呈现多个平行的核心特性、技术亮点或重要功能指标。',
      icon: Sparkles,
      fields: ['能力项列表 (capabilities)', '单个能力项标题 (title)', '单个能力项描述 (description)', '展示配图 (imageUrl)'],
      color: 'from-emerald-600 to-teal-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-white rounded-2xl p-4 space-y-4 shadow-inner select-none">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-100 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> 核心能力展示区域
          </div>
          <div className="grid grid-cols-2 gap-4 items-center scale-95 origin-center">
            <div className="space-y-1.5 text-left">
              <div className="text-[9px] font-bold text-slate-800">1. 跨源海量文档深度解析</div>
              <div className="text-[8px] text-slate-400 font-medium leading-relaxed">系统兼容PDF手册与 Word 合同，提取隐藏的图表数据，实现结构化语义整合。</div>
            </div>
            <div className="aspect-video bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-300">
              <ImageIcon className="w-4 h-4 opacity-50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 items-center scale-95 origin-center pt-1">
            <div className="aspect-video bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-300 order-2">
              <ImageIcon className="w-4 h-4 opacity-50" />
            </div>
            <div className="space-y-1.5 text-left order-1">
              <div className="text-[9px] font-bold text-slate-800">2. 精准高亮溯源与对比</div>
              <div className="text-[8px] text-slate-400 font-medium leading-relaxed">点击检索结果即可毫秒级跳转到源文档对应的页码与高亮位置，清晰比对版本。</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'scenarios',
      name: '应用场景网格模块 (Scenarios Block)',
      desc: '支持多列响应式卡片网格排列（如3列或2列卡片网格），非常适合多行业方案推荐、具体应用场景或者用户案例平铺。',
      icon: Layers,
      fields: ['大标题 (title)', '场景项列表 (items)', '卡片标题 (item.title)', '卡片配图 (item.imageUrl)', '卡片简介 (item.description)'],
      color: 'from-amber-600 to-orange-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl p-4 space-y-4 shadow-inner select-none">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-100 flex items-center justify-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-500" /> 多维度落地应用场景
          </div>
          <div className="grid grid-cols-3 gap-2.5 scale-95 origin-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="aspect-[16/10] bg-slate-100 flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-3.5 h-3.5 opacity-55" />
                </div>
                <div className="p-2 text-left space-y-0.5">
                  <div className="text-[8px] font-bold text-slate-800">场景 {i}</div>
                  <div className="text-[7px] text-slate-450 leading-tight">简介描述信息描述</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'timeline',
      name: '服务实施流程 (Timeline Block)',
      desc: '横向连接的进度轴布局，适合呈现产品的交付实施步骤、发展历程或者项目开发演进阶段。在手机端将自适应为垂直排列。',
      icon: Clock,
      fields: ['标题 (title)', '副标题 (subtitle)', '步骤列表 (steps)', '步骤标题 (step.title)', '详细说明 (step.description)', '时间/标识 (step.duration)'],
      color: 'from-violet-600 to-fuchsia-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-white rounded-2xl p-4 space-y-3 shadow-inner select-none text-left">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-100 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-violet-500" /> 服务交付实施流程
          </div>
          <div className="grid grid-cols-3 gap-2.5 scale-95 origin-center relative">
            <div className="absolute top-4 left-2 right-2 h-0.5 bg-blue-100 -z-10" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 border border-slate-150 rounded-xl p-2 flex flex-col space-y-1 relative">
                <div className="text-[6px] font-bold text-blue-600">第 {i} 阶段</div>
                <div className="text-[8px] font-bold text-slate-800">步骤标题 {i}</div>
                <div className="text-[6px] text-slate-400 leading-normal">描述说明文本</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'features',
      name: '特性功能矩阵 (Features Block)',
      desc: '小卡片多列特性排版。支持为关键技术点添加绿色的高亮标签（如：核心、推荐、首创），适合长列表的技术规格呈现。',
      icon: Layers,
      fields: ['标题 (title)', '副标题 (subtitle)', '特性卡片列表 (items)', '卡片标题 (item.title)', '卡片描述 (item.description)', '高亮徽标 (item.highlightText)'],
      color: 'from-indigo-600 to-cyan-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl p-4 space-y-3 shadow-inner select-none text-left">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-150 flex items-center justify-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-500" /> 特性功能矩阵
          </div>
          <div className="grid grid-cols-2 gap-2 scale-95 origin-center">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-slate-150 rounded-xl p-2.5 flex flex-col space-y-1 relative shadow-sm">
                {i === 1 && (
                  <span className="absolute top-2 right-2 text-[6px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-100">核心</span>
                )}
                <div className="w-4 h-4 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <div className="text-[8px] font-bold text-slate-800">特性标题 {i}</div>
                <div className="text-[6px] text-slate-400 leading-normal">这里是该特性的底层技术与功能注解说明。</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      name: '常见问题解答 (FAQ Block)',
      desc: '交互式折叠问答区。在网页渲染时支持平滑的风琴折叠展开，有效解惑用户，提升网站转化率和SEO搜索引擎友好度。',
      icon: HelpCircle,
      fields: ['大标题 (title)', '副标题 (subtitle)', '问答项列表 (items)', '客户疑问 (item.question)', '官方解答 (item.answer)'],
      color: 'from-pink-600 to-rose-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-white rounded-2xl p-4 space-y-3 shadow-inner select-none text-left">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-100 flex items-center justify-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-pink-500" /> 常见问题与解答
          </div>
          <div className="space-y-1.5 scale-95 origin-center">
            {[1, 2].map((i) => (
              <div key={i} className="border border-slate-150 rounded-xl p-2 bg-slate-50/50 flex flex-col space-y-1">
                <div className="text-[8px] font-bold text-slate-800 flex items-center justify-between">
                  <span>Q: 常见疑问标题 {i} ？</span>
                  <span className="text-[8px] text-slate-400">▼</span>
                </div>
                {i === 1 && (
                  <div className="text-[7px] text-slate-400 border-t border-slate-200/50 pt-1 leading-normal">
                    A: 针对该常见疑问的高阶技术规范、服务支持与收费策略的权威官方解答。
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'architecture',
      name: '产品架构图模块 (Architecture Block)',
      desc: '支持呈现高清晰度产品逻辑架构、系统构成或数据流向拓扑大图，下方可配一段深层次的架构注解。',
      icon: Workflow,
      fields: ['架构图大标题 (title)', '架构图文件 URL (imageUrl)', '图注/描述文本 (description)'],
      color: 'from-purple-600 to-pink-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-white rounded-2xl p-4 space-y-3 shadow-inner select-none">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-100 flex items-center justify-center gap-1">
            <Workflow className="w-3.5 h-3.5 text-purple-500" /> 产品核心技术架构
          </div>
          <div className="aspect-[21/9] bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center text-slate-350 gap-1 shadow-sm">
            <Workflow className="w-6 h-6 opacity-60" />
            <span className="text-[7px] font-bold uppercase tracking-wider">[ 高保真架构逻辑大图展示区域 ]</span>
          </div>
          <p className="text-[7px] text-slate-400 text-center max-w-sm mx-auto font-medium leading-relaxed italic">
            “ 融合多模态深度学习语义提取引擎与分布式向量数据库存储中心，提供百万级文档秒级精准反馈架构 ”
          </p>
        </div>
      )
    },
    {
      id: 'video',
      name: '案例视频播放模块 (Video Case Block)',
      desc: '影视级深色底的视频播放框架。除了支持直接上传 MP4 文件之外，已智能兼容 B站 页面链接，自动提取 BVID 生成高清免打扰嵌入播放器。',
      icon: Play,
      fields: ['视频区域大标题 (title)', '描述子文本 (subtitle)', '视频源链接/本地上传 (videoUrl)'],
      color: 'from-rose-600 to-red-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-slate-900 rounded-2xl p-4 space-y-3 shadow-inner select-none relative">
          <div className="text-center font-bold text-slate-200 text-[10px] pb-1 border-b border-slate-800/80 flex items-center justify-center gap-1">
            <Play className="w-3.5 h-3.5 text-rose-500" /> 案例视频演示
          </div>
          <div className="max-w-xs mx-auto border border-slate-700/50 rounded-xl overflow-hidden aspect-video bg-black flex flex-col items-center justify-center text-slate-550 gap-1.5">
            <div className="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center bg-slate-800/40 text-slate-300">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
            <span className="text-[6px] tracking-wide text-slate-400 font-medium">Bilibili / HTML5 视频流媒体播放就绪</span>
          </div>
        </div>
      )
    },
    {
      id: 'cta',
      name: '引导转换横幅 (CTA Block)',
      desc: '大面积的高亮视觉渐变横幅，包含煽动性的标题、行动召集文本以及醒目的表单预约与联系方式转换按钮。',
      icon: Share2,
      fields: ['召集标题 (title)', '口号副文本 (description)', '主按钮文字 (primaryText)', '次按钮文字 (secondaryText)'],
      color: 'from-cyan-600 to-blue-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-gradient-to-r from-blue-700 to-indigo-850 rounded-2xl p-6 text-center text-white space-y-2.5 shadow-md select-none">
          <div className="text-[11px] font-extrabold tracking-tight">让企业的非结构化知识流转起来</div>
          <p className="text-[8px] text-slate-300 max-w-sm mx-auto font-light leading-normal scale-95">
            立即联系我们的资深知识管理专家，开启 30 天免费私有化部署体验之旅。
          </p>
          <div className="flex justify-center gap-2 pt-1">
            <span className="px-3 py-1 bg-white text-blue-700 text-[8px] font-bold rounded-lg shadow">预约演示</span>
            <span className="px-3 py-1 border border-white/30 text-white text-[8px] font-bold rounded-lg">联系我们</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100 uppercase">
              组件模版库
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">低代码设计模版指南</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">帮助开发者或系统管理员学习、研究模版数据字段，并为未来迭代开发新布局区块提供指引</p>
        </div>
      </div>

      {/* Intro info alert */}
      <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-3xl flex gap-4 text-xs font-semibold text-blue-800/90 leading-relaxed">
        <div className="p-2 bg-white text-blue-600 rounded-2xl shrink-0 h-fit border border-blue-100/50 shadow-sm">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-blue-900 text-sm">如何通过这套组件搭建页面？</h3>
          <p className="font-normal text-slate-600">每个产品都可以随意编排零个或多个下列模版。在前台渲染时，系统会自上而下读取这些模版的数据结构进行拼接。</p>
          <p className="font-normal text-slate-600">数据通过本地的 <code className="px-1.5 py-0.5 bg-slate-100 border rounded text-[10px] text-slate-700">products.json</code> 进行存储与维护，在后台点击“设计”按钮后直接调用可视化编辑器修改数据并自动刷新路由生成缓存。</p>
        </div>
      </div>

      {/* Grid of Templates cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {templates.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <div key={tpl.id} className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              {/* Card Title Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-br ${tpl.color} text-white rounded-xl`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-none">{tpl.name}</h3>
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded">
                  Type: {tpl.id}
                </span>
              </div>

              {/* Card description and fields list */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">{tpl.desc}</p>
                  
                  {/* Schema fields badges */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">模版数据字段：</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tpl.fields.map((f, i) => (
                        <span key={i} className="text-[10px] font-medium px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md border border-slate-200/60 font-mono">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Wireframe Mockup Preview */}
                <div className="space-y-2 text-left pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>视觉排版简图：</span>
                  </span>
                  {tpl.mockup}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
