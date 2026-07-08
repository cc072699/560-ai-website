import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllCases, saveCases } from '@/lib/data';
import { withAdminAuth } from '@/lib/api-auth';
import type { NextRequest } from 'next/server';

type RouteParams = { params: Promise<{ id: string }> };

// PUT /api/admin/cases/[id]
export const PUT = withAdminAuth(async (req: NextRequest, ...args: unknown[]) => {
  const { params } = args[0] as RouteParams;
  const { id } = await params;
  const body = await req.json();
  const cases = await getAllCases();
  const index = cases.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json({ error: '案例不存在' }, { status: 404 });
  }

  cases[index] = { ...cases[index], ...body, id };
  await saveCases(cases);
  revalidatePath('/');
  return NextResponse.json(cases[index]);
});

// DELETE /api/admin/cases/[id]
export const DELETE = withAdminAuth(async (_req: NextRequest, ...args: unknown[]) => {
  const { params } = args[0] as RouteParams;
  const { id } = await params;
  const cases = await getAllCases();
  const filtered = cases.filter((c) => c.id !== id);

  if (filtered.length === cases.length) {
    return NextResponse.json({ error: '案例不存在' }, { status: 404 });
  }

  await saveCases(filtered);
  revalidatePath('/');
  return NextResponse.json({ success: true });
});
