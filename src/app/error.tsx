'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('页面错误:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md mx-auto p-8">
        {/* 错误图标 */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* 错误信息 */}
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          页面出现错误
        </h2>
        <p className="text-slate-500 mb-2">
          很抱歉,页面加载时遇到了问题
        </p>
        {process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-slate-400 mb-6 bg-slate-100 p-3 rounded">
            {error.message}
          </p>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700"
          >
            重新加载
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}