'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Loader2, FolderOpen, Tag, Award, User, Layers, Calendar } from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { Case } from '@/types';

const emptyCase = (): Omit<Case, 'id' | 'order'> => ({
  industry: '',
  title: '',
  client: '',
  description: '',
  stat: '',
  statLabel: '',
  deliverables: ['', '', ''],
  imageUrl: '',
  imageAlt: '',
  visible: true,
});

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyCase());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/cases');
    const data = await res.json();
    setCases(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  const openNew = () => { setEditingId('new'); setFormData(emptyCase()); };
  const openEdit = (c: Case) => {
    setEditingId(c.id);
    setFormData({
      industry: c.industry,
      title: c.title,
      client: c.client,
      description: c.description,
      stat: c.stat,
      statLabel: c.statLabel,
      deliverables: [...c.deliverables, '', '', ''].slice(0, Math.max(3, c.deliverables.length)),
      imageUrl: c.imageUrl,
      imageAlt: c.imageAlt,
      visible: c.visible,
    });
  };
  const cancelEdit = () => setEditingId(null);

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
      fetchCases();
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
    fetchCases();
    showToast(c.visible ? '已隐藏' : '已显示');
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/cases/${deleteId}`, { method: 'DELETE' });
    if (res.ok) { showToast('已删除'); fetchCases(); }
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
      {/* Toast */}
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600">
            <FolderOpen className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">客户落地</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">标杆案例管理</h1>
          <p className="text-xs text-slate-400">管理在官网展示的企业标杆客户案例、所涉行业、量化指标和最终成果</p>
        </div>
        {editingId === null && (
          <button
            id="add-case-btn"
            onClick={openNew}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>新增标杆案例</span>
          </button>
        )}
      </div>

      {/* Form */}
      {editingId !== null && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden transition-all duration-300">
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-black text-slate-800">
                {editingId === 'new' ? '创建客户案例数据' : '更正案例档案'}
              </h2>
            </div>
            <button
              onClick={cancelEdit}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Industry */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">所属行业板块</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="例：智慧农业、精密制造、网络通信"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all bg-slate-50/50 hover:bg-white"
                />
              </div>

              {/* Client */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">服务客户名称</label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="例：国家级现代农业产业示范基地"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all bg-slate-50/50 hover:bg-white"
                />
              </div>

              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">案例核心标题</label>
                <input
                  id="case-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例：智慧农业视觉检测中枢构建项目"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all bg-slate-50/50 hover:bg-white"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">项目背景与深度详述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="细化描述该项目从立案、解决过程、部署落地到给客户带来的宏观成效..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all resize-none bg-slate-50/50 hover:bg-white"
                />
              </div>

              {/* Stat */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">量化考核数据 (超大字突出显示)</label>
                <input
                  type="text"
                  value={formData.stat}
                  onChange={(e) => setFormData({ ...formData, stat: e.target.value })}
                  placeholder="例：-30% 或是 毫秒级"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all bg-slate-50/50 hover:bg-white"
                />
              </div>

              {/* Stat Label */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">数据维度说明</label>
                <input
                  type="text"
                  value={formData.statLabel}
                  onChange={(e) => setFormData({ ...formData, statLabel: e.target.value })}
                  placeholder="例：农药喷洒降低、精密机械组装耗时"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all bg-slate-50/50 hover:bg-white"
                />
              </div>

              {/* Deliverables */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">核心交付成果与产出</label>
                <div className="space-y-3">
                  {formData.deliverables.map((d, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={d}
                      onChange={(e) => setDeliverable(idx, e.target.value)}
                      placeholder={`核心交付物 ${idx + 1}`}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all bg-slate-50/50 hover:bg-white"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={addDeliverable}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-500 transition-all"
                  >
                    + 添加一条成果物
                  </button>
                </div>
              </div>

              {/* Image */}
              <div className="md:col-span-2">
                <ImageUpload
                  label="标杆案例配图"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                />
              </div>

              {/* Visible */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">状态发布</label>
                <select
                  value={formData.visible ? '1' : '0'}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.value === '1' })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white text-slate-800 transition-all"
                >
                  <option value="1">公开展示于官网相应板块</option>
                  <option value="0">草稿保存</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex gap-3">
            <button
              id="save-case-btn"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? '保存至服务器数据库...' : '发布此客户案例'}
            </button>
            <button
              onClick={cancelEdit}
              className="px-5 py-3 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Cards View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs font-bold tracking-wider">从数据存储池获取落地案例...</span>
        </div>
      ) : (
        <>
          {cases.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-slate-50 text-slate-300 rounded-2xl">
                <FolderOpen className="w-8 h-8" />
              </div>
              <span className="text-sm font-bold text-slate-400">目前暂无案例，点击右上角按钮进行添加</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cases.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover image area */}
                    <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden border-b border-slate-100">
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
                          <span className="text-[10px] font-bold uppercase tracking-wider">无案例图</span>
                        </div>
                      )}

                      {/* Display Status Pill */}
                      <span className={`absolute top-4 right-4 inline-flex items-center gap-1.5 text-[10px] px-3 py-1 rounded-full font-bold shadow-md transition-all duration-300 ${
                        c.visible
                          ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                          : 'bg-slate-500 text-white shadow-slate-500/10'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-white ${c.visible ? 'animate-ping' : ''}`} />
                        <span>{c.visible ? '前台展示中' : '暂存草稿'}</span>
                      </span>
                    </div>

                    {/* Meta info & content */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-100/50 rounded-lg text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                          <Tag className="w-3 h-3 text-blue-500" />
                          {c.industry}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>NO. {c.id}</span>
                        </div>
                      </div>

                      {/* Title & Customer */}
                      <div className="space-y-1.5">
                        <h3 className="text-base font-black text-slate-800 line-clamp-1 leading-snug">
                          {c.title}
                        </h3>
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.client}</span>
                        </div>
                      </div>

                      {/* Big KPI card indicator inside info */}
                      <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{c.statLabel}</span>
                          <span className="text-lg font-black text-blue-600 block leading-tight">{c.stat}</span>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                          <Award className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Highlight badges */}
                      {c.deliverables && c.deliverables.length > 0 && (
                        <div className="pt-1.5 flex flex-wrap gap-1.5">
                          {c.deliverables.map((d, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200/50"
                            >
                              ✓ {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <button
                        title={c.visible ? '隐藏产品' : '公开显示'}
                        onClick={() => handleToggleVisible(c)}
                        className={`p-2.5 rounded-xl border transition-all ${
                          c.visible
                            ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-200 bg-white border-slate-200'
                            : 'text-white bg-blue-600 hover:bg-blue-500 border-transparent shadow-md shadow-blue-500/10'
                        }`}
                      >
                        {c.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 hover:text-slate-800 transition-all shadow-sm"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>编辑</span>
                      </button>
                      <button
                        onClick={() => setDeleteId(c.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>删除</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
