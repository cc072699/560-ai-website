# 部署方案（Git 手动部署）

> 适用版本：Next.js 16.2.10 + React 19，服务器 Debian 12
> 最后更新：2026-07-21

## 目标服务器

- 内网 IP：`192.168.75.30`
- 域名：（待定，目前 IP 直连）
- SSH 端口：22

## 必装环境

| 软件 | 版本 | 安装方式 |
|---|---|---|
| Node.js | 20.x LTS（**不要用 25**） | NodeSource |
| npm | 随 Node 20 | - |
| PM2 | 最新 | `npm i -g pm2` |
| Nginx | 系统包 | `apt install nginx`（可选） |
| Git | 系统包 | `apt install git` |

## 必配环境变量

`.env.production`（**不**入 Git）：
```env
NEXTAUTH_SECRET=<openssl rand -base64 32>
NODE_ENV=production
```

## 必改项目配置

1. `next.config.ts` 的 `allowedDevOrigins` 加入服务器 IP/域名
2. 上线前清空 `data/consultation_submissions.json` 和 `data/contact_submissions.json` 的测试数据
3. PM2 单实例运行（JSON 文件存储不支持并发写）

## 部署步骤速查

```bash
# 0. 服务器准备
apt update && apt install -y curl git build-essential ca-certificates nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm i -g pm2
useradd -m -s /bin/bash deploy && passwd deploy

# 1. 拉代码
su - deploy
sudo mkdir -p /var/www && sudo chown -R deploy:deploy /var/www
cd /var/www
git clone https://github.com/cc072699/560-ai-website.git
cd 560-ai-website

# 2. 装依赖 + 构建
npm ci
# 上传 .env.production 到项目根（scp 或 nano）
npm run build

# 3. PM2 启动
pm2 start ecosystem.config.js
pm2 save && pm2 startup
```

## 更新脚本 `deploy.sh`

```bash
#!/bin/bash
set -e
cd /var/www/560-ai-website
git pull origin main
npm ci
npm run build
pm2 reload 560-ai-website
```

## 注意事项

- `data/*.json` 需 deploy 用户有写权限（PM2 跑在 deploy 下）
- `public/uploads/` 已在 Git 跟踪
- Nginx 上传大小：`client_max_body_size 50M`
- 多实例 PM2 不安全（JSON 写竞争）
- 后台默认密码**部署后立刻改**

## 常见坑

1. Node 25 编译 sharp 失败 → 用 20 LTS
2. `/admin` 转圈 → 检查 NEXTAUTH_SECRET
3. 图片 404 → `git ls-files public/uploads/`
4. Nginx 413 → 调 `client_max_body_size`
5. 防火墙阻断 → `ufw allow 80/tcp` 或 `3000/tcp`
