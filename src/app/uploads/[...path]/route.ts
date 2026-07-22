import { NextResponse } from 'next/server';
import { stat, open } from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';
import type { NextRequest } from 'next/server';

// MIME 类型映射
const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.mov': 'video/quicktime',
};

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_MAP[ext] || 'application/octet-stream';
}

/**
 * Catch-all 路由服务 /uploads/* 路径下的文件
 *
 * 解决 Next.js 16 生产模式下的问题：
 *   public/uploads 下的文件在 build 时被加入静态清单。
 *   运行时上传的新文件虽然在磁盘上，但 Next.js 不知道它们存在，
 *   会返回被缓存的 404 页面。
 *
 * 此 catch-all 路由绕过静态文件清单，
 * 直接从磁盘读取并返回文件，运行时新增的文件立即可访问。
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const relativePath = pathSegments.join('/');

  // 安全检查：禁止路径穿越
  if (relativePath.includes('..') || pathSegments.some((p) => p.startsWith('.'))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', relativePath);

  try {
    const stats = await stat(filePath);
    if (!stats.isFile()) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const fileHandle = await open(filePath);
    const stream = fileHandle.createReadStream();

    // 将 Node.js Readable 转换为 Web ReadableStream
    const webStream = Readable.toWeb(stream) as ReadableStream;

    const headers = new Headers();
    headers.set('Content-Type', getMimeType(filePath));
    headers.set('Content-Length', stats.size.toString());
    headers.set('Cache-Control', 'public, max-age=3600');
    headers.set('Last-Modified', stats.mtime.toUTCString());

    return new Response(webStream, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      return new NextResponse('Not Found', { status: 404 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
