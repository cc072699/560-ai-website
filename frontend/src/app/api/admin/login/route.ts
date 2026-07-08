import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body as { username: string; password: string };

  if (!username || !password) {
    return NextResponse.json({ error: '请填写用户名和密码' }, { status: 400 });
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  console.log('[DEBUG LOGIN] Expected user:', adminUsername, 'Hash:', adminPasswordHash);

  if (!adminUsername || !adminPasswordHash) {
    console.error('[Auth] 环境变量 ADMIN_USERNAME 或 ADMIN_PASSWORD_HASH 未设置');
    return NextResponse.json({ error: '服务器配置错误' }, { status: 500 });
  }

  // 验证用户名
  if (username !== adminUsername) {
    // 等时攻击防护：即使用户名错误也执行 bcrypt
    await bcrypt.compare(password, adminPasswordHash);
    return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
  }

  // 验证密码
  const isValid = await bcrypt.compare(password, adminPasswordHash);
  if (!isValid) {
    return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
  }

  // 签发 JWT
  const token = await signToken({ username: adminUsername });

  // 将 token 写入 httpOnly cookie
  const response = NextResponse.json({ success: true });
  return setAuthCookie(response, token);
}
