import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getSiteConfig,
  saveSiteConfig,
  getHeroData,
  saveHeroData,
  getAboutData,
  saveAboutData
} from '@/lib/data';
import { withAdminAuth } from '@/lib/api-auth';
import type { NextRequest } from 'next/server';

// GET /api/admin/site
export const GET = withAdminAuth(async () => {
  const [site, hero, about] = await Promise.all([
    getSiteConfig(),
    getHeroData(),
    getAboutData()
  ]);
  return NextResponse.json({
    ...site,
    hero,
    about
  });
});

// PUT /api/admin/site
export const PUT = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json();
  
  // Split the body back to their respective config datasets
  const { hero, about, ...site } = body;
  
  // Read current configs to preserve keys not edited
  const [currentSite, currentHero, currentAbout] = await Promise.all([
    getSiteConfig(),
    getHeroData(),
    getAboutData()
  ]);

  await Promise.all([
    saveSiteConfig({ ...currentSite, ...site }),
    saveHeroData({ ...currentHero, ...hero }),
    saveAboutData({ ...currentAbout, ...about })
  ]);

  revalidatePath('/');
  revalidatePath('/about');
  return NextResponse.json({ success: true });
});
