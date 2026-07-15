import { NextResponse } from 'next/server';
import { getContactFormTemplate, getContactSubmissions, saveContactSubmissions } from '@/lib/data';
import type { NextRequest } from 'next/server';
import type { ContactSubmission } from '@/types';

// 内存速率限制器
class RateLimiter {
  private counts: Map<string, number[]> = new Map();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number = 5, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  check(identifier: string): boolean {
    const now = Date.now();
    const records = this.counts.get(identifier) || [];
    const recent = records.filter((time) => now - time < this.windowMs);

    if (recent.length >= this.limit) return false;

    recent.push(now);
    this.counts.set(identifier, recent);

    if (Math.random() < 0.01) this.cleanup();

    return true;
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, records] of this.counts.entries()) {
      const recent = records.filter((time) => now - time < this.windowMs);
      if (recent.length === 0) this.counts.delete(key);
      else this.counts.set(key, recent);
    }
  }
}

const submitLimiter = new RateLimiter(5, 60000);

// POST /api/contact/submit — 公开提交表单
export async function POST(req: NextRequest) {
  const identifier = req.headers.get('x-forwarded-for') || 'unknown';
  if (!submitLimiter.check(identifier)) {
    return NextResponse.json({ error: '提交过于频繁，请稍后再试' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { productId, productName, data } = body;

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: '提交数据不能为空' }, { status: 400 });
    }

    const template = await getContactFormTemplate();

    // 校验必填字段
    for (const field of template.fields) {
      if (!field.required) continue;
      const value = data[field.id];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return NextResponse.json({ error: `${field.label} 为必填项` }, { status: 400 });
      }
    }

    // 校验字段最大长度
    for (const field of template.fields) {
      if (field.maxLength && data[field.id] && data[field.id].length > field.maxLength) {
        return NextResponse.json({ error: `${field.label} 超过最大长度` }, { status: 400 });
      }
    }

    const submission: ContactSubmission = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      productId: productId || undefined,
      productName: productName || undefined,
      data,
      status: 'new',
      ip: identifier,
      userAgent: req.headers.get('user-agent') || '',
    };

    const submissions = await getContactSubmissions();
    submissions.push(submission);
    await saveContactSubmissions(submissions);

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: '提交失败，请稍后再试' }, { status: 500 });
  }
}