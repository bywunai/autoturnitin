import type { PaginatedResponse, SubmissionRecord, SubmissionStatus, UpdateSubmissionStatusDto } from '@autoturnitin/config';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

const hoursFromNow = (hours: number) => dayjs().add(hours, 'hour').toISOString();

const createRecord = (overrides: Partial<SubmissionRecord>): SubmissionRecord => ({
  submissionId: nanoid(10),
  displayId: `AT-${Math.floor(Math.random() * 999999)}`,
  detectionCode: overrides.detectionCode || 'ABCD-1234-EFGH',
  fullName: 'Demo User',
  email: 'demo@example.com',
  documentType: '论文',
  wordCount: 4500,
  status: 'processing',
  progressMessage: '等待管理员接单',
  expiresAt: hoursFromNow(24),
  reportLinks: [
    { type: 'similarity', ready: false },
    { type: 'ai', ready: false }
  ],
  createdAt: dayjs().subtract(2, 'hour').toISOString(),
  updatedAt: dayjs().toISOString(),
  ...overrides
});

let submissions: SubmissionRecord[] = [
  createRecord({
    status: 'ready',
    progressMessage: '管理员上传成功',
    reportLinks: [
      { type: 'similarity', ready: true, url: '/reports/demo-sim.pdf', updatedAt: dayjs().toISOString() },
      { type: 'ai', ready: true, url: '/reports/demo-ai.pdf', updatedAt: dayjs().toISOString() }
    ]
  }),
  createRecord({
    status: 'waiting_admin',
    progressMessage: '正在进行人工查询',
    fullName: 'Li Auto'
  }),
  createRecord({
    status: 'processing',
    progressMessage: '排队中',
    fullName: 'Zhang Demo'
  })
];

export async function fetchSubmissionsMock(): Promise<PaginatedResponse<SubmissionRecord>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: submissions,
        page: 1,
        pageSize: submissions.length,
        total: submissions.length
      });
    }, 300);
  });
}

export async function updateSubmissionStatusMock(id: string, dto: UpdateSubmissionStatusDto): Promise<SubmissionRecord> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = submissions.findIndex((record) => record.submissionId === id);
      if (index === -1) {
        reject(new Error('记录不存在'));
        return;
      }

      const updated: SubmissionRecord = {
        ...submissions[index],
        status: dto.status as SubmissionStatus,
        progressMessage: dto.note || submissions[index].progressMessage,
        updatedAt: dayjs().toISOString()
      };

      submissions[index] = updated;
      resolve(updated);
    }, 250);
  });
}
