import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md mx-auto p-8">
        {/* 404 图标 */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
            <span className="text-4xl font-black text-blue-400">404</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          页面未找到
        </h2>
        <p className="text-slate-500 mb-8">
          您访问的页面不存在或已被移除
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            返回首页
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors text-sm"
          >
            浏览产品
          </Link>
        </div>
      </div>
    </div>
  );
}
