'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn } from 'lucide-react';

interface QrCodeImageProps {
  src: string;
  alt: string;
  label?: string;
  /** 外层容器 className：用于控制整体大小、边框、背景等 */
  containerClassName?: string;
  /** 外层容器 style：可覆盖 width/height */
  containerStyle?: React.CSSProperties;
  /** 内部图片包裹层 className（默认会被父容器裁剪），一般无需设置 */
  imageWrapperClassName?: string;
}

/**
 * 全局统一的二维码展示组件
 *
 * 1. 图片使用 object-cover 填满容器，去除多余空白
 * 2. 点击或按回车时唤起放大弹窗，方便用户扫码
 * 3. 放大弹窗：暗色遮罩 + 居中大图 + 点击空白/关闭按钮/ESC 关闭
 */
export function QrCodeImage({
  src,
  alt,
  label,
  containerClassName = '',
  containerStyle,
  imageWrapperClassName = '',
}: QrCodeImageProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ESC 关闭放大弹窗 + body 滚动锁定
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label ? `放大查看${label}二维码` : '放大查看二维码'}
        title="点击放大二维码"
        className={`group relative block overflow-hidden cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 ${containerClassName}`}
        style={containerStyle}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${imageWrapperClassName}`}
          draggable={false}
        />

        {/* hover 提示 */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-200">
          <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow" />
        </span>
      </button>

      {open && mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={label ? `${label}二维码大图` : '二维码大图'}
          >
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

            <div
              className="relative z-10 max-w-[90vw] max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 关闭按钮 */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="关闭"
                className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white text-slate-700 shadow-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 白色卡片 + 二维码 + 标签 */}
              <div className="bg-white shadow-2xl p-5 sm:p-6 flex flex-col items-center">
                <div className="w-[68vmin] h-[68vmin] max-w-[480px] max-h-[480px] sm:w-[420px] sm:h-[420px] flex items-center justify-center bg-white overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
                {label && (
                  <p className="mt-4 text-base sm:text-lg font-bold text-slate-800">
                    {label}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-400 font-medium">长按或截图识别二维码</p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
