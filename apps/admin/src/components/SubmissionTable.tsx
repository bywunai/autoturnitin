import type { SubmissionRecord, SubmissionStatus } from '@autoturnitin/config';

interface SubmissionTableProps {
  rows?: SubmissionRecord[];
  loading?: boolean;
  onStatusChange?: (id: string, status: SubmissionStatus) => void;
}

const statusOptions: SubmissionStatus[] = ['processing', 'waiting_admin', 'ready', 'failed', 'expired', 'deleted'];

export function SubmissionTable({ rows = [], loading, onStatusChange }: SubmissionTableProps) {
  if (loading) {
    return <p>加载中...</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>提交编号</th>
            <th>检测码</th>
            <th>联系人</th>
            <th>字数</th>
            <th>状态</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.submissionId}>
              <td>{row.displayId}</td>
              <td>{row.detectionCode}</td>
              <td>{row.fullName}</td>
              <td>{row.wordCount ?? '—'}</td>
              <td>
                <span className={`status-chip ${row.status}`}>{row.status}</span>
              </td>
              <td>{new Date(row.updatedAt).toLocaleString()}</td>
              <td>
                <select defaultValue={row.status} onChange={(event) => onStatusChange?.(row.submissionId, event.target.value as SubmissionStatus)}>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
