import { getAboutData, getSiteConfig } from '@/lib/data';
import { AboutClient } from '@/components/AboutClient';

export const revalidate = 30;

export default async function AboutPage() {
  const [about, site] = await Promise.all([getAboutData(), getSiteConfig()]);

  return <AboutClient about={about} site={site} />;
}
