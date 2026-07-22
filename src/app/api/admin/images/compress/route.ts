import { NextRequest, NextResponse } from 'next/server';
import { stat, rename, unlink, copyFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { withAdminAuth } from '@/lib/api-auth';

interface CompressResult {
  file: string;
  originalSize: string;
  compressedSize: string;
  saved: string;
  percent: string;
  skipped?: boolean;
  error?: string;
}

async function compressImage(filePath: string, format: string): Promise<{
  saved: number;
  percent: string;
  compressedSize: number;
}> {
  const sharp = (await import('sharp')).default;
  const originalStats = await stat(filePath);
  const meta = await sharp(filePath).metadata();

  let pipeline = sharp(filePath);

  if (meta.width && meta.width > 1920) {
    pipeline = pipeline.resize(1920, null, {
      withoutEnlargement: true,
      fit: 'inside',
    });
  }

  if (format === 'jpeg' || format === 'jpg') {
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
  } else if (format === 'png') {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 90 });
  } else if (format === 'webp') {
    pipeline = pipeline.webp({ quality: 80 });
  } else {
    return { saved: 0, percent: '0', compressedSize: originalStats.size };
  }

  const tmpPath = filePath + '.tmp_compress';
  await pipeline.toFile(tmpPath);

  const compressedStats = await stat(tmpPath);

  if (compressedStats.size >= originalStats.size) {
    await unlink(tmpPath);
    return { saved: 0, percent: '0', compressedSize: originalStats.size };
  }

  await rename(tmpPath, filePath);

  return {
    saved: originalStats.size - compressedStats.size,
    percent: (((originalStats.size - compressedStats.size) / originalStats.size) * 100).toFixed(1),
    compressedSize: compressedStats.size,
  };
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const BACKUP_DIR = path.join(process.cwd(), 'public', 'uploads', '.backup');

export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json();
  const { files } = body as { files: string[] };

  if (!files || !Array.isArray(files) || files.length === 0) {
    return NextResponse.json({ error: '请提供要压缩的文件列表' }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  // 确保备份目录存在
  await mkdir(BACKUP_DIR, { recursive: true });

  // 生成此次压缩的批次时间戳，用于备份文件分组
  const batchTs = Date.now();

  const results: CompressResult[] = [];
  let totalSaved = 0;
  let backedUp = 0;

  for (const relativeUrl of files) {
    const normalized = relativeUrl.replace(/^\/uploads\//, '');
    const filePath = path.join(uploadsDir, normalized);
    const ext = path.extname(filePath).toLowerCase().replace('.', '');

    const result: CompressResult = {
      file: relativeUrl,
      originalSize: '',
      compressedSize: '',
      saved: '',
      percent: '',
    };

    try {
      await stat(filePath);
      const originalStats = await stat(filePath);
      result.originalSize = formatSize(originalStats.size);

      // 备份原文件到 .backup/<timestamp>/ 目录
      const backupSubDir = path.join(BACKUP_DIR, String(batchTs));
      await mkdir(backupSubDir, { recursive: true });
      const backupPath = path.join(backupSubDir, normalized.replace(/\//g, '_'));
      await copyFile(filePath, backupPath);
      backedUp++;

      // SVG / GIF 跳过压缩
      if (ext === 'svg' || ext === 'gif') {
        result.skipped = true;
        result.compressedSize = result.originalSize;
        result.saved = '0 B';
        result.percent = '0';
        results.push(result);
        continue;
      }

      const compressResult = await compressImage(filePath, ext);
      result.compressedSize = formatSize(compressResult.compressedSize);
      result.saved = formatSize(compressResult.saved);
      result.percent = compressResult.percent;
      totalSaved += compressResult.saved;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '压缩失败';
      // 如果已备份但压缩出错，尝试从备份恢复
      const backupSubDir = path.join(BACKUP_DIR, String(batchTs));
      const backupPath = path.join(backupSubDir, normalized.replace(/\//g, '_'));
      if (existsSync(backupPath)) {
        try {
          await copyFile(backupPath, filePath);
          result.error = `${msg}（已从备份恢复原文件）`;
        } catch {
          result.error = `${msg}（自动恢复失败，请从备份目录手动恢复）`;
        }
      } else {
        result.error = msg;
      }
    }

    results.push(result);
  }

  return NextResponse.json({
    results,
    totalSaved: formatSize(totalSaved),
    backedUp,
    backupPath: `/uploads/.backup/${batchTs}/`,
  });
});
