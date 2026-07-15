import { NextResponse } from 'next/server';
import { getContactFormTemplate } from '@/lib/data';

// GET /api/contact-form — 公开获取表单模板
export async function GET() {
  try {
    const template = await getContactFormTemplate();
    return NextResponse.json(template, {
      headers: { 'Cache-Control': 'no-cache, private, max-age=0' },
    });
  } catch {
    return NextResponse.json({ error: '获取表单模板失败' }, { status: 500 });
  }
}