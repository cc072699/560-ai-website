import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getSiteConfig,
  saveSiteConfig,
  getHeroData,
  saveHeroData,
  getAboutData,
  saveAboutData,
  getOpcData,
  saveOpcData,
} from '@/lib/data';
import { withAdminAuth } from '@/lib/api-auth';
import type { NextRequest } from 'next/server';

// GET /api/admin/site
export const GET = withAdminAuth(async () => {
  const [site, hero, about, opc] = await Promise.all([
    getSiteConfig(),
    getHeroData(),
    getAboutData(),
    getOpcData(),
  ]);
  return NextResponse.json({
    ...site,
    hero,
    about,
    opc,
  });
});

// PUT /api/admin/site
export const PUT = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json();
  
  const { hero, about, opc, ...site } = body;
  
  const [currentSite, currentHero, currentAbout, currentOpc] = await Promise.all([
    getSiteConfig(),
    getHeroData(),
    getAboutData(),
    getOpcData(),
  ]);

  await Promise.all([
    saveSiteConfig({ ...currentSite, ...site }),
    saveHeroData({ ...currentHero, ...hero }),
    saveAboutData({ ...currentAbout, ...about }),
    saveOpcData({ ...currentOpc, ...opc, cards: opc?.cards || currentOpc.cards }),
  ]);

  revalidatePath('/');
  revalidatePath('/about');
  return NextResponse.json({ success: true });
});
