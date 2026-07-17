'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Loader2, Image as ImageIcon, LayoutGrid, Layers, Settings, Calendar, ArrowLeft, Palette, ChevronDown, Home, Navigation } from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { Product, ProductLayout } from '@/types';

const emptyProduct = (): Omit<Product, 'id' | 'order'> => ({
  title: '',
  tagline: '',
  category: '',
  description: '',
  features: ['', '', ''],
  imageUrl: '',
  imageAlt: '',
  showInHome: true,
  showInNavbar: true,
  layout: 'text-left',
});

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyProduct());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [categories, setCategories] = useState<string[]>(['智能决策与分析', '自动化与办公协同', '工业智能物联']);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchProducts = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data);
    if (!silent) setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/site');
        const data = await res.json();
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const editId = params.get('edit');
      if (editId && products.length > 0) {
        const found = products.find((p) => p.id === editId);
        if (found) {
          openEdit(found);
        }
      }
    }
  }, [products]);

  const openNew = () => {
    setEditingId('new');
    setFormData(emptyProduct());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      tagline: p.tagline || '',
      category: p.category || '',
      description: p.description,
      features: [...p.features, '', '', ''].slice(0, Math.max(3, p.features.length)),
      imageUrl: p.imageUrl,
      imageAlt: p.imageAlt,
      showInHome: p.showInHome,
      showInNavbar: p.showInNavbar,
      layout: p.layout,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditingId(null); };

  const handleSave = async () => {
    setSaving(true);
    const cleanFeatures = formData.features.filter((f) => f.trim() !== '');
    const payload = { ...formData, features: cleanFeatures };

    try {
      if (editingId === 'new') {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        showToast('产品已创建');
      } else {
        const res = await fetch(`/api/admin/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        showToast('产品已更新');
      }
      setEditingId(null);
      fetchProducts(true);
    } catch {
      showToast('保存失败，请重试', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleShowInHome = async (p: Product) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showInHome: !p.showInHome }),
    });
    fetchProducts(true);
    showToast(p.showInHome ? '已在首页隐藏' : '已在首页显示');
  };

  const handleToggleShowInNavbar = async (p: Product) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showInNavbar: !p.showInNavbar }),
    });
    fetchProducts(true);
    showToast(p.showInNavbar ? '已在导航隐藏' : '已在导航显示');
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/products/${deleteId}`, { method: 'DELETE' });
    if (res.ok) { showToast('已删除'); fetchProducts(true); }
    else showToast('删除失败', 'error');
    setDeleteId(null);
  };

  const setFeature = (idx: number, val: string) => {
    const features = [...formData.features];
    features[idx] = val;
    setFormData({ ...formData, features });
  };

  const addFeature = () => setFormData({ ...formData, features: [...formData.features, ''] });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-20 right-8 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2.5 transition-all duration-300 animate-bounce-in ${
          toast.type === 'success'
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20'
            : 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-rose-500/20'
        }`}>
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          <span>{toast.msg}</span>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="确认删除产品？"
        description="此操作不可撤销，删除后官网将不再显示该产品。"
        confirmLabel="确认删除"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600">
            <Layers className="w-5.5 h-5.5" />
            <span className="text-sm font-bold uppercase tracking-widest">产品中心</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {editingId !== null ? '配置产品档案' : '产品线管控'}
          </h1>
          <p className="text-base text-slate-500">
            {editingId !== null ? '通过表单实时调整并在下方预览实际渲染效果' : '管理在官网主推的人工智能、业务协同及深度学习决策产品'}
          </p>
        </div>
        {editingId === null ? (
          <button
            id="add-product-btn"
            onClick={openNew}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-base font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>新增核心产品</span>
          </button>
        ) : (
          <button
            onClick={cancelEdit}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-800 text-sm font-semibold bg-white hover:bg-slate-50 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回产品管理</span>
          </button>
        )}
      </div>

      {/* Editor Block & Real-time Preview Block */}
      {editingId !== null && (
        <div className="space-y-8 animate-fade-in">
          {/* Editor Container */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden transition-all duration-300">
            <div className="bg-slate-50 border-b border-slate-200/60 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Settings className="w-4 h-4" />
                </span>
                <h2 className="text-base font-bold text-slate-800">
                  {editingId === 'new' ? '创建全新产品档案' : '更新产品数据'}
                </h2>
              </div>
              <button
                onClick={cancelEdit}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Section 1: Basic Info */}
              <div className="bg-slate-50/30 rounded-2xl p-6 border border-slate-200/50 space-y-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/60 pb-3">
                  <span className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
                  基本信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">产品名称</label>
                    <input
                      id="product-title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="请输入产品名称（如：非结构化知识资产管理平台）"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all bg-white hover:border-slate-350"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">产品分类</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all bg-white hover:border-slate-350 cursor-pointer font-semibold"
                    >
                      <option value="">请选择产品所属分类</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      {formData.category && !categories.includes(formData.category) && (
                        <option value={formData.category}>{formData.category} (自定义)</option>
                      )}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1.5 font-bold">
                      💡 您可以在 <Link href="/admin/products/stats" className="text-blue-600 underline">首页/导航统计看板</Link> 中统一新增或修改分类词库选项。
                    </p>
                  </div>

                  {/* Tagline */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">产品一句话宣传语 / 卖点</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="请输入产品宣传语（如：海量企业文档语义解析与毫秒级智能知识定位平台）"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all bg-white hover:border-slate-350"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">核心产品简介</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="简单阐述产品的核心功能、主要受众以及解决的核心痛点..."
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all resize-none bg-white hover:border-slate-350"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Features */}
              <div className="bg-slate-50/30 rounded-2xl p-6 border border-slate-200/50 space-y-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/60 pb-3">
                  <span className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
                  功能特性与亮点 (前台展示为核心功能列表)
                </h3>
                <div className="space-y-3">
                  {formData.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <input
                        type="text"
                        value={f}
                        onChange={(e) => setFeature(idx, e.target.value)}
                        placeholder={`请输入亮点细节 ${idx + 1}`}
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all bg-white hover:border-slate-350"
                      />
                    </div>
                  ))}
                  <div className="pt-2 pl-9">
                    <button
                      type="button"
                      onClick={addFeature}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-650 hover:text-blue-500 transition-all cursor-pointer"
                    >
                      + 增加新的功能特性
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 3: Media & Visibility */}
              <div className="bg-slate-50/30 rounded-2xl p-6 border border-slate-200/50 space-y-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/60 pb-3">
                  <span className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
                  媒体与呈现设置
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload image */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">产品主宣传图</label>
                    <ImageUpload
                      label="产品主宣传图"
                      value={formData.imageUrl}
                      onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                      folder={editingId !== 'new' ? `products/${editingId}` : undefined}
                    />
                  </div>

                  {/* Layout direction */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">页面排版对齐 (PC端生效)</label>
                    <select
                      value={formData.layout}
                      onChange={(e) => setFormData({ ...formData, layout: e.target.value as ProductLayout })}
                      className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all hover:border-slate-350"
                    >
                      <option value="text-left">左文字，右图片</option>
                      <option value="text-right">左图片，右文字</option>
                    </select>
                  </div>

                  {/* Visible indicators */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">首页展示</label>
                      <select
                        value={formData.showInHome ? '1' : '0'}
                        onChange={(e) => setFormData({ ...formData, showInHome: e.target.value === '1' })}
                        className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all hover:border-slate-350"
                      >
                        <option value="1">在首页显示</option>
                        <option value="0">不在首页显示</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">导航栏展示</label>
                      <select
                        value={formData.showInNavbar ? '1' : '0'}
                        onChange={(e) => setFormData({ ...formData, showInNavbar: e.target.value === '1' })}
                        className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all hover:border-slate-350"
                      >
                        <option value="1">在导航下拉显示</option>
                        <option value="0">不在导航下拉显示</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-slate-50 border-t border-slate-200/60 px-8 py-5 flex gap-3 justify-end">
              <button
                onClick={cancelEdit}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                id="save-product-btn"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? '保存至核心库...' : '发布产品档案'}
              </button>
            </div>
          </div>

          {/* Real-time Website Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
                ✨ 前台页面实时排版预览效果 (Web Preview)
              </h3>
              <span className="text-xs text-slate-400 font-medium">前台网站页面实际渲染效果预览</span>
            </div>

            {/* Website replica block */}
            <div className="relative border border-slate-200/60 rounded-2xl p-8 md:p-12 bg-white overflow-hidden shadow-inner min-h-[350px]">
              {/* Ambient Glows mimicking HomeClient */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.25] pointer-events-none z-0" />
              <div className="absolute top-[10%] left-[5%] w-[400px] h-[300px] bg-blue-50/70 rounded-full blur-[80px] pointer-events-none z-0" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                {/* Text column */}
                <div className={`lg:col-span-5 flex flex-col justify-center text-left ${formData.layout === 'text-left' ? '' : 'order-1 lg:order-2'}`}>
                  <span className="inline-block px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-xs font-semibold text-blue-600 mb-4 w-fit">
                    {formData.category || '产品分类'}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                    {formData.title || '产品名称'}
                  </h3>
                  <p className="text-sm font-semibold text-blue-600/90 mb-6 leading-normal">
                    {formData.tagline || '这里是一句话产品卖点宣传语'}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 indent-[2em]">
                    {formData.description || '这里是核心产品简介。请输入描述，此区域将实时呈现排版效果...'}
                  </p>
                  
                  {/* Features preview list */}
                  {formData.features && formData.features.some(f => f.trim() !== '') ? (
                    <ul className="space-y-4 text-sm text-gray-650 leading-relaxed border-l-2 border-blue-500/30 pl-4">
                      {formData.features.filter(f => f.trim() !== '').map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">✓</span>
                          <span className="leading-relaxed">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400 italic">暂无添加任何特性亮点</p>
                  )}
                </div>

                {/* Image column */}
                <div className={`lg:col-span-7 rounded-2xl overflow-hidden aspect-video border border-gray-200/80 shadow-md relative bg-slate-50 ${formData.layout === 'text-left' ? '' : 'order-2 lg:order-1'}`}>
                  {formData.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.imageUrl}
                      alt={formData.imageAlt || 'Preview Image'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-100">
                      <ImageIcon className="w-8 h-8 opacity-45 animate-pulse" />
                      <span className="text-xs font-semibold">暂无上传图片</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid List View */}
      {editingId === null && (
        loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-sm font-bold tracking-wider">从数据存储池获取产品矩阵...</span>
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center gap-3">
                <div className="p-3 bg-slate-50 text-slate-300 rounded-2xl">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <span className="text-sm font-bold text-slate-400">目前暂无产品信息，点击右上角按钮进行添加</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p) => {
                  const isExpanded = expandedId === p.id;
                  return (
                  <div
                    key={p.id}
                    className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col group ${
                      isExpanded ? 'border-blue-300 ring-1 ring-blue-200/60 lg:col-span-3' : 'border-slate-200/80'
                    }`}
                  >
                    {/* Header (always visible) — clickable to toggle expand */}
                    <div
                      className="cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    >
                      {/* Cover image area */}
                      <div className="relative aspect-[16/10] bg-slate-50 overflow-hidden border-b border-slate-100">
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.imageUrl}
                            alt={p.imageAlt}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-50">
                            <ImageIcon className="w-8 h-8 opacity-65" />
                            <span className="text-xs font-bold uppercase tracking-wider">无图展示</span>
                          </div>
                        )}
                        {/* Expand indicator */}
                        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-full p-1.5 shadow-sm">
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-300 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {/* Meta info & content (compact, only when collapsed) */}
                      {!isExpanded && (
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex gap-1.5 flex-wrap min-w-0">
                              <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md text-[11px] font-bold text-blue-600 tracking-wider truncate max-w-[120px]">
                                {p.category}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 border border-slate-200/50 rounded-md text-[11px] font-bold text-slate-500 tracking-wider">
                                {p.layout === 'text-left' ? '文左图右' : '图左文右'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-black shrink-0">
                              <Calendar className="w-3 h-3" />
                              <span>NO. {p.id}</span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                              {p.title}
                            </h3>
                            <p className="text-[13px] font-semibold text-blue-650 leading-snug line-clamp-1">
                              {p.tagline}
                            </p>
                            <p className="text-[13px] text-slate-650 line-clamp-2 leading-relaxed indent-[2em]">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expanded detail panel */}
                    {isExpanded && (
                      <div className="p-5 space-y-4 border-b border-slate-100 bg-gradient-to-br from-slate-50/50 to-white animate-fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                          {/* Left: meta + description */}
                          <div className="lg:col-span-2 space-y-3">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex gap-1.5 flex-wrap">
                                <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-md text-xs font-bold text-blue-600 tracking-wider">
                                  {p.category}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 border border-slate-200/50 rounded-md text-xs font-bold text-slate-500 tracking-wider">
                                  {p.layout === 'text-left' ? '文左图右' : '图左文右'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-black">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>NO. {p.id}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-xl font-black text-slate-900 leading-snug">
                                {p.title}
                              </h3>
                              <p className="text-sm font-bold text-blue-650 leading-normal">
                                {p.tagline}
                              </p>
                              <p className="text-sm text-slate-650 leading-relaxed indent-[2em]">
                                {p.description}
                              </p>
                            </div>
                          </div>

                          {/* Right: features list */}
                          {p.features && p.features.filter(f => f.trim() !== '').length > 0 && (
                            <div className="lg:col-span-1 lg:border-l lg:border-slate-200/60 lg:pl-5">
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                核心特性亮点
                              </div>
                              <ul className="space-y-1.5">
                                {p.features.filter(f => f.trim() !== '').map((f, i) => (
                                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700 leading-snug">
                                    <span className="text-blue-500 font-bold mt-0.5 shrink-0">✓</span>
                                    <span>{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions footer — always visible */}
                    <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-150/60 flex items-center justify-between gap-3 flex-wrap">
                      {/* Visibility status group */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-0.5">展示</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleShowInHome(p); }}
                          title={p.showInHome ? '已在首页"产品中心"区块展示，点击隐藏' : '当前未在首页展示，点击发布到首页'}
                          className={`group flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${
                            p.showInHome
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600'
                          }`}
                        >
                          <Home className="w-3 h-3" />
                          <span>首页</span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleShowInNavbar(p); }}
                          title={p.showInNavbar ? '已在顶部导航"产品中心"下拉菜单中显示，点击隐藏' : '当前未在导航下拉菜单中显示，点击加入导航'}
                          className={`group flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${
                            p.showInNavbar
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                              : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600'
                          }`}
                        >
                          <Navigation className="w-3 h-3" />
                          <span>导航</span>
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="h-5 w-px bg-slate-200 hidden sm:block" />

                      {/* Management actions group */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-0.5">操作</span>
                        <Link
                          href={`/admin/products/${p.id}/design`}
                          onClick={(e) => e.stopPropagation()}
                          title="设计产品详情页的 section 模块（Hero/Capabilities/Architecture 等）"
                          className="group flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-[11px] font-bold hover:bg-blue-100 transition-all cursor-pointer"
                        >
                          <Palette className="w-3 h-3" />
                          <span>设计</span>
                        </Link>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(p); }}
                          title="编辑产品基础信息（名称/分类/简介/图片等）"
                          className="group flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[11px] font-bold hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>编辑</span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); }}
                          title="永久删除该产品（不可恢复）"
                          className="group flex items-center gap-1 px-2 py-1 bg-white border border-rose-200 text-rose-600 rounded-md text-[11px] font-bold hover:bg-rose-50 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>删除</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
