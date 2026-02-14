import type { SubmissionRecord } from '@autoturnitin/config';
import { useSubmissionStore } from '@/store/submission';
import { useSubmissionStatus } from '@/hooks/useSubmissionStatus';

const steps = [
  { key: 'processing', title: '等待管理员接单', description: '文档已上传，正在排队处理中' },
  { key: 'waiting_admin', title: '人工处理', description: '管理员同步至官方渠道' },
  { key: 'ready', title: '可下载报告', description: '查重 / AI 报告可供下载' }
] as const;

function StatusBadge({ status }: { status: SubmissionRecord['status'] | undefined }) {
  if (!status) {
    return <span className="status-pill">待提交</span>;
  }

  return <span className={`status-pill ${status}`}>{status}</span>;
}

export function StatusPanel() {
  const submission = useSubmissionStore((state) => state.submission);
  const submissionId = submission?.submissionId;
  useSubmissionStatus(submissionId);

  return (
    <section className="glass-panel">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p style={{ color: '#94a3b8', margin: 0 }}>检测进度</p>
          <h2 style={{ margin: '8px 0 0', fontSize: '1.5rem' }}>Submission Timeline</h2>
        </div>
        <StatusBadge status={submission?.status} />
      </header>

      <div className="status-grid">
        <div>
          <div className="progress-track">
            {steps.map((step) => (
              <article key={step.key} className={`progress-step ${submission && submission.status === step.key ? 'active' : ''}`}>
                <div>
                  <strong>{step.title}</strong>
                  <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <ReportPanel submission={submission} />
      </div>
    </section>
  );
}

function ReportPanel({ submission }: { submission?: SubmissionRecord }) {
  const downloadDeadline = submission ? new Date(submission.expiresAt) : null;
  const countdown = downloadDeadline ? Math.max(0, downloadDeadline.getTime() - Date.now()) : null;
  const hoursLeft = countdown ? Math.ceil(countdown / (1000 * 60 * 60)) : 0;

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>报告交付</h3>
      <p style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>
        {submission
          ? submission.status === 'ready'
            ? `报告已生成，请在 ${hoursLeft} 小时内下载，超时自动删除`
            : '管理员处理完成后，将在此处启用下载按钮'
          : '提交成功后可在此追踪下载状态'}
      </p>

      <div className="report-actions">
        {['similarity', 'ai'].map((type) => {
          const link = submission?.reportLinks.find((item) => item.type === type);
          const ready = Boolean(link?.ready && link?.url);
          return (
            <button
              key={type}
              type="button"
              className={`report-button ${ready ? 'ready' : 'disabled'}`}
              disabled={!ready}
              onClick={() => ready && link?.url && window.open(link.url, '_blank')}
            >
              <span>{type === 'similarity' ? '下载查重报告' : '下载 AI 报告'}</span>
              <span>{ready ? '可用' : '待上线'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
