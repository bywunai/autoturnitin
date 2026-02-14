# Requirements Document

## Introduction
AutoTurnitin 自助检测平台复制 turnitin-service.com/similarity 的使用体验，允许访客无需登录即可上传文档，通过检测码提交查询，后台管理员人工处理并上传查重/AI 报告，系统在 24 小时内提供下载入口并自动清理。

## Glossary
- **Visitor**：无需登录即可提交检测请求的终端用户。
- **Detection Code**：管理员预先生成的 12 位编码，作为提交校验与订单绑定凭证。
- **Submission**：一次访客上传请求及其相关元数据、文件、状态。
- **Admin**：登录管理后台的运营人员，可管理记录、报告、检测码与统计。
- **Report**：管理员上传的查重报告或 AI 鉴别报告文件。
- **Cleanup Worker**：定时任务，用于过期删除文件与记录。

## Requirements

### R1 自助提交链路
**User Story:** AS a Visitor, I want to upload my document with a detection code so that I can request a similarity check without creating an account.

#### Acceptance Criteria
1. WHEN a Visitor clicks **提交检测**, the system SHALL validate the detection code status (`available`) before accepting the upload.
2. WHEN the detection code is valid, the system SHALL persist the submission metadata, lock the code, and set the submission status to `processing`.
3. IF file upload fails, the system SHALL surface a blocking error message and keep the detection code in `available` state.
4. WHILE the submission is `processing`, the frontend SHALL display disabled grey download buttons and a “等待结果” progress indicator.

### R2 结果展示与下载
**User Story:** AS a Visitor, I want to know when my report is ready and download it within 24 hours so that I can obtain the checking result.

#### Acceptance Criteria
1. WHEN the submission status transitions to `ready`, the system SHALL expose both download actions as active blue buttons with a countdown message “24 小时后自动删除”。
2. WHILE status is `processing` or `waiting_admin`, the system SHALL keep the download buttons disabled and display the latest progress message.
3. IF 24 hours elapse after status `ready`, the system SHALL mark the submission `expired`, disable downloads, and delete associated report files.
4. WHEN a Visitor requests a download during the valid window, the system SHALL issue a signed URL (valid ≤5 minutes) and log the download event.

### R3 管理后台检测记录
**User Story:** AS an Admin, I want to review and manage all submissions so that I can process tasks and maintain accurate statuses.

#### Acceptance Criteria
1. WHEN an Admin filters submissions by detection code, date range, status, or keyword, the system SHALL return matching records with pagination, file size, word count, and current state.
2. WHEN an Admin manually updates a submission status (e.g., `processing` → `ready`), the system SHALL persist the change, record an audit log, and trigger frontend notifications.
3. WHEN an Admin deletes a submission, the system SHALL remove stored files, mark the record as `deleted`, and revoke any active download URLs.
4. WHEN an Admin downloads user uploads or reports, the system SHALL log the action with actor, timestamp, and IP address.

### R4 检测码生命周期管理
**User Story:** AS an Admin, I want to generate and control detection codes so that each submission is authorized and traceable.

#### Acceptance Criteria
1. WHEN an Admin requests a batch generation, the system SHALL create unique detection codes with batch metadata, quota, and optional expiration.
2. WHEN a Visitor submits using a detection code, the system SHALL transition the code state to `in-use` and bind it to the submission.
3. IF a detection code is `expired`, `used`, or `invalid`, the system SHALL block the submission attempt and return a descriptive error.
4. WHEN an Admin imports detection codes via CSV, the system SHALL validate format, prevent duplicates, and provide a summary report.

### R5 报告上传与同步
**User Story:** AS an Admin, I want to upload similarity and AI reports so that visitors can download finalized results.

#### Acceptance Criteria
1. WHEN an Admin uploads either report, the system SHALL store the file in object storage, associate it with the submission, and optionally update the status to `ready`.
2. WHEN only one report is uploaded, the system SHALL keep the other download button disabled and labeled “待上传”。
3. WHEN an Admin re-uploads a report, the system SHALL replace the previous file, refresh signed URLs, and extend the 24-hour retention window from the latest upload time.
4. IF report upload fails, the system SHALL retain the previous state and surface an actionable error message to the Admin.

### R6 运营统计与监控
**User Story:** AS an Operations Owner, I want to monitor throughput and issues so that I can keep the service reliable.

#### Acceptance Criteria
1. WHEN an Admin opens the运营统计 dashboard, the system SHALL provide submission volume, completion rate, average turnaround time, and failure counts grouped by day/week.
2. WHEN the system detects failed submissions or retries, it SHALL list the top failure reasons and expose a **任务重试** action per record.
3. WHEN the cleanup worker removes expired data, it SHALL emit metrics and audit logs for storage reclaim summary.
4. IF the cleanup worker encounters an error, the system SHALL raise an alert in the dashboard and via email to super admins.

### R7 安全与合规
**User Story:** AS the Platform Owner, I want the service to be secure so that sensitive manuscripts and reports are protected.

#### Acceptance Criteria
1. WHEN a Visitor uploads a file larger than the configured limit (default 30 MB), the system SHALL reject it with a clear error message.
2. WHEN admins sign in, the system SHALL enforce MFA and role-based access for different modules (records, detection codes, analytics).
3. WHEN any file is downloaded (user or admin), the system SHALL enforce signed URLs and automatically revoke them after the configured duration.
4. IF repeated invalid submissions occur from the same IP, the system SHALL throttle the requests and log them as potential abuse incidents.
