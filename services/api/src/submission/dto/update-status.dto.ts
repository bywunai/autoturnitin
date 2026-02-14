import type { SubmissionStatus, UpdateSubmissionStatusDto } from '@autoturnitin/config';

export class UpdateStatusDto implements UpdateSubmissionStatusDto {
  status!: SubmissionStatus;
  note?: string;
}
