import { getHeroData, getAboutData, getProducts, getCases } from '@/lib/data';
import { HomeClient } from '@/components/HomeClient';

// ISR: 最多每30秒重新生成一次
export const revalidate = 30;

export default async function Home() {
  const [hero, about, products, cases] = await Promise.all([
    getHeroData(),
    getAboutData(),
    getProducts(),
    getCases(),
  ]);

  return <HomeClient hero={hero} about={about} products={products} cases={cases} />;
}
