import { withAdminAuth } from '@/lib/auth';

// 导出空路由以防止 /api/auth/* 路径 404
// 登录/登出现在由 /api/admin/login 和 /api/admin/logout 处理
export const GET = withAdminAuth(async () => {
  return Response.json({ status: 'ok' });
});
