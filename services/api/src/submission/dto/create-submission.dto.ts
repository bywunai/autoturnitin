import type { CreateSubmissionPayload } from '@autoturnitin/config';

export class CreateSubmissionDto implements CreateSubmissionPayload {
  detectionCode!: string;
  fullName!: string;
  email!: string;
  documentType!: string;
  institution?: string | undefined;
  notes?: string | undefined;
  wordCount?: number | undefined;
}
