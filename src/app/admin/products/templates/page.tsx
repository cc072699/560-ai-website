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
  Check,
  Table,
  MessageSquare,
  BarChart3,
  Monitor,
  FileText,
  Users,
  Download,
  Award,
  MapPin,
  Images
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
    },
    {
      id: 'comparison',
      name: '产品方案对比 (Comparison Block)',
      desc: '标准的横向对比表格。支持管理后台自由添加对比维度与版本选项，高亮显示核心优势（非常适合呈现版本差异或传统 vs. 我们的方案）。',
      icon: Table,
      fields: ['表格标题 (title)', '副标题 (subtitle)', '表头项 (headers: 字符串数组)', '对比行 (rows)', '行维度名 (row.label)', '列描述 (row.values: 字符串数组)', '高亮列索引 (row.highlightIndex)'],
      color: 'from-blue-600 to-cyan-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-white rounded-2xl p-4 space-y-3 shadow-inner select-none text-left">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-100 flex items-center justify-center gap-1">
            <Table className="w-3.5 h-3.5 text-blue-500" /> 产品方案配置对比表
          </div>
          <div className="border border-slate-150 rounded-lg overflow-hidden text-[7px] leading-normal">
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-150 font-bold p-1 text-slate-700">
              <span>特性</span>
              <span>传统自研</span>
              <span className="text-blue-600">五六零方案</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-100 p-1 text-slate-500">
              <span className="font-bold text-slate-800">交付周期</span>
              <span>3 个月起</span>
              <span className="bg-blue-50/50 text-blue-700 font-semibold px-0.5">1-2 周</span>
            </div>
            <div className="grid grid-cols-3 p-1 text-slate-500">
              <span className="font-bold text-slate-800">安全合规</span>
              <span>需复杂改造</span>
              <span className="bg-blue-50/50 text-blue-700 font-semibold px-0.5">原生私有部署</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'testimonials',
      name: '客户评价见证 (Testimonials Block)',
      desc: '卡片式的高级客户口碑及管理层证言陈列。支持自由增删卡片，支持上传客户个人头像与企业商标 Logo，提升标杆信誉背书。',
      icon: MessageSquare,
      fields: ['板块标题 (title)', '副标题 (subtitle)', '见证项 (items)', '证言内容 (item.quote)', '评价人姓名 (item.author)', '职位 (item.role)', '公司名称 (item.company)', '头像 (item.avatarUrl)', '公司徽标 (item.logoUrl)'],
      color: 'from-indigo-600 to-purple-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-slate-50/30 rounded-2xl p-4 space-y-3 shadow-inner select-none text-left">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-150 flex items-center justify-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> 真实客户成功评价
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-slate-150 rounded-xl p-2 flex flex-col justify-between space-y-1.5 shadow-sm">
                <p className="text-[6px] text-slate-500 leading-normal italic">“ 引入该平台后，原先数小时的内容检查被缩短到秒级。”</p>
                <div className="flex items-center gap-1.5 border-t border-slate-100 pt-1">
                  <div className="w-4.5 h-4.5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[5px] font-bold">张</div>
                  <div className="leading-none text-[5px]">
                    <div className="font-bold text-slate-800">张总</div>
                    <div className="text-slate-400">CIO · 某合伙公司</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'metrics',
      name: '核心成效指标 (Metrics Block)',
      desc: '大字号、渐变色的业务成效指标网格，支持三列或多列平铺，直观展现产品为客户带来的量化商业价值与技术实力。',
      icon: BarChart3,
      fields: ['大标题 (title)', '副标题 (subtitle)', '指标项列表 (items)', '指标值 (item.value: 如 99.9%)', '指标名称 (item.label)', '指标补充描述 (item.description)'],
      color: 'from-amber-500 to-rose-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-white rounded-2xl p-4 space-y-3 shadow-inner select-none text-left">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-100 flex items-center justify-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-rose-500" /> 商业成效量化展现
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: '45%+', l: '效率提升' },
              { v: '99.9%', l: '系统可用性' },
              { v: '60%', l: 'TCO 下降' }
            ].map((metric, i) => (
              <div key={i} className="bg-slate-50 border border-slate-150 rounded-xl p-2 text-center flex flex-col justify-center">
                <span className="text-[12px] font-black text-blue-600 leading-none">{metric.v}</span>
                <span className="text-[6px] font-bold text-slate-700 mt-1">{metric.l}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'canvas',
      name: '产品工作画布 (Canvas Block)',
      desc: '展示高保真的软件工作台、系统主看板截图。采用精美的 macOS 风格浏览器框包裹，右侧可平行罗列数个关键交互功能点的解析。',
      icon: Monitor,
      fields: ['画布标题 (title)', '副标题 (subtitle)', '画布图片 URL (imageUrl)', 'Alt 描述 (imageAlt)', '大段说明 (description)', '功能解析项 (features)', '解析标题 (feat.title)', '解析描述 (feat.description)'],
      color: 'from-purple-600 to-indigo-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-white rounded-2xl p-4 space-y-3 shadow-inner select-none text-left">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-100 flex items-center justify-center gap-1">
            <Monitor className="w-3.5 h-3.5 text-purple-500" /> 系统交互工作画布
          </div>
          <div className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-7 bg-slate-900 border border-slate-850 rounded-lg aspect-video flex flex-col justify-between p-1.5 shadow-sm">
              <div className="flex gap-1">
                <span className="w-1 h-1 rounded-full bg-rose-500" />
                <span className="w-1 h-1 rounded-full bg-amber-500" />
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1 flex items-center justify-center text-[5px] text-slate-500 font-bold uppercase">
                [ 系统操作看板大图 ]
              </div>
            </div>
            <div className="col-span-5 space-y-2">
              <div className="text-[7px] font-bold text-slate-800">1. 一键触发管控</div>
              <div className="text-[6px] text-slate-400 scale-95 origin-left">无层级菜单跳转，即开即用</div>
              <div className="text-[7px] font-bold text-slate-800">2. 多源异构协同</div>
              <div className="text-[6px] text-slate-400 scale-95 origin-left">实现多平台状态同步</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'richText',
      name: '图文合规叙事 (Rich Text Block)',
      desc: '专为纯文字、政策合规、安全白皮书声明设计的排版区块。支持选择左图右文、右图左文或纯文本居中/居左展示。',
      icon: FileText,
      fields: ['标题 (title)', '副标题 (subtitle)', '正文长内容 (content)', '文本对齐方式 (align: 居左/居中)', '配图 URL (imageUrl)', '配图位置 (imagePosition: 左/右)'],
      color: 'from-slate-600 to-slate-800',
      mockup: (
        <div className="w-full border border-slate-200 bg-slate-50/30 rounded-2xl p-4 space-y-3 shadow-inner select-none text-left">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-150 flex items-center justify-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-600" /> 政策声明与合规细则
          </div>
          <div className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-8 space-y-1">
              <div className="w-16 h-1 bg-slate-300 rounded" />
              <div className="w-full h-0.5 bg-slate-200 rounded" />
              <div className="w-[90%] h-0.5 bg-slate-200 rounded" />
              <div className="w-[85%] h-0.5 bg-slate-200 rounded" />
            </div>
            <div className="col-span-4 aspect-video bg-white border border-slate-150 rounded flex items-center justify-center text-[5px] text-slate-350 font-medium">
              配图
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'partners',
      name: '合作伙伴墙 (Partners Block)',
      desc: '成熟企业的合作伙伴或客户信任墙徽标网络。支持自定义企业名单与对应的 Logo 上传，在页面底部形成无缝的静音信任网。',
      icon: Users,
      fields: ['标题 (title)', '副标题 (subtitle)', '品牌项列表 (items)', '品牌名称 (item.name)', 'Logo 徽标 URL (item.logoUrl)'],
      color: 'from-gray-500 to-blue-900',
      mockup: (
        <div className="w-full border border-slate-200 bg-white rounded-2xl p-4 space-y-3 shadow-inner select-none text-center">
          <div className="text-[7px] font-black text-slate-400 tracking-widest uppercase">与杰出企业同行，共创未来</div>
          <div className="flex justify-center items-center gap-3">
            {['中国石油', '华为技术', '腾讯云', '字节跳动'].map((name, i) => (
              <span key={i} className="text-[6px] font-bold text-slate-400 bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded shadow-sm">
                {name}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'carousel',
      name: '高阶功能幻灯轮播 (Carousel Block)',
      desc: '精美轮播框架，适合在页面核心位置滚动呈现高保真的系统截图、工作台界面细节或企业生产应用实景，可附加详细大样文字。',
      icon: Images,
      fields: ['演示大标题 (title)', '副描述说明 (subtitle)', '轮播图片列表 (items)', '图片 URL (item.imageUrl)', '图片小标题 (item.caption)', '图片备注描述 (item.description)'],
      color: 'from-purple-500 to-indigo-500',
      mockup: (
        <div className="w-full border border-slate-200 bg-white rounded-2xl p-4 space-y-3 shadow-inner select-none text-left">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-100 flex items-center justify-center gap-1">
            <Images className="w-3.5 h-3.5 text-purple-500" /> 产品核心功能截图演示
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="border border-slate-150 bg-slate-50 rounded-xl overflow-hidden p-1 shadow-sm">
                <div className="aspect-video bg-slate-900 flex items-center justify-center text-[5px] text-slate-500 font-bold uppercase">
                  [ 截图 {i} ]
                </div>
                <div className="text-[6px] font-bold text-slate-800 mt-1">演示模块 {i}</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'downloads',
      name: '资料资源下载中心 (Downloads Block)',
      desc: '标准的文档白皮书、解决方案指南、SDK 与客户端软件包下载卡片。提供文件类型徽标、文件大小说明，打通交付漏斗最后一环。',
      icon: Download,
      fields: ['板块大标题 (title)', '说明副标题 (subtitle)', '文件资源列表 (items)', '文件标题 (item.title)', '文件大小 (item.fileSize)', '下载链接 URL (item.fileUrl)', '扩展名 (item.fileType)'],
      color: 'from-blue-500 to-cyan-500',
      mockup: (
        <div className="w-full border border-slate-200 bg-white rounded-2xl p-4 space-y-3 shadow-inner select-none text-left">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-100 flex items-center justify-center gap-1">
            <Download className="w-3.5 h-3.5 text-blue-500" /> 技术资料白皮书下载
          </div>
          <div className="space-y-1.5">
            {[
              { t: '产品白皮书.pdf', s: '4.2 MB', ty: 'PDF' },
              { t: '桌面客户端安装包.exe', s: '78 MB', ty: 'EXE' }
            ].map((file, i) => (
              <div key={i} className="flex justify-between items-center p-1.5 border border-slate-150 rounded bg-slate-50 text-[6px]">
                <div className="flex items-center gap-1">
                  <span className="bg-blue-100 text-blue-700 font-bold px-1 rounded">{file.ty}</span>
                  <span className="font-bold text-slate-700">{file.t}</span>
                </div>
                <span className="text-slate-400 font-medium">{file.s}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'certificates',
      name: '企业荣誉与合规资质 (Certificates Block)',
      desc: '专为成熟企业定制的证书背书展架。网格化排列安全资质或行业荣誉奖项（如等保三级、软著、权威监测认证），打消企业级买家合作疑虑。',
      icon: Award,
      fields: ['板块标题 (title)', '副标题 (subtitle)', '资质列表 (items)', '证书名称 (item.name)', '证书照片/图 (item.imageUrl)', '颁发机构 (item.issuingBody)', '颁发日期 (item.date)'],
      color: 'from-amber-500 to-yellow-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl p-4 space-y-3 shadow-inner select-none text-center">
          <div className="text-[10px] font-bold text-slate-800 pb-1 border-b border-slate-150 flex items-center justify-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-500" /> 权威技术资质与荣誉
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['等级保护三级', 'ISO9001 质量认证', '系统软件著作权'].map((name, i) => (
              <div key={i} className="bg-white border border-slate-150 rounded p-1.5 space-y-1 shadow-sm">
                <div className="w-4 h-6 bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center">
                  <Award className="w-2.5 h-2.5 text-slate-400" />
                </div>
                <div className="text-[5px] font-bold text-slate-700 leading-tight">{name}</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'coverage',
      name: '全国分支服务网络 (Coverage Block)',
      desc: '以三列布局平行排布各主要分支机构或办事处的地址、客服电话与专职支持邮箱。完美传达企业的本地化售后及贴身服务能力。',
      icon: MapPin,
      fields: ['服务标题 (title)', '副描述说明 (subtitle)', '网点清单 (items)', '地区名 (item.region)', '地址 (item.address)', '电话 (item.phone)', '邮箱 (item.email)'],
      color: 'from-emerald-500 to-teal-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-white rounded-2xl p-4 space-y-3 shadow-inner select-none text-left">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-100 flex items-center justify-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" /> 全国服务支撑办事处
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['北海总部运营中心', '北京研发服务中心'].map((reg, i) => (
              <div key={i} className="bg-slate-50 border border-slate-150 rounded p-1.5 text-[5px]">
                <div className="font-bold text-slate-800 flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-blue-600" /> {reg}
                </div>
                <div className="text-slate-400 mt-1">电话: 0779-xxxxxxx</div>
                <div className="text-slate-450 leading-tight mt-0.5">地址: 网点详细大楼地址...</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'consultation',
      name: '定制咨询服务卡片 (Consultation Block)',
      desc: '专为政企定制开发或大型私有部署咨询设计的行动呼吁。包含清晰的服务承诺条款展示（如免费架构规划、2小时极速服务响应）。',
      icon: HelpCircle,
      fields: ['咨询标题 (title)', '说明副文本 (subtitle)', 'CTA 按钮文本 (ctaText)', '服务承诺条款 (benefits: 字符串数组)'],
      color: 'from-slate-900 to-indigo-900',
      mockup: (
        <div className="w-full border border-slate-200 bg-gradient-to-r from-slate-900 to-indigo-955 rounded-2xl p-4 text-center text-white space-y-2.5 shadow-md select-none">
          <div className="text-[10px] font-extrabold tracking-tight">为您量身定制大客户行业方案</div>
          <div className="text-[8px] px-2 py-1 bg-blue-600 text-white rounded font-bold w-fit mx-auto cursor-pointer">
            立即预约免费咨询
          </div>
          <div className="flex justify-center gap-3 text-[5px] text-slate-400 border-t border-white/5 pt-1.5">
            <span>✓ 支持完全私有离线化</span>
            <span>✓ 免费上门实地调研</span>
          </div>
        </div>
      )
    },
    {
      id: 'multiDevice',
      name: '多端协同自适应预览 (Multi Device Block)',
      desc: '同步层叠电脑、平板、智能手机的多设备排布框架。优雅展现产品在跨端交互、原生渲染及多屏一致响应式技术上的实力。',
      icon: Monitor,
      fields: ['预览大标题 (title)', '副描述说明 (subtitle)', '桌面截图 URL (desktopUrl)', '平板截图 URL (tabletUrl)', '手机截图 URL (mobileUrl)', '端特性列表 (features: { title, desc })'],
      color: 'from-sky-500 to-indigo-650',
      mockup: (
        <div className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl p-4 space-y-3 shadow-inner select-none text-center">
          <div className="text-[7px] font-black text-slate-400 tracking-wider mb-2">一套架构 · 响应式多端原生展示</div>
          <div className="flex items-end justify-center gap-2">
            <div className="w-20 h-12 bg-slate-800 rounded border border-slate-700 shadow p-0.5">
              <div className="w-full h-full bg-slate-950 text-[4px] text-slate-500 flex items-center justify-center">[ 电脑端 ]</div>
            </div>
            <div className="w-10 h-14 bg-slate-800 rounded border border-slate-700 shadow p-0.5">
              <div className="w-full h-full bg-slate-950 text-[4px] text-slate-500 flex items-center justify-center">[ 平板 ]</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'hardwareSpec',
      name: '核心架构拆解热区 (Hardware Spec Block)',
      desc: '在核心芯片或软件运行机制底图上，精确定位多组雷达闪烁热区（通过 x/y 相对比例坐标定位）。点击悬停展示核心工艺指标。',
      icon: Workflow,
      fields: ['板块标题 (title)', '副标题 (subtitle)', '核心大图 URL (imageUrl)', '热区标注 (annotations)', '热点 X/Y 百分比 (x / y)', '标注名称 (ann.title)', '详细工艺注解 (ann.desc)'],
      color: 'from-rose-500 to-orange-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-slate-950 rounded-2xl p-4 text-center text-white space-y-3 shadow-md select-none relative overflow-hidden aspect-video flex flex-col justify-between">
          <div className="text-[7px] font-black tracking-widest text-slate-450">自研 H2 高性能计算核心剖解</div>
          <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded mx-auto flex items-center justify-center relative">
            <Workflow className="w-4 h-4 text-slate-500" />
            <span className="absolute top-1 left-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 border border-white"></span>
            </span>
          </div>
          <div className="text-[5px] text-slate-400">[ 指示闪烁热点提供交互详情 ]</div>
        </div>
      )
    },
    {
      id: 'techStack',
      name: '原生技术栈兼容生态 (Tech Stack Block)',
      desc: '标准的软件生态依赖网格，用于呈现产品的开放适配度。每个技术标签卡片含有 Logo 徽标、小版本支持号及官方授权状态彩色角标。',
      icon: Layers,
      fields: ['网格标题 (title)', '副标题 (subtitle)', '兼容技术列表 (items)', '依赖名称 (item.name)', '依赖 Logo (item.logoUrl)', '认证状态 (item.status)', '依赖版本号 (item.version)'],
      color: 'from-blue-600 to-cyan-500',
      mockup: (
        <div className="w-full border border-slate-200 bg-white rounded-2xl p-4 space-y-3 shadow-inner select-none text-left">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-100 flex items-center justify-center gap-1">
            <Layers className="w-3.5 h-3.5 text-blue-500" /> 系统技术栈兼容网格
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['.NET 9', 'React', 'Docker'].map((tech, i) => (
              <div key={i} className="bg-slate-50 border border-slate-150 p-1.5 rounded text-[5px] flex items-center gap-1 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-50 text-[4px] border border-blue-150 text-blue-600 flex items-center justify-center font-black">L</span>
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'sandbox',
      name: '代码调用交互沙盒 (Sandbox Block)',
      desc: '交互式集成控制台。允许客户在前台页面点击切换不同选项卡（如 cURL / Shell / C#），实时同步更换底层暗色代码高亮及说明。',
      icon: FileCode,
      fields: ['沙盒大标题 (title)', '副描述说明 (subtitle)', '沙盒选项卡 (tabs)', '选项卡标签 (tab.label)', '代码高亮语言 (tab.language)', '示例代码内容 (tab.code)', '详细接入解析 (tab.description)'],
      color: 'from-slate-700 to-slate-900',
      mockup: (
        <div className="w-full border border-slate-200 bg-white rounded-2xl p-4 space-y-3 shadow-inner select-none text-left flex flex-col">
          <div className="bg-slate-100 border border-slate-200/80 rounded-t p-1 flex gap-1 items-center">
            <span className="px-1.5 py-0.5 bg-white text-blue-600 text-[5px] font-bold rounded shadow-sm border border-slate-150">cURL</span>
            <span className="text-[5px] text-slate-400 font-semibold pl-1">C# SDK</span>
          </div>
          <div className="bg-slate-900 text-slate-400 font-mono text-[5px] p-2 rounded-b leading-normal">
            {"$ curl -X POST https://api.560ai.com/v1"}
          </div>
        </div>
      )
    },
    {
      id: 'signalWave',
      name: '信号时延对比器 (Signal Wave Block)',
      desc: '以双列拟物化卡片形式，对比大客户高度关心的性能指标（如传输时延、吞吐峰值、降噪深度）。采用深色科技背景，直观易懂。',
      icon: Clock,
      fields: ['对比标题 (title)', '副描述说明 (subtitle)', '左标签名 (leftLabel)', '左端数值 (leftValue)', '右标签名 (rightLabel)', '右端数值 (rightValue)', '底层核心对比技术剖析 (description)'],
      color: 'from-indigo-600 to-purple-700',
      mockup: (
        <div className="w-full border border-slate-200 bg-slate-950 rounded-2xl p-4 text-center text-white space-y-3 shadow-md select-none">
          <div className="grid grid-cols-2 gap-3 text-[6px]">
            <div className="border border-slate-800 rounded p-1 bg-slate-900/60">
              <span className="opacity-50 block text-[5px]">传统自研</span>
              <span className="font-extrabold text-slate-400 block text-xs">120ms 时延</span>
            </div>
            <div className="border border-blue-900 rounded p-1 bg-blue-950/20">
              <span className="text-blue-400 block text-[5px]">五六零算法</span>
              <span className="font-extrabold text-blue-500 block text-xs">5ms 时延</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'bentoGrid',
      name: 'Bento 非对称特性栅格 (Bento Grid Block)',
      desc: '苹果风格的非对称拼图特性展示。支持大小、长宽卡片混排，且每个卡片都可以独立配置渐变背景、图文或微缩插画，极富表现力。',
      icon: Sparkles,
      fields: ['板块标题 (title)', '副描述说明 (subtitle)', '卡片网格列表 (items)', '占用大小 (item.size: small/large/tall)', '卡片标题 (item.title)', '副标题描述 (item.subtitle)', '背景图片 (item.imageUrl)', '背景色类名 (item.colorBg)'],
      color: 'from-amber-600 to-rose-600',
      mockup: (
        <div className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl p-4 space-y-3 shadow-inner select-none text-left">
          <div className="text-center font-bold text-slate-800 text-[10px] pb-1 border-b border-slate-150 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> 特性功能 Bento 拼图
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[5px]">
            <div className="col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded p-1.5 min-h-[40px] flex flex-col justify-between">
              <span className="font-bold">智能自动化编译器</span>
            </div>
            <div className="col-span-1 bg-slate-900 text-white rounded p-1.5 flex flex-col justify-between">
              <span className="font-bold">等保三级</span>
            </div>
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
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-100 uppercase">
              组件模版库
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">低代码设计模版指南</h1>
          </div>
          <p className="text-sm text-slate-450 mt-1">帮助开发者或系统管理员学习、研究模版数据字段，并为未来迭代开发新布局区块提供指引</p>
        </div>
      </div>

      {/* Intro info alert */}
      <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-3xl flex gap-4 text-sm font-semibold text-blue-850 leading-relaxed">
        <div className="p-2 bg-white text-blue-600 rounded-2xl shrink-0 h-fit border border-blue-100/50 shadow-sm">
          <BookOpen className="w-5.5 h-5.5" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-blue-905 text-base">如何通过这套组件搭建页面？</h3>
          <p className="font-normal text-slate-750">每个产品都可以随意编排零个或多个下列模版。在前台渲染时，系统会自上而下读取这些模版的数据结构进行拼接。</p>
          <p className="font-normal text-slate-750">数据通过本地的 <code className="px-1.5 py-0.5 bg-slate-100 border rounded text-xs text-slate-700">products.json</code> 进行存储与维护，在后台点击“设计”按钮后直接调用可视化编辑器修改数据并自动刷新路由生成缓存。</p>
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
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-black text-slate-900 text-base leading-none">{tpl.name}</h3>
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded">
                  Type: {tpl.id}
                </span>
              </div>

              {/* Card description and fields list */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 leading-relaxed font-semibold">{tpl.desc}</p>
                  
                  {/* Schema fields badges */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">模版数据字段：</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tpl.fields.map((f, i) => (
                        <span key={i} className="text-xs font-bold px-2.5 py-1 bg-slate-50 text-slate-700 rounded-md border border-slate-200 font-mono">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Wireframe Mockup Preview */}
                <div className="space-y-2 text-left pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1">
                    <Eye className="w-4 h-4 text-slate-400" />
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
