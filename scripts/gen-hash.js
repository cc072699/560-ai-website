#!/usr/bin/env node
/**
 * 密码哈希生成工具
 * 用法：node scripts/gen-hash.js <新密码>
 * 
 * 示例：
 *   node scripts/gen-hash.js MySecurePassword2026
 *
 * 将输出的 HASH 值填入 .env.local 的 ADMIN_PASSWORD_HASH 字段
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('❌ 请提供密码参数');
  console.error('   用法: node scripts/gen-hash.js <密码>');
  process.exit(1);
}

if (password.length < 8) {
  console.error('❌ 密码长度不得少于8位');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log('\n✅ 密码哈希生成成功！\n');
  console.log('请将以下内容复制到 .env.local 文件：');
  const escapedHash = hash.replace(/\$/g, '\\$');
  console.log('─'.repeat(60));
  console.log(`ADMIN_PASSWORD_HASH=${escapedHash}`);
  console.log('─'.repeat(60));
  console.log('\n⚠️  请妥善保管原始密码，哈希值无法反向解密');
});
