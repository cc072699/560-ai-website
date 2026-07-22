'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Image as ImageIcon,
  Loader2,
  Check,
  X,
  Zap,
  Filter,
  AlertTriangle,
  Database,
  Shield,
  RefreshCw,
} from 'lucide-react';

interface ImageInfo {
  url: string;
  relativePath: string;
  size: number;
  sizeFormatted: string;
  width?: number;
  height?: number;
  format: string;
  directory: string;
}

interface CompressItem {
  file: string;
  originalSize: string;
  compressedSize: string;
  saved: string;
  percent: string;
  skipped?: boolean;
  error?: string;
}

const SIZE_THRESHOLDS = {
  large: 500 * 1024,
  warning: 1024 * 1024,
} as const;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [compressing, setCompressing] = useState(false);
  const [compressResults, setCompressResults] = useState<CompressItem[] | null>(null);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');
  const [filterDir, setFilterDir] = useState<string>('all');
  const [filterSize, setFilterSize] = useState<string>('all');
  const [showConfirm, setShowConfirm] = useState(false);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      // 添加时间戳参数，确保绕过任何可能的 HTTP 缓存
      const res = await fetch(`/api/admin/images/scan?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      });
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      showToast('加载图片列表失败', 'error');
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const directories = ['all', ...Array.from(new Set(images.map((img) => img.directory))).sort()];

  const filtered = images.filter((img) => {
    if (search) {
      const s = search.toLowerCase();
      if (!img.relativePath.toLowerCase().includes(s) && !img.url.toLowerCase().includes(s)) {
        return false;
      }
    }
    if (filterDir !== 'all' && img.directory !== filterDir) return false;
    if (filterSize === 'large' && img.size < SIZE_THRESHOLDS.large) return false;
    if (filterSize === 'warning' && img.size < SIZE_THRESHOLDS.warning) return false;
    return true;
  });

  const toggleSelect = (url: string) => {
    const next = new Set(selected);
    if (next.has(url)) next.delete(url); else next.add(url);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((img) => img.url)));
  };

  const selectLargeImages = () => {
    const large = new Set(
      images.filter((img) => img.size > SIZE_THRESHOLDS.warning).map((img) => img.url),
    );
    setSelected(large);
    showToast(`已选择 ${large.size} 张大于 1MB 的图片`, 'success');
  };

  const handleCompress = async () => {
    if (selected.size === 0) { showToast('请先选择需要压缩的图片', 'error'); return; }
    setShowConfirm(false);
    setCompressing(true);
    setCompressResults(null);
    try {
      const res = await fetch('/api/admin/images/compress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: Array.from(selected) }),
      });
      const data = await res.json();
      const results: CompressItem[] = data.results || [];
      setCompressResults(results);
      setLastSaved(data.totalSaved || '0');
      setSelected(new Set());

      // 直接根据压缩结果更新本地 state（不依赖重新 fetch）
      setImages((prev) => {
        const resultsMap = new Map(results.map((r) => [r.file, r]));
        return prev.map((img) => {
          const r = resultsMap.get(img.url);
          if (!r || r.skipped || r.error) return img;
          // 解析压缩后大小（bytes）更新本地数据
          const newSize = parseSize(r.compressedSize);
          if (newSize === null) return img;
          return { ...img, size: newSize, sizeFormatted: r.compressedSize };
        });
      });

      showToast(`压缩完成，共节省 ${data.totalSaved || '0'}。原文件已备份至 ${data.backupPath || '.backup/'}`, 'success');

      // 异步重新拉取，确保与服务器一致
      setTimeout(() => fetchImages(), 500);
    } catch {
      showToast('压缩请求失败', 'error');
    }
    setCompressing(false);
  };

  // 解析 "1.23 MB" / "456 KB" / "789 B" 为字节数
  const parseSize = (str: string): number | null => {
    const m = str.match(/^([\d.]+)\s*(B|KB|MB)$/);
    if (!m) return null;
    const n = parseFloat(m[1]);
    if (m[2] === 'B') return n;
    if (m[2] === 'KB') return n * 1024;
    return n * 1024 * 1024;
  };

  const totalSelectedSize = images
    .filter((img) => selected.has(img.url))
    .reduce((sum, img) => sum + img.size, 0);

  const stats = {
    total: images.length,
    large: images.filter((i) => i.size > SIZE_THRESHOLDS.large).length,
    warning: images.filter((i) => i.size > SIZE_THRESHOLDS.warning).length,
    totalSize: images.reduce((sum, i) => sum + i.size, 0),
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-8 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2.5 transition-all backdrop-blur ${
          toast.type === 'success'
            ? 'bg-emerald-500/95 text-white'
            : 'bg-rose-500/95 text-white'
        }`}>
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* 确认对话框 */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">确认压缩图片</h3>
                <p className="text-sm text-slate-500">原文件将自动备份，可随时恢复</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-bold">安全备份说明</span>
              </div>
              <p className="text-xs text-blue-600/80 leading-relaxed">
                压缩前会将原文件备份到 <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-700">public/uploads/.backup/</code> 目录。
                如遇异常会自动恢复。无备份文件不会被覆盖。
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-1.5 text-sm">
              <p>选中图片：<span className="font-bold text-slate-800">{selected.size} 张</span></p>
              <p>当前总大小：<span className="font-bold text-amber-600">{formatSize(totalSelectedSize)}</span></p>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                取消
              </button>
              <button onClick={handleCompress}
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                开始压缩
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-200/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600">
            <ImageIcon className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">图片管理</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">媒体资源优化</h1>
          <p className="text-sm text-slate-500">查看所有上传图片，一键压缩大图，压缩前自动备份</p>
        </div>
        <button onClick={fetchImages} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all">
          <RefreshCw className="w-4 h-4" /> 刷新列表
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><ImageIcon className="w-5 h-5" /></div>
          <div><p className="text-xs text-slate-400 font-semibold">图片总数</p><p className="text-xl font-black text-slate-800">{stats.total}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Database className="w-5 h-5" /></div>
          <div><p className="text-xs text-slate-400 font-semibold">总占用空间</p><p className="text-xl font-black text-slate-800">{formatSize(stats.totalSize)}</p></div>
        </div>
        <div className={`bg-white rounded-xl border p-4 flex items-center gap-3 ${stats.warning > 0 ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200/80'}`}>
          <div className={`p-2 rounded-lg ${stats.warning > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}><AlertTriangle className="w-5 h-5" /></div>
          <div><p className="text-xs text-slate-400 font-semibold">{'>'} 1MB 图片</p><p className={`text-xl font-black ${stats.warning > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{stats.warning}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Zap className="w-5 h-5" /></div>
          <div><p className="text-xs text-slate-400 font-semibold">已优化图片</p><p className="text-xl font-black text-emerald-600">{stats.total - stats.large}</p></div>
        </div>
        <div className={`bg-white rounded-xl border p-4 flex items-center gap-3 ${lastSaved ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200/80'}`}>
          <div className={`p-2 rounded-lg ${lastSaved ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}><Check className="w-5 h-5" /></div>
          <div><p className="text-xs text-slate-400 font-semibold">本次压缩节省</p><p className={`text-xl font-black ${lastSaved ? 'text-emerald-600' : 'text-slate-400'}`}>{lastSaved || '0 B'}</p></div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索文件名..."
              className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-white w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          {/* Dir filter */}
          <select value={filterDir} onChange={(e) => setFilterDir(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="all">全部目录</option>
            {directories.filter(d => d !== 'all').map(d => {
              const label = d.replace('/uploads/', '');
              return <option key={d} value={d}>{label}</option>;
            })}
          </select>
          {/* Size filter */}
          <select value={filterSize} onChange={(e) => setFilterSize(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="all">全部大小</option>
            <option value="large">{'>'} 500KB</option>
            <option value="warning">{'>'} 1MB</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={selectLargeImages}
            className="px-3.5 py-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-xl transition-all flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> 选择全部大图 ({'>'}1MB)
          </button>
          <button onClick={() => setShowConfirm(true)} disabled={selected.size === 0 || compressing}
            className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
            {compressing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {compressing ? '压缩中...' : `一键压缩 (${selected.size})`}
          </button>
        </div>
      </div>

      {/* Compress Results */}
      {compressResults && (
        <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-3 border-b border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700">
              <Check className="w-4 h-4" />
              <span className="text-sm font-bold">压缩完成 · 共节省 {lastSaved}</span>
            </div>
            <button onClick={() => setCompressResults(null)}
              className="text-emerald-500 hover:text-emerald-700"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-2 max-h-60 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                  <th className="p-2 font-bold">文件</th>
                  <th className="p-2 font-bold">压缩前</th>
                  <th className="p-2 font-bold">压缩后</th>
                  <th className="p-2 font-bold">节省</th>
                </tr>
              </thead>
              <tbody>
                {compressResults.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="p-2 text-slate-700 max-w-[300px] truncate font-medium">{r.file}</td>
                    <td className="p-2 text-slate-500">{r.originalSize}</td>
                    <td className="p-2 text-slate-700 font-semibold">{r.compressedSize}</td>
                    <td className={`p-2 font-bold ${r.skipped ? 'text-slate-400' : r.error ? 'text-red-500' : 'text-emerald-600'}`}>
                      {r.error ? r.error : r.skipped ? '已跳过' : `${r.saved} (${r.percent}%)`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-sm font-bold">正在扫描所有上传图片...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="p-3 bg-slate-50 text-slate-300 rounded-2xl inline-block mb-3">
            <ImageIcon className="w-8 h-8" />
          </div>
          <p className="text-sm font-bold text-slate-400">暂无匹配的图片</p>
        </div>
      ) : (
        <>
          {/* Select all bar */}
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="font-semibold">全选 ({filtered.length})</span>
            </label>
            {selected.size > 0 && (
              <span className="text-slate-400">已选 <span className="font-bold text-slate-700">{selected.size}</span> 张，{formatSize(totalSelectedSize)}</span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((img) => {
              const isSelected = selected.has(img.url);
              const isWarning = img.size > SIZE_THRESHOLDS.large;
              const isOptimized = img.size < SIZE_THRESHOLDS.large;
              return (
                <div key={img.url}
                  onClick={() => toggleSelect(img.url)}
                  className={`group relative bg-white rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}>
                  {/* Thumbnail */}
                  <div className="aspect-square bg-slate-100 overflow-hidden relative">
                    {img.format === 'SVG' ? (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img.url} alt={img.relativePath}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy" />
                    )}
                    {/* Size badge */}
                    {isWarning && (
                      <span className={`absolute top-1.5 right-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                        img.size > SIZE_THRESHOLDS.warning
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-slate-500/80 text-white'
                      }`}>
                        {img.sizeFormatted}
                      </span>
                    )}
                    {/* Optimized badge */}
                    {isOptimized && (
                      <span className="absolute top-1.5 right-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-500/90 text-white flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> 已优化
                      </span>
                    )}
                    {/* Selected check */}
                    <div className={`absolute top-1.5 left-1.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white/80 border-slate-300 group-hover:border-slate-400'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-2.5 space-y-1">
                    <p className="text-[11px] font-bold text-slate-700 truncate" title={img.relativePath}>
                      {img.relativePath.split('/').pop() || img.relativePath}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                      <span className={`px-1 py-0.5 rounded ${isWarning ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {img.sizeFormatted}
                      </span>
                      <span className="bg-slate-100 px-1 py-0.5 rounded text-slate-400">{img.format}</span>
                      {img.width && <span className="text-slate-350">{img.width}×{img.height}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
