import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllCases, saveCases } from '@/lib/data';
import { withAdminAuth } from '@/lib/api-auth';
import type { Case } from '@/types';
import type { NextRequest } from 'next/server';

// GET /api/admin/cases
export const GET = withAdminAuth(async () => {
  const cases = await getAllCases();
  return NextResponse.json(cases);
});

// POST /api/admin/cases
export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json();
  const cases = await getAllCases();

  const newCase: Case = {
    id: Date.now().toString(),
    industry: body.industry || '未分类',
    title: body.title || '新案例',
    client: body.client || '',
    description: body.description || '',
    stat: body.stat || '',
    statLabel: body.statLabel || '',
    deliverables: body.deliverables || [],
    imageUrl: body.imageUrl || '',
    imageAlt: body.imageAlt || '',
    order: cases.length + 1,
    visible: body.visible ?? true,
    showInHome: body.showInHome ?? true,
    homeDescription: body.homeDescription || '',
  };

  await saveCases([...cases, newCase]);
  revalidatePath('/');
  return NextResponse.json(newCase, { status: 201 });
});
