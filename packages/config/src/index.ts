export const SUBMISSION_STATUSES = [
  'processing',
  'waiting_admin',
  'ready',
  'failed',
  'expired',
  'deleted'
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export type ReportType = 'similarity' | 'ai';

export interface ReportLink {
  type: ReportType;
  ready: boolean;
  url?: string;
  updatedAt?: string;
}

export interface SubmissionMetadata {
  fullName: string;
  email: string;
  documentType: string;
  institution?: string;
  notes?: string;
  wordCount?: number;
}

export interface CreateSubmissionPayload extends SubmissionMetadata {
  detectionCode: string;
}

export interface SubmissionRecord extends SubmissionMetadata {
  submissionId: string;
  displayId: string;
  detectionCode: string;
  status: SubmissionStatus;
  progressMessage: string;
  expiresAt: string;
  reportLinks: ReportLink[];
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionStatusResponse {
  submission: SubmissionRecord;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface DetectionCodeRecord {
  code: string;
  status: 'available' | 'in-use' | 'used' | 'expired' | 'invalid';
  batch?: string;
  expiresAt?: string;
  quota?: number;
}

export interface AdminSubmissionFilter {
  status?: SubmissionStatus;
  code?: string;
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface UpdateSubmissionStatusDto {
  status: SubmissionStatus;
  note?: string;
}

export interface UploadReportPayload {
  similarityReport?: File | Buffer | Blob;
  aiReport?: File | Buffer | Blob;
  expiresOverrideHours?: number;
}

export const API_ROUTES = {
  public: {
    submissions: '/api/public/submissions',
    submissionById: (id: string) => `/api/public/submissions/${id}`,
    reports: (id: string, type: ReportType) => `/api/public/submissions/${id}/reports/${type}`,
    detectionCode: (code: string) => `/api/public/codes/${code}`
  },
  admin: {
    submissions: '/api/admin/submissions',
    submissionById: (id: string) => `/api/admin/submissions/${id}`,
    uploadReports: (id: string) => `/api/admin/submissions/${id}/reports`
  }
} as const;
