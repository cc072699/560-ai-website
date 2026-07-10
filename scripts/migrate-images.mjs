/**
 * 迁移脚本：将现有图片按页面划分到子目录
 *
 * 运行方式: node scripts/migrate-images.mjs
 *
 * 目录结构迁移目标：
 *   public/uploads/products/{id}/   ← 产品详情图片
 *   public/uploads/cases/{id}/      ← 案例图片
 *   public/uploads/about/           ← 关于页面图片
 *   public/uploads/site/            ← 站点设置图片
 *   public/uploads/general/         ← 未分类图片
 *
 * 安全说明：
 *   - 仅复制，不删除原文件
 *   - 跳过已存在于子目录中的图片
 *   - 自动备份被修改的 JSON 文件
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const uploadsDir = path.join(rootDir, 'public', 'uploads');
const dataDir = path.join(rootDir, 'data');

// 页面 → 目标子目录映射
const pageFolders = {
  'about_page.json': 'about',
  'about.json': 'about',
  'site.json': 'site',
};

// 收集所有需要迁移的图片信息: { url, targetDir, sourceFile }
const migrations = [];

// ── 1. 收集产品图片 ──────────────────────────────────
console.log('📦 扫描 products.json...');
const products = JSON.parse(fs.readFileSync(path.join(dataDir, 'products.json'), 'utf-8'));
for (const product of products) {
  const productId = product.id;
  const collectedUrls = new Set();

  // 产品主图
  if (product.imageUrl?.startsWith('/uploads/')) collectedUrls.add(product.imageUrl);

  // detailSections 中的图片
  for (const section of product.detailSections || []) {
    if (section.type === 'hero' && section.hero?.bgUrl?.startsWith('/uploads/')) collectedUrls.add(section.hero.bgUrl);
    if (section.type === 'architecture' && section.architecture?.imageUrl?.startsWith('/uploads/')) collectedUrls.add(section.architecture.imageUrl);
    if (section.type === 'video' && section.video?.videoUrl?.startsWith('/uploads/')) collectedUrls.add(section.video.videoUrl);
    for (const cap of section.capabilities || []) {
      if (cap.imageUrl?.startsWith('/uploads/')) collectedUrls.add(cap.imageUrl);
    }
    for (const item of section.scenarios?.items || []) {
      if (item.imageUrl?.startsWith('/uploads/')) collectedUrls.add(item.imageUrl);
    }
  }

  for (const url of collectedUrls) {
    const relativePath = url.replace('/uploads/', '');
    if (relativePath.includes('/')) continue; // 已在子目录
    migrations.push({ url, targetDir: `products/${productId}`, sourceFile: 'products.json' });
  }
}

// ── 2. 收集关于/站点等页面图片 ──────────────────────
for (const [jsonFile, targetDir] of Object.entries(pageFolders)) {
  const filePath = path.join(dataDir, jsonFile);
  if (!fs.existsSync(filePath)) continue;

  console.log(`📦 扫描 ${jsonFile}...`);
  const content = fs.readFileSync(filePath, 'utf-8');

  // 提取所有 /uploads/xxx 路径
  const matches = content.match(/\/uploads\/[^"']+/g) || [];
  const uniqueUrls = [...new Set(matches)];

  for (const url of uniqueUrls) {
    const relativePath = url.replace('/uploads/', '');
    if (relativePath.includes('/')) continue;
    migrations.push({ url, targetDir, sourceFile: jsonFile });
  }
}

// ── 3. 迁移图片 ──────────────────────────────────────
if (migrations.length === 0) {
  console.log('✅ 没有需要迁移的图片');
  process.exit(0);
}

// 按源文件分组
const bySource = {};
for (const m of migrations) {
  if (!bySource[m.sourceFile]) bySource[m.sourceFile] = [];
  bySource[m.sourceFile].push(m);
}

// 构建 URL 映射 (oldUrl -> newUrl)
const urlMappings = {};
let totalMigrated = 0;

console.log(`\n📂 开始迁移 ${migrations.length} 个图片...\n`);

for (const [sourceFile, items] of Object.entries(bySource)) {
  console.log(`▸ ${sourceFile}:`);

  for (const { url, targetDir } of items) {
    const relativePath = url.replace('/uploads/', '');
    const oldFile = path.join(uploadsDir, relativePath);

    if (!fs.existsSync(oldFile)) {
      console.log(`  ⚠️  文件不存在: ${url}`);
      continue;
    }

    const destDir = path.join(uploadsDir, targetDir);
    const newFile = path.join(destDir, relativePath);

    fs.mkdirSync(destDir, { recursive: true });

    // 检查目标文件是否已存在（幂等）
    if (!fs.existsSync(newFile)) {
      fs.copyFileSync(oldFile, newFile);
    }

    const newUrl = `/uploads/${targetDir}/${relativePath}`;
    urlMappings[url] = newUrl;
    totalMigrated++;
    console.log(`  ✅ ${url} → ${newUrl}`);
  }
  console.log('');
}

// ── 4. 更新 JSON 文件 ──────────────────────────────
console.log('📝 更新 JSON 文件中的图片路径...\n');

function replaceUrls(content, mappings) {
  let result = content;
  for (const [oldUrl, newUrl] of Object.entries(mappings)) {
    result = result.split(oldUrl).join(newUrl);
  }
  return result;
}

// 更新 products.json
const productUrls = migrations.filter(m => m.sourceFile === 'products.json');
if (productUrls.length > 0) {
  const pMappings = {};
  for (const m of productUrls) pMappings[m.url] = urlMappings[m.url];

  const oldContent = fs.readFileSync(path.join(dataDir, 'products.json'), 'utf-8');
  const backupPath = path.join(dataDir, 'products.json.bak');
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(path.join(dataDir, 'products.json'), backupPath);
    console.log(`  📦 已备份: ${backupPath}`);
  }
  fs.writeFileSync(path.join(dataDir, 'products.json'), replaceUrls(oldContent, pMappings), 'utf-8');
  console.log(`  ✅ products.json 已更新 (${productUrls.length} 个路径)`);
}

// 更新其他 JSON 文件
for (const [jsonFile, _targetDir] of Object.entries(pageFolders)) {
  const related = migrations.filter(m => m.sourceFile === jsonFile);
  if (related.length === 0) continue;

  const pMappings = {};
  for (const m of related) pMappings[m.url] = urlMappings[m.url];

  const filePath = path.join(dataDir, jsonFile);
  const oldContent = fs.readFileSync(filePath, 'utf-8');
  const newContent = replaceUrls(oldContent, pMappings);
  if (oldContent !== newContent) {
    const bakPath = filePath + '.bak';
    if (!fs.existsSync(bakPath)) {
      fs.copyFileSync(filePath, bakPath);
      console.log(`  📦 已备份: ${bakPath}`);
    }
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`  ✅ ${jsonFile} 已更新 (${related.length} 个路径)`);
  }
}

// ── 5. 验证 JSON 完整性 ──────────────────────────────
console.log('\n🔍 验证 JSON 完整性...');
const jsonFiles = ['products.json', 'about_page.json', 'about.json', 'site.json'];
for (const f of jsonFiles) {
  const fp = path.join(dataDir, f);
  if (!fs.existsSync(fp)) continue;
  try {
    JSON.parse(fs.readFileSync(fp, 'utf-8'));
    console.log(`  ✅ ${f}`);
  } catch {
    console.log(`  ❌ ${f} - JSON 格式错误！`);
    console.log('  请从备份文件恢复');
  }
}

console.log(`\n✨ 迁移完成！共处理 ${totalMigrated} 张图片`);
console.log('⚠️  原文件仍在 public/uploads/ 中，确认无误后可手动删除。');