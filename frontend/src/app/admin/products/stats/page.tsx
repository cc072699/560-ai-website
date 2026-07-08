'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Package,
  Home,
  Menu,
  EyeOff,
  Palette,
  Pencil,
  Loader2,
  TrendingUp,
  Check,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FolderHeart
} from 'lucide-react';
import type { Product } from '@/types';

export default function ProductsStatsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['智能决策与分析', '自动化与办公协同', '工业智能物联']);
  const [newCatInput, setNewCatInput] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Load products
        const productsRes = await fetch('/api/admin/products');
        const productsData = await productsRes.json();
        setProducts(productsData);

        // Load categories from site config
        const siteRes = await fetch('/api/admin/site');
        const siteData = await siteRes.json();
        if (siteData.categories && Array.isArray(siteData.categories)) {
          setCategories(siteData.categories);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync category library to site config
  const saveCategoriesToBackend = async (updatedCats: string[]) => {
    try {
      const res = await fetch('/api/admin/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: updatedCats }),
      });
      if (!res.ok) throw new Error();
      setCategories(updatedCats);
      showToast('品类库更新成功');
    } catch {
      showToast('保存品类库失败，请重试', 'error');
    }
  };

  // Add Category
  const handleAddCategory = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      showToast('该分类已存在', 'error');
      return;
    }
    const updated = [...categories, trimmed];
    saveCategoriesToBackend(updated);
    setNewCatInput('');
  };

  // Remove Category
  const handleRemoveCategory = (cat: string) => {
    // Check if any product is currently using this category
    const isUsed = products.some((p) => p.category === cat);
    if (isUsed) {
      showToast('该分类正在被产品使用，无法删除', 'error');
      return;
    }
    const updated = categories.filter((c) => c !== cat);
    saveCategoriesToBackend(updated);
  };

  // Quick Update Product Fields (Category, showInHome, showInNavbar)
  const handleQuickUpdateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
        showToast('设置更新成功');
      } else {
        throw new Error();
      }
    } catch {
      showToast('快捷修改失败，请重试', 'error');
    }
  };

  const total = products.length;
  const inHome = products.filter((p) => p.showInHome).length;
  const inNavbar = products.filter((p) => p.showInNavbar).length;
  const inDraft = products.filter((p) => !p.showInHome && !p.showInNavbar).length;

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-sm font-bold tracking-wider">正在汇总数据及词库指标...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in text-left">
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

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100 uppercase">
              数据看板
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">产品矩阵曝光与统计</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">全局监控首页与导航栏的双轨开关曝光情况、以及详情页模版编译状态</p>
        </div>
      </div>

      {/* Metric Cards (Left) & Category Manager (Right) Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Metric 2x2 grid (Takes 8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1: Total */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">总产品数量</p>
              <p className="text-3xl font-black text-slate-900">{total} <span className="text-xs font-bold text-slate-400">款</span></p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-105 transition-transform">
              <Package className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Home */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">首页推荐展示</p>
              <p className="text-3xl font-black text-emerald-600">{inHome} <span className="text-xs font-bold text-slate-400">款</span></p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-105 transition-transform">
              <Home className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Navbar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">导航栏下拉展示</p>
              <p className="text-3xl font-black text-indigo-600">{inNavbar} <span className="text-xs font-bold text-slate-400">款</span></p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-105 transition-transform">
              <Menu className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Drafts */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">未公开草稿/隐藏</p>
              <p className="text-3xl font-black text-slate-500">{inDraft} <span className="text-xs font-bold text-slate-400">款</span></p>
            </div>
            <div className="p-3 bg-slate-50 text-slate-550 rounded-2xl group-hover:scale-105 transition-transform">
              <EyeOff className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Category Manager Card (Takes 4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <FolderHeart className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">所属分类库管理</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full border">
                共 {categories.length} 类
              </span>
            </div>

            {/* Quick input search/add */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                placeholder="添加新分类属性..."
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 bg-white"
              />
              <button
                onClick={handleAddCategory}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-550 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
              >
                添加
              </button>
            </div>

            {/* Category tag badges */}
            <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1 py-1 scrollbar-thin">
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-200 text-[11px] font-semibold hover:border-red-200 transition-colors"
                >
                  <span>{cat}</span>
                  <button
                    onClick={() => handleRemoveCategory(cat)}
                    className="text-slate-400 hover:text-red-500 font-bold ml-1 cursor-pointer"
                    title="从类别库删除"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Audit Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">产品矩阵曝光明细表</h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400">
            总计曝光率：{total ? Math.round(((inHome + inNavbar - inDraft) / total) * 100) : 0}%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase font-black text-xs tracking-wider">
                <th className="px-6 py-4">产品编号 / 名称</th>
                <th className="px-6 py-4">所属分类 (快速修改)</th>
                <th className="px-6 py-4">首页推荐 (快速修改)</th>
                <th className="px-6 py-4">导航下拉 (快速修改)</th>
                <th className="px-6 py-4">详情模版状态</th>
                <th className="px-6 py-4 text-center">快捷入口</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150/60 font-semibold text-slate-650">
              {products.map((p) => {
                const hasBuilder = p.detailSections && p.detailSections.length > 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900">{p.title}</p>
                        <p className="text-[10px] text-slate-400 leading-none font-bold">ID: {p.id}</p>
                      </div>
                    </td>

                    {/* Category Select Dropdown */}
                    <td className="px-6 py-4">
                      <select
                        value={p.category}
                        onChange={(e) => handleQuickUpdateProduct(p.id, { category: e.target.value })}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer transition-all"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        {/* Fallback option if a product's current category isn't in site database config */}
                        {p.category && !categories.includes(p.category) && (
                          <option value={p.category}>{p.category} (外部)</option>
                        )}
                      </select>
                    </td>

                    {/* Home Toggle */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleQuickUpdateProduct(p.id, { showInHome: !p.showInHome })}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          p.showInHome
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-white text-slate-400 border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.showInHome ? 'bg-emerald-500 animate-pulse' : 'bg-slate-350'}`} />
                        <span>{p.showInHome ? '已在主页推荐' : '主页隐藏'}</span>
                      </button>
                    </td>

                    {/* Navbar Toggle */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleQuickUpdateProduct(p.id, { showInNavbar: !p.showInNavbar })}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          p.showInNavbar
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-white text-slate-400 border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.showInNavbar ? 'bg-indigo-500 animate-pulse' : 'bg-slate-350'}`} />
                        <span>{p.showInNavbar ? '已进导航菜单' : '导航隐藏'}</span>
                      </button>
                    </td>

                    {/* Template page builder status */}
                    <td className="px-6 py-4">
                      {hasBuilder ? (
                        <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>模块化 ({p.detailSections!.length}块)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 text-xs">
                          <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
                          <span>降级默认静态</span>
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2 justify-center">
                        <Link
                          href={`/admin/products?edit=${p.id}`}
                          className="p-1.5 bg-slate-50 text-slate-550 border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                          title="编辑产品基础信息"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/design`}
                          className="p-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                          title="设计产品详情页面"
                        >
                          <Palette className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
