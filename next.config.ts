import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ['127.0.0.1', 'localhost', '192.168.75.73', '192.168.75.30'],
  // /uploads 下的 catch-all 动态路由直接读磁盘，绕过 Next.js 16 的 build-time 静态文件清单
  // 这里强制 no-store 防止任何中间层（CDN/代理）缓存
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
