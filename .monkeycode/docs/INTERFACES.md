# 接口说明

## 公共 API

### 1. 获取检测码状态
| 项目 | 说明 |
| --- | --- |
| Method | `GET /api/public/codes/{code}` |
| Query | `code`: 字母数字 10-16 位 |
| Response | `{ code, status: available|used|invalid, quota, expiresAt }` |
| 说明 | 前端在提交前调用，只有 `available` 才允许提交 |

### 2. 提交自助检测
| 项目 | 说明 |
| --- | --- |
| Method | `POST /api/public/submissions` |
| Body | `multipart/form-data`: `code`, `fullName`, `email`, `documentType`, `wordCount`, `file` |
| Response | `{ submissionId, displayId, status, expiresAt }` |
| 说明 | 验证检测码并锁定，文件上传到对象存储，状态初始为 `processing` |

### 3. 查询提交状态
| 项目 | 说明 |
| --- | --- |
| Method | `GET /api/public/submissions/{submissionId}` |
| Response | `{ status, aiReportUrl?, similarityReportUrl?, progress, message }` |
| 说明 | 前端轮询或长轮询接口，status 取值 `processing|ready|expired|failed` |

### 4. 下载报告
| 项目 | 说明 |
| --- | --- |
| Method | `GET /api/public/submissions/{submissionId}/reports/{type}` |
| Params | `type`: `similarity` 或 `ai` |
| Response | `302` 重定向至带签名的对象存储 URL |
| 说明 | 仅当状态为 `ready` 且未过期时返回；超时返回 `410 Gone` |

## 管理端 API（需 Bearer Token）

### 1. 登录
| Method | `POST /api/admin/auth/login` |
| Body | `{ email, password, otp }` |
| Response | `{ accessToken, refreshToken, role }` |

### 2. 检测记录列表
| Method | `GET /api/admin/submissions` |
| Query | `status`, `code`, `dateFrom`, `dateTo`, `keyword`, `page`, `pageSize` |
| Response | `items[]`（含文件名、大小、字数、状态、报告链接、删除标记） + `meta` |

### 3. 更新提交状态
| Method | `PATCH /api/admin/submissions/{id}` |
| Body | `{ status, note }` |
| 说明 | 允许管理员将 `processing` 改为 `ready|failed|cancelled`，并触发通知 |

### 4. 上传报告
| Method | `POST /api/admin/submissions/{id}/reports` |
| Body | `multipart/form-data`: `similarityReport`, `aiReport`, `expiresOverride?` |
| 说明 | 保存文件到对象存储，写入下载 token，若仅上传其一则另一份仍为占位灰色按钮 |

### 5. 检测码管理
| Create | `POST /api/admin/codes`，Body `{ count, batchName, quota }` |
| Import | `POST /api/admin/codes/import` 上传 CSV |
| List | `GET /api/admin/codes` 支持状态筛选（available/in-use/expired） |
| Bulk Query | `POST /api/admin/codes/query` Body `{ codes: string[] }` |

### 6. 订单/任务
| List | `GET /api/admin/orders`，可按渠道、状态、日期查询 |
| Retry | `POST /api/admin/orders/{id}/retry` 记录重新处理动作 |

### 7. 报表与监控
| Stats | `GET /api/admin/analytics/summary` 返回提交量、完成率、平均 TAT |
| Failures | `GET /api/admin/analytics/failures` 提供 Top 异常原因 |
| System | `GET /api/admin/health` 返回对象存储、数据库、队列健康度 |

### 8. 审计日志
| Method | `GET /api/admin/audit-logs` |
| Query | `actor`, `action`, ` from`, `to` |
| 说明 | 记录管理员的状态变更、报告下载、删除等敏感操作。
