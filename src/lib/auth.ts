import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_token';

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    '[auth] NEXTAUTH_SECRET 环境变量未设置。请在 .env.local（开发）或服务器环境变量（生产）中配置该值。'
  );
}

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

// ── Token 签发 ──────────────────────────────────────────────────
export async function signToken(payload: { username: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

// ── Token 验证 ──────────────────────────────────────────────────
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { username: string };
  } catch {
    return null;
  }
}

// ── 从 Cookie 获取当前用户（Server Component 用）─────────────────
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ── API Route 中间件：验证管理员身份 ──────────────────────────────
export function withAdminAuth(
  handler: (req: NextRequest, ...args: unknown[]) => Promise<Response>
) {
  return async (req: NextRequest, ...rest: unknown[]) => {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: '未授权，请先登录' }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: '会话已过期，请重新登录' }, { status: 401 });
    }
    return handler(req, ...rest);
  };
}

// ── 设置登录 Cookie ──────────────────────────────────────────────
export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && process.env.SECURE_COOKIE !== 'false',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7天
    path: '/',
  });
  return response;
}

// ── 清除登录 Cookie ──────────────────────────────────────────────
export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });
  return response;
}
