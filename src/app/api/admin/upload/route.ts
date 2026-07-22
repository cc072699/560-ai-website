import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { withAdminAuth } from '@/lib/api-auth';
import type { NextRequest } from 'next/server';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
];

/**
 * 文件头（magic bytes）签名表
 * 防止攻击者将非法文件伪装成合法 MIME 类型上传
 */
const MAGIC_BYTES: { mime: string; bytes: number[]; offset?: number }[] = [
  { mime: 'image/jpeg',      bytes: [0xFF, 0xD8, 0xFF] },
  { mime: 'image/png',       bytes: [0x89, 0x50, 0x4E, 0x47] },
  { mime: 'image/gif',       bytes: [0x47, 0x49, 0x46] },
  { mime: 'image/webp',      bytes: [0x52, 0x49, 0x46, 0x46] },   // RIFF....WEBP
  { mime: 'video/mp4',       bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }, // ftyp at byte 4
  { mime: 'video/webm',      bytes: [0x1A, 0x45, 0xDF, 0xA3] },
  { mime: 'video/quicktime', bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },
];

function checkMagicBytes(buffer: Uint8Array, mimeType: string): boolean {
  const signatures = MAGIC_BYTES.filter(s => s.mime === mimeType);
  // 若该类型没有定义签名（如 video/ogg），退后放行
  if (signatures.length === 0) return true;
  return signatures.some(sig => {
    const offset = sig.offset ?? 0;
    return sig.bytes.every((byte, i) => buffer[offset + i] === byte);
  });
}

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

    // 定期清理过期数据（概率触发）
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
  // 速率限制检查（使用IP或用户标识）
  const identifier = req.headers.get('x-forwarded-for') || 'anonymous';
  if (!uploadLimiter.check(identifier)) {
    return NextResponse.json(
      { error: '上传频率过高，请稍后再试' },
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
  const maxSizeLimit = isVideo ? 100 * 1024 * 1024 : 20 * 1024 * 1024;

  if (file.size > maxSizeLimit) {
    return NextResponse.json(
      { error: `文件过大，最大允许 ${isVideo ? '100MB' : '20MB'}` },
      { status: 400 }
    );
  }

  // 读取文件内容并校验 magic bytes（防止 MIME 类型伪造）
  const arrayBuf = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuf);

  if (!checkMagicBytes(buffer, file.type)) {
    return NextResponse.json(
      { error: '文件内容与声明类型不匹配，请上传合法的图片或视频文件' },
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

  await writeFile(path.join(uploadDir, filename), Buffer.from(buffer));

  // 关键修复：Next.js 16 在 build 时扫描 public/ 目录生成静态文件清单。
  // 运行时新增的文件不在清单中，会被错误地 404 缓存。
  // 通过 revalidatePath 让 Next.js 重新检查 /uploads/* 路径。
  try {
    revalidatePath(`/uploads/${folder}/${filename}`);
    revalidatePath('/uploads/[...slug]', 'page');
  } catch {
    // revalidatePath 对非页面路径可能抛错，忽略即可
  }

  // 返回的 URL 路径包含子目录
  const url = `/uploads/${folder}/${filename}`;
  return NextResponse.json({ url, filename }, { status: 201 });
});