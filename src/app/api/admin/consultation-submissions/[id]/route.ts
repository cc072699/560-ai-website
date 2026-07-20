import { NextResponse } from 'next/server';
import { getConsultationSubmissions, saveConsultationSubmissions } from '@/lib/data';
import { deleteConsultationSubmission } from '@/lib/cleanup';
import { withAdminAuth } from '@/lib/api-auth';
import type { NextRequest } from 'next/server';

type RouteParams = { params: Promise<{ id: string }> };

const VALID_STATUSES = ['new', 'read', 'replied', 'archived'];

// PATCH /api/admin/consultation-submissions/[id] — 更新提交状态
export const PATCH = withAdminAuth(async (req: NextRequest, ...args: unknown[]) => {
  const { params } = args[0] as RouteParams;
  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: '无效的状态值' }, { status: 400 });
  }

  const submissions = await getConsultationSubmissions();
  const index = submissions.findIndex((s) => s.id === id);

  if (index === -1) {
    return NextResponse.json({ error: '提交记录不存在' }, { status: 404 });
  }

  submissions[index] = { ...submissions[index], status };
  await saveConsultationSubmissions(submissions);
  return NextResponse.json(submissions[index]);
});

// DELETE /api/admin/consultation-submissions/[id] — 删除提交记录
export const DELETE = withAdminAuth(async (_req: NextRequest, ...args: unknown[]) => {
  const { params } = args[0] as RouteParams;
  const { id } = await params;

  const submissions = await getConsultationSubmissions();
  const exists = submissions.some((s) => s.id === id);

  if (!exists) {
    return NextResponse.json({ error: '提交记录不存在' }, { status: 404 });
  }

  await deleteConsultationSubmission(id);
  return NextResponse.json({ success: true });
});