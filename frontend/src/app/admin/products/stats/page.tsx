'use client';

import { useState, useEffect } from 'react';
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
  PieChart,
  Grid,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { Product } from '@/types';

export default function ProductsStatsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products for stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const total = products.length;
  const inHome = products.filter((p) => p.showInHome).length;
  const inNavbar = products.filter((p) => p.showInNavbar).length;
  const inDraft = products.filter((p) => !p.showInHome && !p.showInNavbar).length;

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-xs font-bold tracking-wider">正在汇总数据看板指标...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in text-left">
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

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Total */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">总产品数量</p>
            <p className="text-3xl font-black text-slate-900">{total} <span className="text-xs font-bold text-slate-400">款</span></p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-105 transition-transform">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Home */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">首页推荐展示</p>
            <p className="text-3xl font-black text-emerald-600">{inHome} <span className="text-xs font-bold text-slate-400">款</span></p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-105 transition-transform">
            <Home className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Navbar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">导航栏下拉展示</p>
            <p className="text-3xl font-black text-indigo-600">{inNavbar} <span className="text-xs font-bold text-slate-400">款</span></p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-105 transition-transform">
            <Menu className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Drafts */}
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
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase font-black text-[10px] tracking-wider">
                <th className="px-6 py-4">产品编号 / 名称</th>
                <th className="px-6 py-4">所属分类</th>
                <th className="px-6 py-4">首页开关</th>
                <th className="px-6 py-4">导航下拉</th>
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
                        <p className="text-[10px] text-slate-400 leading-none">ID: {p.id}</p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px]">
                        {p.category}
                      </span>
                    </td>

                    {/* Home toggle state */}
                    <td className="px-6 py-4">
                      {p.showInHome ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>已在主页推荐</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-350" />
                          <span>主页隐藏</span>
                        </span>
                      )}
                    </td>

                    {/* Navbar toggle state */}
                    <td className="px-6 py-4">
                      {p.showInNavbar ? (
                        <span className="inline-flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                          <span>已进导航菜单</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-350" />
                          <span>导航隐藏</span>
                        </span>
                      )}
                    </td>

                    {/* Template page builder status */}
                    <td className="px-6 py-4">
                      {hasBuilder ? (
                        <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>模块化 ({p.detailSections!.length}块)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                          <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
                          <span>降级默认静态</span>
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 justify-center">
                        <Link
                          href={`/admin/products/${p.id}/design`}
                          className="p-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                          title="可视化设计"
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
