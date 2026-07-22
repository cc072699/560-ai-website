import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// ── 登录频率限制（共享 RateLimiter） ─────────────────────────
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  check(identifier: string): boolean {
    const now = Date.now();
    const history = this.attempts.get(identifier) || [];
    const recent = history.filter((t) => now - t < this.windowMs);

    if (recent.length >= this.limit) {
      this.attempts.set(identifier, recent);
      return false;
    }

    recent.push(now);
    this.attempts.set(identifier, recent);

    // 定期清理过期数据（概率触发）
    if (Math.random() < 0.01) {
      const now2 = Date.now();
      for (const [key, times] of this.attempts.entries()) {
        const valid = times.filter((t) => now2 - t < this.windowMs);
        if (valid.length === 0) {
          this.attempts.delete(key);
        } else {
          this.attempts.set(key, valid);
        }
      }
    }

    return true;
  }
}

const loginLimiter = new RateLimiter(5, 60_000);  // 每分钟 5 次

// ── 代理/中间件主函数 ────────────────────────────────────────────
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 登录接口频率限制
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    const identifier = req.headers.get('x-forwarded-for') || 'anonymous';
    if (!loginLimiter.check(identifier)) {
      return NextResponse.json(
        { error: '登录尝试过于频繁，请稍后再试' },
        { status: 429 },
      );
    }
    return NextResponse.next();
  }

  // 只保护 /admin 路由
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // 登录页不需要保护
  if (pathname === '/admin/login') {
    // 已登录时重定向到后台首页
    const token = req.cookies.get('admin_token')?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }
    return NextResponse.next();
  }

  // 检查 admin_token cookie
  const token = req.cookies.get('admin_token')?.value;
  if (!token) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/login'],
};
