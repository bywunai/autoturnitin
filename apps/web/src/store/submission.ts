import type { CreateSubmissionPayload, SubmissionRecord } from '@autoturnitin/config';
import { create } from 'zustand';
import { createSubmission } from '@/api/client';

type SubmissionStatusFlag = 'idle' | 'submitting' | 'awaiting' | 'error';

interface SubmissionState {
  submission?: SubmissionRecord;
  phase: SubmissionStatusFlag;
  error?: string;
  actions: {
    submit: (payload: CreateSubmissionPayload, file: File) => Promise<void>;
    updateSubmission: (submission: SubmissionRecord) => void;
    reset: () => void;
  };
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  phase: 'idle',
  submission: undefined,
  error: undefined,
  actions: {
    async submit(payload, file) {
      set({ phase: 'submitting', error: undefined });
      try {
        const submission = await createSubmission({ ...payload, file });
        set({ submission, phase: 'awaiting' });
      } catch (error) {
        set({ phase: 'error', error: error instanceof Error ? error.message : '提交失败' });
      }
    },
    updateSubmission(submission) {
      set({ submission });
    },
    reset() {
      set({ submission: undefined, phase: 'idle', error: undefined });
    }
  }
}));
