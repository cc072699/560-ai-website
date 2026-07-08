'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Package,
  FolderOpen,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { href: '/admin/products', label: '产品管理', icon: Package },
  { href: '/admin/cases', label: '客户案例', icon: FolderOpen },
  { href: '/admin/settings', label: '全局配置', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 shrink-0 bg-slate-950 min-h-screen flex flex-col border-r border-slate-800/60 shadow-xl relative z-20">
      {/* Background glow in sidebar */}
      <div className="absolute top-0 left-0 w-full h-40 bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Admin Branding Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="text-blue-500 p-1 bg-blue-950/40 rounded-lg border border-blue-900/30">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.95" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
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
      <nav className="flex-1 py-6 px-4 space-y-1">
        <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">数据管理</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                active
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                active ? 'scale-105' : 'group-hover:scale-105'
              }`} />
              {item.label}
              {active && (
                <span className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer / Actions */}
      <div className="p-4 border-t border-slate-800/50 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-all duration-200 group"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-white transition-colors" />
          <span>预览官网</span>
        </a>
        <button
          id="admin-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-red-400 transition-colors" />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
}
