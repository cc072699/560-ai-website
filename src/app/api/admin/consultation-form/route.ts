import { NextResponse } from 'next/server';
import { getConsultationFormTemplate, saveConsultationFormTemplate } from '@/lib/data';
import { withAdminAuth } from '@/lib/api-auth';
import { ContactFormTemplateSchema } from '@/lib/validations/contact';
import type { NextRequest } from 'next/server';

// GET /api/admin/contact-form — 获取表单模板（管理端）
export const GET = withAdminAuth(async () => {
  const template = await getConsultationFormTemplate();
  return NextResponse.json(template);
});

// PUT /api/admin/contact-form — 更新表单模板
export const PUT = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json();
  const result = ContactFormTemplateSchema.safeParse(body);
  if (!result.success) {
    const errorMessage = result.error.issues[0]?.message || '数据验证失败';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
  await saveConsultationFormTemplate({ ...result.data, updatedAt: new Date().toISOString() });
  return NextResponse.json({ success: true });
});