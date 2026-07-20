'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Check,
  Loader2,
  X,
  Inbox,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { ContactSubmission, SubmissionStatus } from '@/types';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '全部' },
  { value: 'new', label: '新' },
  { value: 'read', label: '已读' },
  { value: 'replied', label: '已回复' },
  { value: 'archived', label: '已归档' },
];

const STATUS_BADGE: Record<SubmissionStatus, { bg: string; text: string; italic?: boolean }> = {
  new: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-600' },
  read: { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-500' },
  replied: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-600' },
  archived: { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-400', italic: true },
};

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  new: '新',
  read: '已读',
  replied: '已回复',
  archived: '已归档',
};

interface ProductOption {
  id: string;
  title: string;
}

export default function ConsultationSubmissionsAdminPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchData = useCallback(async (status?: string) => {
    try {
      const params = status ? `?status=${status}` : '';
      const [subsRes, tplRes] = await Promise.all([
        fetch(`/api/admin/consultation-submissions${params}`),
        fetch('/api/admin/consultation-form')
      ]);
      const [subsData, tplData] = await Promise.all([
        subsRes.json(),
        tplRes.json()
      ]);
      setSubmissions(subsData);
      setTemplate(tplData);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
    setLoading(true);
    fetchData(status || undefined).finally(() => setLoading(false));
  };

  const filteredSubmissions = submissions;

  const handleStatusChange = async (id: string, newStatus: SubmissionStatus) => {
    const res = await fetch(`/api/admin/consultation-submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setSubmissions((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToast('状态已更新');
    } else {
      showToast('状态更新失败', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/consultation-submissions/${deleteId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setSubmissions((prev) => prev.filter((s) => s.id !== deleteId));
      showToast('已删除');
    } else {
      showToast('删除失败', 'error');
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs font-semibold">加载提交记录中...</span>
        </div>
      </div>
    );
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const leftBarColor: Record<SubmissionStatus, string> = {
    new: 'bg-blue-500',
    read: 'bg-slate-300',
    replied: 'bg-emerald-500',
    archived: 'bg-slate-200',
  };

  const badgeBorderClass: Record<SubmissionStatus, string> = {
    new: 'bg-blue-50 text-blue-700 border-blue-200',
    read: 'bg-slate-50 text-slate-500 border-slate-200',
    replied: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    archived: 'bg-slate-50 text-slate-400 border-slate-200',
  };

  const dotColor: Record<SubmissionStatus, string> = {
    new: 'bg-blue-500',
    read: 'bg-slate-400',
    replied: 'bg-emerald-500',
    archived: 'bg-slate-300',
  };

  const statCards = [
    {
      key: 'all',
      label: '全部',
      count: submissions.length,
      value: '',
      barColor: 'border-l-blue-500',
      activeRing: 'ring-blue-200 bg-blue-50/50 border-blue-200',
    },
    {
      key: 'new',
      label: '新',
      count: submissions.filter((s) => s.status === 'new').length,
      value: 'new',
      barColor: 'border-l-blue-500',
      activeRing: 'ring-blue-200 bg-blue-50/50 border-blue-200',
    },
    {
      key: 'read',
      label: '已读',
      count: submissions.filter((s) => s.status === 'read').length,
      value: 'read',
      barColor: 'border-l-slate-400',
      activeRing: 'ring-slate-200 bg-slate-50/50 border-slate-300',
    },
    {
      key: 'replied',
      label: '已回复',
      count: submissions.filter((s) => s.status === 'replied').length,
      value: 'replied',
      barColor: 'border-l-emerald-500',
      activeRing: 'ring-emerald-200 bg-emerald-50/50 border-emerald-300',
    },
  ];

  const cleanLabel = (label: string) => {
    return label.replace(/^(您的|你的|请填写|填写)/, '');
  };

  const getFieldLabel = (key: string) => {
    if (!template || !template.fields) return key;
    const field = template.fields.find((f: any) => f.id === key);
    return field ? cleanLabel(field.label) : key;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
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

      <ConfirmDialog
        open={!!deleteId}
        title="确认删除提交记录？"
        description="此操作不可撤销，删除后数据将无法恢复。"
        confirmLabel="确认删除"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />

      {/* Header */}
      <div className="pb-4 border-b border-slate-200/50">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Inbox className="w-5 h-5 text-blue-600" />
          咨询记录
        </h1>
        <p className="text-xs text-slate-400 mt-1">查看和管理全局“立即咨询”表单的提交记录</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const isActive = filterStatus === stat.value;
          return (
            <div
              key={stat.key}
              onClick={() => handleStatusFilter(stat.value)}
              className={`rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-md hover:border-blue-200 ${
                isActive
                  ? `ring-2 ${stat.activeRing}`
                  : 'border-slate-200/80 bg-white'
              }`}
            >
              <div className={`border-l-4 ${stat.barColor} px-4 py-3`}>
                <div className="text-2xl font-black text-slate-800">{stat.count}</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">状态</label>
            <select
              value={filterStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all bg-white cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="ml-auto text-xs text-slate-400 font-medium pt-2">
            共 {filteredSubmissions.length} 条记录
          </div>
        </div>
      </div>

      {/* Submission Cards / Empty State */}
      {filteredSubmissions.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center gap-3">
          <div className="p-4 bg-slate-50 text-slate-300 rounded-2xl">
            <Inbox className="w-12 h-12" />
          </div>
          <span className="text-base font-bold text-slate-500">还没有提交记录</span>
          <span className="text-xs text-slate-400">用户提交的申请表单将显示在这里</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((sub) => {
            const bar = leftBarColor[sub.status];
            const badgeCls = badgeBorderClass[sub.status];
            const dot = dotColor[sub.status];
            const isItalic = sub.status === 'archived';

            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex">
                  {/* Colored left bar */}
                  <div className={`w-1 shrink-0 ${bar}`} />

                  {/* Card body */}
                  <div className="flex-1 min-w-0">
                    {/* Clickable open area */}
                    <div
                      className="cursor-pointer px-4 pt-3 pb-2"
                      onClick={() => setExpandedId(sub.id)}
                    >
                      {/* Top bar: time + badge | actions */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                            {formatTime(sub.submittedAt)}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0 ${badgeCls} ${isItalic ? 'italic' : ''}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                            {STATUS_LABELS[sub.status] || sub.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={sub.status}
                            onChange={(e) => handleStatusChange(sub.id, e.target.value as SubmissionStatus)}
                            className="px-1.5 py-1 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-600 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            {STATUS_OPTIONS.filter((o) => o.value !== '').map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(sub.id);
                            }}
                            className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-slate-100 my-2" />

                      {/* Info row: dynamic values preview */}
                      <div className="text-sm text-slate-700 pb-1 flex flex-wrap items-center">
                        {Object.entries(sub.data).slice(0, 3).map(([k, v], idx, arr) => (
                          <span key={k} className="flex items-center">
                            <span className={idx === 0 ? "font-semibold" : ""}>{String(v) || '-'}</span>
                            {idx < arr.length - 1 && <span className="text-slate-300 mx-2">·</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      {(() => {
        const activeSub = submissions.find((s) => s.id === expandedId);
        if (!activeSub) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setExpandedId(null)}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">咨询记录详情</h2>
                  <p className="text-xs text-slate-500 mt-1">提交于 {formatTime(activeSub.submittedAt)}</p>
                </div>
                <button
                  onClick={() => setExpandedId(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="space-y-6">
                  {template?.fields ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {template.fields.map((f: any) => {
                        const val = activeSub.data[f.id];
                        const isLong = f.type === 'textarea';
                        return (
                          <div key={f.id} className={`${isLong ? 'md:col-span-2' : ''} space-y-1.5`}>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                              {cleanLabel(f.label)}
                            </label>
                            <div className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 ${isLong ? 'min-h-[100px] whitespace-pre-wrap' : ''}`}>
                              {val ? String(val) : <span className="text-slate-400 italic">未填写</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(activeSub.data).map(([key, val]) => (
                        <div key={key} className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {getFieldLabel(key)}
                          </label>
                          <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 whitespace-pre-wrap">
                            {val ? String(val) : <span className="text-slate-400 italic">未填写</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  状态：
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeBorderClass[activeSub.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor[activeSub.status]}`} />
                    {STATUS_LABELS[activeSub.status] || activeSub.status}
                  </span>
                </div>
                <div className="flex gap-3">
                  <select
                    value={activeSub.status}
                    onChange={(e) => handleStatusChange(activeSub.id, e.target.value as SubmissionStatus)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {STATUS_OPTIONS.filter((o) => o.value !== '').map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}