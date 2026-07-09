import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAboutPageData, saveAboutPageData } from '@/lib/data';
import { withAdminAuth } from '@/lib/api-auth';
import type { NextRequest } from 'next/server';

export const GET = withAdminAuth(async () => {
  const data = await getAboutPageData();
  return NextResponse.json(data);
});

export const PUT = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json();
  await saveAboutPageData(body);
  revalidatePath('/about');
  return NextResponse.json({ success: true });
});