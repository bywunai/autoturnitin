import { Body, Controller, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SubmissionService } from './submission.service';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('admin')
export class AdminSubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Get('submissions')
  findAll() {
    const submissions = this.submissionService.findAll();
    return { data: { items: submissions, total: submissions.length } };
  }

  @Patch('submissions/:id')
  updateStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
    const submission = this.submissionService.updateStatus(id, body);
    return { data: submission };
  }

  @Post('submissions/:id/reports')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'similarityReport', maxCount: 1 }, { name: 'aiReport', maxCount: 1 }]))
  uploadReports(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      similarityReport?: Express.Multer.File[];
      aiReport?: Express.Multer.File[];
    }
  ) {
    let submission = this.submissionService.findOne(id);
    if (files?.similarityReport?.length) {
      submission = this.submissionService.uploadReport(id, 'similarity', files.similarityReport[0].originalname);
    }
    if (files?.aiReport?.length) {
      submission = this.submissionService.uploadReport(id, 'ai', files.aiReport[0].originalname);
    }

    return { data: submission };
  }
}
