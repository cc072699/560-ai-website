import { NextResponse } from 'next/server';
import { getConsultationSubmissions } from '@/lib/data';
import { withAdminAuth } from '@/lib/api-auth';
import type { NextRequest } from 'next/server';

// GET /api/admin/consultation-submissions — 获取提交记录列表
export const GET = withAdminAuth(async (req: NextRequest) => {
  const submissions = await getConsultationSubmissions();
  const status = req.nextUrl.searchParams.get('status');

  let filtered = submissions;
  if (status) {
    filtered = submissions.filter((s) => s.status === status);
  }

  // 按 submittedAt 倒序排列
  filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  return NextResponse.json(filtered);
});