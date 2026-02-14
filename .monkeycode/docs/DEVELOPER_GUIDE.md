# 开发者指南

## 目录结构（规划）
```
/
├─ apps/
│  ├─ web/               # Vite + React 仿站前端
│  └─ admin/             # 后台管理前端（可共享组件库）
├─ services/
│  └─ api/               # NestJS REST API
├─ packages/
│  ├─ ui/                # 共享 UI 组件库（按钮、表单、模态）
│  └─ config/            # 类型与 API SDK
└─ infra/                # IaC 模板（Terraform/CDK）
```

## 本地开发流程
1. **安装依赖**
   - Node.js 20+
   - pnpm 9+
   - PostgreSQL 15（本地可使用 Docker Compose）
   - Redis 7（BullMQ 与缓存）
2. **环境变量**：复制 `apps/*/.env.example` 至 `.env.local`，填入对象存储、数据库、Redis、签名密钥等变量。
3. **初始化数据库**：
   ```bash
   # 创建数据库与表
   pnpm prisma migrate deploy
   ```
4. **启动服务**：
   ```bash
   # 并行启动前台、后台、API
   pnpm dev:all
   ```
5. **运行单元测试**：
   ```bash
   pnpm test
   ```
6. **代码质量**：提交前运行 `pnpm lint && pnpm typecheck`。

## 约定
- **UI 规范**：严格对齐参考站点的布局/色板；使用 CSS 变量集中管理主题。
- **API 前缀**：所有公共 API 走 `/api/public/*`，管理端走 `/api/admin/*`，前端开发服务器需通过 `/api` 代理后端。
- **检测码**：统一长度 12，格式 `XXXX-XXXX-XXXX`；数据库层保持 `char(14)` 并包含校验位。
- **状态枚举**：`processing | waiting_admin | ready | failed | expired | deleted`。
- **文件策略**：上传至对象存储 ` submissions/<id>/origin` 与 `reports/<id>/similarity|ai`，生命周期 24 小时。

## 安全与合规
- 所有管理员操作写入 `admin_audit_logs`，包含 IP、User-Agent、变更前后状态。
- 报告下载使用一次性签名 URL，默认 5 分钟有效。
- 前端对上传文件执行 MIME/大小校验，并添加 reCAPTCHA/行为验证限制机器人。
- API 层启用速率限制与 WAF（Cloudflare Turnstile + R2 监听）。

## 部署建议
- 使用 Terraform 管理基础设施：Vercel/Netlify 部署前端，AWS ECS/Fargate 部署 API。
- 对象存储可使用 AWS S3 + S3 Intelligent-Tiering；设置生命周期策略 T+1 清除。
- 通过 GitHub Actions 进行 CI/CD：
  1. 运行 lint/test。
  2. 构建 Docker 镜像并推送 ECR。
  3. 触发 ECS 滚动更新。

## 后续路线
- 集成在线支付（Stripe/国内支付）绑定检测码发放。
- 增加 Webhook 通知用户报告完成。
- 评估自动化官方接口对接的可行性。
