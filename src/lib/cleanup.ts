import { rm, unlink, access } from 'fs/promises';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

async function pathExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * 删除产品关联的整个图片目录
 */
export async function deleteProductImageDir(productId: string): Promise<void> {
  const dirPath = path.join(uploadsDir, 'products', productId);
  try {
    if (await pathExists(dirPath)) {
      await rm(dirPath, { recursive: true, force: true });
    }
  } catch {
    // 目录不存在或删除失败，静默处理
  }
}

/**
 * 删除案例关联的整个图片目录
 */
export async function deleteCaseImageDir(caseId: string): Promise<void> {
  const dirPath = path.join(uploadsDir, 'cases', caseId);
  try {
    if (await pathExists(dirPath)) {
      await rm(dirPath, { recursive: true, force: true });
    }
  } catch {
    // 目录不存在或删除失败，静默处理
  }
}

/**
 * 删除单个文件（通过 URL 路径）
 */
export async function deleteFileByUrl(url: string): Promise<void> {
  if (!url.startsWith('/uploads/')) return;
  const filePath = path.join(process.cwd(), 'public', url);
  try {
    if (await pathExists(filePath)) {
      await unlink(filePath);
    }
  } catch {
    // 文件不存在或删除失败，静默处理
  }
}