import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import type { ReportType } from '@autoturnitin/config';

@Controller('public')
export class PublicSubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post('submissions')
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() body: CreateSubmissionDto, @UploadedFile() file?: Express.Multer.File) {
    const submission = this.submissionService.create(body, file?.originalname);
    return { data: submission };
  }

  @Get('submissions/:id')
  findOne(@Param('id') id: string) {
    return { data: { submission: this.submissionService.findOne(id) } };
  }

  @Get('codes/:code')
  validateCode(@Param('code') code: string) {
    return { data: this.submissionService.validateDetectionCode(code) };
  }

  @Get('submissions/:id/reports/:type')
  downloadReport(@Param('id') id: string, @Param('type') type: ReportType) {
    const submission = this.submissionService.findOne(id);
    const link = submission.reportLinks.find((report) => report.type === type);
    if (!link || !link.ready || !link.url) {
      throw new NotFoundException('报告尚未就绪');
    }

    return { data: { url: link.url } };
  }
}
