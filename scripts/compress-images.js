/**
 * 批量图片压缩脚本
 * 将 public/uploads/ 下所有图片压缩并转换为 WebP 格式
 * 原文件保留备份到 public/uploads/.backup/
 *
 * 使用：
 *   node scripts/compress-images.js
 *
 * 需要先安装依赖：
 *   npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const BACKUP_DIR = path.join(UPLOADS_DIR, '.backup');

// 压缩配置
const CONFIG = {
  jpeg: { quality: 82, progressive: true },
  png:  { quality: 82, compressionLevel: 8 },
  webp: { quality: 82 },
  // 超过此尺寸的图片按比例缩小（保持宽高比）
  maxWidth: 1920,
  maxHeight: 1080,
};

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
const SKIP_DIRS  = ['.backup'];

let totalOriginal = 0;
let totalCompressed = 0;
let processedCount = 0;
let skippedCount = 0;
let errorCount = 0;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function getRelativePath(absPath) {
  return absPath.replace(UPLOADS_DIR, '').replace(/^\//, '');
}

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!IMAGE_EXTS.includes(ext)) return;

  // 跳过备份目录
  if (SKIP_DIRS.some(d => filePath.includes(path.sep + d + path.sep) || filePath.includes(path.sep + d))) return;

  const originalSize = fs.statSync(filePath).size;
  const relPath = getRelativePath(filePath);

  // 小于 150KB 的图片不压缩（已经够小了）
  if (originalSize < 150 * 1024) {
    console.log(`  ⏭  跳过（已足够小）: ${relPath} (${formatBytes(originalSize)})`);
    skippedCount++;
    return;
  }

  // 备份原文件
  const backupPath = path.join(BACKUP_DIR, relPath);
  ensureDir(path.dirname(backupPath));
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // 调整尺寸（若超过最大限制）
    let pipeline = image;
    if (metadata.width > CONFIG.maxWidth || metadata.height > CONFIG.maxHeight) {
      pipeline = pipeline.resize(CONFIG.maxWidth, CONFIG.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // 根据文件类型选择压缩格式
    let outputBuffer;
    if (ext === '.png') {
      outputBuffer = await pipeline.png(CONFIG.png).toBuffer();
    } else if (ext === '.webp') {
      outputBuffer = await pipeline.webp(CONFIG.webp).toBuffer();
    } else {
      // jpg / jpeg → 输出 jpeg
      outputBuffer = await pipeline.jpeg(CONFIG.jpeg).toBuffer();
    }

    const compressedSize = outputBuffer.length;

    // 只有压缩后更小才覆盖（避免二次压缩反而变大）
    if (compressedSize < originalSize * 0.98) {
      fs.writeFileSync(filePath, outputBuffer);
      const saved = originalSize - compressedSize;
      const ratio = ((saved / originalSize) * 100).toFixed(1);
      console.log(`  ✅ ${relPath}`);
      console.log(`     ${formatBytes(originalSize)} → ${formatBytes(compressedSize)} (节省 ${ratio}%)`);
      totalOriginal += originalSize;
      totalCompressed += compressedSize;
    } else {
      console.log(`  ⏭  压缩无收益，保留原文件: ${relPath}`);
      totalOriginal += originalSize;
      totalCompressed += originalSize;
      skippedCount++;
    }

    processedCount++;
  } catch (err) {
    console.error(`  ❌ 处理失败: ${relPath} — ${err.message}`);
    errorCount++;
  }
}

async function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.includes(entry.name)) {
        await walkDir(path.join(dir, entry.name));
      }
    } else if (entry.isFile()) {
      await compressImage(path.join(dir, entry.name));
    }
  }
}

async function main() {
  console.log('🖼  开始批量压缩 public/uploads/ 下的图片...');
  console.log(`📁 目录: ${UPLOADS_DIR}`);
  console.log(`💾 备份目录: ${BACKUP_DIR}`);
  console.log('─'.repeat(60));

  ensureDir(BACKUP_DIR);

  await walkDir(UPLOADS_DIR);

  const totalSaved = totalOriginal - totalCompressed;
  const totalRatio = totalOriginal > 0
    ? ((totalSaved / totalOriginal) * 100).toFixed(1)
    : '0';

  console.log('\n' + '─'.repeat(60));
  console.log('📊 压缩完成统计：');
  console.log(`   ✅ 成功压缩：${processedCount} 张`);
  console.log(`   ⏭  跳过：${skippedCount} 张`);
  console.log(`   ❌ 错误：${errorCount} 张`);
  console.log(`   原始总大小：${formatBytes(totalOriginal)}`);
  console.log(`   压缩后大小：${formatBytes(totalCompressed)}`);
  console.log(`   节省空间：${formatBytes(totalSaved)} (${totalRatio}%)`);
  console.log('\n✨ 原文件已备份到 public/uploads/.backup/');
  console.log('   若压缩效果不满意，可手动从备份恢复。');
}

main().catch(console.error);
