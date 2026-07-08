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
  Play
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
                                />
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
                              className="absolute inset-0 w-full h-full object-cover opacity-40"
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
                              {sec.cta.primaryText}
                            </span>
                            <span className="px-4 py-2 border border-white/40 text-white text-xs font-bold rounded-lg cursor-pointer">
                              {sec.cta.secondaryText}
                            </span>
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
