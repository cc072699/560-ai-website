import { NextResponse } from 'next/server';
import { getConsultationFormTemplate } from '@/lib/data';

// GET /api/consultation — 获取表单模板（公开前端用）
export async function GET() {
  try {
    const template = await getConsultationFormTemplate();
    return NextResponse.json(template);
  } catch {
    return NextResponse.json({ error: '获取表单配置失败' }, { status: 500 });
  }
}