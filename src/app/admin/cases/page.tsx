'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Loader2, FolderOpen, Tag, User, Palette, ChevronDown, Calendar, Building2, ArrowLeft, Settings } from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { Case } from '@/types';

const emptyCase = (): Omit<Case, 'id' | 'order'> => ({
  industry: '',
  title: '',
  client: '',
  description: '',
  homeDescription: '',
  stat: '',
  statLabel: '',
  deliverables: ['', '', ''],
  imageUrl: '',
  imageAlt: '',
  visible: true,
  showInHome: true,
});

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyCase());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchCases = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const res = await fetch('/api/admin/cases');
    const data = await res.json();
    setCases(data);
    if (!silent) setLoading(false);
  }, []);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const editId = params.get('edit');
      if (editId && cases.length > 0) {
        const found = cases.find((c) => c.id === editId);
        if (found) {
          openEdit(found);
        }
      }
    }
  }, [cases]);

  const openNew = () => {
    setEditingId('new');
    setFormData(emptyCase());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEdit = (c: Case) => {
    setEditingId(c.id);
    setFormData({
      industry: c.industry,
      title: c.title,
      client: c.client,
      description: c.description,
      homeDescription: c.homeDescription || '',
      stat: c.stat,
      statLabel: c.statLabel,
      deliverables: [...c.deliverables, '', '', ''].slice(0, Math.max(3, c.deliverables.length)),
      imageUrl: c.imageUrl,
      imageAlt: c.imageAlt,
      visible: c.visible,
      showInHome: c.showInHome !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditingId(null); };

  const handleSave = async () => {
    setSaving(true);
    const cleanDeliverables = formData.deliverables.filter((d) => d.trim() !== '');
    const payload = { ...formData, deliverables: cleanDeliverables };

    try {
      if (editingId === 'new') {
        const res = await fetch('/api/admin/cases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        showToast('案例已创建');
      } else {
        const res = await fetch(`/api/admin/cases/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        showToast('案例已更新');
      }
      setEditingId(null);
      fetchCases(true);
    } catch {
      showToast('保存失败，请重试', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisible = async (c: Case) => {
    await fetch(`/api/admin/cases/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !c.visible }),
    });
    fetchCases(true);
    showToast(c.visible ? '已隐藏' : '已显示');
  };

  const handleToggleShowInHome = async (c: Case) => {
    await fetch(`/api/admin/cases/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showInHome: !c.showInHome }),
    });
    fetchCases(true);
    showToast(c.showInHome ? '已在首页隐藏' : '已在首页显示');
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/cases/${deleteId}`, { method: 'DELETE' });
    if (res.ok) { showToast('已删除'); fetchCases(true); }
    else showToast('删除失败', 'error');
    setDeleteId(null);
  };

  const setDeliverable = (idx: number, val: string) => {
    const deliverables = [...formData.deliverables];
    deliverables[idx] = val;
    setFormData({ ...formData, deliverables });
  };

  const addDeliverable = () => setFormData({ ...formData, deliverables: [...formData.deliverables, ''] });

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
        title="确认删除案例？"
        description="此操作不可撤销，删除后官网将不再显示该案例。"
        confirmLabel="确认删除"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <Building2 className="w-5.5 h-5.5" />
            <span className="text-sm font-bold uppercase tracking-widest">标杆案例</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {editingId !== null ? '配置案例档案' : '案例库管控'}
          </h1>
          <p className="text-base text-slate-500">
            {editingId !== null ? '通过表单实时调整并在下方预览实际渲染效果' : '管理在官网展示的企业标杆案例，支持增删改查和前台展示控制'}
          </p>
        </div>
        {editingId === null ? (
          <button
            id="add-case-btn"
            onClick={openNew}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-base font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>新增标杆案例</span>
          </button>
        ) : (
          <button
            onClick={cancelEdit}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-800 text-sm font-semibold bg-white hover:bg-slate-50 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回案例管理</span>
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
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Settings className="w-4 h-4" />
                </span>
                <h2 className="text-base font-bold text-slate-800">
                  {editingId === 'new' ? '创建全新案例档案' : '更新案例数据'}
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
                  <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full" />
                  基本信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">行业板块</label>
                    <input
                      id="case-industry"
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="例：智慧农业、工业智能"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800 transition-all bg-white hover:border-slate-350"
                    />
                  </div>

                  {/* Client */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">客户名称</label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      placeholder="客户企业全称"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800 transition-all bg-white hover:border-slate-350"
                    />
                  </div>

                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">案例标题</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="案例核心标题"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800 transition-all bg-white hover:border-slate-350"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">案例详细描述</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="描述项目从立案、部署到交付的完整过程..."
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800 transition-all resize-none bg-white hover:border-slate-350"
                    />
                  </div>

                  {/* Home Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">首页简述（可选）</label>
                    <textarea
                      value={formData.homeDescription || ''}
                      onChange={(e) => setFormData({ ...formData, homeDescription: e.target.value })}
                      rows={2}
                      placeholder="用于首页展示的简短描述..."
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800 transition-all resize-none bg-white hover:border-slate-350"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Stats and Deliverables */}
              <div className="bg-slate-50/30 rounded-2xl p-6 border border-slate-200/50 space-y-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/60 pb-3">
                  <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full" />
                  指标与交付成果
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stat */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">量化指标</label>
                    <input
                      type="text"
                      value={formData.stat}
                      onChange={(e) => setFormData({ ...formData, stat: e.target.value })}
                      placeholder="例：80%+"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800 transition-all bg-white hover:border-slate-350"
                    />
                  </div>

                  {/* Stat Label */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">指标说明</label>
                    <input
                      type="text"
                      value={formData.statLabel}
                      onChange={(e) => setFormData({ ...formData, statLabel: e.target.value })}
                      placeholder="例：运营效率提升"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800 transition-all bg-white hover:border-slate-350"
                    />
                  </div>

                  {/* Deliverables */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">核心交付成果</label>
                    <div className="space-y-3">
                      {formData.deliverables.map((d, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-400 bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <input
                            type="text"
                            value={d}
                            onChange={(e) => setDeliverable(idx, e.target.value)}
                            placeholder={`交付项 ${idx + 1}`}
                            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800 transition-all bg-white hover:border-slate-350"
                          />
                        </div>
                      ))}
                      <div className="pt-2 pl-9">
                        <button
                          type="button"
                          onClick={addDeliverable}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-650 hover:text-indigo-500 transition-all cursor-pointer"
                        >
                          + 增加新的交付成果
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Media & Visibility */}
              <div className="bg-slate-50/30 rounded-2xl p-6 border border-slate-200/50 space-y-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/60 pb-3">
                  <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full" />
                  媒体与发布设置
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload image */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">案例配图</label>
                    <ImageUpload
                      label="案例配图"
                      value={formData.imageUrl}
                      onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                      folder={editingId !== 'new' ? `cases/${editingId}` : undefined}
                    />
                  </div>

                  {/* Visible status */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">发布状态</label>
                    <select
                      value={formData.visible ? '1' : '0'}
                      onChange={(e) => setFormData({ ...formData, visible: e.target.value === '1' })}
                      className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800 transition-all hover:border-slate-350"
                    >
                      <option value="1">公开展示</option>
                      <option value="0">草稿保存</option>
                    </select>
                  </div>

                  {/* Home visible status */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">首页展示</label>
                    <select
                      value={formData.showInHome !== false ? '1' : '0'}
                      onChange={(e) => setFormData({ ...formData, showInHome: e.target.value === '1' })}
                      className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800 transition-all hover:border-slate-350"
                    >
                      <option value="1">在首页和/cases中展示</option>
                      <option value="0">仅在/cases页面展示</option>
                    </select>
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
                id="save-case-btn"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? '保存至案例库...' : '发布案例档案'}
              </button>
            </div>
          </div>

          {/* Real-time Website Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
                前台页面实时排版预览效果 (Web Preview)
              </h3>
              <span className="text-xs text-slate-400 font-medium">案例卡片在首页和案例列表页的实际渲染效果预览</span>
            </div>

            {/* Preview: Case Card (simulating CasesClient layout) */}
            <div className="relative border border-slate-200/60 rounded-2xl p-8 md:p-10 bg-white overflow-hidden shadow-inner">
              {/* Ambient Glows */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.25] pointer-events-none z-0" />
              <div className="absolute top-[10%] left-[5%] w-[400px] h-[300px] bg-indigo-50/50 rounded-full blur-[80px] pointer-events-none z-0" />

              <div className="relative z-10 flex flex-col gap-8">
                {/* Case hero preview */}
                <div className="relative rounded-2xl overflow-hidden aspect-[21/9] border border-slate-200/80 shadow-md bg-slate-50">
                  {formData.imageUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.imageUrl}
                        alt={formData.imageAlt || '案例预览图'}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/35 to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-100">
                      <FolderOpen className="w-8 h-8 opacity-45 animate-pulse" />
                      <span className="text-xs font-semibold">暂无上传图片</span>
                    </div>
                  )}
                  {/* Hero overlay text */}
                  <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4 backdrop-blur-sm w-fit">
                      <span className="text-[10px] font-bold text-blue-300 tracking-widest uppercase">客户案例 / CASE STUDY</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 leading-none">
                      {formData.title || '案例标题'}
                    </h2>
                    <p className="text-sm md:text-base text-slate-200/90 max-w-xl leading-relaxed">
                      {formData.description || '案例详细描述将展示在此处...'}
                    </p>
                  </div>
                </div>

                {/* Case Info Card Preview (simulating the card in cases list) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Case details */}
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600">
                      <Tag className="w-3 h-3" />
                      {formData.industry || '行业板块'}
                    </div>

                    {formData.client && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <User className="w-3.5 h-3.5" />
                        <span className="font-semibold">{formData.client}</span>
                      </div>
                    )}

                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                      {formData.title || '案例标题'}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed indent-[2em]">
                      {formData.description || '案例描述将在此处展示...'}
                    </p>

                    {/* Deliverables preview */}
                    {formData.deliverables.filter(d => d.trim() !== '').length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">核心交付成果</span>
                        <ul className="space-y-1.5">
                          {formData.deliverables.filter(d => d.trim() !== '').map((d, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                              <span className="text-indigo-500 font-bold mt-0.5 shrink-0">✓</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Stat & StatLabel preview */}
                    {(formData.stat || formData.statLabel) && (
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl px-4 py-2.5">
                        {formData.stat && (
                          <span className="text-xl font-black text-indigo-600">{formData.stat}</span>
                        )}
                        {formData.statLabel && (
                          <span className="text-xs font-semibold text-indigo-500">{formData.statLabel}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: Status indicators & Action preview */}
                  <div className="flex flex-col justify-center items-start lg:items-end gap-4">
                    {/* Visibility badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border"
                        style={{
                          backgroundColor: formData.visible ? '#ecfdf5' : '#f1f5f9',
                          color: formData.visible ? '#059669' : '#64748b',
                          borderColor: formData.visible ? '#a7f3d0' : '#e2e8f0'
                        }}
                      >
                        {formData.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {formData.visible ? '已发布' : '草稿'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border"
                        style={{
                          backgroundColor: formData.showInHome !== false ? '#eef2ff' : '#f1f5f9',
                          color: formData.showInHome !== false ? '#4f46e5' : '#64748b',
                          borderColor: formData.showInHome !== false ? '#c7d2fe' : '#e2e8f0'
                        }}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        {formData.showInHome !== false ? '在首页展示' : '仅案例页展示'}
                      </span>
                    </div>

                    {/* "View Case" CTA preview */}
                    <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                      查看完整案例
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
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
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-sm font-bold tracking-wider">从数据存储池获取案例矩阵...</span>
          </div>
        ) : (
          <>
            {cases.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center gap-3">
                <div className="p-3 bg-slate-50 text-slate-300 rounded-2xl">
                  <FolderOpen className="w-8 h-8" />
                </div>
                <span className="text-sm font-bold text-slate-400">目前暂无案例信息，点击右上角按钮进行添加</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {cases.map((c) => {
                  const isExpanded = expandedId === c.id;
                  return (
                  <div
                    key={c.id}
                    className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col group ${
                      isExpanded ? 'border-indigo-300 ring-1 ring-indigo-200/60 lg:col-span-3' : 'border-slate-200/80'
                    }`}
                  >
                    {/* Header (always visible) — clickable to toggle expand */}
                    <div
                      className="cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    >
                      {/* Cover image area */}
                      <div className="relative aspect-[16/10] bg-slate-50 overflow-hidden border-b border-slate-100">
                        {c.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={c.imageUrl}
                            alt={c.imageAlt}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-50">
                            <FolderOpen className="w-8 h-8 opacity-65" />
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
                              <span className="inline-flex items-center px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-md text-[11px] font-bold text-indigo-600 tracking-wider truncate max-w-[120px]">
                                {c.industry}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 border border-slate-200/50 rounded-md text-[11px] font-bold text-slate-500 tracking-wider">
                                <User className="w-3 h-3" />
                                {c.client}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-black shrink-0">
                              <Calendar className="w-3 h-3" />
                              <span>NO. {c.id}</span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                              {c.title}
                            </h3>
                            <p className="text-[13px] text-slate-650 line-clamp-2 leading-relaxed indent-[2em]">
                              {c.description}
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
                                <span className="inline-flex items-center px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-md text-xs font-bold text-indigo-600 tracking-wider">
                                  {c.industry}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200/50 rounded-md text-xs font-bold text-slate-500 tracking-wider">
                                  <User className="w-3 h-3" />
                                  {c.client}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-black">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>NO. {c.id}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-xl font-black text-slate-900 leading-snug">
                                {c.title}
                              </h3>
                              <p className="text-sm text-slate-650 leading-relaxed indent-[2em]">
                                {c.description}
                              </p>
                            </div>
                            {/* Stats */}
                            {(c.stat || c.statLabel) && (
                              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl px-4 py-2.5">
                                {c.stat && (
                                  <span className="text-xl font-black text-indigo-600">{c.stat}</span>
                                )}
                                {c.statLabel && (
                                  <span className="text-xs font-semibold text-indigo-500">{c.statLabel}</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Right: deliverables list */}
                          {c.deliverables && c.deliverables.filter(d => d.trim() !== '').length > 0 && (
                            <div className="lg:col-span-1 lg:border-l lg:border-slate-200/60 lg:pl-5">
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                核心交付成果
                              </div>
                              <ul className="space-y-1.5">
                                {c.deliverables.filter(d => d.trim() !== '').map((d, i) => (
                                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700 leading-snug">
                                    <span className="text-indigo-500 font-bold mt-0.5 shrink-0">✓</span>
                                    <span>{d}</span>
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
                          onClick={(e) => { e.stopPropagation(); handleToggleVisible(c); }}
                          title={c.visible ? '已在前台显示，点击隐藏' : '当前为草稿状态，点击发布'}
                          className={`group flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${
                            c.visible
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600'
                          }`}
                        >
                          {c.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{c.visible ? '已发布' : '草稿'}</span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleShowInHome(c); }}
                          title={c.showInHome !== false ? '已在首页展示，点击隐藏' : '当前未在首页展示，点击发布到首页'}
                          className={`group flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${
                            c.showInHome !== false
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                              : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600'
                          }`}
                        >
                          <Building2 className="w-3 h-3" />
                          <span>首页</span>
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="h-5 w-px bg-slate-200 hidden sm:block" />

                      {/* Management actions group */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-0.5">操作</span>
                        <Link
                          href={`/admin/cases/${c.id}/design`}
                          onClick={(e) => e.stopPropagation()}
                          title="设计案例详情页的 section 模块（CaseOverview/CaseChallenges/CaseScenes 等）"
                          className="group flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md text-[11px] font-bold hover:bg-indigo-100 transition-all cursor-pointer"
                        >
                          <Palette className="w-3 h-3" />
                          <span>设计</span>
                        </Link>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                          title="编辑案例基础信息（行业/客户/简介/图片等）"
                          className="group flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[11px] font-bold hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>编辑</span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteId(c.id); }}
                          title="永久删除该案例（不可恢复）"
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
