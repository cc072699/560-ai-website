import { getHeroData, getAboutData, getProducts, getCases, getOpcData } from '@/lib/data';
import { HomeClient } from '@/components/HomeClient';

// ISR: 最多每30秒重新生成一次
export const revalidate = 30;

export default async function Home() {
  const [hero, about, products, cases, opc] = await Promise.all([
    getHeroData(),
    getAboutData(),
    getProducts(),
    getCases(),
    getOpcData(),
  ]);

  return <HomeClient hero={hero} about={about} products={products} cases={cases} opc={opc} />;
}
