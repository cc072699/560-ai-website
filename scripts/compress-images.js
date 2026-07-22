/**
 * 图片压缩脚本 - 针对近期上传的大图进行压缩
 *
 * 策略：
 * - JPEG: 保持格式，质量 80，宽度最大 1920px
 * - PNG: 保持格式，宽度最大 1920px，使用 palette 模式压缩
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');

const images = [
  // === 数据文件中引用的图片（必须保持原格式） ===
  {
    file: 'uploads/general/1784706787560-j8llbrfbt8.jpeg',
    format: 'jpeg',
    desc: 'about_page hero image (3.12MB)',
  },
  {
    file: 'uploads/general/1784708897725-rwciue5w8mc.png',
    format: 'png',
    desc: 'about_page slide image (1.68MB)',
  },
  {
    file: 'uploads/general/1784710363071-v257o4onrn.jpeg',
    format: 'jpeg',
    desc: 'opc image (3.53MB)',
  },

  // === 可能通过管理后台使用的图片 ===
  {
    file: 'uploads/general/1784705478287-8h86c67bvpo.png',
    format: 'png',
    desc: '超大 PNG (12.75MB)',
    maxWidth: 1920,
  },
  {
    file: 'uploads/general/1784706328913-t9x2u6ysgp8.jpeg',
    format: 'jpeg',
    desc: '大 JPEG (3.12MB)',
  },
  {
    file: 'uploads/general/1784706376617-dyo579e8x37.jpeg',
    format: 'jpeg',
    desc: '大 JPEG (3.12MB)',
  },
  {
    file: 'uploads/general/1784701703749-zn8bh32fhq.png',
    format: 'png',
    desc: '大 PNG (1.68MB)',
  },
  {
    file: 'uploads/general/1784701763434-bnyy5jehlj6.png',
    format: 'png',
    desc: '大 PNG (1.68MB)',
  },
  {
    file: 'uploads/general/1784702300767-k5pmf9im96l.png',
    format: 'png',
    desc: '大 PNG (1.68MB)',
  },
  {
    file: 'uploads/products/4/scene-qrcode.png',
    format: 'png',
    desc: 'product qrcode (1.01MB)',
  },
];

function formatSize(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

async function compressImage({ file, format, desc, maxWidth = 1920 }) {
  const filePath = path.join(ROOT, file);

  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠ 文件不存在: ${filePath}`);
    return;
  }

  const originalStats = fs.statSync(filePath);
  const originalSize = originalStats.size;
  const meta = await sharp(filePath).metadata();

  // 先备份到临时文件
  const tmpPath = filePath + '.tmp_compress';

  let pipeline = sharp(filePath);

  // 如果宽度超过 maxWidth，等比缩放
  if (meta.width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, null, {
      withoutEnlargement: true,
      fit: 'inside',
    });
  }

  if (format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
  } else if (format === 'png') {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 90 });
  }

  await pipeline.toFile(tmpPath);

  const compressedStats = fs.statSync(tmpPath);
  const compressedSize = compressedStats.size;

  // 如果压缩后更大，保留原文件
  if (compressedSize >= originalSize) {
    fs.unlinkSync(tmpPath);
    console.log(`  ⚠ ${desc}: 已是最优 (${formatSize(originalSize)}), 跳过`);
    return;
  }

  // 替换原文件
  fs.renameSync(tmpPath, filePath);

  const saved = originalSize - compressedSize;
  const percent = ((saved / originalSize) * 100).toFixed(1);

  console.log(
    `  ✔ ${desc}: ${formatSize(originalSize)} → ${formatSize(compressedSize)} (节省 ${percent}%)`
  );
}

async function main() {
  console.log('开始压缩图片...\n');

  let totalSaved = 0;
  let totalOriginal = 0;

  for (const img of images) {
    const filePath = path.join(ROOT, img.file);
    if (fs.existsSync(filePath)) {
      totalOriginal += fs.statSync(filePath).size;
    }
    await compressImage(img);
  }

  // 重新统计最终大小
  let totalCompressed = 0;
  for (const img of images) {
    const filePath = path.join(ROOT, img.file);
    if (fs.existsSync(filePath)) {
      totalCompressed += fs.statSync(filePath).size;
    }
  }
  totalSaved = totalOriginal - totalCompressed;

  console.log('\n---');
  console.log(`总计: ${formatSize(totalOriginal)} → ${formatSize(totalCompressed)}`);
  console.log(`节省: ${formatSize(totalSaved)} (${((totalSaved / totalOriginal) * 100).toFixed(1)}%)`);
  console.log('压缩完成!');
}

main().catch(err => {
  console.error('压缩失败:', err);
  process.exit(1);
});
