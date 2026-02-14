import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SubmissionStatus } from '@autoturnitin/config';
import { MetricCard } from '@/components/MetricCard';
import { SubmissionTable } from '@/components/SubmissionTable';
import { fetchSubmissionsMock, updateSubmissionStatusMock } from '@/api/mock';

export function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-submissions'], queryFn: fetchSubmissionsMock });
  const queryClient = useQueryClient();
  const rows = data?.items ?? [];
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SubmissionStatus }) => updateSubmissionStatusMock(id, { status }),
    onSuccess(updated) {
      queryClient.setQueryData(['admin-submissions'], (current: typeof data) => {
        if (!current) return current;
        return {
          ...current,
          items: current.items.map((item) => (item.submissionId === updated.submissionId ? updated : item))
        };
      });
    }
  });

  const readyCount = rows.filter((row) => row.status === 'ready').length;
  const processingCount = rows.filter((row) => row.status === 'processing' || row.status === 'waiting_admin').length;

  return (
    <div className="content">
      <header>
        <p style={{ color: '#94a3b8', margin: 0 }}>系统管理与监控中心</p>
        <h1 style={{ margin: '8px 0 0' }}>仪表盘</h1>
      </header>

      <section className="metric-grid">
        <MetricCard label="今日提交" value={String(rows.length)} trend="相比昨日 +18%" accent="#38bdf8" />
        <MetricCard label="已完成" value={`${readyCount}`} trend="转化率 62%" accent="#34d399" />
        <MetricCard label="处理中" value={`${processingCount}`} trend="平均 42 分钟" accent="#facc15" />
        <MetricCard label="失败/异常" value={`${rows.filter((row) => row.status === 'failed').length}`} accent="#fb7185" />
      </section>

      <section className="glass-card">
        <header style={{ marginBottom: 18 }}>
          <h2 style={{ margin: 0 }}>筛选条件</h2>
        </header>
        <div className="filters">
          <label>
            状态
            <select defaultValue="all">
              <option value="all">全部</option>
              <option value="processing">处理中</option>
              <option value="waiting_admin">人工处理中</option>
              <option value="ready">完成</option>
            </select>
          </label>
          <label>
            检测码
            <input placeholder="输入检测码" />
          </label>
          <label>
            日期范围
            <input type="date" />
          </label>
          <label>
            关键字
            <input placeholder="姓名、文件名" />
          </label>
        </div>
      </section>

      <section className="glass-card">
        <header style={{ display: 'flex', justify-content: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <p style={{ color: '#94a3b8', margin: 0 }}>检测记录</p>
            <h2 style={{ margin: 0 }}>Submissions</h2>
          </div>
          {mutation.isPending && <span style={{ color: '#fbbf24' }}>更新中...</span>}
        </header>
        <SubmissionTable rows={rows} loading={isLoading} onStatusChange={(id, status) => mutation.mutate({ id, status })} />
      </section>
    </div>
  );
}
