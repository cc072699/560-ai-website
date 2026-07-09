import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
  matcher: ['/admin/:path*'],
};
