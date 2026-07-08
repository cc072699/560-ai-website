'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, Loader2, X, Settings as SettingsIcon, Globe, MapPin, Save } from 'lucide-react';
import type { SiteConfig } from '@/types';

const defaultConfig: SiteConfig = {
  companyName: '',
  companyNameEn: '',
  companyFullName: '',
  copyright: '',
  icp: '',
  contact: { phone: '', email: '', address: '' },
  social: { wechat: '', weibo: '', linkedin: '' },
  nav: [],
};

export default function SettingsPage() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    fetch('/api/admin/site')
      .then((r) => r.json())
      .then((data) => { setConfig(data); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error();
      showToast('配置已保存，官网将在 30 秒内自动更新并生效');
    } catch {
      showToast('配置保存失败，请检查网络重试', 'error');
    } finally {
      setSaving(false);
    }
  };

  const setContact = (key: keyof SiteConfig['contact'], val: string) =>
    setConfig({ ...config, contact: { ...config.contact, [key]: val } });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-xs font-medium">获取全局配置数据中...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-8 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2.5 transition-all duration-300 animate-slide-in ${
          toast.type === 'success'
            ? 'bg-emerald-500 text-white shadow-emerald-500/10'
            : 'bg-rose-500 text-white shadow-rose-500/10'
        }`}>
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-slate-200/50">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-blue-600" />
          全局配置
        </h1>
        <p className="text-xs text-slate-400 mt-1">更新官网基础信息、页脚版权声明、ICP 备案号以及服务联系方式</p>
      </div>

      <div className="space-y-6">
        {/* Company Info */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">公司基本元数据</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Field label="公司简称 (显示于导航栏)">
              <input
                id="settings-company-name"
                type="text"
                value={config.companyName}
                onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                className={inputCls}
                placeholder="如：五六零人工智能科技"
              />
            </Field>
            <Field label="英文简称 (显示于导航栏副标)">
              <input
                type="text"
                value={config.companyNameEn}
                onChange={(e) => setConfig({ ...config, companyNameEn: e.target.value })}
                className={inputCls}
                placeholder="如：560 AI TECHNOLOGY"
              />
            </Field>
            <Field label="公司法定全称 (显示于简介块)">
              <input
                type="text"
                value={config.companyFullName}
                onChange={(e) => setConfig({ ...config, companyFullName: e.target.value })}
                className={inputCls}
                placeholder="如：五六零人工智能科技（北海）有限公司"
              />
            </Field>
            <Field label="版权所有声明 (页脚呈现)">
              <input
                type="text"
                value={config.copyright}
                onChange={(e) => setConfig({ ...config, copyright: e.target.value })}
                className={inputCls}
                placeholder="如：© 2026 560 AI Technology Co., Ltd. 保留所有权利。"
              />
            </Field>
            <Field label="工信部 ICP 备案号 (可选)">
              <input
                type="text"
                value={config.icp}
                onChange={(e) => setConfig({ ...config, icp: e.target.value })}
                placeholder="例：桂ICP备xxxxxxxx号-1"
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        {/* Contact info */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">联系方式配置</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Field label="服务热线电话">
              <input
                id="settings-phone"
                type="text"
                value={config.contact.phone}
                onChange={(e) => setContact('phone', e.target.value)}
                placeholder="如：400-880-0560"
                className={inputCls}
              />
            </Field>
            <Field label="官方联络邮箱">
              <input
                type="email"
                value={config.contact.email}
                onChange={(e) => setContact('email', e.target.value)}
                placeholder="如：contact@560ai.com"
                className={inputCls}
              />
            </Field>
            <Field label="企业办公地址">
              <input
                type="text"
                value={config.contact.address}
                onChange={(e) => setContact('address', e.target.value)}
                placeholder="如：广西北海市银海区高新技术产业园"
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            id="save-settings-btn"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/15 transition-all duration-200"
          >
            {saving ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
            {saving ? '正在写入系统配置...' : '保存全局设置'}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  'w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all bg-white';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      {children}
    </div>
  );
}
