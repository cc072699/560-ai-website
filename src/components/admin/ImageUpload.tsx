'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export function ImageUpload({ value, onChange, label = '图片', folder }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL验证函数
  const validateImageUrl = (url: string): boolean => {
    if (url.trim() === '') {
      return true; // 允许空值
    }

    try {
      const parsedUrl = new URL(url);
      // 仅允许http/https协议
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        setError('仅支持HTTP/HTTPS协议的图片URL');
        return false;
      }
      return true;
    } catch {
      setError('URL格式无效,请输入完整的URL地址');
      return false;
    }
  };

  const handleUrlChange = (url: string) => {
    setError(''); // 清除旧错误
    onChange(url);
  };

  const handleUrlBlur = () => {
    if (value && !validateImageUrl(value)) {
      return; // 验证失败,不更新值
    }
  };

  const handleFile = useCallback(async (file: File) => {
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
		if (folder) formData.append('folder', folder);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '上传失败');
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : '上传失败');
    } finally {
      setUploading(false);
    }
  }, [onChange, folder]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`text-xs px-3 py-1 rounded-full border transition-all ${
            mode === 'url'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'text-slate-500 border-slate-300 hover:border-slate-400'
          }`}
        >
          输入图片URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`text-xs px-3 py-1 rounded-full border transition-all ${
            mode === 'upload'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'text-slate-500 border-slate-300 hover:border-slate-400'
          }`}
        >
          上传本地文件
        </button>
      </div>

      {mode === 'url' && (
        <>
          <input
            type="url"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            onBlur={handleUrlBlur}
            placeholder="https://example.com/image.jpg"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 ${
              error ? 'border-red-300 bg-red-50' : 'border-slate-200'
            }`}
          />
        </>
      )}

      {mode === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-blue-500">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">上传中...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Upload className="w-6 h-6" />
              <span className="text-sm">点击或拖拽文件到此处</span>
              <span className="text-xs text-slate-300">支持 JPG、PNG、WebP，最大 10MB</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}

      {/* Preview */}
      {value && (
        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 h-36">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="预览"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 opacity-0 hover:opacity-100 transition-opacity">
            <ImageIcon className="w-6 h-6 text-slate-400" />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-white rounded-full p-0.5 shadow hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
