import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { withAdminAuth } from '@/lib/api-auth';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);

interface ImageInfo {
  url: string;
  relativePath: string;
  size: number;
  sizeFormatted: string;
  width?: number;
  height?: number;
  format: string;
  directory: string;
}

async function scanDir(dir: string, basePath: string, results: ImageInfo[]): Promise<void> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(basePath, fullPath);

    if (entry.isDirectory()) {
      await scanDir(fullPath, basePath, results);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        try {
          const stats = await stat(fullPath);
          const info: ImageInfo = {
            url: `/uploads/${relativePath.replace(/\\/g, '/')}`,
            relativePath: `${relativePath.replace(/\\/g, '/')}`,
            size: stats.size,
            sizeFormatted: formatSize(stats.size),
            format: ext.replace('.', '').toUpperCase(),
            directory: path.dirname(`/uploads/${relativePath.replace(/\\/g, '/')}`),
          };

          // 尝试读取尺寸（仅非 SVG）
          if (ext !== '.svg') {
            try {
              const sharp = (await import('sharp')).default;
              const meta = await sharp(fullPath).metadata();
              info.width = meta.width;
              info.height = meta.height;
            } catch {
              // 读取失败跳过
            }
          }

          results.push(info);
        } catch {
          // 读取失败跳过
        }
      }
    }
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const GET = withAdminAuth(async () => {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const results: ImageInfo[] = [];

  await scanDir(uploadsDir, uploadsDir, results);

  // 按文件大小降序排列
  results.sort((a, b) => b.size - a.size);

  // 计算总大小
  const totalSize = results.reduce((sum, img) => sum + img.size, 0);

  return NextResponse.json(
    {
      images: results,
      total: results.length,
      totalSize,
      totalSizeFormatted: formatSize(totalSize),
      scannedAt: Date.now(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    },
  );
});
