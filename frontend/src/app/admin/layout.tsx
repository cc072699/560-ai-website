import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ShieldCheck, User } from 'lucide-react';

export const metadata: Metadata = {
  title: '管理后台 - 五六零AI',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50/50 font-sans text-base">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Modern Header Bar for Admin */}
        <header className="h-16 bg-white border-b border-slate-150 px-8 flex items-center justify-between shrink-0 shadow-sm relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
              数据中心
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-sm text-slate-500 font-semibold">企业官网内容管控</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Glowing active environment indicator */}
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3.5 py-1 text-sm text-blue-700 font-bold shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <ShieldCheck className="w-4 h-4" />
              <span>管理后台安全验证已开启</span>
            </div>

            <div className="h-4 w-px bg-slate-200" />

            {/* Profile Avatar / Info */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-inner">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-tight">系统管理员</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-auto bg-slate-50/40">
          {children}
        </main>
      </div>
    </div>
  );
}
