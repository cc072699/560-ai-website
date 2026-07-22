'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X, Phone, Mail, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import type { SiteConfig, ContactFormTemplate, ContactFormField } from '@/types';
import { QrCodeImage } from '@/components/QrCodeImage';

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  site?: SiteConfig;
}

export function ContactDialog({ open, onClose, site: siteProp }: ContactDialogProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 当外部未传入 site 时，自动从接口获取全局配置
  const [fetchedSite, setFetchedSite] = useState<SiteConfig | null>(null);
  useEffect(() => {
    if (siteProp || !open) return;
    fetch('/api/site')
      .then((r) => r.json())
      .then((data: SiteConfig) => setFetchedSite(data))
      .catch(() => {});
  }, [open, siteProp]);
  const site = siteProp ?? fetchedSite ?? undefined;

  const [template, setTemplate] = useState<ContactFormTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Fetch form configuration
  useEffect(() => {
    if (!open) return;
    let isMounted = true;
    
    async function fetchTemplate() {
      try {
        setLoading(true);
        const res = await fetch('/api/consultation');
        if (!res.ok) throw new Error('fetch template failed');
        const data = await res.json();
        if (isMounted) setTemplate(data);
      } catch (err) {
        console.error('Failed to load consultation form config:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchTemplate();

    return () => { isMounted = false; };
  }, [open]);

  // Reset state when opening — useLayoutEffect 确保在 DOM 更新后、浏览器绘制前执行滚动重置
  useLayoutEffect(() => {
    if (open && scrollerRef.current) {
      scrollerRef.current.scrollTop = 0;
    }
  }, [open]);

  // 重置表单数据
  useEffect(() => {
    if (open) {
      setFormData({});
      setError('');
      setSuccess(false);
    }
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;
    setError('');

    // Validation
    for (const field of template.fields) {
      if (field.required && !formData[field.id]?.trim()) {
        setError(`请填写 ${field.label}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/consultation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: formData,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'submit failed');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || '提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const sortedFields = template?.fields.slice().sort((a, b) => a.order - b.order) || [];

  const handleFieldChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError('');
  };

  const renderField = (field: ContactFormField) => {
    const value = formData[field.id] || '';
    if (field.type === 'textarea') {
      return (
        <textarea
          id={`cf-${field.id}`}
          rows={4}
          value={value}
          onChange={(e) => handleFieldChange(field.id, e.target.value)}
          placeholder={field.placeholder || `请输入${field.label}`}
          maxLength={field.maxLength}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400 transition-all bg-slate-50/50 hover:bg-white resize-none"
        />
      );
    }
    return (
      <input
        id={`cf-${field.id}`}
        type="text"
        value={value}
        onChange={(e) => handleFieldChange(field.id, e.target.value)}
        placeholder={field.placeholder || `请输入${field.label}`}
        maxLength={field.maxLength}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400 transition-all bg-slate-50/50 hover:bg-white"
      />
    );
  };

  if (!open || !mounted) return null;

  const dialog = (
    <div ref={scrollerRef} className="fixed inset-0 z-[100] overflow-y-auto">
      {/* 遮罩 */}
      <div
        className="fixed inset-0 bg-slate-950/50"
        onClick={onClose}
        aria-hidden
      />

      {/* 居中容器：flex flex-col + 弹窗 m-auto 让弹窗在内容比视口矮时垂直居中，
          比视口高时贴顶对齐（避免被 flex items-center 居中后溢出顶部被裁切） */}
      <div className="relative min-h-full flex flex-col p-4">
        {/* 主卡片 - 左右分栏 - 高度严格限制在视口内，超出内容在弹窗内滚动 */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="联系我们"
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[960px] m-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col"
          style={{ maxHeight: 'calc(100vh - 2rem)' }}
        >
        {/* 关闭按钮 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-y-auto">
          {/* ========== 左侧：品牌标识区 ========== */}
          <div className="md:w-[42%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 md:p-10 flex flex-col justify-between">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-[40%] right-[20%] w-20 h-20 border border-blue-400/15 rounded-full" />
            <div className="absolute bottom-[30%] left-[25%] w-3 h-3 bg-blue-400/30 rounded-full" />

            {/* 内容 */}
            <div className="relative z-10">
              {/* Logo */}
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-2.5 group w-fit mb-8"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/uploads/brand/logo-whale.png"
                  alt="560 AI Logo"
                  className="h-9 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-col">
                  <span className="text-[17px] font-extrabold tracking-tight leading-tight transition-colors group-hover:text-blue-400">
                    {site?.companyName || '五六零人工智能科技'}
                  </span>
                  <span className="text-[10px] font-bold text-white/35 tracking-[0.18em] uppercase leading-none mt-0.5">
                    {site?.companyNameEn || '560 AI TECHNOLOGY'}
                  </span>
                </div>
              </Link>

              {/* Tagline */}
              <h2 className="text-2xl font-black leading-snug mb-3">
                让技术
                <span className="text-blue-400">懂你所需</span>
                ，<br />为业务创造价值
              </h2>
              <p className="text-sm text-white/55 font-medium leading-relaxed max-w-[90%]">
                驱动企业数字化的新一代生产力引擎，通过大模型与机器视觉技术，赋能实体产业智能化升级。
              </p>
            </div>

            {/* 底部联系方式 */}
            <div className="relative z-10 space-y-3.5 mt-8">
              {site?.contact?.phone && (
                <div className="flex items-center gap-3 text-sm text-white/70 hover:text-white/95 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="font-semibold">电话：{site.contact.phone}</span>
                </div>
              )}
              {site?.contact?.email && (
                <div className="flex items-center gap-3 text-sm text-white/70 hover:text-white/95 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <a href={`mailto:${site.contact.email}`} className="font-semibold truncate">
                    邮箱：{site.contact.email}
                  </a>
                </div>
              )}
              {site?.contact?.address && (
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="font-semibold leading-snug text-xs">
                    地址：{site.contact.address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ========== 右侧：咨询表单 ========== */}
          <div className="md:w-[58%] p-8 md:p-10 flex flex-col justify-between">
            {success ? (
              /* 成功状态 */
              <MotionSuccess onClose={onClose} template={template} />
            ) : (
              <>
                {loading ? (
                  <div className="flex flex-1 items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <div className="w-1 h-5 rounded-full bg-blue-600" />
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {template?.title || '立即咨询'}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-7">
                      {template?.description || '请填写以下信息，我们会在 24 小时内与您取得联系'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {sortedFields.map((field) => (
                        <div key={field.id}>
                          <label htmlFor={`cf-${field.id}`} className="block text-sm font-semibold text-slate-700 mb-1.5">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-0.5">*</span>}
                          </label>
                          {renderField(field)}
                        </div>
                      ))}

                      {/* 错误提示 */}
                      {error && (
                        <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5 font-medium">{error}</p>
                      )}

                      {/* 提交按钮 */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-slate-200 hover:shadow-blue-200 text-[15px]"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            发送中…
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            {template?.submitText || '发送消息'}
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* 底部：二维码 */}
                <div className="mt-7 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-6">
                    {site?.wechatQrUrl ? (
                      <div className="flex items-center gap-3">
                        <QrCodeImage
                          src={site.wechatQrUrl}
                          alt="微信公众号二维码"
                          label="微信公众号"
                          containerClassName="w-12 h-12 border border-slate-200 bg-white shadow-sm shrink-0"
                        />
                        <span className="text-xs font-bold text-slate-500 leading-tight">
                          关注<br />公众号
                        </span>
                      </div>
                    ) : null}
                    {site?.douyinQrUrl ? (
                      <div className="flex items-center gap-3">
                        <QrCodeImage
                          src={site.douyinQrUrl}
                          alt="抖音官方号"
                          label="抖音官方号"
                          containerClassName="w-12 h-12 border border-slate-200 bg-white shadow-sm shrink-0"
                        />
                        <span className="text-xs font-bold text-slate-500 leading-tight">
                          关注<br />抖音号
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

/** 提交成功提示 */
function MotionSuccess({ onClose, template }: { onClose: () => void, template: ContactFormTemplate | null }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5">
        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 mb-2">
        {template?.successTitle || '消息已发送'}
      </h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs mb-6">
        {template?.successMessage || '感谢您的咨询，我们的团队将在 24 小时内通过您留下的联系方式与您取得联系。'}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all text-sm"
      >
        关闭
      </button>
    </div>
  );
}
