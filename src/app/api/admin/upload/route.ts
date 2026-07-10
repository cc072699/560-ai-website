import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { withAdminAuth } from '@/lib/api-auth';
import type { NextRequest } from 'next/server';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
];

// 简单的内存速率限制器
class UploadLimiter {
  private uploadCounts: Map<string, number[]> = new Map();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number = 10, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  check(identifier: string): boolean {
    const now = Date.now();
    const uploads = this.uploadCounts.get(identifier) || [];

    // 过滤掉窗口外的上传记录
    const recentUploads = uploads.filter(time => now - time < this.windowMs);

    if (recentUploads.length >= this.limit) {
      return false; // 超过限制
    }

    // 记录本次上传
    recentUploads.push(now);
    this.uploadCounts.set(identifier, recentUploads);

    // 定期清理过期数据(每小时)
    if (Math.random() < 0.01) {
      this.cleanup();
    }

    return true;
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, uploads] of this.uploadCounts.entries()) {
      const recent = uploads.filter(time => now - time < this.windowMs);
      if (recent.length === 0) {
        this.uploadCounts.delete(key);
      } else {
        this.uploadCounts.set(key, recent);
      }
    }
  }
}

const uploadLimiter = new UploadLimiter(10, 60000); // 每分钟10次

// POST /api/admin/upload
export const POST = withAdminAuth(async (req: NextRequest) => {
  // 速率限制检查(使用IP或用户标识)
  const identifier = req.ip || 'anonymous';
  if (!uploadLimiter.check(identifier)) {
    return NextResponse.json(
      { error: '上传频率过高,请稍后再试' },
      { status: 429 }
    );
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: '未上传文件' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: '文件类型不支持，仅允许图片及 MP4、WebM、QuickTime 视频' },
      { status: 400 }
    );
  }

  const isVideo = file.type.startsWith('video/');
  const maxSizeLimit = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for video, 10MB for image

  if (file.size > maxSizeLimit) {
    return NextResponse.json(
      { error: `文件过大，最大允许 ${isVideo ? '100MB' : '10MB'}` },
      { status: 400 }
    );
  }

  // 支持传入 folder 参数，例如 "products/9"、"cases/3"
  // 文件将保存到 public/uploads/{folder}/
  const folder = (formData.get('folder') as string) || 'general';

  // 生成唯一文件名
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);

  // 确保目录存在
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(path.join(uploadDir, filename), buffer);

  // 返回的 URL 路径包含子目录
  const url = `/uploads/${folder}/${filename}`;
  return NextResponse.json({ url, filename }, { status: 201 });
});