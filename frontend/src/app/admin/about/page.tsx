'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Check,
  Loader2,
  X,
  Save,
  FileText,
  Plus,
  Trash2,
  Image as ImageIcon,
  GripVertical,
} from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { AboutPageData, AboutSlide, CultureTimelineItem } from '@/types';

const defaultData: AboutPageData = {
  hero: { title: '', description: '', imageUrl: '' },
  slides: [],
  philosophy: {
    title: '',
    left: { title: '', description: '', image: '' },
    right: { title: '', description: '', image: '' },
  },
  culture: {
    title: '',
    subtitle: '',
    description: '',
    heading: '',
    timeline: [],
  },
};

const TABS = [
  { key: 'hero', label: '首屏配置', sub: 'Hero' },
  { key: 'slides', label: '核心优势', sub: 'Slides' },
  { key: 'philosophy', label: '核心理念', sub: 'Philosophy' },
  { key: 'culture', label: '企业文化', sub: 'Culture' },
] as const;

export default function AboutAdminPage() {
  const [data, setData] = useState<AboutPageData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    fetch('/api/admin/about')
      .then((r) => r.json())
      .then((d: AboutPageData) => {
        const merged: AboutPageData = {
          ...defaultData,
          ...d,
          hero: { ...defaultData.hero, ...(d?.hero || {}) },
          philosophy: {
            ...defaultData.philosophy,
            ...(d?.philosophy || {}),
            left: { ...defaultData.philosophy.left, ...(d?.philosophy?.left || {}) },
            right: { ...defaultData.philosophy.right, ...(d?.philosophy?.right || {}) },
          },
          culture: {
            ...defaultData.culture,
            ...(d?.culture || {}),
            timeline: d?.culture?.timeline || [],
          },
          slides: d?.slides || [],
        };
        setData(merged);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('保存失败');
      showToast('关于我们页面配置已成功保存');
    } catch {
      showToast('保存失败，请检查网络后重试', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Hero updaters ──────────────────────────────────────────
  const updateHero = (key: string, val: string) =>
    setData({ ...data, hero: { ...data.hero, [key]: val } });

  // ── Slides updaters ────────────────────────────────────────
  const updateSlide = (index: number, key: keyof AboutSlide, val: string) => {
    const slides = [...data.slides];
    slides[index] = { ...slides[index], [key]: val };
    setData({ ...data, slides });
  };

  const addSlide = () =>
    setData({ ...data, slides: [...data.slides, { category: '', title: '', description: '', image: '' }] });

  const removeSlide = (index: number) =>
    setData({ ...data, slides: data.slides.filter((_, i) => i !== index) });

  // ── Philosophy updaters ────────────────────────────────────
  const updatePhilosophySide = (side: 'left' | 'right', key: string, val: string) =>
    setData({
      ...data,
      philosophy: {
        ...data.philosophy,
        [side]: { ...data.philosophy[side], [key]: val },
      },
    });

  // ── Timeline updaters ──────────────────────────────────────
  const updateTimelineItem = (index: number, key: keyof CultureTimelineItem, val: string) => {
    const timeline = [...data.culture.timeline];
    timeline[index] = { ...timeline[index], [key]: val };
    setData({ ...data, culture: { ...data.culture, timeline } });
  };

  const addTimelineItem = () =>
    setData({
      ...data,
      culture: {
        ...data.culture,
        timeline: [...data.culture.timeline, { tag: '', title: '', description: '', image: '', node: '' }],
      },
    });

  const removeTimelineItem = (index: number) =>
    setData({
      ...data,
      culture: {
        ...data.culture,
        timeline: data.culture.timeline.filter((_, i) => i !== index),
      },
    });

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-xs font-semibold">加载关于页面配置数据中...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 pb-28">
      {/* ── Toast ───────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed top-20 right-8 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2.5 transition-all duration-300 animate-slide-in ${
            toast.type === 'success'
              ? 'bg-emerald-500 text-white shadow-emerald-500/10'
              : 'bg-rose-500 text-white shadow-rose-500/10'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="pb-4 border-b border-slate-200/50">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          公司简介管理
        </h1>
        <p className="text-xs text-slate-400 mt-1">管理 /about 页面的所有区块内容、图片配置及文案编排</p>
      </div>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            {tab.label}
            <span className="text-[9px] font-medium opacity-60">{tab.sub}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Hero ────────────────────────────────────────── */}
      {activeTab === 'hero' && (
        <SectionCard icon={ImageIcon} title="首屏配置" desc="Hero 区域的标题、描述与背景图片">
          <Field label="主标题">
            <input
              type="text"
              value={data.hero.title}
              onChange={(e) => updateHero('title', e.target.value)}
              className={inputCls}
              placeholder="如：科技点亮实体产业"
            />
          </Field>
          <Field label="描述文本">
            <textarea
              value={data.hero.description}
              onChange={(e) => updateHero('description', e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Hero 区域描述文字"
            />
          </Field>
          <Field label="背景图片">
            <ImageUpload
              label="上传 Hero 背景图"
              value={data.hero.imageUrl}
              onChange={(url) => updateHero('imageUrl', url)}
            />
          </Field>
        </SectionCard>
      )}

      {/* ── Tab: Slides ───────────────────────────────────────── */}
      {activeTab === 'slides' && (
        <SectionCard icon={ImageIcon} title="核心优势" desc="公司核心优势幻灯片列表">
          <div className="space-y-6">
            {data.slides.map((slide, i) => (
              <div
                key={i}
                className="border border-slate-200 rounded-xl p-5 space-y-4 relative bg-white/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    优势 #{i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSlide(i)}
                    className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="分类标签">
                      <input
                        type="text"
                        value={slide.category}
                        onChange={(e) => updateSlide(i, 'category', e.target.value)}
                        className={inputCls}
                        placeholder="如：有硬实力的技术基因 / Tech DNA"
                      />
                    </Field>
                    <Field label="标题">
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => updateSlide(i, 'title', e.target.value)}
                        className={inputCls}
                        placeholder="如：源自深圳的前沿算法沉淀"
                      />
                    </Field>
                  </div>
                  <Field label="描述">
                    <textarea
                      value={slide.description}
                      onChange={(e) => updateSlide(i, 'description', e.target.value)}
                      rows={2}
                      className={`${inputCls} resize-none`}
                      placeholder="幻灯片描述文本"
                    />
                  </Field>
                  <Field label="配图">
                    <ImageUpload
                      label={`上传优势 #${i + 1} 配图`}
                      value={slide.image}
                      onChange={(url) => updateSlide(i, 'image', url)}
                    />
                  </Field>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addSlide}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-semibold text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              新增优势条目
            </button>
          </div>
        </SectionCard>
      )}

      {/* ── Tab: Philosophy ───────────────────────────────────── */}
      {activeTab === 'philosophy' && (
        <SectionCard icon={ImageIcon} title="核心理念" desc="公司核心理念区块配置">
          <Field label="区块标题">
            <input
              type="text"
              value={data.philosophy.title}
              onChange={(e) =>
                setData({ ...data, philosophy: { ...data.philosophy, title: e.target.value } })
              }
              className={inputCls}
              placeholder="如：核心理念"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-white/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">左侧 — 生态构建</h3>
              <Field label="标题">
                <input
                  type="text"
                  value={data.philosophy.left.title}
                  onChange={(e) => updatePhilosophySide('left', 'title', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="描述">
                <textarea
                  value={data.philosophy.left.description}
                  onChange={(e) => updatePhilosophySide('left', 'description', e.target.value)}
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </Field>
              <Field label="配图">
                <ImageUpload
                  label="上传左侧配图"
                  value={data.philosophy.left.image}
                  onChange={(url) => updatePhilosophySide('left', 'image', url)}
                />
              </Field>
            </div>
            <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-white/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">右侧 — 技术赋能</h3>
              <Field label="标题">
                <input
                  type="text"
                  value={data.philosophy.right.title}
                  onChange={(e) => updatePhilosophySide('right', 'title', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="描述">
                <textarea
                  value={data.philosophy.right.description}
                  onChange={(e) => updatePhilosophySide('right', 'description', e.target.value)}
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </Field>
              <Field label="配图">
                <ImageUpload
                  label="上传右侧配图"
                  value={data.philosophy.right.image}
                  onChange={(url) => updatePhilosophySide('right', 'image', url)}
                />
              </Field>
            </div>
          </div>
        </SectionCard>
      )}

      {/* ── Tab: Culture ──────────────────────────────────────── */}
      {activeTab === 'culture' && (
        <SectionCard icon={ImageIcon} title="企业文化" desc="企业文化区块与时间线配置">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="标题">
              <input
                type="text"
                value={data.culture.title}
                onChange={(e) =>
                  setData({ ...data, culture: { ...data.culture, title: e.target.value } })
                }
                className={inputCls}
                placeholder="如：五六零"
              />
            </Field>
            <Field label="副标题">
              <input
                type="text"
                value={data.culture.subtitle}
                onChange={(e) =>
                  setData({ ...data, culture: { ...data.culture, subtitle: e.target.value } })
                }
                className={inputCls}
                placeholder="如：语出「五洲互联，六力聚能，零碳未来」"
              />
            </Field>
          </div>
          <Field label="描述">
            <textarea
              value={data.culture.description}
              onChange={(e) =>
                setData({ ...data, culture: { ...data.culture, description: e.target.value } })
              }
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </Field>
          <Field label="区块内标题">
            <input
              type="text"
              value={data.culture.heading}
              onChange={(e) =>
                setData({ ...data, culture: { ...data.culture, heading: e.target.value } })
              }
              className={inputCls}
              placeholder="如：企业文化"
            />
          </Field>

          {/* Timeline items */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              时间线条目 ({data.culture.timeline.length})
            </h3>
            <div className="space-y-4">
              {data.culture.timeline.map((item, i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-xl p-5 space-y-4 relative bg-white/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      条目 #{i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTimelineItem(i)}
                      className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="标签 (Tag)">
                      <input
                        type="text"
                        value={item.tag}
                        onChange={(e) => updateTimelineItem(i, 'tag', e.target.value)}
                        className={inputCls}
                        placeholder="如：品牌标识"
                      />
                    </Field>
                    <Field label="节点标识 (Node)">
                      <input
                        type="text"
                        value={item.node}
                        onChange={(e) => updateTimelineItem(i, 'node', e.target.value)}
                        className={inputCls}
                        placeholder="如：AI"
                      />
                    </Field>
                  </div>
                  <Field label="标题">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateTimelineItem(i, 'title', e.target.value)}
                      className={inputCls}
                      placeholder="如：科技之蓝，普惠之绿"
                    />
                  </Field>
                  <Field label="描述">
                    <textarea
                      value={item.description}
                      onChange={(e) => updateTimelineItem(i, 'description', e.target.value)}
                      rows={2}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                  <Field label="配图">
                    <ImageUpload
                      label={`上传条目 #${i + 1} 配图`}
                      value={item.image}
                      onChange={(url) => updateTimelineItem(i, 'image', url)}
                    />
                  </Field>
                </div>
              ))}
              <button
                type="button"
                onClick={addTimelineItem}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-semibold text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                新增时间线条目
              </button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* ── Fixed Save Bar ─────────────────────────────────── */}
      <div className="fixed bottom-0 left-64 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200/80 px-8 py-4 flex items-center justify-end gap-4 z-40">
        <span className="text-xs text-slate-400">
          {saving ? '正在写入配置...' : '修改后将立即更新 /about 页面'}
        </span>
        <button
          id="save-about-btn"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/15 transition-all duration-200 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
          {saving ? '正在保存...' : '保存配置'}
        </button>
      </div>
    </div>
  );
}

// ── Reusable styled components ──────────────────────────────────

const inputCls =
  'w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all bg-white';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Icon className="w-4 h-4 text-blue-600" />
        <div>
          <h2 className="text-sm font-bold text-slate-800">{title}</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
        </div>
      </div>
      {children}
    </section>
  );
}