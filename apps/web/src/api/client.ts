import type {
  ApiResponse,
  CreateSubmissionPayload,
  SubmissionRecord,
  SubmissionStatusResponse
} from '@autoturnitin/config';
import { API_ROUTES } from '@autoturnitin/config';

const headers: Record<string, string> = {
  Accept: 'application/json'
};

type SubmissionPayloadWithFile = CreateSubmissionPayload & {
  file: File;
};

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type');
  const body = contentType && contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof body === 'string' ? body : body?.message || '请求失败';
    throw new Error(message);
  }

  return body as T;
}

export async function createSubmission(payload: SubmissionPayloadWithFile): Promise<SubmissionRecord> {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'file' && value instanceof File) {
      formData.append('file', value);
      return;
    }

    if (typeof value === 'undefined' || value === null) {
      return;
    }

    formData.append(key, String(value));
  });

  const res = await fetch(API_ROUTES.public.submissions, {
    method: 'POST',
    body: formData,
    headers
  });

  const data = await handleResponse<ApiResponse<SubmissionRecord>>(res);
  return data.data;
}

export async function getSubmissionStatus(submissionId: string): Promise<SubmissionRecord> {
  const res = await fetch(API_ROUTES.public.submissionById(submissionId), {
    headers
  });

  const data = await handleResponse<ApiResponse<SubmissionStatusResponse>>(res);
  return data.data.submission;
}

export async function validateDetectionCode(code: string): Promise<boolean> {
  const res = await fetch(API_ROUTES.public.detectionCode(code), { headers });
  if (res.status === 404) {
    return false;
  }

  const data = await handleResponse<ApiResponse<{ status: string }>>(res);
  return data.data.status === 'available';
}
