import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/data';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: `${site.companyName} - 企业级AI智能引擎`,
    description: `${site.companyFullName}，专注于为大中型企业提供私有化部署的AI大模型系统及机器视觉引擎。`,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
