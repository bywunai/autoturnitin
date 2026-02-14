import { Module } from '@nestjs/common';
import { SubmissionModule } from './submission/submission.module';

@Module({
  imports: [SubmissionModule]
})
export class AppModule {}
