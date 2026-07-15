'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, X } from 'lucide-react';
import type { ContactFormTemplate, ContactFormField } from '@/types';

interface ContactFormDialogProps {
  open: boolean;
  onClose: () => void;
  productId?: string;
  productName?: string;
}

interface FormErrors {
  [key: string]: string;
}

export function ContactFormDialog({ open, onClose, productId, productName }: ContactFormDialogProps) {
  const [template, setTemplate] = useState<ContactFormTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [products, setProducts] = useState<{ id: string; title: string }[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // 获取表单模板（仅一次）
  useEffect(() => {
    if (open && !templateLoaded) {
      setLoading(true);
      fetch('/api/contact-form')
        .then((r) => r.json())
        .then((data: ContactFormTemplate) => {
          setTemplate(data);
          setTemplateLoaded(true);
        })
        .catch(() => setError('加载表单失败'))
        .finally(() => setLoading(false));
    }
  }, [open, templateLoaded]);

  // 每次打开时初始化表单数据
  useEffect(() => {
    if (open && template) {
      const initial: Record<string, string> = {};
      for (const field of template.fields) {
        if (field.id === 'product' && productName) {
          initial[field.id] = productName;
        } else {
          initial[field.id] = field.defaultValue || '';
        }
      }
      setFormData(initial);
      setSuccess(false);
      setError('');
    }
  }, [open, template, productName]);

  // 打开弹窗时获取产品列表
  useEffect(() => {
    if (!open) return;
    setProductsLoading(true);
    fetch('/api/products')
      .then((r) => r.json())
      .then((data: { id: string; title: string }[]) => setProducts(data))
      .catch(() => {/* 静默失败，select 会显示空列表 */})
      .finally(() => setProductsLoading(false));
  }, [open]);

  // Body 滚动锁定
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ESC 键关闭
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // 成功后自动关闭
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  const handleChange = useCallback((fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!template) return;

    // 前端校验必填字段
    for (const field of template.fields) {
      if (field.required && !formData[field.id]?.trim()) {
        setError(`${field.label} 为必填项`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productName,
          data: formData,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || '提交失败');
        return;
      }
      setSuccess(true);
    } catch {
      setError('提交失败，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: ContactFormField) => {
    const value = formData[field.id] || '';
    const commonClasses =
      'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all';

    // id="product" 字段强制渲染为 select，选项从 /api/products 动态加载
    if (field.id === 'product') {
      if (productsLoading) {
        return (
          <div className="flex items-center gap-2 text-sm text-slate-400 py-2.5">
            <Loader2 className="w-4 h-4 animate-spin" />
            加载中...
          </div>
        );
      }
      return (
        <select
          id={field.id}
          required={field.required}
          value={value}
          onChange={(e) => handleChange(field.id, e.target.value)}
          className={`${commonClasses} appearance-none bg-white`}
        >
          <option value="">请选择...</option>
          {products.map((p) => (
            <option key={p.id} value={p.title}>{p.title}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          id={field.id}
          rows={4}
          maxLength={field.maxLength}
          required={field.required}
          value={value}
          onChange={(e) => handleChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          className={`${commonClasses} resize-none`}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <select
          id={field.id}
          required={field.required}
          value={value}
          onChange={(e) => handleChange(field.id, e.target.value)}
          className={`${commonClasses} appearance-none bg-white`}
        >
          <option value="">{field.placeholder || '请选择...'}</option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    // text / email / phone
    return (
      <input
        type={field.type}
        id={field.id}
        maxLength={field.maxLength}
        required={field.required}
        value={value}
        onChange={(e) => handleChange(field.id, e.target.value)}
        placeholder={field.placeholder}
        className={commonClasses}
      />
    );
  };

  const sortedFields = template?.fields
    ? [...template.fields].sort((a, b) => a.order - b.order)
    : [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 卡片 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* 关闭按钮 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        )}

        {!loading && template && success && (
          <div className="py-8 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-slate-700">{template.successMessage}</p>
          </div>
        )}

        {!loading && template && !success && (
          <>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">{template.title}</h2>
            {template.description && (
              <p className="text-sm text-slate-500 mb-5">{template.description}</p>
            )}

            {sortedFields.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">暂无字段</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {sortedFields.map((field) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                    <label htmlFor={field.id} className="md:text-right text-sm font-medium text-slate-700 pt-2.5">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    <div className="md:col-span-2">
                      {renderField(field)}
                    </div>
                  </div>
                ))}

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {template.submitText}
                </button>
              </form>
            )}
          </>
        )}

        {!loading && !template && error && (
          <p className="text-sm text-red-500 py-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}