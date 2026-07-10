import { getAboutPageData, getSiteConfig } from '@/lib/data';
import { AboutClient } from '@/components/AboutClient';

export const revalidate = 30;

export default async function AboutPage() {
  const [aboutPage, site] = await Promise.all([getAboutPageData(), getSiteConfig()]);

  return <AboutClient aboutPage={aboutPage} site={site} />;
}
