import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { withAdminAuth } from '@/lib/api-auth';
import type { NextRequest } from 'next/server';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
];

// POST /api/admin/upload
export const POST = withAdminAuth(async (req: NextRequest) => {
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

  // 生成唯一文件名
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  // 确保目录存在
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(path.join(uploadDir, filename), buffer);

  const url = `/uploads/${filename}`;
  return NextResponse.json({ url, filename }, { status: 201 });
});
