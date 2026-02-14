import { Module } from '@nestjs/common';
import { PublicSubmissionController } from './public.controller';
import { AdminSubmissionController } from './admin.controller';
import { SubmissionService } from './submission.service';

@Module({
  controllers: [PublicSubmissionController, AdminSubmissionController],
  providers: [SubmissionService]
})
export class SubmissionModule {}
