'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Check,
  Loader2,
  X,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileSpreadsheet,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { ContactFormTemplate, ContactFormField } from '@/types';

const emptyField = (order: number): ContactFormField => ({
  id: `field_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  type: 'text',
  label: '',
  placeholder: '',
  required: false,
  order,
});

export default function ContactFormAdminPage() {
  const [template, setTemplate] = useState<ContactFormTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    fetch('/api/admin/contact-form')
      .then((r) => r.json())
      .then((data: ContactFormTemplate) => {
        setTemplate(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateField = (id: string, key: keyof ContactFormField, value: unknown) => {
    if (!template) return;
    setTemplate({
      ...template,
      fields: template.fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)),
    });
  };

  const addField = () => {
    if (!template) return;
    const maxOrder = template.fields.reduce((max, f) => Math.max(max, f.order), 0);
    setTemplate({
      ...template,
      fields: [...template.fields, emptyField(maxOrder + 10)],
    });
  };

  const removeField = () => {
    if (!template || !deleteFieldId) return;
    setTemplate({
      ...template,
      fields: template.fields.filter((f) => f.id !== deleteFieldId),
    });
    setDeleteFieldId(null);
  };

  const moveField = (index: number, direction: -1 | 1) => {
    if (!template) return;
    const fields = [...template.fields];
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;
    [fields[index], fields[target]] = [fields[target], fields[index]];
    // Swap order values
    const tempOrder = fields[index].order;
    fields[index] = { ...fields[index], order: fields[target].order };
    fields[target] = { ...fields[target], order: tempOrder };
    setTemplate({ ...template, fields });
  };

  const handleSave = async () => {
    if (!template) return;
    setSaving(true);
    try {
      const sortedFields = [...template.fields].sort((a, b) => a.order - b.order);
      const payload = { ...template, fields: sortedFields, updatedAt: new Date().toISOString() };
      const res = await fetch('/api/admin/contact-form', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('保存失败');
      showToast('申请表单配置已保存');
    } catch {
      showToast('保存失败，请重试', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs font-semibold">加载表单配置中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 pb-28 animate-fade-in">
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
        open={!!deleteFieldId}
        title="确认删除字段？"
        description="删除后前台表单将不再显示该字段，已提交的数据不受影响。"
        confirmLabel="确认删除"
        onConfirm={removeField}
        onCancel={() => setDeleteFieldId(null)}
        danger
      />

      {/* Header */}
      <div className="pb-4 border-b border-slate-200/50">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-blue-600" />
          申请表单配置
        </h1>
        <p className="text-xs text-slate-400 mt-1">管理产品详情页「申请试用」弹窗表单的字段与文案</p>
      </div>

      {/* Basic Settings Section */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <FileSpreadsheet className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-800">基础配置</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Field label="表单标题">
            <input
              type="text"
              value={template?.title || ''}
              onChange={(e) => setTemplate(template ? { ...template, title: e.target.value } : null)}
              className={inputCls}
              placeholder="如：申请试用"
            />
          </Field>
          <Field label="表单描述">
            <textarea
              value={template?.description || ''}
              onChange={(e) => setTemplate(template ? { ...template, description: e.target.value } : null)}
              rows={2}
              className={`${inputCls} resize-none`}
              placeholder="选填，显示在表单顶部的说明文字"
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="提交按钮文字">
              <input
                type="text"
                value={template?.submitText || ''}
                onChange={(e) => setTemplate(template ? { ...template, submitText: e.target.value } : null)}
                className={inputCls}
                placeholder="如：提交申请"
              />
            </Field>
            <Field label="提交成功消息">
              <input
                type="text"
                value={template?.successMessage || ''}
                onChange={(e) => setTemplate(template ? { ...template, successMessage: e.target.value } : null)}
                className={inputCls}
                placeholder="如：感谢您的申请，我们将尽快与您联系"
              />
            </Field>
          </div>
        </div>
      </section>

      {/* Fields Section */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">表单字段 ({template?.fields.length || 0})</h2>
          </div>
        </div>

        <div className="space-y-4">
          {template?.fields
            .sort((a, b) => a.order - b.order)
            .map((field, index) => (
              <div
                key={field.id}
                className="border border-slate-200 rounded-xl p-5 space-y-4 relative bg-white/50"
              >
                {/* Card Header: Order + Move/Delete Buttons */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    字段 #{index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveField(index, -1)}
                      disabled={index === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveField(index, 1)}
                      disabled={index === template.fields.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteFieldId(field.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Field Type + Label + Placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="类型">
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, 'type', e.target.value)}
                      className={inputCls + ' cursor-pointer'}
                    >
                      <option value="text">文本 (text)</option>
                      <option value="email">邮箱 (email)</option>
                      <option value="phone">电话 (phone)</option>
                      <option value="textarea">多行文本 (textarea)</option>
                      <option value="select">下拉选择 (select)</option>
                    </select>
                  </Field>
                  <Field label="标签">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(field.id, 'label', e.target.value)}
                      className={inputCls}
                      placeholder="如：姓名"
                    />
                  </Field>
                  <Field label="占位文本">
                    <input
                      type="text"
                      value={field.placeholder}
                      onChange={(e) => updateField(field.id, 'placeholder', e.target.value)}
                      className={inputCls}
                      placeholder="如：请输入您的姓名"
                    />
                  </Field>
                </div>

                {/* Required Checkbox + MaxLength */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                    />
                    必填字段
                  </label>
                  <Field label="最大字数限制（选填）">
                    <input
                      type="number"
                      value={field.maxLength ?? ''}
                      onChange={(e) =>
                        updateField(field.id, 'maxLength', e.target.value ? parseInt(e.target.value) : undefined)
                      }
                      className={inputCls}
                      placeholder="留空则不限制"
                      min={1}
                      max={2000}
                    />
                  </Field>
                </div>

                {/* Options for select type */}
                {field.type === 'select' && (
                  <Field label="选项（每行一个）">
                    <textarea
                      value={(field.options || []).join('\n')}
                      onChange={(e) =>
                        updateField(
                          field.id,
                          'options',
                          e.target.value.split('\n').filter((o) => o.trim() !== '')
                        )
                      }
                      rows={3}
                      className={`${inputCls} resize-none`}
                      placeholder="选项1&#10;选项2&#10;选项3"
                    />
                  </Field>
                )}
              </div>
            ))}
        </div>

        {/* Add Field Button */}
        <button
          type="button"
          onClick={addField}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-semibold text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          新增字段
        </button>
      </section>

      {/* Fixed Save Bar */}
      <div className="fixed bottom-0 left-64 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200/80 px-8 py-4 flex items-center justify-end gap-4 z-40">
        <span className="text-xs text-slate-400">
          {saving ? '正在保存...' : '修改后将更新所有产品详情页的申请表单'}
        </span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/15 transition-all duration-200 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
          {saving ? '正在保存...' : '保存配置'}
        </button>
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