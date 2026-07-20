import type { Metadata } from 'next';
import { getAboutPageData, getSiteConfig } from '@/lib/data';
import { AboutClient } from '@/components/AboutClient';

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: `关于我们 — ${site.companyName}`,
    description: `了解${site.companyFullName}的企业背景、发展历程、核心团队与技术使命。专注为大中型企业提供私有化AI解决方案。`,
  };
}

export default async function AboutPage() {
  const [aboutPage, site] = await Promise.all([getAboutPageData(), getSiteConfig()]);

  return <AboutClient aboutPage={aboutPage} site={site} />;
}
