import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateSubmissionPayload,
  DetectionCodeRecord,
  ReportType,
  SubmissionRecord,
  SubmissionStatus,
  UpdateSubmissionStatusDto
} from '@autoturnitin/config';
import { randomUUID } from 'node:crypto';

const hoursFromNow = (hours: number) => new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

@Injectable()
export class SubmissionService {
  private submissions: SubmissionRecord[] = [];
  private detectionCodes: DetectionCodeRecord[] = [
    { code: 'ABCD-1234-EFGH', status: 'available' },
    { code: 'TOUR-7788-CODE', status: 'available' },
    { code: 'USED-1111-CODE', status: 'used' }
  ];

  create(payload: CreateSubmissionPayload, fileName?: string): SubmissionRecord {
    const code = this.detectionCodes.find((item) => item.code === payload.detectionCode);
    if (!code || code.status !== 'available') {
      throw new BadRequestException('检测码不可用');
    }

    code.status = 'in-use';

    const submission: SubmissionRecord = {
      submissionId: randomUUID(),
      displayId: `AT-${Math.floor(Math.random() * 999999)}`,
      detectionCode: payload.detectionCode,
      fullName: payload.fullName,
      email: payload.email,
      documentType: payload.documentType,
      institution: payload.institution,
      notes: payload.notes,
      wordCount: payload.wordCount,
      status: 'processing',
      progressMessage: '等待管理员接单',
      expiresAt: hoursFromNow(24),
      reportLinks: [
        { type: 'similarity', ready: false },
        { type: 'ai', ready: false }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.submissions.push(submission);
    return submission;
  }

  findAll(): SubmissionRecord[] {
    return this.submissions;
  }

  findOne(id: string): SubmissionRecord {
    const submission = this.submissions.find((item) => item.submissionId === id);
    if (!submission) {
      throw new NotFoundException('提交不存在');
    }

    return submission;
  }

  validateDetectionCode(code: string) {
    const record = this.detectionCodes.find((item) => item.code === code);
    if (!record) {
      throw new NotFoundException('检测码不存在');
    }

    return record;
  }

  updateStatus(id: string, dto: UpdateSubmissionStatusDto): SubmissionRecord {
    const submission = this.findOne(id);
    submission.status = dto.status as SubmissionStatus;
    if (dto.note) {
      submission.progressMessage = dto.note;
    }
    submission.updatedAt = new Date().toISOString();
    return submission;
  }

  uploadReport(id: string, type: ReportType, filename: string): SubmissionRecord {
    const submission = this.findOne(id);
    submission.reportLinks = submission.reportLinks.map((link) =>
      link.type === type
        ? {
            ...link,
            ready: true,
            url: `/files/${id}/${type}/${filename}`,
            updatedAt: new Date().toISOString()
          }
        : link
    );
    submission.status = 'ready';
    submission.expiresAt = hoursFromNow(24);
    submission.updatedAt = new Date().toISOString();
    return submission;
  }
}
