import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSiteConfig, saveSiteConfig } from '@/lib/data';
import { withAdminAuth } from '@/lib/api-auth';
import type { NextRequest } from 'next/server';

// GET /api/admin/site
export const GET = withAdminAuth(async () => {
  const config = await getSiteConfig();
  return NextResponse.json(config);
});

// PUT /api/admin/site
export const PUT = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json();
  const current = await getSiteConfig();
  const updated = { ...current, ...body };
  await saveSiteConfig(updated);
  revalidatePath('/');
  return NextResponse.json(updated);
});
