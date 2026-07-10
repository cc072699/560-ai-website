'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Play, Video } from 'lucide-react';

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export function VideoUpload({ value, onChange, label = '视频', folder }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'url' | 'upload'>('url');

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
    <div className="space-y-2 text-left">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
            mode === 'url'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'text-slate-500 border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          输入视频URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
            mode === 'upload'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'text-slate-500 border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          上传本地视频
        </button>
      </div>

      {mode === 'url' && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/video.mp4"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
        />
      )}

      {mode === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
          onClick={() => document.getElementById('video-file-input')?.click()}
        >
          <input
            id="video-file-input"
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-blue-550 justify-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold">大视频文件解析上传中，请稍候...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400 justify-center">
              <Upload className="w-6 h-6" />
              <span className="text-xs font-bold text-slate-500">点击或拖拽视频文件到此处</span>
              <span className="text-[10px] text-slate-400">支持 MP4、WebM、QuickTime，最大 100MB</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[10px] text-red-500 flex items-center gap-1 font-bold mt-1">
          <X className="w-3 h-3 animate-pulse" /> {error}
        </p>
      )}

      {/* Preview */}
      {value && (
        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-950 aspect-video max-h-48 mt-2 flex items-center justify-center">
          <video
            src={value}
            controls
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full p-1 shadow hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors z-10 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
