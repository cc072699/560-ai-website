'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Package,
  FolderOpen,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  Inbox,
  MessageSquare,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [productsOpen, setProductsOpen] = useState(
    pathname.startsWith('/admin/products') ||
    pathname.startsWith('/admin/contact-form') ||
    pathname.startsWith('/admin/contact-submissions')
  );

  const [consultationsOpen, setConsultationsOpen] = useState(
    pathname.startsWith('/admin/consultations')
  );

  useEffect(() => {
    if (
      pathname.startsWith('/admin/products')
    ) {
      setProductsOpen(true);
    }
    if (
      pathname.startsWith('/admin/consultations') ||
      pathname.startsWith('/admin/contact-form') ||
      pathname.startsWith('/admin/contact-submissions')
    ) {
      setConsultationsOpen(true);
    }
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 shrink-0 bg-slate-950 h-screen sticky top-0 flex flex-col border-r border-slate-800/60 shadow-xl relative z-20">
      {/* Background glow in sidebar */}
      <div className="absolute top-0 left-0 w-full h-40 bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Admin Branding Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="p-1 bg-blue-950/40 rounded-lg border border-blue-900/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uploads/brand/logo-whale.png"
              alt="560 AI Logo"
              className="h-5 w-auto"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-row">
              <span className="text-sm font-extrabold text-white tracking-tight leading-none">五六零AI</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-black uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md tracking-wider">
                <ShieldCheck className="w-2.5 h-2.5" />
                后台
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1 text-left overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">数据管理</div>

        {/* Collapsible: 产品管理 */}
        <div className="space-y-1">
          <button
            onClick={() => setProductsOpen(!productsOpen)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 group cursor-pointer ${
              isActive('/admin/products')
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                isActive('/admin/products') ? 'scale-105' : 'group-hover:scale-105'
              }`} />
              <span>产品管理</span>
            </div>
            {productsOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {productsOpen && (
            <div className="pl-6 pr-2 py-1 space-y-1 animate-fade-in">
              <Link
                href="/admin/products"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin/products', true)
                    ? 'text-blue-400 bg-blue-950/30 border-l-2 border-blue-500 pl-3.5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="w-1 h-1 rounded-full bg-current opacity-70" />
                <span>产品矩阵列表</span>
              </Link>
              <Link
                href="/admin/products/stats"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin/products/stats', true)
                    ? 'text-blue-400 bg-blue-950/30 border-l-2 border-blue-500 pl-3.5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="w-1 h-1 rounded-full bg-current opacity-70" />
                <span>首页/导航统计</span>
              </Link>
              <Link
                href="/admin/products/templates"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin/products/templates', true)
                    ? 'text-blue-400 bg-blue-950/30 border-l-2 border-blue-500 pl-3.5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="w-1 h-1 rounded-full bg-current opacity-70" />
                <span>设计模版库介绍</span>
              </Link>
            </div>
          )}
        </div>

        {/* Collapsible: 咨询管理 */}
        <div className="space-y-1">
          <button
            onClick={() => setConsultationsOpen(!consultationsOpen)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 group cursor-pointer ${
              isActive('/admin/consultations') || isActive('/admin/contact-form') || isActive('/admin/contact-submissions')
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                isActive('/admin/consultations') || isActive('/admin/contact-form') || isActive('/admin/contact-submissions') ? 'scale-105' : 'group-hover:scale-105'
              }`} />
              <span>咨询管理</span>
            </div>
            {consultationsOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {consultationsOpen && (
            <div className="pl-6 pr-2 py-1 space-y-1 animate-fade-in">
              <Link
                href="/admin/consultations/config"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin/consultations/config', true)
                    ? 'text-blue-400 bg-blue-950/30 border-l-2 border-blue-500 pl-3.5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0" />
                <span>咨询表单配置</span>
              </Link>
              <Link
                href="/admin/consultations/records"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin/consultations/records', true)
                    ? 'text-blue-400 bg-blue-950/30 border-l-2 border-blue-500 pl-3.5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Inbox className="w-4 h-4 shrink-0" />
                <span>咨询记录</span>
              </Link>
              <Link
                href="/admin/contact-form"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin/contact-form', true)
                    ? 'text-blue-400 bg-blue-950/30 border-l-2 border-blue-500 pl-3.5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0" />
                <span>产品申请表配置</span>
              </Link>
              <Link
                href="/admin/contact-submissions"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin/contact-submissions', true)
                    ? 'text-blue-400 bg-blue-950/30 border-l-2 border-blue-500 pl-3.5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Inbox className="w-4 h-4 shrink-0" />
                <span>产品申请记录</span>
              </Link>
            </div>
          )}
        </div>

        {/* 客户案例 */}
        <Link
          href="/admin/cases"
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 relative group ${
            isActive('/admin/cases')
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/10'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FolderOpen className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            isActive('/admin/cases') ? 'scale-105' : 'group-hover:scale-105'
          }`} />
          <span>客户案例</span>
          {isActive('/admin/cases') && (
            <span className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
          )}
        </Link>

        {/* 公司简介 */}
        <Link
          href="/admin/about"
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 relative group ${
            isActive('/admin/about')
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/10'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            isActive('/admin/about') ? 'scale-105' : 'group-hover:scale-105'
          }`} />
          <span>公司简介</span>
          {isActive('/admin/about') && (
            <span className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
          )}
        </Link>

        {/* 全局配置 */}
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 relative group ${
            isActive('/admin/settings')
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/10'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Settings className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            isActive('/admin/settings') ? 'scale-105' : 'group-hover:scale-105'
          }`} />
          <span>全局配置</span>
          {isActive('/admin/settings') && (
            <span className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
          )}
        </Link>
      </nav>

      {/* Sidebar Footer / Actions */}
      <div className="p-4 border-t border-slate-800/50 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-all duration-200 group"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-white transition-colors" />
          <span>预览官网</span>
        </a>
        <button
          id="admin-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-red-400 transition-colors" />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
}
