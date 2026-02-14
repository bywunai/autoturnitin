import { useQuery } from '@tanstack/react-query';
import { getSubmissionStatus } from '@/api/client';
import { useSubmissionStore } from '@/store/submission';

export function useSubmissionStatus(submissionId?: string) {
  const updateSubmission = useSubmissionStore((state) => state.actions.updateSubmission);

  return useQuery({
    queryKey: ['submission-status', submissionId],
    queryFn: async () => {
      if (!submissionId) {
        throw new Error('submissionId is required');
      }

      const submission = await getSubmissionStatus(submissionId);
      updateSubmission(submission);
      return submission;
    },
    enabled: Boolean(submissionId),
    refetchInterval: (submission) => {
      if (!submission) {
        return 5000;
      }

      return submission.status === 'ready' || submission.status === 'expired' || submission.status === 'failed'
        ? false
        : 4000;
    }
  });
}
