'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  Loader2,
  Settings,
  Layers,
  Image as ImageIcon,
  PlusCircle,
  Video,
  Workflow,
  Sparkles,
  Eye,
  FileCode,
  Undo,
  Play,
  Clock,
  HelpCircle,
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
import { ImageUpload } from '@/components/admin/ImageUpload';
import { VideoUpload } from '@/components/admin/VideoUpload';
import type { Product, PageSection, SectionType } from '@/types';

const genId = () => Math.random().toString(36).substring(2, 9);

function getEmbedUrl(url: string): { type: 'iframe' | 'video'; src: string } {
  if (!url) return { type: 'video', src: '' };
  const biliRegex = /(?:bilibili\.com\/video\/|bvid=)(BV[a-zA-Z0-9]+)/i;
  const match = url.match(biliRegex);
  if (match && match[1]) {
    return {
      type: 'iframe',
      src: `https://player.bilibili.com/player.html?bvid=${match[1]}&high_quality=1&as_wide=1&danmaku=0`
    };
  }
  if (url.includes('player.bilibili.com') || url.includes('youtube.com/embed')) {
    return { type: 'iframe', src: url };
  }
  return { type: 'video', src: url };
}

export default function ProductDesignPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch('/api/admin/products');
        const data: Product[] = await res.json();
        const found = data.find((p) => p.id === id);
        if (found) {
          setProduct(found);
          setSections(found.detailSections || []);
        } else {
          showToast('找不到该产品', 'error');
        }
      } catch {
        showToast('加载失败，请重试', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, showToast]);

  const handleSave = async () => {
    if (!product) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, detailSections: sections }),
      });
      if (!res.ok) throw new Error();
      showToast('设计排版已保存并发布');
    } catch {
      showToast('保存失败，请检查网络', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addSection = (type: SectionType) => {
    const newSectionId = genId();
    let newSec: PageSection = { id: newSectionId, type };

    if (type === 'hero') {
      newSec.hero = {
        title: product?.title || '进入智能空间',
        subtitle: product?.tagline || '企业级智能空间核心平台',
        bgType: 'image',
        bgUrl: product?.imageUrl || '',
      };
    } else if (type === 'capabilities') {
      newSec.capabilities = [
        {
          title: '核心能力 1',
          description: '描述该能力的具体表现、带来的业务价值以及应用成效...',
          imageUrl: '',
        },
        {
          title: '核心能力 2',
          description: '描述该能力的具体表现、带来的业务价值以及应用成效...',
          imageUrl: '',
        }
      ];
    } else if (type === 'scenarios') {
      newSec.scenarios = {
        title: '应用场景',
        items: [
          { title: '设备运维', imageUrl: '', description: '实现设备巡检与状态自动推演' },
          { title: '生产制造', imageUrl: '', description: '打通流水线核心指标建模' }
        ],
      };
    } else if (type === 'architecture') {
      newSec.architecture = {
        title: '产品架构图',
        imageUrl: '',
        description: '融合多源物理数据与智能大模型处理中心，提供端到端数据交付控制。',
      };
    } else if (type === 'cta') {
      newSec.cta = {
        title: '深度融合技术，带来行业数字化升级',
        description: '立即预约演示，快速了解如何助力您的企业提升整体效率。',
        primaryText: '预约演示',
        secondaryText: '联系我们',
      };
    } else if (type === 'video') {
      newSec.video = {
        title: '产品与案例视频演示',
        subtitle: '3分钟快速了解我们在该行业的落地实践与具体成效',
        videoUrl: '',
      };
    } else if (type === 'timeline') {
      newSec.timeline = {
        title: '落地实施与服务流程',
        subtitle: '我们提供端到端的贴身规划与系统平滑上线支持',
        steps: [
          { title: '需求调研与环境规划', description: '深入业务一线进行软硬件环境与物理数据流建模规划', duration: '阶段一 (第1-2周)' },
          { title: '系统部署与模型定制', description: '现场/私有化交付系统并针对客户特定业务微调垂直模型', duration: '阶段二 (第3-4周)' },
          { title: '上线培训与运营交割', description: '提供全套技术文档并培训现场人员，实现系统完美交接', duration: '阶段三 (第5周起)' }
        ]
      };
    } else if (type === 'features') {
      newSec.features = {
        title: '细分功能特性矩阵',
        subtitle: '全方位多场景支持，打通业务效率瓶颈',
        items: [
          { title: '多源物理引擎适配', description: '支持绝大多数主流工控协议和物理设备端实时接入', highlightText: '核心' },
          { title: '秒级预测模型响应', description: '云端联合计算实现超短网络时延与高帧率仿真反馈', highlightText: '推荐' },
          { title: '私有化离线交付', description: '支持完全的单机/私有网部署，保障核心数据资产安全' }
        ]
      };
    } else if (type === 'faq') {
      newSec.faq = {
        title: '常见问题解答',
        subtitle: '关于该产品的商业授权、技术服务与部署周期的解答',
        items: [
          { question: '该系统支持私有化部署吗？', answer: '支持。系统可以通过 Docker/K8s 容器化技术一键部署在客户的私有数据中心，提供完整的离线计算与预测能力。' },
          { question: '部署这套系统需要多长时间？', answer: '一般标准版部署加对接工作在 3-5 周内完成，我们提供全流程专属工程师贴身跟进支持。' }
        ]
      };
    } else if (type === 'comparison') {
      newSec.comparison = {
        title: '产品方案对比',
        subtitle: '对比传统自研或市面同类产品，为您呈现全方位核心优势',
        headers: ['对比维度', '传统方式', '五六零方案'],
        rows: [
          { label: '交付周期', values: ['3-6 个月且沟通成本高', '1-2 周即可快速开箱即用'], highlightIndex: 2 },
          { label: '系统架构', values: ['烟囱式老旧开发，不易扩展', '微服务云原生，支持极速迭代'], highlightIndex: 2 },
          { label: '数据合规', values: ['私有化成本昂贵，公有云不合规', '支持轻量本地部署，数据完全自主掌控'], highlightIndex: 2 }
        ]
      };
    } else if (type === 'testimonials') {
      newSec.testimonials = {
        title: '客户评价与标杆证言',
        subtitle: '深受信赖：听听我们真实企业用户的声音与评价反馈',
        items: [
          { quote: '自从引入五六零公司的产品，我们原先烦琐的线下审核工作基本实现了全自动化，交付合规风险降低了90%！', author: '张经理', role: 'CIO', company: '某智能制造百强企业' },
          { quote: '该系统的本地私有化部署方案极佳，安全合规的同时，维护门槛非常低，极力推荐成熟企业引入。', author: '李总', role: '技术总监', company: '某商业地产巨头' }
        ]
      };
    } else if (type === 'metrics') {
      newSec.metrics = {
        title: '核心业务成效指标',
        subtitle: '用最直观的数据表现，证明我们的商业价值与技术成效',
        items: [
          { value: '45%', label: '运营效率大幅提升', description: '数据多源采集与规则引擎自动化，省去人工比对' },
          { value: '99.9%', label: '高可用保障', description: '基于分布式轻量微服务架构，保障高负载平稳运行' },
          { value: '60%', label: '总拥有成本(TCO)下降', description: '精简IT架构与硬件需求，免去昂贵运维费用' }
        ]
      };
    } else if (type === 'canvas') {
      newSec.canvas = {
        title: '产品工作画布 / 界面概览',
        subtitle: '所见即所得：直观优雅的系统操作工作台，带来高阶生产力体验',
        imageUrl: '',
        imageAlt: '产品画布系统看板',
        description: '专为中大型企业设计的集中内容管控工作舱，让非技术人员也能在 5 分钟内上手并完成发布配置。',
        features: [
          { title: '多源看板集成', description: '直观呈现多渠道内容健康指标、最新审批流及数据同步节点状态' },
          { title: '无缝快捷审批', description: '无需层层菜单跳转，直接在主看板点击状态切换与内容溯源对比' }
        ]
      };
    } else if (type === 'richText') {
      newSec.richText = {
        title: '企业安全合规与详细资质说明',
        subtitle: '全方位安全防护底座，为大中型组织提供金融级合规声明',
        content: '我们高度重视企业的数据安全。系统内置细粒度权限控制，支持端到端数据传输高强度加密。系统已全面通过多项安全红蓝对抗审计，并完美适配政企私有内网等极度苛刻的安全合规条件。同时，我们提供长期的合规性追踪保障服务，确保产品升级无缝平滑，符合国家级最新信息技术规范要求。',
        align: 'left',
        imageUrl: '',
        imagePosition: 'right'
      };
    } else if (type === 'partners') {
      newSec.partners = {
        title: '与杰出企业同行，共创智能未来',
        subtitle: '已服务超过百家行业先锋企业，为不同规模 of 组织注入长期生产力',
        items: [
          { name: '中国石油', logoUrl: '' },
          { name: '腾讯云', logoUrl: '' },
          { name: '华为技术', logoUrl: '' },
          { name: '字节跳动', logoUrl: '' }
        ]
      };
    } else if (type === 'carousel') {
      newSec.carousel = {
        title: '产品功能演示与现场实拍',
        subtitle: '直观感受系统的交互界面与丰富落地应用现场图景',
        items: [
          { imageUrl: '', caption: '系统控制台主页面', description: '一站式监测所有内容发布健康指数与审批状态' },
          { imageUrl: '', caption: '规则配置编辑器', description: '所见即所得的可视化规则建模与多条件控制画布' }
        ]
      };
    } else if (type === 'downloads') {
      newSec.downloads = {
        title: '产品资料与客户端资源下载',
        subtitle: '我们为您准备了详实的产品白皮书、部署指南以及多终端安装包',
        items: [
          { title: '企业官网与内容管控产品白皮书', fileSize: '4.5 MB', fileUrl: '', fileType: 'PDF' },
          { title: '本地私有化一键部署 Docker 脚本', fileSize: '1.2 MB', fileUrl: '', fileType: 'ZIP' },
          { title: '桌面管理端（macOS/Windows）', fileSize: '68 MB', fileUrl: '', fileType: 'EXE' }
        ]
      };
    } else if (type === 'certificates') {
      newSec.certificates = {
        title: '专业资质荣誉与安全合规认证',
        subtitle: '权威认证：坚持高标准的软件研发流程与金融级安全保障',
        items: [
          { name: '国家信息系统安全等级保护三级认证', imageUrl: '', issuingBody: '公安部安全监测中心' },
          { name: 'ISO9001 质量管理体系认证证书', imageUrl: '', issuingBody: '国际标准化组织' },
          { name: '企业内容智能分发及安全管控系统软件著作权', imageUrl: '', issuingBody: '国家版权局' }
        ]
      };
    } else if (type === 'coverage') {
      newSec.coverage = {
        title: '全国本地化服务支撑网络',
        subtitle: '贴身规划与7x24快速技术支持，保障您的系统稳定无忧',
        items: [
          { region: '北海运营中心 (总部)', address: '广西北海市工业园区软件大厦 B 座', phone: '0779-xxxxxxx', email: 'service@560ai.com' },
          { region: '北京研发中心', address: '北京市海淀区中关村科技园区', phone: '010-xxxxxxx', email: 'bj@560ai.com' },
          { region: '深圳服务中心', address: '深圳市南山区高新科技园', phone: '0755-xxxxxxx', email: 'sz@560ai.com' }
        ]
      };
    } else if (type === 'consultation') {
      newSec.consultation = {
        title: '即刻开启您的数字化升级之旅',
        subtitle: '联系我们的资深架构师，获取为您量身定制的行业解决方案与私有化部署规划',
        ctaText: '立即申请免费架构咨询',
        benefits: ['支持完全私有化离线部署', '提供 2 小时极速技术响应承诺', '赠送 30 天全功能免费试用授权']
      };
    } else if (type === 'multiDevice') {
      newSec.multiDevice = {
        title: '多端协同，一致体验',
        subtitle: '一套架构，多端适配。实时同步数据与界面状态，无缝契合各种工作场景',
        desktopUrl: '',
        tabletUrl: '',
        mobileUrl: '',
        features: [
          { title: '多平台无缝编译', desc: '自适应网格自动计算设备长宽比，渲染高保真操作系统原生控件' },
          { title: '离线同步缓存', desc: '弱网或离线状态自动记录业务操作，重新连网自动毫秒级合并冲突' }
        ]
      };
    } else if (type === 'hardwareSpec') {
      newSec.hardwareSpec = {
        title: '芯片级处理核心与通力协作工艺',
        subtitle: '搭载全新自研高性能多模态计算芯片，运算吞吐相比上一代提升高达 4 倍',
        imageUrl: '',
        annotations: [
          { x: 35, y: 40, title: '自研 H2 计算核心', desc: '内嵌百万级神经元计算引擎，实时根据输入信息优化推理决策' },
          { x: 65, y: 55, title: '智能音频过滤器', desc: '每秒 48,000 次主动降噪，将杂音折减率推高至金融合规级安全界限' }
        ]
      };
    } else if (type === 'techStack') {
      newSec.techStack = {
        title: '原生兼容技术栈与系统依赖网',
        subtitle: '无缝接入成熟企业生态，支持多种语言、主流数据库与核心中间件原生连接',
        items: [
          { name: 'TypeScript / React', logoUrl: '', status: 'Certified', version: 'v18+' },
          { name: 'Microsoft .NET / C#', logoUrl: '', status: 'Native', version: '.NET 8/9' },
          { name: 'PostgreSQL DB', logoUrl: '', status: 'Certified', version: 'v15+' },
          { name: 'Docker / Kubernetes', logoUrl: '', status: 'Native', version: 'v20+' }
        ]
      };
    } else if (type === 'sandbox') {
      newSec.sandbox = {
        title: '多端 API 代码调用与快速开发接入',
        subtitle: '通过极简的几行代码即可完成产品服务的核心功能挂载，提供主流多语言 SDK 支持',
        tabs: [
          {
            label: 'cURL / Shell',
            language: 'bash',
            code: 'curl -X POST "https://api.560ai.com/v1/analyze" \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "text": "企业待处理非结构化数据"\n  }\'',
            description: '通过标准 HTTP POST 请求在终端执行一键推理分析，支持任何可以发送网络请求的后台语言。'
          },
          {
            label: 'C# / .NET SDK',
            language: 'csharp',
            code: 'using FiveSixtyAI;\n\nvar client = new AnalysisClient("YOUR_TOKEN");\nvar response = await client.AnalyzeAsync(new AnalysisRequest\n{\n    Text = "企业待处理非结构化数据"\n});\n\nConsole.WriteLine($"处理结果: {response.Result}");',
            description: '原生 C# 客户端异步操作类，已深度优化 HTTP 连接池分配，提供金融级数据稳定性。'
          }
        ]
      };
    } else if (type === 'signalWave') {
      newSec.signalWave = {
        title: '声学波形对比与处理延迟对比',
        subtitle: '通过高频取样和差值计算算法，我们在降噪、吞吐时延两项硬核指标上均做到了行业领先',
        leftLabel: '通用开源通道',
        rightLabel: '五六零专属引擎',
        description: '我们采用双通道主动噪音过滤与大吞吐缓冲流控制，让在处理高并发、多来源复杂数据时的等待时间减少了 90% 以上。',
        leftValue: '128ms 高延迟波动',
        rightValue: '8ms 极速毫秒级响应'
      };
    } else if (type === 'bentoGrid') {
      newSec.bentoGrid = {
        title: '以非凡设计，陈列每一项产品特性',
        subtitle: '不规则的 Bento 盒排版布局，完美融合动效图章、数据统计与功能说明',
        items: [
          { size: 'large', title: '智能自动化规则编译器', subtitle: '一键将散乱的业务表单构建为逻辑完整的处理网络，节省 80% 代码编写量。', imageUrl: '', colorBg: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white' },
          { size: 'small', title: '等保三级安全合规', subtitle: '通过国家级权威红蓝演练。', imageUrl: '', colorBg: 'bg-slate-900 text-white' },
          { size: 'small', title: 'Docker 私有镜像', subtitle: '支持一键离线本地化。', imageUrl: '', colorBg: 'bg-white text-slate-800' },
          { size: 'tall', title: '跨平台跨端编译内核', subtitle: '完美适配 iOS、Android、Windows、macOS 原生设备。', imageUrl: '', colorBg: 'bg-slate-50 text-slate-800' }
        ]
      };
    }

    setSections([...sections, newSec]);
    setExpandedId(newSectionId);
    showToast('区块已添加');
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const list = [...sections];
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
    setSections(list);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const list = [...sections];
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
    setSections(list);
  };

  const removeSection = (index: number) => {
    const list = [...sections];
    list.splice(index, 1);
    setSections(list);
    showToast('区块已移除');
  };

  // Mutators for nested form elements
  const updateHero = (index: number, fields: Partial<NonNullable<PageSection['hero']>>) => {
    const list = [...sections];
    if (list[index].hero) {
      list[index].hero = { ...list[index].hero!, ...fields };
      setSections(list);
    }
  };

  const updateCapabilities = (index: number, capIdx: number, fields: Partial<NonNullable<PageSection['capabilities']>[0]>) => {
    const list = [...sections];
    if (list[index].capabilities) {
      list[index].capabilities![capIdx] = { ...list[index].capabilities![capIdx], ...fields };
      setSections(list);
    }
  };

  const addCapabilityItem = (index: number) => {
    const list = [...sections];
    if (list[index].capabilities) {
      list[index].capabilities!.push({ title: '新核心能力', description: '', imageUrl: '' });
      setSections(list);
    }
  };

  const removeCapabilityItem = (index: number, capIdx: number) => {
    const list = [...sections];
    if (list[index].capabilities) {
      list[index].capabilities!.splice(capIdx, 1);
      setSections(list);
    }
  };

  const updateScenarios = (index: number, title: string) => {
    const list = [...sections];
    if (list[index].scenarios) {
      list[index].scenarios!.title = title;
      setSections(list);
    }
  };

  const updateScenarioItem = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['scenarios']>['items'][0]>) => {
    const list = [...sections];
    if (list[index].scenarios) {
      list[index].scenarios!.items[itemIdx] = { ...list[index].scenarios!.items[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addScenarioItem = (index: number) => {
    const list = [...sections];
    if (list[index].scenarios) {
      list[index].scenarios!.items.push({ title: '新应用场景', imageUrl: '', description: '' });
      setSections(list);
    }
  };

  const removeScenarioItem = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].scenarios) {
      list[index].scenarios!.items.splice(itemIdx, 1);
      setSections(list);
    }
  };

  const updateArchitecture = (index: number, fields: Partial<NonNullable<PageSection['architecture']>>) => {
    const list = [...sections];
    if (list[index].architecture) {
      list[index].architecture = { ...list[index].architecture!, ...fields };
      setSections(list);
    }
  };

  const updateCta = (index: number, fields: Partial<NonNullable<PageSection['cta']>>) => {
    const list = [...sections];
    if (list[index].cta) {
      list[index].cta = { ...list[index].cta!, ...fields };
      setSections(list);
    }
  };

  const updateVideo = (index: number, fields: Partial<NonNullable<PageSection['video']>>) => {
    const list = [...sections];
    if (list[index].video) {
      list[index].video = { ...list[index].video!, ...fields };
      setSections(list);
    }
  };

  // Mutators for timeline
  const updateTimeline = (index: number, fields: Partial<NonNullable<PageSection['timeline']>>) => {
    const list = [...sections];
    if (list[index].timeline) {
      list[index].timeline = { ...list[index].timeline!, ...fields };
      setSections(list);
    }
  };

  const updateTimelineStep = (index: number, stepIdx: number, fields: Partial<NonNullable<PageSection['timeline']>['steps'][0]>) => {
    const list = [...sections];
    if (list[index].timeline) {
      list[index].timeline!.steps[stepIdx] = { ...list[index].timeline!.steps[stepIdx], ...fields };
      setSections(list);
    }
  };

  const addTimelineStep = (index: number) => {
    const list = [...sections];
    if (list[index].timeline) {
      list[index].timeline!.steps.push({ title: '新步骤节点', description: '', duration: '' });
      setSections(list);
    }
  };

  const removeTimelineStep = (index: number, stepIdx: number) => {
    const list = [...sections];
    if (list[index].timeline) {
      list[index].timeline!.steps.splice(stepIdx, 1);
      setSections(list);
    }
  };

  // Mutators for features
  const updateFeatures = (index: number, fields: Partial<NonNullable<PageSection['features']>>) => {
    const list = [...sections];
    if (list[index].features) {
      list[index].features = { ...list[index].features!, ...fields };
      setSections(list);
    }
  };

  const updateFeaturesItem = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['features']>['items'][0]>) => {
    const list = [...sections];
    if (list[index].features) {
      list[index].features!.items[itemIdx] = { ...list[index].features!.items[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addFeaturesItem = (index: number) => {
    const list = [...sections];
    if (list[index].features) {
      list[index].features!.items.push({ title: '新特性说明', description: '', highlightText: '' });
      setSections(list);
    }
  };

  const removeFeaturesItem = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].features) {
      list[index].features!.items.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for faq
  const updateFaq = (index: number, fields: Partial<NonNullable<PageSection['faq']>>) => {
    const list = [...sections];
    if (list[index].faq) {
      list[index].faq = { ...list[index].faq!, ...fields };
      setSections(list);
    }
  };

  const updateFaqItem = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['faq']>['items'][0]>) => {
    const list = [...sections];
    if (list[index].faq) {
      list[index].faq!.items[itemIdx] = { ...list[index].faq!.items[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addFaqItem = (index: number) => {
    const list = [...sections];
    if (list[index].faq) {
      list[index].faq!.items.push({ question: '新问题？', answer: '新答案说明。' });
      setSections(list);
    }
  };

  const removeFaqItem = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].faq) {
      list[index].faq!.items.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for comparison
  const updateComparison = (index: number, fields: Partial<NonNullable<PageSection['comparison']>>) => {
    const list = [...sections];
    if (list[index].comparison) {
      list[index].comparison = { ...list[index].comparison!, ...fields };
      setSections(list);
    }
  };

  const updateComparisonRow = (index: number, rowIdx: number, fields: Partial<NonNullable<PageSection['comparison']>['rows'][0]>) => {
    const list = [...sections];
    if (list[index].comparison) {
      list[index].comparison!.rows[rowIdx] = { ...list[index].comparison!.rows[rowIdx], ...fields };
      setSections(list);
    }
  };

  const addComparisonRow = (index: number) => {
    const list = [...sections];
    if (list[index].comparison) {
      const colCount = list[index].comparison!.headers.length;
      const values = Array(colCount - 1).fill('对比详情描述');
      list[index].comparison!.rows.push({ label: '新对比维度', values, highlightIndex: colCount - 1 });
      setSections(list);
    }
  };

  const removeComparisonRow = (index: number, rowIdx: number) => {
    const list = [...sections];
    if (list[index].comparison) {
      list[index].comparison!.rows.splice(rowIdx, 1);
      setSections(list);
    }
  };

  const updateComparisonHeader = (index: number, headerIdx: number, val: string) => {
    const list = [...sections];
    if (list[index].comparison) {
      list[index].comparison!.headers[headerIdx] = val;
      setSections(list);
    }
  };

  const addComparisonColumn = (index: number) => {
    const list = [...sections];
    if (list[index].comparison) {
      list[index].comparison!.headers.push('新对比项');
      list[index].comparison!.rows = list[index].comparison!.rows.map(row => ({
        ...row,
        values: [...row.values, '对比项说明']
      }));
      setSections(list);
    }
  };

  const removeComparisonColumn = (index: number, colIdx: number) => {
    const list = [...sections];
    if (list[index].comparison && list[index].comparison!.headers.length > 2) {
      list[index].comparison!.headers.splice(colIdx, 1);
      list[index].comparison!.rows = list[index].comparison!.rows.map(row => {
        const newValues = [...row.values];
        newValues.splice(colIdx - 1, 1);
        return {
          ...row,
          values: newValues,
          highlightIndex: row.highlightIndex === colIdx ? undefined : (row.highlightIndex && row.highlightIndex > colIdx ? row.highlightIndex - 1 : row.highlightIndex)
        };
      });
      setSections(list);
    }
  };

  // Mutators for testimonials
  const updateTestimonials = (index: number, fields: Partial<NonNullable<PageSection['testimonials']>>) => {
    const list = [...sections];
    if (list[index].testimonials) {
      list[index].testimonials = { ...list[index].testimonials!, ...fields };
      setSections(list);
    }
  };

  const updateTestimonialItem = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['testimonials']>['items'][0]>) => {
    const list = [...sections];
    if (list[index].testimonials) {
      list[index].testimonials!.items[itemIdx] = { ...list[index].testimonials!.items[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addTestimonialItem = (index: number) => {
    const list = [...sections];
    if (list[index].testimonials) {
      list[index].testimonials!.items.push({ quote: '新客户评语描述内容。', author: '新客户姓名', role: '经理', company: '新合作公司' });
      setSections(list);
    }
  };

  const removeTestimonialItem = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].testimonials) {
      list[index].testimonials!.items.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for metrics
  const updateMetrics = (index: number, fields: Partial<NonNullable<PageSection['metrics']>>) => {
    const list = [...sections];
    if (list[index].metrics) {
      list[index].metrics = { ...list[index].metrics!, ...fields };
      setSections(list);
    }
  };

  const updateMetricItem = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['metrics']>['items'][0]>) => {
    const list = [...sections];
    if (list[index].metrics) {
      list[index].metrics!.items[itemIdx] = { ...list[index].metrics!.items[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addMetricItem = (index: number) => {
    const list = [...sections];
    if (list[index].metrics) {
      list[index].metrics!.items.push({ value: '80%', label: '新指标提升', description: '数据说明描述。' });
      setSections(list);
    }
  };

  const removeMetricItem = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].metrics) {
      list[index].metrics!.items.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for canvas
  const updateCanvas = (index: number, fields: Partial<NonNullable<PageSection['canvas']>>) => {
    const list = [...sections];
    if (list[index].canvas) {
      list[index].canvas = { ...list[index].canvas!, ...fields };
      setSections(list);
    }
  };

  const updateCanvasFeature = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['canvas']>['features'][0]>) => {
    const list = [...sections];
    if (list[index].canvas) {
      list[index].canvas!.features[itemIdx] = { ...list[index].canvas!.features[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addCanvasFeature = (index: number) => {
    const list = [...sections];
    if (list[index].canvas) {
      list[index].canvas!.features.push({ title: '新特性亮点', description: '特性的详细作用与表现' });
      setSections(list);
    }
  };

  const removeCanvasFeature = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].canvas) {
      list[index].canvas!.features.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for richText
  const updateRichText = (index: number, fields: Partial<NonNullable<PageSection['richText']>>) => {
    const list = [...sections];
    if (list[index].richText) {
      list[index].richText = { ...list[index].richText!, ...fields };
      setSections(list);
    }
  };

  // Mutators for partners
  const updatePartners = (index: number, fields: Partial<NonNullable<PageSection['partners']>>) => {
    const list = [...sections];
    if (list[index].partners) {
      list[index].partners = { ...list[index].partners!, ...fields };
      setSections(list);
    }
  };

  const updatePartnerItem = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['partners']>['items'][0]>) => {
    const list = [...sections];
    if (list[index].partners) {
      list[index].partners!.items[itemIdx] = { ...list[index].partners!.items[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addPartnerItem = (index: number) => {
    const list = [...sections];
    if (list[index].partners) {
      list[index].partners!.items.push({ name: '新合作伙伴', logoUrl: '' });
      setSections(list);
    }
  };

  const removePartnerItem = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].partners) {
      list[index].partners!.items.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for carousel
  const updateCarousel = (index: number, fields: Partial<NonNullable<PageSection['carousel']>>) => {
    const list = [...sections];
    if (list[index].carousel) {
      list[index].carousel = { ...list[index].carousel!, ...fields };
      setSections(list);
    }
  };

  const updateCarouselItem = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['carousel']>['items'][0]>) => {
    const list = [...sections];
    if (list[index].carousel) {
      list[index].carousel!.items[itemIdx] = { ...list[index].carousel!.items[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addCarouselItem = (index: number) => {
    const list = [...sections];
    if (list[index].carousel) {
      list[index].carousel!.items.push({ imageUrl: '', caption: '新演示图片', description: '图片的相关说明与内容' });
      setSections(list);
    }
  };

  const removeCarouselItem = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].carousel) {
      list[index].carousel!.items.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for downloads
  const updateDownloads = (index: number, fields: Partial<NonNullable<PageSection['downloads']>>) => {
    const list = [...sections];
    if (list[index].downloads) {
      list[index].downloads = { ...list[index].downloads!, ...fields };
      setSections(list);
    }
  };

  const updateDownloadItem = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['downloads']>['items'][0]>) => {
    const list = [...sections];
    if (list[index].downloads) {
      list[index].downloads!.items[itemIdx] = { ...list[index].downloads!.items[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addDownloadItem = (index: number) => {
    const list = [...sections];
    if (list[index].downloads) {
      list[index].downloads!.items.push({ title: '新产品资料包.pdf', fileSize: '2.5 MB', fileUrl: '', fileType: 'PDF' });
      setSections(list);
    }
  };

  const removeDownloadItem = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].downloads) {
      list[index].downloads!.items.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for certificates
  const updateCertificates = (index: number, fields: Partial<NonNullable<PageSection['certificates']>>) => {
    const list = [...sections];
    if (list[index].certificates) {
      list[index].certificates = { ...list[index].certificates!, ...fields };
      setSections(list);
    }
  };

  const updateCertificateItem = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['certificates']>['items'][0]>) => {
    const list = [...sections];
    if (list[index].certificates) {
      list[index].certificates!.items[itemIdx] = { ...list[index].certificates!.items[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addCertificateItem = (index: number) => {
    const list = [...sections];
    if (list[index].certificates) {
      list[index].certificates!.items.push({ name: '新资质荣誉证书', imageUrl: '', issuingBody: '相关认证中心' });
      setSections(list);
    }
  };

  const removeCertificateItem = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].certificates) {
      list[index].certificates!.items.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for coverage
  const updateCoverage = (index: number, fields: Partial<NonNullable<PageSection['coverage']>>) => {
    const list = [...sections];
    if (list[index].coverage) {
      list[index].coverage = { ...list[index].coverage!, ...fields };
      setSections(list);
    }
  };

  const updateCoverageItem = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['coverage']>['items'][0]>) => {
    const list = [...sections];
    if (list[index].coverage) {
      list[index].coverage!.items[itemIdx] = { ...list[index].coverage!.items[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addCoverageItem = (index: number) => {
    const list = [...sections];
    if (list[index].coverage) {
      list[index].coverage!.items.push({ region: '新服务网点', address: '', phone: '', email: '' });
      setSections(list);
    }
  };

  const removeCoverageItem = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].coverage) {
      list[index].coverage!.items.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for consultation
  const updateConsultation = (index: number, fields: Partial<NonNullable<PageSection['consultation']>>) => {
    const list = [...sections];
    if (list[index].consultation) {
      list[index].consultation = { ...list[index].consultation!, ...fields };
      setSections(list);
    }
  };

  const updateConsultationBenefit = (index: number, itemIdx: number, val: string) => {
    const list = [...sections];
    if (list[index].consultation) {
      list[index].consultation!.benefits[itemIdx] = val;
      setSections(list);
    }
  };

  const addConsultationBenefit = (index: number) => {
    const list = [...sections];
    if (list[index].consultation) {
      list[index].consultation!.benefits.push('新定制咨询服务承诺');
      setSections(list);
    }
  };

  const removeConsultationBenefit = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].consultation) {
      list[index].consultation!.benefits.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for multiDevice
  const updateMultiDevice = (index: number, fields: Partial<NonNullable<PageSection['multiDevice']>>) => {
    const list = [...sections];
    if (list[index].multiDevice) {
      list[index].multiDevice = { ...list[index].multiDevice!, ...fields };
      setSections(list);
    }
  };

  const updateMultiDeviceFeature = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['multiDevice']>['features'][0]>) => {
    const list = [...sections];
    if (list[index].multiDevice) {
      list[index].multiDevice!.features[itemIdx] = { ...list[index].multiDevice!.features[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addMultiDeviceFeature = (index: number) => {
    const list = [...sections];
    if (list[index].multiDevice) {
      list[index].multiDevice!.features.push({ title: '新适配端特性', desc: '特性的详细描述' });
      setSections(list);
    }
  };

  const removeMultiDeviceFeature = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].multiDevice) {
      list[index].multiDevice!.features.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for hardwareSpec
  const updateHardwareSpec = (index: number, fields: Partial<NonNullable<PageSection['hardwareSpec']>>) => {
    const list = [...sections];
    if (list[index].hardwareSpec) {
      list[index].hardwareSpec = { ...list[index].hardwareSpec!, ...fields };
      setSections(list);
    }
  };

  const updateHardwareSpecAnnotation = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['hardwareSpec']>['annotations'][0]>) => {
    const list = [...sections];
    if (list[index].hardwareSpec) {
      list[index].hardwareSpec!.annotations[itemIdx] = { ...list[index].hardwareSpec!.annotations[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addHardwareSpecAnnotation = (index: number) => {
    const list = [...sections];
    if (list[index].hardwareSpec) {
      list[index].hardwareSpec!.annotations.push({ x: 50, y: 50, title: '新架构热点', desc: '热区参数的详细工艺介绍说明' });
      setSections(list);
    }
  };

  const removeHardwareSpecAnnotation = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].hardwareSpec) {
      list[index].hardwareSpec!.annotations.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for techStack
  const updateTechStack = (index: number, fields: Partial<NonNullable<PageSection['techStack']>>) => {
    const list = [...sections];
    if (list[index].techStack) {
      list[index].techStack = { ...list[index].techStack!, ...fields };
      setSections(list);
    }
  };

  const updateTechStackItem = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['techStack']>['items'][0]>) => {
    const list = [...sections];
    if (list[index].techStack) {
      list[index].techStack!.items[itemIdx] = { ...list[index].techStack!.items[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addTechStackItem = (index: number) => {
    const list = [...sections];
    if (list[index].techStack) {
      list[index].techStack!.items.push({ name: '新支持技术/语言', logoUrl: '', status: 'Certified', version: 'v1.0' });
      setSections(list);
    }
  };

  const removeTechStackItem = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].techStack) {
      list[index].techStack!.items.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for sandbox
  const updateSandbox = (index: number, fields: Partial<NonNullable<PageSection['sandbox']>>) => {
    const list = [...sections];
    if (list[index].sandbox) {
      list[index].sandbox = { ...list[index].sandbox!, ...fields };
      setSections(list);
    }
  };

  const updateSandboxTab = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['sandbox']>['tabs'][0]>) => {
    const list = [...sections];
    if (list[index].sandbox) {
      list[index].sandbox!.tabs[itemIdx] = { ...list[index].sandbox!.tabs[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addSandboxTab = (index: number) => {
    const list = [...sections];
    if (list[index].sandbox) {
      list[index].sandbox!.tabs.push({ label: '新语言 SDK', language: 'javascript', code: '// 示例代码', description: '代码块调用说明' });
      setSections(list);
    }
  };

  const removeSandboxTab = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].sandbox) {
      list[index].sandbox!.tabs.splice(itemIdx, 1);
      setSections(list);
    }
  };

  // Mutators for signalWave
  const updateSignalWave = (index: number, fields: Partial<NonNullable<PageSection['signalWave']>>) => {
    const list = [...sections];
    if (list[index].signalWave) {
      list[index].signalWave = { ...list[index].signalWave!, ...fields };
      setSections(list);
    }
  };

  // Mutators for bentoGrid
  const updateBentoGrid = (index: number, fields: Partial<NonNullable<PageSection['bentoGrid']>>) => {
    const list = [...sections];
    if (list[index].bentoGrid) {
      list[index].bentoGrid = { ...list[index].bentoGrid!, ...fields };
      setSections(list);
    }
  };

  const updateBentoGridItem = (index: number, itemIdx: number, fields: Partial<NonNullable<PageSection['bentoGrid']>['items'][0]>) => {
    const list = [...sections];
    if (list[index].bentoGrid) {
      list[index].bentoGrid!.items[itemIdx] = { ...list[index].bentoGrid!.items[itemIdx], ...fields };
      setSections(list);
    }
  };

  const addBentoGridItem = (index: number) => {
    const list = [...sections];
    if (list[index].bentoGrid) {
      list[index].bentoGrid!.items.push({ size: 'small', title: '新特性小卡片', subtitle: '卡片特性简介。', imageUrl: '', colorBg: 'bg-white text-slate-800' });
      setSections(list);
    }
  };

  const removeBentoGridItem = (index: number, itemIdx: number) => {
    const list = [...sections];
    if (list[index].bentoGrid) {
      list[index].bentoGrid!.items.splice(itemIdx, 1);
      setSections(list);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-500">拉取设计排版面板中...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <p className="text-sm font-bold text-rose-500">产品文件损坏或路由参数错误</p>
        <button onClick={() => router.push('/admin/products')} className="text-xs text-blue-600 flex items-center gap-1 font-bold">
          <ArrowLeft className="w-4 h-4" /> 返回产品中心
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 animate-fade-in">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-6 right-8 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2.5 transition-all duration-300 animate-bounce-in ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Header Controls */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/products')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-slate-800"
            title="返回产品管理"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100 uppercase">
                模块设计器
              </span>
              <h1 className="text-base font-black text-slate-800 tracking-tight">{product.title}</h1>
            </div>
            <p className="text-xs text-slate-400">选择、拖动与修改各种小模版积木，实时装配前台详情页面</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSections([])}
            className="flex items-center gap-1 px-4 py-2 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
          >
            <Undo className="w-4 h-4" />
            <span>清空重置</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{saving ? '保存并刷新静态路由...' : '保存排版设计'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Modular Blocks Compiler */}
        <div className="w-[45%] border-r border-slate-200 bg-white overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100 text-left">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>排版模块序列 ({sections.length})</span>
            </h2>

            {sections.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-3 bg-slate-50/50">
                <FileCode className="w-10 h-10 text-slate-300 animate-pulse" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500">页面暂无区块内容</p>
                  <p className="text-[10px] text-slate-400">目前处于“降级兼容模式”：将渲染前台默认的静态模板。</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {sections.map((sec, idx) => {
                  const isExpanded = expandedId === sec.id;
                  return (
                    <div
                      key={sec.id}
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                        isExpanded ? 'border-blue-500 shadow-md shadow-blue-500/5' : 'border-slate-200/80'
                      }`}
                    >
                      {/* Section Card Header */}
                      <div className={`px-4 py-3 flex items-center justify-between select-none cursor-pointer ${
                        isExpanded ? 'bg-blue-50/20' : 'bg-slate-50/50'
                      }`}
                        onClick={() => setExpandedId(isExpanded ? null : sec.id)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {sec.type === 'hero' && '巨幕模块 (Hero)'}
                            {sec.type === 'capabilities' && '核心能力交替 (Capabilities)'}
                            {sec.type === 'scenarios' && '应用场景网格 (Scenarios)'}
                            {sec.type === 'architecture' && '产品架构图 (Architecture)'}
                            {sec.type === 'cta' && '引导转换横幅 (CTA)'}
                            {sec.type === 'video' && '产品与案例视频演示 (Video)'}
                            {sec.type === 'timeline' && '服务实施流程 (Timeline)'}
                            {sec.type === 'features' && '特性功能矩阵 (Features)'}
                            {sec.type === 'faq' && '常见问题解答 (FAQ)'}
                            {sec.type === 'comparison' && '产品方案对比 (Comparison)'}
                            {sec.type === 'testimonials' && '客户评价见证 (Testimonials)'}
                            {sec.type === 'metrics' && '核心成效指标 (Metrics)'}
                            {sec.type === 'canvas' && '产品工作画布 (Canvas)'}
                            {sec.type === 'richText' && '图文合规叙事 (Rich Text)'}
                            {sec.type === 'partners' && '合作伙伴墙 (Partners)'}
                            {sec.type === 'carousel' && '多图轮播幻灯 (Carousel)'}
                            {sec.type === 'downloads' && '资料资源下载 (Downloads)'}
                            {sec.type === 'certificates' && '荣誉合规资质 (Certificates)'}
                            {sec.type === 'coverage' && '分支服务网络 (Coverage)'}
                            {sec.type === 'consultation' && '定制方案咨询 (Consultation)'}
                            {sec.type === 'multiDevice' && '多端协同自适应 (Multi Device)'}
                            {sec.type === 'hardwareSpec' && '核心架构拆解热区 (Hardware Spec)'}
                            {sec.type === 'techStack' && '原生技术栈兼容生态 (Tech Stack)'}
                            {sec.type === 'sandbox' && '代码调用交互沙盒 (Sandbox)'}
                            {sec.type === 'signalWave' && '信号时延对比器 (Signal Wave)'}
                            {sec.type === 'bentoGrid' && 'Apple风格Bento特性栅格 (Bento Grid)'}
                          </span>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            disabled={idx === 0}
                            onClick={() => moveUp(idx)}
                            className="p-1 hover:bg-slate-200 rounded-md text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={idx === sections.length - 1}
                            onClick={() => moveDown(idx)}
                            className="p-1 hover:bg-slate-200 rounded-md text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeSection(idx)}
                            className="p-1 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="删除区块"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Section Card Form */}
                      {isExpanded && (
                        <div className="p-4 border-t border-slate-200/60 bg-white space-y-4 text-sm text-left">
                          {/* 1. HERO BLOCK */}
                          {sec.type === 'hero' && sec.hero && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">主标题</label>
                                <input
                                  type="text"
                                  value={sec.hero.title}
                                  onChange={(e) => updateHero(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题 / 描述</label>
                                <input
                                  type="text"
                                  value={sec.hero.subtitle}
                                  onChange={(e) => updateHero(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">背景图 URL</label>
                                <ImageUpload
                                  label="上传背景图"
                                  value={sec.hero.bgUrl}
                                  onChange={(url) => updateHero(idx, { bgUrl: url })}
                                  folder={`products/${product.id}`}
                                />
                              </div>
                            </div>
                          )}

                          {/* 2. CAPABILITIES BLOCK */}
                          {sec.type === 'capabilities' && sec.capabilities && (
                            <div className="space-y-4">
                              {sec.capabilities.map((cap, capIdx) => (
                                <div key={capIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-3 relative text-left">
                                  <button
                                    onClick={() => removeCapabilityItem(idx, capIdx)}
                                    className="absolute top-2 right-2 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                    title="删除此项"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                  <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                    能力项 {capIdx + 1}
                                  </span>
                                  <div>
                                    <label className="block font-semibold text-slate-700 mb-1">标题</label>
                                    <input
                                      type="text"
                                      value={cap.title}
                                      onChange={(e) => updateCapabilities(idx, capIdx, { title: e.target.value })}
                                      className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="block font-semibold text-slate-700 mb-1">描述文本</label>
                                    <textarea
                                      value={cap.description}
                                      onChange={(e) => updateCapabilities(idx, capIdx, { description: e.target.value })}
                                      rows={2}
                                      className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm resize-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block font-semibold text-slate-700 mb-1">展示配图</label>
                                    <ImageUpload
                                      label="上传图片"
                                      value={cap.imageUrl}
                                      onChange={(url) => updateCapabilities(idx, capIdx, { imageUrl: url })}
                                      folder={`products/${product.id}`}
                                    />
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={() => addCapabilityItem(idx)}
                                className="w-full py-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer"
                              >
                                + 新增能力特性项
                              </button>
                            </div>
                          )}

                          {/* 3. SCENARIOS GRID BLOCK */}
                          {sec.type === 'scenarios' && sec.scenarios && (
                            <div className="space-y-4">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">模块全局大标题</label>
                                <input
                                  type="text"
                                  value={sec.scenarios.title}
                                  onChange={(e) => updateScenarios(idx, e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3.5">
                                {sec.scenarios.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-3 relative text-left">
                                    <button
                                      onClick={() => removeScenarioItem(idx, itemIdx)}
                                      className="absolute top-2 right-2 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除场景"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      应用场景项 {itemIdx + 1}
                                    </span>
                                    <div>
                                      <label className="block font-semibold text-slate-700 mb-1">场景名称</label>
                                      <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => updateScenarioItem(idx, itemIdx, { title: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block font-semibold text-slate-700 mb-1">简要介绍</label>
                                      <input
                                        type="text"
                                        value={item.description || ''}
                                        onChange={(e) => updateScenarioItem(idx, itemIdx, { description: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block font-semibold text-slate-700 mb-1">场景图片</label>
                                      <ImageUpload
                                        label="上传图片"
                                        value={item.imageUrl}
                                        onChange={(url) => updateScenarioItem(idx, itemIdx, { imageUrl: url })}
                                        folder={`products/${product.id}`}
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addScenarioItem(idx)}
                                  className="w-full py-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-655 hover:bg-slate-100 cursor-pointer"
                                >
                                  + 新增落地场景卡片
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 4. ARCHITECTURE BLOCK */}
                          {sec.type === 'architecture' && sec.architecture && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">架构图标题</label>
                                <input
                                  type="text"
                                  value={sec.architecture.title}
                                  onChange={(e) => updateArchitecture(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">架构大图 URL</label>
                                <ImageUpload
                                  label="上传大图"
                                  value={sec.architecture.imageUrl}
                                  onChange={(url) => updateArchitecture(idx, { imageUrl: url })}
                                  folder={`products/${product.id}`}
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">下方图注与架构说明</label>
                                <textarea
                                  value={sec.architecture.description || ''}
                                  onChange={(e) => updateArchitecture(idx, { description: e.target.value })}
                                  rows={3}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none"
                                />
                              </div>
                            </div>
                          )}

                          {/* 5. CTA BLOCK */}
                          {sec.type === 'cta' && sec.cta && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">召集口号标题</label>
                                <input
                                  type="text"
                                  value={sec.cta.title}
                                  onChange={(e) => updateCta(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">详细副文本说明</label>
                                <input
                                  type="text"
                                  value={sec.cta.description}
                                  onChange={(e) => updateCta(idx, { description: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block font-semibold text-slate-700 mb-1">主按钮文字</label>
                                  <input
                                    type="text"
                                    value={sec.cta.primaryText}
                                    onChange={(e) => updateCta(idx, { primaryText: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block font-semibold text-slate-700 mb-1">次按钮文字</label>
                                  <input
                                    type="text"
                                    value={sec.cta.secondaryText}
                                    onChange={(e) => updateCta(idx, { secondaryText: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 6. VIDEO CASE BLOCK */}
                          {sec.type === 'video' && sec.video && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">视频区域大标题</label>
                                <input
                                  type="text"
                                  value={sec.video.title}
                                  onChange={(e) => updateVideo(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.video.subtitle || ''}
                                  onChange={(e) => updateVideo(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <VideoUpload
                                  label="视频源文件"
                                  value={sec.video.videoUrl}
                                  onChange={(url) => updateVideo(idx, { videoUrl: url })}
                                  folder={`products/${product.id}`}
                                />
                              </div>
                            </div>
                          )}

                          {/* 7. TIMELINE BLOCK */}
                          {sec.type === 'timeline' && sec.timeline && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">实施流程大标题</label>
                                <input
                                  type="text"
                                  value={sec.timeline.title}
                                  onChange={(e) => updateTimeline(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.timeline.subtitle || ''}
                                  onChange={(e) => updateTimeline(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3.5 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">流程节点配置</label>
                                {sec.timeline.steps.map((step, stepIdx) => (
                                  <div key={stepIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-3 relative text-left">
                                    <button
                                      onClick={() => removeTimelineStep(idx, stepIdx)}
                                      className="absolute top-2 right-2 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除步骤"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      节点 {stepIdx + 1}
                                    </span>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block font-semibold text-slate-700 mb-1">时间/期段 (可选)</label>
                                        <input
                                          type="text"
                                          value={step.duration || ''}
                                          onChange={(e) => updateTimelineStep(idx, stepIdx, { duration: e.target.value })}
                                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="block font-semibold text-slate-700 mb-1">节点名称</label>
                                        <input
                                          type="text"
                                          value={step.title}
                                          onChange={(e) => updateTimelineStep(idx, stepIdx, { title: e.target.value })}
                                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block font-semibold text-slate-700 mb-1">节点详细描述</label>
                                      <textarea
                                        value={step.description}
                                        onChange={(e) => updateTimelineStep(idx, stepIdx, { description: e.target.value })}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm resize-none"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addTimelineStep(idx)}
                                  className="w-full py-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增流程节点
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 8. FEATURES BLOCK */}
                          {sec.type === 'features' && sec.features && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">特性矩阵大标题</label>
                                <input
                                  type="text"
                                  value={sec.features.title}
                                  onChange={(e) => updateFeatures(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.features.subtitle || ''}
                                  onChange={(e) => updateFeatures(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3.5 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">特性项卡片配置</label>
                                {sec.features.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-3 relative text-left">
                                    <button
                                      onClick={() => removeFeaturesItem(idx, itemIdx)}
                                      className="absolute top-2 right-2 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除特性"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      特性 {itemIdx + 1}
                                    </span>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block font-semibold text-slate-700 mb-1">特性名称</label>
                                        <input
                                          type="text"
                                          value={item.title}
                                          onChange={(e) => updateFeaturesItem(idx, itemIdx, { title: e.target.value })}
                                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="block font-semibold text-slate-700 mb-1">高亮标签 (可选)</label>
                                        <input
                                          type="text"
                                          value={item.highlightText || ''}
                                          onChange={(e) => updateFeaturesItem(idx, itemIdx, { highlightText: e.target.value })}
                                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm"
                                          placeholder="例如：核心、推荐"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block font-semibold text-slate-700 mb-1">详细描述</label>
                                      <textarea
                                        value={item.description}
                                        onChange={(e) => updateFeaturesItem(idx, itemIdx, { description: e.target.value })}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm resize-none"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addFeaturesItem(idx)}
                                  className="w-full py-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增特性卡片
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 9. FAQ BLOCK */}
                          {sec.type === 'faq' && sec.faq && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">FAQ 答疑区标题</label>
                                <input
                                  type="text"
                                  value={sec.faq.title}
                                  onChange={(e) => updateFaq(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.faq.subtitle || ''}
                                  onChange={(e) => updateFaq(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3.5 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">问答对配置</label>
                                {sec.faq.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-3 relative text-left">
                                    <button
                                      onClick={() => removeFaqItem(idx, itemIdx)}
                                      className="absolute top-2 right-2 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除问答"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      问答项 {itemIdx + 1}
                                    </span>
                                    <div>
                                      <label className="block font-semibold text-slate-700 mb-1">客户疑问 (Question)</label>
                                      <input
                                        type="text"
                                        value={item.question}
                                        onChange={(e) => updateFaqItem(idx, itemIdx, { question: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block font-semibold text-slate-700 mb-1">官方解答 (Answer)</label>
                                      <textarea
                                        value={item.answer}
                                        onChange={(e) => updateFaqItem(idx, itemIdx, { answer: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm resize-none"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addFaqItem(idx)}
                                  className="w-full py-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增 FAQ 问答
                                </button>
                              </div>
                            </div>
                          )}
                          {/* 10. COMPARISON BLOCK */}
                          {sec.type === 'comparison' && sec.comparison && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">对比表大标题</label>
                                <input
                                  type="text"
                                  value={sec.comparison.title}
                                  onChange={(e) => updateComparison(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.comparison.subtitle || ''}
                                  onChange={(e) => updateComparison(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-2 border-t border-slate-100 pt-3">
                                <div className="flex justify-between items-center">
                                  <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">列头配置 (Headers)</label>
                                  <button
                                    onClick={() => addComparisonColumn(idx)}
                                    className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                                  >
                                    + 添加对比列
                                  </button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  {sec.comparison.headers.map((hdr, hdrIdx) => (
                                    <div key={hdrIdx} className="relative flex items-center">
                                      <input
                                        type="text"
                                        value={hdr}
                                        onChange={(e) => updateComparisonHeader(idx, hdrIdx, e.target.value)}
                                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs bg-slate-50 font-bold"
                                        placeholder={`列 ${hdrIdx + 1}`}
                                      />
                                      {hdrIdx > 1 && (
                                        <button
                                          onClick={() => removeComparisonColumn(idx, hdrIdx)}
                                          className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] cursor-pointer"
                                          title="删除列"
                                        >
                                          ×
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-3 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">对比行维度配置 (Rows)</label>
                                {sec.comparison.rows.map((row, rowIdx) => (
                                  <div key={rowIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-2 relative text-left">
                                    <button
                                      onClick={() => removeComparisonRow(idx, rowIdx)}
                                      className="absolute top-1.5 right-1.5 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除维度"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-550 block mb-0.5">对比维度名 (如：安全保障)</label>
                                      <input
                                        type="text"
                                        value={row.label}
                                        onChange={(e) => updateComparisonRow(idx, rowIdx, { label: e.target.value })}
                                        className="w-[80%] px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-bold text-slate-550 block">各列数值描述</label>
                                      {row.values.map((val, valIdx) => (
                                        <div key={valIdx} className="flex items-center gap-1.5">
                                          <span className="text-[9px] font-mono text-slate-400 w-12 truncate">{sec.comparison!.headers[valIdx + 1] || `列 ${valIdx + 2}`}</span>
                                          <input
                                            type="text"
                                            value={val}
                                            onChange={(e) => {
                                              const newVals = [...row.values];
                                              newVals[valIdx] = e.target.value;
                                              updateComparisonRow(idx, rowIdx, { values: newVals });
                                            }}
                                            className="flex-1 px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <label className="text-[10px] font-bold text-slate-550">高亮列:</label>
                                      <select
                                        value={row.highlightIndex !== undefined ? row.highlightIndex : -1}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value);
                                          updateComparisonRow(idx, rowIdx, { highlightIndex: val === -1 ? undefined : val });
                                        }}
                                        className="text-xs border rounded bg-white px-1.5 py-0.5"
                                      >
                                        <option value={-1}>不突出显示</option>
                                        {sec.comparison!.headers.map((hdr, hIdx) => (
                                          hIdx > 0 && <option key={hIdx} value={hIdx}>{hdr}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addComparisonRow(idx)}
                                  className="w-full py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增对比行维度
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 11. TESTIMONIALS BLOCK */}
                          {sec.type === 'testimonials' && sec.testimonials && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">见证模块大标题</label>
                                <input
                                  type="text"
                                  value={sec.testimonials.title}
                                  onChange={(e) => updateTestimonials(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">描述副标题</label>
                                <input
                                  type="text"
                                  value={sec.testimonials.subtitle || ''}
                                  onChange={(e) => updateTestimonials(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3.5 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">客户评语卡片配置</label>
                                {sec.testimonials.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-3 relative text-left">
                                    <button
                                      onClick={() => removeTestimonialItem(idx, itemIdx)}
                                      className="absolute top-2 right-2 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除评语"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      卡片 {itemIdx + 1}
                                    </span>
                                    <div>
                                      <label className="block font-semibold text-slate-700 mb-1">客户见证评语</label>
                                      <textarea
                                        value={item.quote}
                                        onChange={(e) => updateTestimonialItem(idx, itemIdx, { quote: e.target.value })}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm resize-none"
                                      />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div>
                                        <label className="block font-semibold text-slate-750 text-[10px] mb-0.5">评价人</label>
                                        <input
                                          type="text"
                                          value={item.author}
                                          onChange={(e) => updateTestimonialItem(idx, itemIdx, { author: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="block font-semibold text-slate-750 text-[10px] mb-0.5">职位</label>
                                        <input
                                          type="text"
                                          value={item.role}
                                          onChange={(e) => updateTestimonialItem(idx, itemIdx, { role: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="block font-semibold text-slate-750 text-[10px] mb-0.5">所属公司</label>
                                        <input
                                          type="text"
                                          value={item.company}
                                          onChange={(e) => updateTestimonialItem(idx, itemIdx, { company: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="block font-semibold text-slate-750 text-[10px] mb-0.5">头像图片 URL</label>
                                        <ImageUpload
                                          label="头像"
                                          value={item.avatarUrl || ''}
                                          onChange={(url) => updateTestimonialItem(idx, itemIdx, { avatarUrl: url })}
                                          folder={`products/${product.id}`}
                                        />
                                      </div>
                                      <div>
                                        <label className="block font-semibold text-slate-750 text-[10px] mb-0.5">公司徽标 URL</label>
                                        <ImageUpload
                                          label="Logo"
                                          value={item.logoUrl || ''}
                                          onChange={(url) => updateTestimonialItem(idx, itemIdx, { logoUrl: url })}
                                          folder={`products/${product.id}`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addTestimonialItem(idx)}
                                  className="w-full py-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增客户评语
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 12. METRICS BLOCK */}
                          {sec.type === 'metrics' && sec.metrics && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">指标模块大标题</label>
                                <input
                                  type="text"
                                  value={sec.metrics.title}
                                  onChange={(e) => updateMetrics(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.metrics.subtitle || ''}
                                  onChange={(e) => updateMetrics(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3.5 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">指标卡片配置</label>
                                {sec.metrics.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-3 relative text-left">
                                    <button
                                      onClick={() => removeMetricItem(idx, itemIdx)}
                                      className="absolute top-2 right-2 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除指标"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      指标 {itemIdx + 1}
                                    </span>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block font-semibold text-slate-700 mb-1">核心指标数值 (如: 40%+)</label>
                                        <input
                                          type="text"
                                          value={item.value}
                                          onChange={(e) => updateMetricItem(idx, itemIdx, { value: e.target.value })}
                                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="block font-semibold text-slate-700 mb-1">指标项名称 (如: 效率提升)</label>
                                        <input
                                          type="text"
                                          value={item.label}
                                          onChange={(e) => updateMetricItem(idx, itemIdx, { label: e.target.value })}
                                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block font-semibold text-slate-700 mb-1">指标详细描述</label>
                                      <textarea
                                        value={item.description || ''}
                                        onChange={(e) => updateMetricItem(idx, itemIdx, { description: e.target.value })}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm resize-none"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addMetricItem(idx)}
                                  className="w-full py-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增指标卡片
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 13. CANVAS BLOCK */}
                          {sec.type === 'canvas' && sec.canvas && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">工作画布区标题</label>
                                <input
                                  type="text"
                                  value={sec.canvas.title}
                                  onChange={(e) => updateCanvas(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题说明</label>
                                <input
                                  type="text"
                                  value={sec.canvas.subtitle || ''}
                                  onChange={(e) => updateCanvas(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">画布主展示图 URL</label>
                                <ImageUpload
                                  label="上传画布大图"
                                  value={sec.canvas.imageUrl}
                                  onChange={(url) => updateCanvas(idx, { imageUrl: url })}
                                  folder={`products/${product.id}`}
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">画布配图 Alt 文字</label>
                                <input
                                  type="text"
                                  value={sec.canvas.imageAlt || ''}
                                  onChange={(e) => updateCanvas(idx, { imageAlt: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">画布深度图解说明</label>
                                <textarea
                                  value={sec.canvas.description || ''}
                                  onChange={(e) => updateCanvas(idx, { description: e.target.value })}
                                  rows={3}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none"
                                />
                              </div>
                              <div className="space-y-3 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">右侧功能点解析</label>
                                {sec.canvas.features.map((feat, featIdx) => (
                                  <div key={featIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-2 relative text-left">
                                    <button
                                      onClick={() => removeCanvasFeature(idx, featIdx)}
                                      className="absolute top-1.5 right-1.5 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除此功能点"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-550 block mb-0.5">解析标题</label>
                                      <input
                                        type="text"
                                        value={feat.title}
                                        onChange={(e) => updateCanvasFeature(idx, featIdx, { title: e.target.value })}
                                        className="w-[85%] px-2 py-1 border border-slate-200 bg-white rounded text-xs font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-550 block mb-0.5">解析详细描述</label>
                                      <textarea
                                        value={feat.description}
                                        onChange={(e) => updateCanvasFeature(idx, featIdx, { description: e.target.value })}
                                        rows={2}
                                        className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs resize-none"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addCanvasFeature(idx)}
                                  className="w-full py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-650 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增画布功能解析
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 14. RICH TEXT BLOCK */}
                          {sec.type === 'richText' && sec.richText && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">富文本板块标题</label>
                                <input
                                  type="text"
                                  value={sec.richText.title}
                                  onChange={(e) => updateRichText(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.richText.subtitle || ''}
                                  onChange={(e) => updateRichText(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">叙事主体内容</label>
                                <textarea
                                  value={sec.richText.content}
                                  onChange={(e) => updateRichText(idx, { content: e.target.value })}
                                  rows={6}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono leading-relaxed"
                                  placeholder="在此输入详细的纯文本段落或规范叙述内容..."
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                                <div>
                                  <label className="block font-semibold text-slate-700 text-xs mb-1">文本对齐方式</label>
                                  <select
                                    value={sec.richText.align || 'left'}
                                    onChange={(e) => updateRichText(idx, { align: e.target.value as 'left' | 'center' })}
                                    className="w-full border rounded-lg bg-white px-3 py-2 text-sm"
                                  >
                                    <option value="left">居左排版</option>
                                    <option value="center">居中排版</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block font-semibold text-slate-700 text-xs mb-1">配图展示位置</label>
                                  <select
                                    value={sec.richText.imagePosition || 'right'}
                                    onChange={(e) => updateRichText(idx, { imagePosition: e.target.value as 'left' | 'right' })}
                                    className="w-full border rounded-lg bg-white px-3 py-2 text-sm"
                                  >
                                    <option value="left">图片位于文本左侧</option>
                                    <option value="right">图片位于文本右侧</option>
                                  </select>
                                </div>
                              </div>
                              <div className="pt-2">
                                <label className="block font-semibold text-slate-700 mb-1">侧边展示配图 URL (可选)</label>
                                <ImageUpload
                                  label="侧边配图"
                                  value={sec.richText.imageUrl || ''}
                                  onChange={(url) => updateRichText(idx, { imageUrl: url })}
                                  folder={`products/${product.id}`}
                                />
                              </div>
                            </div>
                          )}

                          {/* 15. PARTNERS BLOCK */}
                          {sec.type === 'partners' && sec.partners && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">背书墙大标题</label>
                                <input
                                  type="text"
                                  value={sec.partners.title}
                                  onChange={(e) => updatePartners(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.partners.subtitle || ''}
                                  onChange={(e) => updatePartners(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">合作伙伴列表 (Logo Grid)</label>
                                {sec.partners.items.map((part, partIdx) => (
                                  <div key={partIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-2 relative text-left">
                                    <button
                                      onClick={() => removePartnerItem(idx, partIdx)}
                                      className="absolute top-1.5 right-1.5 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除此客户"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      品牌客户 {partIdx + 1}
                                    </span>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">企业名称</label>
                                        <input
                                          type="text"
                                          value={part.name}
                                          onChange={(e) => updatePartnerItem(idx, partIdx, { name: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">上传 Logo 徽标</label>
                                        <ImageUpload
                                          label="Logo"
                                          value={part.logoUrl}
                                          onChange={(url) => updatePartnerItem(idx, partIdx, { logoUrl: url })}
                                          folder={`products/${product.id}`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addPartnerItem(idx)}
                                  className="w-full py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增合作伙伴 Logo
                                </button>
                              </div>
                            </div>
                          )}
                          {/* 16. CAROUSEL BLOCK */}
                          {sec.type === 'carousel' && sec.carousel && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">演示轮播大标题</label>
                                <input
                                  type="text"
                                  value={sec.carousel.title}
                                  onChange={(e) => updateCarousel(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述说明</label>
                                <input
                                  type="text"
                                  value={sec.carousel.subtitle || ''}
                                  onChange={(e) => updateCarousel(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">幻灯播放图片配置</label>
                                {sec.carousel.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-2 relative text-left">
                                    <button
                                      onClick={() => removeCarouselItem(idx, itemIdx)}
                                      className="absolute top-1.5 right-1.5 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除此幻灯"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      幻灯 {itemIdx + 1}
                                    </span>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">幻灯标题 (Caption)</label>
                                        <input
                                          type="text"
                                          value={item.caption || ''}
                                          onChange={(e) => updateCarouselItem(idx, itemIdx, { caption: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">图片演示文件</label>
                                        <ImageUpload
                                          label="上传图片"
                                          value={item.imageUrl}
                                          onChange={(url) => updateCarouselItem(idx, itemIdx, { imageUrl: url })}
                                          folder={`products/${product.id}`}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-550 block mb-0.5">详细备注描述</label>
                                      <textarea
                                        value={item.description || ''}
                                        onChange={(e) => updateCarouselItem(idx, itemIdx, { description: e.target.value })}
                                        rows={2}
                                        className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs resize-none"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addCarouselItem(idx)}
                                  className="w-full py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增幻灯片图片
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 17. DOWNLOADS BLOCK */}
                          {sec.type === 'downloads' && sec.downloads && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">下载中心大标题</label>
                                <input
                                  type="text"
                                  value={sec.downloads.title}
                                  onChange={(e) => updateDownloads(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.downloads.subtitle || ''}
                                  onChange={(e) => updateDownloads(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">下载文件与资料清单</label>
                                {sec.downloads.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-2 relative text-left">
                                    <button
                                      onClick={() => removeDownloadItem(idx, itemIdx)}
                                      className="absolute top-1.5 right-1.5 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除下载"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      文件 {itemIdx + 1}
                                    </span>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-550 block mb-0.5">资料名称 / 客户端文件名</label>
                                      <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => updateDownloadItem(idx, itemIdx, { title: e.target.value })}
                                        className="w-[85%] px-2 py-1 border border-slate-200 bg-white rounded text-xs font-bold"
                                      />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">文件大小</label>
                                        <input
                                          type="text"
                                          value={item.fileSize || ''}
                                          onChange={(e) => updateDownloadItem(idx, itemIdx, { fileSize: e.target.value })}
                                          placeholder="例: 4.5 MB"
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">资料扩展名</label>
                                        <input
                                          type="text"
                                          value={item.fileType || ''}
                                          onChange={(e) => updateDownloadItem(idx, itemIdx, { fileType: e.target.value })}
                                          placeholder="例: PDF / ZIP"
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">下载链接 URL</label>
                                        <input
                                          type="text"
                                          value={item.fileUrl}
                                          onChange={(e) => updateDownloadItem(idx, itemIdx, { fileUrl: e.target.value })}
                                          placeholder="例: /uploads/abc.pdf"
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addDownloadItem(idx)}
                                  className="w-full py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增资料下载项
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 18. CERTIFICATES BLOCK */}
                          {sec.type === 'certificates' && sec.certificates && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">荣誉资质板块标题</label>
                                <input
                                  type="text"
                                  value={sec.certificates.title}
                                  onChange={(e) => updateCertificates(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.certificates.subtitle || ''}
                                  onChange={(e) => updateCertificates(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">证书列表与荣誉勋章</label>
                                {sec.certificates.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-2 relative text-left">
                                    <button
                                      onClick={() => removeCertificateItem(idx, itemIdx)}
                                      className="absolute top-1.5 right-1.5 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除此证书"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      证书资质 {itemIdx + 1}
                                    </span>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-550 block mb-0.5">证书名称</label>
                                      <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => updateCertificateItem(idx, itemIdx, { name: e.target.value })}
                                        className="w-[85%] px-2 py-1 border border-slate-200 bg-white rounded text-xs font-bold"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">颁发机构</label>
                                        <input
                                          type="text"
                                          value={item.issuingBody || ''}
                                          onChange={(e) => updateCertificateItem(idx, itemIdx, { issuingBody: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">证书大图</label>
                                        <ImageUpload
                                          label="资质图"
                                          value={item.imageUrl}
                                          onChange={(url) => updateCertificateItem(idx, itemIdx, { imageUrl: url })}
                                          folder={`products/${product.id}`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addCertificateItem(idx)}
                                  className="w-full py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增荣誉证书
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 19. COVERAGE BLOCK */}
                          {sec.type === 'coverage' && sec.coverage && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">服务网络大标题</label>
                                <input
                                  type="text"
                                  value={sec.coverage.title}
                                  onChange={(e) => updateCoverage(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.coverage.subtitle || ''}
                                  onChange={(e) => updateCoverage(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">各区域服务网点配置</label>
                                {sec.coverage.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-2 relative text-left">
                                    <button
                                      onClick={() => removeCoverageItem(idx, itemIdx)}
                                      className="absolute top-1.5 right-1.5 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除此网点"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      网点分支 {itemIdx + 1}
                                    </span>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">网点地区 / 名称</label>
                                        <input
                                          type="text"
                                          value={item.region}
                                          onChange={(e) => updateCoverageItem(idx, itemIdx, { region: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs font-bold"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">咨询电话</label>
                                        <input
                                          type="text"
                                          value={item.phone || ''}
                                          onChange={(e) => updateCoverageItem(idx, itemIdx, { phone: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">详细地址</label>
                                        <input
                                          type="text"
                                          value={item.address || ''}
                                          onChange={(e) => updateCoverageItem(idx, itemIdx, { address: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">服务邮箱</label>
                                        <input
                                          type="text"
                                          value={item.email || ''}
                                          onChange={(e) => updateCoverageItem(idx, itemIdx, { email: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addCoverageItem(idx)}
                                  className="w-full py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增服务网点
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 20. CONSULTATION BLOCK */}
                          {sec.type === 'consultation' && sec.consultation && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">咨询板块大标题</label>
                                <input
                                  type="text"
                                  value={sec.consultation.title}
                                  onChange={(e) => updateConsultation(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.consultation.subtitle || ''}
                                  onChange={(e) => updateConsultation(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">方案定制 CTA 按钮文字</label>
                                <input
                                  type="text"
                                  value={sec.consultation.ctaText}
                                  onChange={(e) => updateConsultation(idx, { ctaText: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">方案服务承诺条款 (Benefits)</label>
                                {sec.consultation.benefits.map((bf, bfIdx) => (
                                  <div key={bfIdx} className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={bf}
                                      onChange={(e) => updateConsultationBenefit(idx, bfIdx, e.target.value)}
                                      className="flex-1 px-2.5 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-xs"
                                    />
                                    <button
                                      onClick={() => removeConsultationBenefit(idx, bfIdx)}
                                      className="p-1.5 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除承诺"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addConsultationBenefit(idx)}
                                  className="w-full py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增服务承诺
                                </button>
                              </div>
                            </div>
                          )}
                          {/* 21. MULTI DEVICE BLOCK */}
                          {sec.type === 'multiDevice' && sec.multiDevice && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">多端预览标题</label>
                                <input
                                  type="text"
                                  value={sec.multiDevice.title}
                                  onChange={(e) => updateMultiDevice(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.multiDevice.subtitle || ''}
                                  onChange={(e) => updateMultiDevice(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-550 block mb-0.5">电脑端截图</label>
                                  <ImageUpload
                                    label="Desktop"
                                    value={sec.multiDevice.desktopUrl}
                                    onChange={(url) => updateMultiDevice(idx, { desktopUrl: url })}
                                    folder={`products/${product.id}`}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-550 block mb-0.5">平板端截图</label>
                                  <ImageUpload
                                    label="Tablet"
                                    value={sec.multiDevice.tabletUrl}
                                    onChange={(url) => updateMultiDevice(idx, { tabletUrl: url })}
                                    folder={`products/${product.id}`}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-550 block mb-0.5">手机端截图</label>
                                  <ImageUpload
                                    label="Mobile"
                                    value={sec.multiDevice.mobileUrl}
                                    onChange={(url) => updateMultiDevice(idx, { mobileUrl: url })}
                                    folder={`products/${product.id}`}
                                  />
                                </div>
                              </div>
                              <div className="space-y-3 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">多端适配特性点</label>
                                {sec.multiDevice.features.map((feat, featIdx) => (
                                  <div key={featIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-2 relative text-left">
                                    <button
                                      onClick={() => removeMultiDeviceFeature(idx, featIdx)}
                                      className="absolute top-1.5 right-1.5 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除特性"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-550 block mb-0.5">特性标题</label>
                                      <input
                                        type="text"
                                        value={feat.title}
                                        onChange={(e) => updateMultiDeviceFeature(idx, featIdx, { title: e.target.value })}
                                        className="w-[85%] px-2 py-1 border border-slate-200 bg-white rounded text-xs font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-550 block mb-0.5">描述说明</label>
                                      <input
                                        type="text"
                                        value={feat.desc}
                                        onChange={(e) => updateMultiDeviceFeature(idx, featIdx, { desc: e.target.value })}
                                        className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addMultiDeviceFeature(idx)}
                                  className="w-full py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增适配特性
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 22. HARDWARE SPEC BLOCK */}
                          {sec.type === 'hardwareSpec' && sec.hardwareSpec && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">拆解底图标题</label>
                                <input
                                  type="text"
                                  value={sec.hardwareSpec.title}
                                  onChange={(e) => updateHardwareSpec(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.hardwareSpec.subtitle || ''}
                                  onChange={(e) => updateHardwareSpec(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">拆件核心图 (芯片/引擎大图)</label>
                                <ImageUpload
                                  label="核心大图"
                                  value={sec.hardwareSpec.imageUrl}
                                  onChange={(url) => updateHardwareSpec(idx, { imageUrl: url })}
                                  folder={`products/${product.id}`}
                                />
                              </div>
                              <div className="space-y-3 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">标注热区指示线</label>
                                {sec.hardwareSpec.annotations.map((ann, annIdx) => (
                                  <div key={annIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-2 relative text-left">
                                    <button
                                      onClick={() => removeHardwareSpecAnnotation(idx, annIdx)}
                                      className="absolute top-1.5 right-1.5 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除标注"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      标注热区 {annIdx + 1}
                                    </span>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">X 轴坐标比率 (0-100%)</label>
                                        <input
                                          type="number"
                                          min={0}
                                          max={100}
                                          value={ann.x}
                                          onChange={(e) => updateHardwareSpecAnnotation(idx, annIdx, { x: Number(e.target.value) })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">Y 轴坐标比率 (0-100%)</label>
                                        <input
                                          type="number"
                                          min={0}
                                          max={100}
                                          value={ann.y}
                                          onChange={(e) => updateHardwareSpecAnnotation(idx, annIdx, { y: Number(e.target.value) })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-550 block mb-0.5">标注标题</label>
                                      <input
                                        type="text"
                                        value={ann.title}
                                        onChange={(e) => updateHardwareSpecAnnotation(idx, annIdx, { title: e.target.value })}
                                        className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-550 block mb-0.5">详细剖析说明</label>
                                      <textarea
                                        value={ann.desc}
                                        onChange={(e) => updateHardwareSpecAnnotation(idx, annIdx, { desc: e.target.value })}
                                        rows={2}
                                        className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs resize-none"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addHardwareSpecAnnotation(idx)}
                                  className="w-full py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增核心标注热点
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 23. TECH STACK BLOCK */}
                          {sec.type === 'techStack' && sec.techStack && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">技术栈板块标题</label>
                                <input
                                  type="text"
                                  value={sec.techStack.title}
                                  onChange={(e) => updateTechStack(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.techStack.subtitle || ''}
                                  onChange={(e) => updateTechStack(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">生态依赖项列表</label>
                                {sec.techStack.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-2 relative text-left">
                                    <button
                                      onClick={() => removeTechStackItem(idx, itemIdx)}
                                      className="absolute top-1.5 right-1.5 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除依赖"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      技术栈 {itemIdx + 1}
                                    </span>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">依赖名称 (例: PostgreSQL)</label>
                                        <input
                                          type="text"
                                          value={item.name}
                                          onChange={(e) => updateTechStackItem(idx, itemIdx, { name: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs font-bold"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">支持版本 (例: v15.0+)</label>
                                        <input
                                          type="text"
                                          value={item.version || ''}
                                          onChange={(e) => updateTechStackItem(idx, itemIdx, { version: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">支持状态 (例: Native / Certified)</label>
                                        <input
                                          type="text"
                                          value={item.status}
                                          onChange={(e) => updateTechStackItem(idx, itemIdx, { status: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">Logo 徽标图片</label>
                                        <ImageUpload
                                          label="Logo"
                                          value={item.logoUrl}
                                          onChange={(url) => updateTechStackItem(idx, itemIdx, { logoUrl: url })}
                                          folder={`products/${product.id}`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addTechStackItem(idx)}
                                  className="w-full py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增依赖技术栈
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 24. SANDBOX BLOCK */}
                          {sec.type === 'sandbox' && sec.sandbox && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">代码沙盒标题</label>
                                <input
                                  type="text"
                                  value={sec.sandbox.title}
                                  onChange={(e) => updateSandbox(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.sandbox.subtitle || ''}
                                  onChange={(e) => updateSandbox(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">多语言代码沙盒选项</label>
                                {sec.sandbox.tabs.map((tab, tabIdx) => (
                                  <div key={tabIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-2 relative text-left">
                                    <button
                                      onClick={() => removeSandboxTab(idx, tabIdx)}
                                      className="absolute top-1.5 right-1.5 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除选项卡"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      沙盒选项卡 {tabIdx + 1}
                                    </span>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">选项卡标签名称 (例: cURL)</label>
                                        <input
                                          type="text"
                                          value={tab.label}
                                          onChange={(e) => updateSandboxTab(idx, tabIdx, { label: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs font-bold"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">代码高亮语言 (例: javascript / csharp)</label>
                                        <input
                                          type="text"
                                          value={tab.language}
                                          onChange={(e) => updateSandboxTab(idx, tabIdx, { language: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-550 block mb-0.5">选项卡详细解析描述</label>
                                      <input
                                        type="text"
                                        value={tab.description}
                                        onChange={(e) => updateSandboxTab(idx, tabIdx, { description: e.target.value })}
                                        className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-550 block mb-0.5">示例代码块</label>
                                      <textarea
                                        value={tab.code}
                                        onChange={(e) => updateSandboxTab(idx, tabIdx, { code: e.target.value })}
                                        rows={4}
                                        className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs font-mono resize-y"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addSandboxTab(idx)}
                                  className="w-full py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增代码沙盒语言
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 25. SIGNAL WAVE BLOCK */}
                          {sec.type === 'signalWave' && sec.signalWave && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">波形/时延对比大标题</label>
                                <input
                                  type="text"
                                  value={sec.signalWave.title}
                                  onChange={(e) => updateSignalWave(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.signalWave.subtitle || ''}
                                  onChange={(e) => updateSignalWave(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-550 block mb-0.5">对比左标签 (例: 常规产品)</label>
                                  <input
                                    type="text"
                                    value={sec.signalWave.leftLabel}
                                    onChange={(e) => updateSignalWave(idx, { leftLabel: e.target.value })}
                                    className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-550 block mb-0.5">对比左数值 (例: 120ms 时延)</label>
                                  <input
                                    type="text"
                                    value={sec.signalWave.leftValue}
                                    onChange={(e) => updateSignalWave(idx, { leftValue: e.target.value })}
                                    className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-550 block mb-0.5">对比右标签 (例: 五六零方案)</label>
                                  <input
                                    type="text"
                                    value={sec.signalWave.rightLabel}
                                    onChange={(e) => updateSignalWave(idx, { rightLabel: e.target.value })}
                                    className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-550 block mb-0.5">对比右数值 (例: 5ms 极低时延)</label>
                                  <input
                                    type="text"
                                    value={sec.signalWave.rightValue}
                                    onChange={(e) => updateSignalWave(idx, { rightValue: e.target.value })}
                                    className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">详细算法工艺说明</label>
                                <textarea
                                  value={sec.signalWave.description}
                                  onChange={(e) => updateSignalWave(idx, { description: e.target.value })}
                                  rows={3}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none"
                                />
                              </div>
                            </div>
                          )}

                          {/* 26. BENTO GRID BLOCK */}
                          {sec.type === 'bentoGrid' && sec.bentoGrid && (
                            <div className="space-y-3">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">Bento 栅格大标题</label>
                                <input
                                  type="text"
                                  value={sec.bentoGrid.title}
                                  onChange={(e) => updateBentoGrid(idx, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">副标题描述</label>
                                <input
                                  type="text"
                                  value={sec.bentoGrid.subtitle || ''}
                                  onChange={(e) => updateBentoGrid(idx, { subtitle: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                              </div>
                              <div className="space-y-3 border-t border-slate-100 pt-3">
                                <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">不规则 Bento 盒特性卡片</label>
                                {sec.bentoGrid.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-2 relative text-left">
                                    <button
                                      onClick={() => removeBentoGridItem(idx, itemIdx)}
                                      className="absolute top-1.5 right-1.5 p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                                      title="删除卡片"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded w-fit block">
                                      卡片 {itemIdx + 1}
                                    </span>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">占用大小规格 (size)</label>
                                        <select
                                          value={item.size}
                                          onChange={(e) => updateBentoGridItem(idx, itemIdx, { size: e.target.value as any })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        >
                                          <option value="small">small (1x1 小方格)</option>
                                          <option value="large">large (2x1 横长格)</option>
                                          <option value="tall">tall (1x2 竖长格)</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">底色 Tailwind 或 CSS 类名</label>
                                        <input
                                          type="text"
                                          value={item.colorBg || ''}
                                          placeholder="例: bg-slate-900 text-white"
                                          onChange={(e) => updateBentoGridItem(idx, itemIdx, { colorBg: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs"
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">特性卡片标题</label>
                                        <input
                                          type="text"
                                          value={item.title}
                                          onChange={(e) => updateBentoGridItem(idx, itemIdx, { title: e.target.value })}
                                          className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs font-bold"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-550 block mb-0.5">背景配图 URL</label>
                                        <ImageUpload
                                          label="背景图"
                                          value={item.imageUrl || ''}
                                          onChange={(url) => updateBentoGridItem(idx, itemIdx, { imageUrl: url })}
                                          folder={`products/${product.id}`}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-550 block mb-0.5">辅助副标题描述</label>
                                      <textarea
                                        value={item.subtitle || ''}
                                        onChange={(e) => updateBentoGridItem(idx, itemIdx, { subtitle: e.target.value })}
                                        rows={2}
                                        className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-xs resize-none"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addBentoGridItem(idx)}
                                  className="w-full py-1.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg font-bold text-blue-600 hover:bg-slate-100 cursor-pointer text-xs"
                                >
                                  + 新增 Bento 特性卡片
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Module Injector Panel */}
          <div className="border-t border-slate-100 pt-6 mt-6">
            <p className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1.5 justify-start">
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>注入全新设计区块</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => addSection('hero')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-600 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>巨幕区块</span>
              </button>
              <button
                onClick={() => addSection('capabilities')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>核心能力交替</span>
              </button>
              <button
                onClick={() => addSection('scenarios')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>应用场景网格</span>
              </button>
              <button
                onClick={() => addSection('architecture')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Workflow className="w-4 h-4" />
                <span>产品架构图</span>
              </button>
              <button
                onClick={() => addSection('cta')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>引导转换横幅</span>
              </button>
              <button
                onClick={() => addSection('video')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>案例视频播放</span>
              </button>
              <button
                onClick={() => addSection('timeline')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>服务实施流程</span>
              </button>
              <button
                onClick={() => addSection('features')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>特性功能矩阵</span>
              </button>
              <button
                onClick={() => addSection('faq')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>常见问题解答</span>
              </button>
              <button
                onClick={() => addSection('comparison')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Table className="w-4 h-4" />
                <span>产品方案对比</span>
              </button>
              <button
                onClick={() => addSection('testimonials')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>客户评价见证</span>
              </button>
              <button
                onClick={() => addSection('metrics')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <BarChart3 className="w-4 h-4" />
                <span>核心成效指标</span>
              </button>
              <button
                onClick={() => addSection('canvas')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Monitor className="w-4 h-4" />
                <span>产品工作画布</span>
              </button>
              <button
                onClick={() => addSection('richText')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>图文合规叙事</span>
              </button>
              <button
                onClick={() => addSection('partners')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>合作伙伴墙</span>
              </button>
              <button
                onClick={() => addSection('carousel')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Images className="w-4 h-4" />
                <span>多图轮播幻灯</span>
              </button>
              <button
                onClick={() => addSection('downloads')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>资料资源下载</span>
              </button>
              <button
                onClick={() => addSection('certificates')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>荣誉资质认证</span>
              </button>
              <button
                onClick={() => addSection('coverage')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>分支服务网络</span>
              </button>
              <button
                onClick={() => addSection('consultation')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>定制方案咨询</span>
              </button>
              <button
                onClick={() => addSection('multiDevice')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Monitor className="w-4 h-4" />
                <span>多端协同自适应</span>
              </button>
              <button
                onClick={() => addSection('hardwareSpec')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Workflow className="w-4 h-4" />
                <span>核心拆解热区</span>
              </button>
              <button
                onClick={() => addSection('techStack')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>依赖技术生态</span>
              </button>
              <button
                onClick={() => addSection('sandbox')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <FileCode className="w-4 h-4" />
                <span>代码调用沙盒</span>
              </button>
              <button
                onClick={() => addSection('signalWave')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>信号时延对比</span>
              </button>
              <button
                onClick={() => addSection('bentoGrid')}
                className="px-2 py-2.5 border border-slate-200 hover:border-blue-500 rounded-xl text-[10px] font-bold text-slate-655 hover:text-blue-600 transition-all flex flex-col items-center gap-1.5 bg-slate-50 hover:bg-blue-50/10 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>苹果Bento特性</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: High Fidelity Web Replica Preview */}
        <div className="flex-1 bg-slate-100 overflow-y-auto p-8 relative flex flex-col">
          <div className="absolute top-4 left-6 z-10 flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
            <Eye className="w-3.5 h-3.5 text-emerald-500" />
            <span>实时前台排版预览</span>
          </div>

          <div className="flex-1 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-inner flex flex-col mt-8">
            {sections.length === 0 ? (
              /* Fallback default template preview */
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 gap-3">
                <ImageIcon className="w-12 h-12 text-slate-200" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-500">正在显示默认详情布局</p>
                  <p className="text-xs text-slate-400">当前产品无专门设计的模版组合，前台将默认渲染默认三段式。请点击左下角添加模块开始设计。</p>
                </div>
              </div>
            ) : (
              /* Live preview loop */
              <div className="flex-1 overflow-y-auto text-left relative bg-white">
                {sections.map((sec, idx) => {
                  return (
                    <div key={sec.id} className="relative group/preview border-b last:border-b-0 border-dashed border-slate-200/50">
                      {/* Section label in preview */}
                      <span className="absolute top-2 left-2 z-20 text-[9px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded opacity-0 group-hover/preview:opacity-75 transition-opacity">
                        区块 {idx + 1}: {sec.type}
                      </span>

                      {/* Render type: HERO */}
                      {sec.type === 'hero' && sec.hero && (
                        <div className="relative aspect-[16/6] bg-slate-900 flex items-center justify-center overflow-hidden">
                          {sec.hero.bgUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={sec.hero.bgUrl}
                              alt="Hero bg"
                              className="absolute inset-0 w-full h-full object-cover opacity-85"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                          <div className="relative z-10 text-center text-white px-6 max-w-2xl space-y-3">
                            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">{sec.hero.title}</h2>
                            <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">{sec.hero.subtitle}</p>
                            <div className="pt-2">
                              <span className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow">
                                申请试用
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Render type: CAPABILITIES */}
                      {sec.type === 'capabilities' && sec.capabilities && (
                        <div className="py-12 px-8 space-y-12 bg-white">
                          <div className="text-center">
                            <h3 className="text-lg md:text-xl font-bold text-slate-900">核心能力</h3>
                            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-2" />
                          </div>
                          <div className="space-y-8">
                            {sec.capabilities.map((cap, capIdx) => {
                              const isLeft = capIdx % 2 === 0;
                              return (
                                <div key={capIdx} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                  <div className={`space-y-3 ${isLeft ? '' : 'order-1 md:order-2 text-left'}`}>
                                    <h4 className="text-base font-bold text-slate-800">{cap.title}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed indent-[2em]">{cap.description}</p>
                                  </div>
                                  <div className={`aspect-video rounded-xl overflow-hidden border border-slate-100 shadow bg-slate-50 relative ${isLeft ? '' : 'order-2 md:order-1'}`}>
                                    {cap.imageUrl ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={cap.imageUrl} alt="Cap image" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1 bg-slate-50">
                                        <ImageIcon className="w-6 h-6 opacity-50" />
                                        <span className="text-[10px]">无能力配图</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Render type: SCENARIOS */}
                      {sec.type === 'scenarios' && sec.scenarios && (
                        <div className="py-12 px-8 bg-slate-50/50">
                          <div className="text-center mb-8">
                            <h3 className="text-lg md:text-xl font-bold text-slate-900">{sec.scenarios.title}</h3>
                            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-2" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sec.scenarios.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm flex flex-col h-full">
                                <div className="aspect-[16/10] bg-slate-100 relative">
                                  {item.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.imageUrl} alt="Scenario" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1 bg-slate-50">
                                      <ImageIcon className="w-6 h-6 opacity-50" />
                                      <span className="text-[10px]">未配置场景图</span>
                                    </div>
                                  )}
                                </div>
                                <div className="p-4 text-left">
                                  <h4 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h4>
                                  <p className="text-[11px] text-slate-400 leading-normal">{item.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render type: ARCHITECTURE */}
                      {sec.type === 'architecture' && sec.architecture && (
                        <div className="py-12 px-8 bg-white space-y-6">
                          <div className="text-center">
                            <h3 className="text-lg md:text-xl font-bold text-slate-900">{sec.architecture.title}</h3>
                            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-2" />
                          </div>
                          <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50 relative aspect-[21/9] flex items-center justify-center">
                            {sec.architecture.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={sec.architecture.imageUrl} alt="Architecture map" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1 bg-slate-50">
                                <Workflow className="w-8 h-8 opacity-50 animate-pulse" />
                                <span className="text-[10px]">请上传架构大图</span>
                              </div>
                            )}
                          </div>
                          {sec.architecture.description && (
                            <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed text-center italic">
                              “ {sec.architecture.description} ”
                            </p>
                          )}
                        </div>
                      )}

                      {/* Render type: VIDEO */}
                      {sec.type === 'video' && sec.video && (
                        <div className="py-12 px-8 bg-slate-50/50 space-y-6 text-center border-b border-slate-100">
                          <div className="max-w-2xl mx-auto space-y-2">
                            <h3 className="text-lg md:text-xl font-bold text-slate-900">{sec.video.title}</h3>
                            {sec.video.subtitle && <p className="text-xs text-slate-400 font-normal">{sec.video.subtitle}</p>}
                          </div>
                          <div className="max-w-2xl mx-auto border border-slate-200/80 rounded-2xl overflow-hidden shadow-md bg-slate-950 relative aspect-video flex items-center justify-center">
                            {!sec.video.videoUrl ? (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1.5 bg-slate-950">
                                <Play className="w-8 h-8 opacity-50 text-slate-300 animate-pulse" />
                                <span className="text-[10px]">请配置视频源文件播放链接</span>
                              </div>
                            ) : getEmbedUrl(sec.video.videoUrl).type === 'iframe' ? (
                              <iframe
                                src={getEmbedUrl(sec.video.videoUrl).src}
                                scrolling="no"
                                frameBorder="no"
                                allowFullScreen={true}
                                className="w-full h-full aspect-video border-0"
                              />
                            ) : (
                              <video src={getEmbedUrl(sec.video.videoUrl).src} poster={sec.video.coverUrl} controls className="w-full h-full object-contain" />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Render type: CTA */}
                      {sec.type === 'cta' && sec.cta && (
                        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-center py-10 px-6 space-y-4">
                          <h3 className="text-lg md:text-2xl font-bold">{sec.cta.title}</h3>
                          <p className="text-xs text-slate-300 max-w-lg mx-auto font-light leading-relaxed">{sec.cta.description}</p>
                          <div className="flex justify-center gap-3 pt-2">
                            <span className="px-4 py-2 bg-white text-blue-700 text-xs font-bold rounded-lg shadow cursor-pointer">
                              {sec.cta.primaryText || '免费获取方案咨询'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Render type: COMPARISON */}
                      {sec.type === 'comparison' && sec.comparison && (
                        <div className="py-12 px-8 bg-slate-50/30 border-b border-slate-100">
                          <div className="text-center mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.comparison.title}</h3>
                            {sec.comparison.subtitle && <p className="text-[10px] text-slate-400 mt-1">{sec.comparison.subtitle}</p>}
                            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-2" />
                          </div>
                          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                            <table className="w-full text-xs text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                                  {sec.comparison.headers.map((hdr, hIdx) => (
                                    <th key={hIdx} className="px-4 py-3 font-bold">{hdr}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {sec.comparison.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="border-b last:border-b-0 border-slate-100">
                                    <td className="px-4 py-3 font-bold text-slate-800 bg-slate-50/20">{row.label}</td>
                                    {row.values.map((val, vIdx) => {
                                      const isHighlighted = row.highlightIndex === (vIdx + 1);
                                      return (
                                        <td key={vIdx} className={`px-4 py-3 ${isHighlighted ? 'bg-blue-50/35 font-semibold text-blue-700' : 'text-slate-550'}`}>
                                          {val}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Render type: TESTIMONIALS */}
                      {sec.type === 'testimonials' && sec.testimonials && (
                        <div className="py-12 px-8 bg-white border-b border-slate-100">
                          <div className="text-center mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.testimonials.title}</h3>
                            {sec.testimonials.subtitle && <p className="text-[10px] text-slate-400 mt-1">{sec.testimonials.subtitle}</p>}
                            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-2" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sec.testimonials.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="p-5 rounded-2xl border border-slate-150 bg-slate-50/40 relative flex flex-col justify-between space-y-4">
                                <p className="text-xs text-slate-600 leading-relaxed italic font-medium">“{item.quote}”</p>
                                <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
                                  {item.avatarUrl ? (
                                    <img src={item.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                      {item.author[0]}
                                    </div>
                                  )}
                                  <div className="text-left leading-tight">
                                    <div className="text-xs font-bold text-slate-800">{item.author}</div>
                                    <div className="text-[9px] text-slate-400 font-medium">
                                      {item.role} · {item.company}
                                    </div>
                                  </div>
                                  {item.logoUrl && (
                                    <img src={item.logoUrl} alt="Company logo" className="h-4 max-w-[60px] object-contain ml-auto opacity-70" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render type: METRICS */}
                      {sec.type === 'metrics' && sec.metrics && (
                        <div className="py-12 px-8 bg-slate-50/50 border-b border-slate-100">
                          <div className="text-center mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.metrics.title}</h3>
                            {sec.metrics.subtitle && <p className="text-[10px] text-slate-400 mt-1">{sec.metrics.subtitle}</p>}
                            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-2" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {sec.metrics.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="bg-white p-5 rounded-2xl border border-slate-150/70 shadow-sm text-center space-y-1">
                                <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                  {item.value}
                                </div>
                                <div className="text-xs font-bold text-slate-800">{item.label}</div>
                                {item.description && (
                                  <p className="text-[10px] text-slate-450 leading-normal font-medium">{item.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render type: CANVAS */}
                      {sec.type === 'canvas' && sec.canvas && (
                        <div className="py-12 px-8 bg-white border-b border-slate-100">
                          <div className="text-center mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.canvas.title}</h3>
                            {sec.canvas.subtitle && <p className="text-[10px] text-slate-400 mt-1">{sec.canvas.subtitle}</p>}
                            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-2" />
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
                            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-md aspect-video relative flex items-center justify-center">
                              {sec.canvas.imageUrl ? (
                                <img src={sec.canvas.imageUrl} alt={sec.canvas.imageAlt || 'Canvas'} className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-slate-500 flex flex-col items-center gap-1">
                                  <Monitor className="w-8 h-8 opacity-40" />
                                  <span className="text-[9px]">暂无系统看板大图</span>
                                </div>
                              )}
                            </div>
                            <div className="lg:col-span-5 space-y-4">
                              {sec.canvas.description && (
                                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{sec.canvas.description}</p>
                              )}
                              <div className="space-y-3">
                                {sec.canvas.features.map((feat, featIdx) => (
                                  <div key={featIdx} className="space-y-0.5">
                                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                                      <span>{feat.title}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-455 leading-relaxed pl-3">{feat.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Render type: RICH TEXT */}
                      {sec.type === 'richText' && sec.richText && (
                        <div className="py-12 px-8 bg-slate-50/30 border-b border-slate-100 text-left">
                          <div className="text-center mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.richText.title}</h3>
                            {sec.richText.subtitle && <p className="text-[10px] text-slate-400 mt-1">{sec.richText.subtitle}</p>}
                            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-2" />
                          </div>
                          <div className={`grid grid-cols-1 ${sec.richText.imageUrl ? 'lg:grid-cols-12 gap-8' : ''} items-center`}>
                            <div className={`${sec.richText.imageUrl ? 'lg:col-span-7' : 'w-full'} ${sec.richText.align === 'center' ? 'text-center' : 'text-left'} space-y-3 ${
                              sec.richText.imageUrl && sec.richText.imagePosition === 'left' ? 'lg:order-2' : ''
                            }`}>
                              <div className="text-xs text-slate-650 leading-relaxed whitespace-pre-line font-medium">{sec.richText.content}</div>
                            </div>
                            {sec.richText.imageUrl && (
                              <div className={`lg:col-span-5 aspect-video border rounded-xl overflow-hidden bg-slate-50 relative ${
                                sec.richText.imagePosition === 'left' ? 'lg:order-1' : ''
                              }`}>
                                <img src={sec.richText.imageUrl} alt="rich text side image" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Render type: PARTNERS */}
                      {sec.type === 'partners' && sec.partners && (
                        <div className="py-10 px-8 bg-white border-b border-slate-100 text-center">
                          <h3 className="text-xs font-bold text-slate-800 tracking-wider mb-2">{sec.partners.title}</h3>
                          {sec.partners.subtitle && <p className="text-[9px] text-slate-455 mb-6 font-medium">{sec.partners.subtitle}</p>}
                          <div className="flex flex-wrap items-center justify-center gap-6">
                            {sec.partners.items.map((part, partIdx) => (
                              <div key={partIdx} className="flex flex-col items-center justify-center gap-1 opacity-75 hover:opacity-100 transition-opacity">
                                {part.logoUrl ? (
                                  <img src={part.logoUrl} alt={part.name} className="h-6 max-w-[80px] object-contain filter grayscale" />
                                ) : (
                                  <div className="text-[10px] font-bold text-slate-400 bg-slate-100 border px-2.5 py-1 rounded">
                                    {part.name}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render type: CAROUSEL */}
                      {sec.type === 'carousel' && sec.carousel && (
                        <div className="py-12 px-8 bg-slate-50/50 border-b border-slate-100 text-center">
                          <div className="max-w-2xl mx-auto space-y-2 mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.carousel.title}</h3>
                            {sec.carousel.subtitle && <p className="text-[10px] text-slate-400 font-medium">{sec.carousel.subtitle}</p>}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
                            {sec.carousel.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm">
                                <div className="aspect-video bg-slate-950 flex items-center justify-center text-slate-500 relative">
                                  {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="flex flex-col items-center gap-1">
                                      <Images className="w-6 h-6 opacity-40" />
                                      <span className="text-[8px]">演示图 {itemIdx + 1}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="p-3 space-y-1">
                                  <h4 className="text-[11px] font-bold text-slate-800">{item.caption || '未命名演示'}</h4>
                                  <p className="text-[9px] text-slate-455 leading-normal">{item.description || '暂无描述'}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render type: DOWNLOADS */}
                      {sec.type === 'downloads' && sec.downloads && (
                        <div className="py-12 px-8 bg-white border-b border-slate-100">
                          <div className="text-center mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.downloads.title}</h3>
                            {sec.downloads.subtitle && <p className="text-[10px] text-slate-400 mt-1">{sec.downloads.subtitle}</p>}
                            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-2" />
                          </div>
                          <div className="max-w-2xl mx-auto space-y-2">
                            {sec.downloads.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-center justify-between p-3.5 border border-slate-150 rounded-xl bg-slate-50/20 hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-2.5 text-left">
                                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black uppercase">
                                    {item.fileType || 'Doc'}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-800 leading-tight">{item.title}</h4>
                                    <span className="text-[9px] text-slate-400 font-semibold">{item.fileSize || '大小未知'}</span>
                                  </div>
                                </div>
                                <span className="px-3 py-1 bg-white border border-slate-200 text-blue-600 hover:text-white hover:bg-blue-600 transition-colors text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-sm">
                                  <Download className="w-3 h-3" /> 下载
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render type: CERTIFICATES */}
                      {sec.type === 'certificates' && sec.certificates && (
                        <div className="py-12 px-8 bg-slate-50/30 border-b border-slate-100 text-center">
                          <div className="max-w-2xl mx-auto space-y-2 mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.certificates.title}</h3>
                            {sec.certificates.subtitle && <p className="text-[10px] text-slate-400 font-medium">{sec.certificates.subtitle}</p>}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                            {sec.certificates.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="bg-white border border-slate-150 rounded-xl p-4 flex flex-col items-center justify-between gap-3 text-center shadow-sm">
                                <div className="w-12 h-16 bg-slate-50 border border-slate-200 rounded flex items-center justify-center text-slate-400 overflow-hidden relative">
                                  {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <Award className="w-6 h-6 opacity-30 text-slate-500" />
                                  )}
                                </div>
                                <div className="space-y-0.5">
                                  <h4 className="text-[10px] font-extrabold text-slate-800 leading-tight">{item.name}</h4>
                                  {item.issuingBody && <p className="text-[8px] text-slate-400">{item.issuingBody}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render type: COVERAGE */}
                      {sec.type === 'coverage' && sec.coverage && (
                        <div className="py-12 px-8 bg-white border-b border-slate-100">
                          <div className="text-center mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.coverage.title}</h3>
                            {sec.coverage.subtitle && <p className="text-[10px] text-slate-400 mt-1">{sec.coverage.subtitle}</p>}
                            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-2" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
                            {sec.coverage.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="p-4 border border-slate-150 rounded-xl bg-slate-50/20 space-y-2 relative flex flex-col justify-between">
                                <div className="space-y-1">
                                  <div className="text-[11px] font-black text-slate-800 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                    <span>{item.region}</span>
                                  </div>
                                  {item.address && <p className="text-[9px] text-slate-455 font-medium leading-relaxed">{item.address}</p>}
                                </div>
                                <div className="border-t border-slate-100 pt-2 text-[8px] text-slate-400 space-y-0.5">
                                  {item.phone && <div>电话: {item.phone}</div>}
                                  {item.email && <div>邮箱: {item.email}</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render type: CONSULTATION */}
                      {sec.type === 'consultation' && sec.consultation && (
                        <div className="py-12 px-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-b border-slate-100 text-center relative overflow-hidden">
                          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
                            <h3 className="text-base md:text-lg font-black tracking-tight">{sec.consultation.title}</h3>
                            {sec.consultation.subtitle && <p className="text-[10px] text-slate-350 max-w-lg mx-auto font-light leading-relaxed">{sec.consultation.subtitle}</p>}
                            <div className="flex justify-center gap-6 pt-2">
                              <span className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-[10px] font-bold rounded-lg shadow-lg cursor-pointer transition-colors">
                                {sec.consultation.ctaText}
                              </span>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4 pt-4 text-[9px] text-slate-400 border-t border-white/5 mt-4">
                              {sec.consultation.benefits.map((bf, bfIdx) => (
                                <span key={bfIdx} className="flex items-center gap-1">
                                  <Check className="w-3 h-3 text-blue-500" /> {bf}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Render type: MULTI DEVICE */}
                      {sec.type === 'multiDevice' && sec.multiDevice && (
                        <div className="py-12 px-8 bg-white border-b border-slate-100 text-center">
                          <div className="max-w-2xl mx-auto space-y-2 mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.multiDevice.title}</h3>
                            {sec.multiDevice.subtitle && <p className="text-[10px] text-slate-400 font-medium">{sec.multiDevice.subtitle}</p>}
                          </div>
                          {/* Device mockup preview stacks */}
                          <div className="flex flex-wrap items-end justify-center gap-4 max-w-3xl mx-auto mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-150">
                            {/* Laptop */}
                            <div className="w-[180px] bg-slate-900 rounded-lg border border-slate-700 shadow p-1 shrink-0">
                              <div className="aspect-[16/10] bg-slate-950 rounded flex items-center justify-center text-[7px] text-slate-500 overflow-hidden relative">
                                {sec.multiDevice.desktopUrl ? <img src={sec.multiDevice.desktopUrl} className="w-full h-full object-cover" /> : '[ 电脑端预览 ]'}
                              </div>
                              <div className="h-1 bg-slate-600 rounded-b mt-1 w-8 mx-auto" />
                            </div>
                            {/* Tablet */}
                            <div className="w-[100px] bg-slate-900 rounded-md border border-slate-700 shadow p-1 shrink-0">
                              <div className="aspect-[3/4] bg-slate-950 rounded flex items-center justify-center text-[7px] text-slate-500 overflow-hidden relative">
                                {sec.multiDevice.tabletUrl ? <img src={sec.multiDevice.tabletUrl} className="w-full h-full object-cover" /> : '[ 平板端 ]'}
                              </div>
                            </div>
                            {/* Phone */}
                            <div className="w-[60px] bg-slate-900 rounded-md border border-slate-700 shadow p-0.5 shrink-0">
                              <div className="aspect-[9/16] bg-slate-955 rounded flex items-center justify-center text-[5px] text-slate-500 overflow-hidden relative">
                                {sec.multiDevice.mobileUrl ? <img src={sec.multiDevice.mobileUrl} className="w-full h-full object-cover" /> : '[ 手机端 ]'}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left border-t border-slate-100 pt-4">
                            {sec.multiDevice.features.map((feat, featIdx) => (
                              <div key={featIdx} className="space-y-0.5">
                                <h4 className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                  <span>{feat.title}</span>
                                </h4>
                                <p className="text-[9px] text-slate-455 pl-3 leading-normal">{feat.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render type: HARDWARE SPEC */}
                      {sec.type === 'hardwareSpec' && sec.hardwareSpec && (
                        <div className="py-12 px-8 bg-slate-50/30 border-b border-slate-100 text-center">
                          <div className="max-w-2xl mx-auto space-y-2 mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.hardwareSpec.title}</h3>
                            {sec.hardwareSpec.subtitle && <p className="text-[10px] text-slate-400 font-medium">{sec.hardwareSpec.subtitle}</p>}
                          </div>
                          <div className="max-w-lg mx-auto bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center">
                            {sec.hardwareSpec.imageUrl ? (
                              <img src={sec.hardwareSpec.imageUrl} alt="spec image" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-slate-500 flex flex-col items-center gap-1.5">
                                <Workflow className="w-8 h-8 opacity-30 text-slate-400" />
                                <span className="text-[9px]">核心引擎架构底图展示区域</span>
                              </div>
                            )}
                            {/* Annotation points */}
                            {sec.hardwareSpec.annotations.map((ann, annIdx) => (
                              <div
                                key={annIdx}
                                className="absolute group cursor-pointer"
                                style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
                              >
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border border-white"></span>
                                </span>
                                {/* Annotation hover tag mockup */}
                                <div className="absolute top-4 left-4 bg-white/95 border border-slate-200 p-2 rounded-lg text-left shadow-lg w-[140px] pointer-events-none opacity-90">
                                  <h4 className="text-[9px] font-black text-slate-800 leading-tight">{ann.title}</h4>
                                  <p className="text-[8px] text-slate-500 leading-normal mt-0.5">{ann.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render type: TECH STACK */}
                      {sec.type === 'techStack' && sec.techStack && (
                        <div className="py-12 px-8 bg-white border-b border-slate-100 text-center">
                          <div className="max-w-2xl mx-auto space-y-2 mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.techStack.title}</h3>
                            {sec.techStack.subtitle && <p className="text-[10px] text-slate-400 font-medium">{sec.techStack.subtitle}</p>}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
                            {sec.techStack.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="bg-slate-50/50 border border-slate-150 p-3 rounded-xl flex items-center gap-2.5 text-left shadow-sm">
                                <div className="w-7 h-7 bg-white border border-slate-200 rounded flex items-center justify-center shrink-0 overflow-hidden relative">
                                  {item.logoUrl ? <img src={item.logoUrl} className="w-full h-full object-contain" /> : <Layers className="w-4 h-4 text-slate-400" />}
                                </div>
                                <div className="leading-tight">
                                  <h4 className="text-[10px] font-bold text-slate-800 block truncate max-w-[80px]">{item.name}</h4>
                                  <span className="text-[8px] text-slate-400">{item.version || '最新版'}</span>
                                  <span className="text-[7px] font-bold px-1 py-0.2 bg-blue-50 text-blue-600 rounded ml-1 border border-blue-100">{item.status}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render type: SANDBOX */}
                      {sec.type === 'sandbox' && sec.sandbox && (
                        <div className="py-12 px-8 bg-slate-50/50 border-b border-slate-100">
                          <div className="text-center mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.sandbox.title}</h3>
                            {sec.sandbox.subtitle && <p className="text-[10px] text-slate-400 mt-1">{sec.sandbox.subtitle}</p>}
                            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-2" />
                          </div>
                          {/* Tabs sandboxes */}
                          <div className="max-w-2xl mx-auto border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col text-left">
                            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                              <div className="flex gap-1.5">
                                {sec.sandbox.tabs.map((tab, tabIdx) => (
                                  <span key={tabIdx} className={`px-2.5 py-1 text-[9px] font-bold rounded-md border cursor-pointer ${
                                    tabIdx === 0 ? 'bg-white text-blue-600 border-slate-200/80 shadow-sm' : 'text-slate-500 border-transparent hover:bg-slate-100'
                                  }`}>
                                    {tab.label}
                                  </span>
                                ))}
                              </div>
                              <span className="text-[8px] text-slate-400 font-mono">SDK Sandbox Active</span>
                            </div>
                            <div className="p-4 bg-slate-900 text-slate-350 font-mono text-[9px] leading-relaxed whitespace-pre-wrap overflow-x-auto select-all max-h-[160px]">
                              {sec.sandbox.tabs[0]?.code}
                            </div>
                            {sec.sandbox.tabs[0]?.description && (
                              <p className="p-3 border-t border-slate-100 text-[9px] text-slate-505 font-medium leading-relaxed bg-slate-50/40">
                                {sec.sandbox.tabs[0].description}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Render type: SIGNAL WAVE */}
                      {sec.type === 'signalWave' && sec.signalWave && (
                        <div className="py-12 px-8 bg-white border-b border-slate-100 text-center">
                          <div className="max-w-2xl mx-auto space-y-2 mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.signalWave.title}</h3>
                            {sec.signalWave.subtitle && <p className="text-[10px] text-slate-400 font-medium">{sec.signalWave.subtitle}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto mb-6">
                            <div className="p-4 border border-slate-150 rounded-xl bg-slate-50/40 space-y-2">
                              <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-wider">{sec.signalWave.leftLabel}</span>
                              <div className="text-base font-black text-slate-600">{sec.signalWave.leftValue}</div>
                            </div>
                            <div className="p-4 border border-blue-150 rounded-xl bg-blue-50/20 space-y-2 relative overflow-hidden shadow-inner">
                              <span className="text-[9px] font-bold text-blue-600 block uppercase tracking-wider">{sec.signalWave.rightLabel}</span>
                              <div className="text-base font-black text-blue-700">{sec.signalWave.rightValue}</div>
                              {/* Simple signal indicator wave graphics mock */}
                              <div className="w-16 h-1.5 bg-blue-500/20 rounded mx-auto mt-2 animate-pulse" />
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-455 max-w-xl mx-auto font-medium leading-relaxed italic border-t border-slate-100 pt-4">
                            “ {sec.signalWave.description} ”
                          </p>
                        </div>
                      )}

                      {/* Render type: BENTO GRID */}
                      {sec.type === 'bentoGrid' && sec.bentoGrid && (
                        <div className="py-12 px-8 bg-slate-50/50 border-b border-slate-100 text-center">
                          <div className="max-w-2xl mx-auto space-y-2 mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.bentoGrid.title}</h3>
                            {sec.bentoGrid.subtitle && <p className="text-[10px] text-slate-400 font-medium">{sec.bentoGrid.subtitle}</p>}
                          </div>
                          {/* Bento Grid asymmetric arrangement mockup */}
                          <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
                            {sec.bentoGrid.items.map((item, itemIdx) => {
                              const isLarge = item.size === 'large';
                              const isTall = item.size === 'tall';
                              return (
                                <div
                                  key={itemIdx}
                                  className={`p-4 rounded-xl border border-slate-150/70 shadow-sm flex flex-col justify-between overflow-hidden relative min-h-[100px] ${item.colorBg || 'bg-white text-slate-800'} ${
                                    isLarge ? 'col-span-2' : isTall ? 'row-span-2' : 'col-span-1'
                                  }`}
                                >
                                  <div className="space-y-1 z-10">
                                    <h4 className="text-[10px] font-black leading-snug">{item.title}</h4>
                                    {item.subtitle && <p className="text-[8px] opacity-75 leading-normal">{item.subtitle}</p>}
                                  </div>
                                  {item.imageUrl && (
                                    <img src={item.imageUrl} className="absolute right-0 bottom-0 opacity-20 w-12 object-contain" />
                                  )}
                                  <span className="text-[7px] opacity-50 uppercase tracking-widest mt-3 block">特性 {itemIdx + 1}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Render type: TIMELINE */}
                      {sec.type === 'timeline' && sec.timeline && (
                        <div className="py-12 px-8 bg-white border-b border-slate-100">
                          <div className="text-center mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.timeline.title}</h3>
                            {sec.timeline.subtitle && <p className="text-[10px] text-slate-400 mt-1">{sec.timeline.subtitle}</p>}
                            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-2" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {sec.timeline.steps.map((step, stepIdx) => (
                              <div key={stepIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 relative text-left flex flex-col space-y-2">
                                <div className="flex justify-between items-center text-[9px] font-bold text-blue-600">
                                  <span>{step.duration || `阶段 ${stepIdx + 1}`}</span>
                                  <span className="text-slate-300">0{stepIdx + 1}</span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-800">{step.title}</h4>
                                <p className="text-[10px] text-slate-450 leading-normal font-medium">{step.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render type: FEATURES */}
                      {sec.type === 'features' && sec.features && (
                        <div className="py-12 px-8 bg-slate-50/50 border-b border-slate-100">
                          <div className="text-center mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.features.title}</h3>
                            {sec.features.subtitle && <p className="text-[10px] text-slate-400 mt-1">{sec.features.subtitle}</p>}
                            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-2" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sec.features.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="bg-white p-4 rounded-xl border border-slate-150 relative text-left flex flex-col space-y-2">
                                {item.highlightText && (
                                  <span className="absolute top-2 right-2 text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 py-0.5 rounded">
                                    {item.highlightText}
                                  </span>
                                )}
                                <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                                <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                                <p className="text-[10px] text-slate-450 leading-normal font-medium">{item.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render type: FAQ */}
                      {sec.type === 'faq' && sec.faq && (
                        <div className="py-12 px-8 bg-white border-b border-slate-100">
                          <div className="text-center mb-8">
                            <h3 className="text-sm font-bold text-slate-900">{sec.faq.title}</h3>
                            {sec.faq.subtitle && <p className="text-[10px] text-slate-400 mt-1">{sec.faq.subtitle}</p>}
                            <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-2" />
                          </div>
                          <div className="space-y-3">
                            {sec.faq.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="p-4 border border-slate-150 rounded-xl bg-slate-50/30 text-left space-y-1.5">
                                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-1 py-0.5 rounded">Q</span>
                                  <span>{item.question}</span>
                                </h4>
                                <p className="text-[10px] text-slate-450 leading-normal font-medium pl-5">{item.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
