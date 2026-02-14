import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { CreateSubmissionPayload } from '@autoturnitin/config';
import { useSubmissionStore } from '@/store/submission';
import { validateDetectionCode } from '@/api/client';

type FormValues = CreateSubmissionPayload;

export function SubmissionForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<FormValues>();
  const [file, setFile] = useState<File | null>(null);
  const [codeMessage, setCodeMessage] = useState<string>('请输入检测码以验证可用性');
  const [codeStatus, setCodeStatus] = useState<'idle' | 'checking' | 'invalid' | 'valid'>('idle');
  const { phase, error } = useSubmissionStore((state) => state);
  const submit = useSubmissionStore((state) => state.actions.submit);

  const onSubmit = handleSubmit(async (values) => {
    if (!file) {
      setCodeMessage('请先选择要检测的文档文件');
      setCodeStatus('invalid');
      return;
    }

    await submit(values, file);
  });

  const handleCodeBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const code = event.target.value.trim();
    if (!code) {
      setCodeStatus('invalid');
      setCodeMessage('检测码不能为空');
      return;
    }

    setCodeStatus('checking');
    try {
      const valid = await validateDetectionCode(code);
      setCodeStatus(valid ? 'valid' : 'invalid');
      setCodeMessage(valid ? '检测码可用，提交后将锁定额度' : '检测码不可用，请核对或联系运营');
    } catch (err) {
      setCodeStatus('invalid');
      setCodeMessage(err instanceof Error ? err.message : '检测码校验失败');
    }
  };

  return (
    <section className="glass-panel" aria-label="提交检测">
      <form onSubmit={onSubmit} className="form-grid">
        <div className="form-field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="detectionCode">检测码</label>
          <input id="detectionCode" {...register('detectionCode', { required: true })} onBlur={handleCodeBlur} placeholder="XXXX-XXXX-XXXX" />
          <small style={{ color: codeStatus === 'invalid' ? '#fda4af' : '#93c5fd' }}>{codeMessage}</small>
        </div>

        <div className="form-field">
          <label htmlFor="fullName">姓名 / 联系人</label>
          <input id="fullName" {...register('fullName', { required: true })} placeholder="张三" />
        </div>

        <div className="form-field">
          <label htmlFor="email">邮箱</label>
          <input id="email" type="email" {...register('email', { required: true })} placeholder="you@example.com" />
        </div>

        <div className="form-field">
          <label htmlFor="documentType">稿件类型</label>
          <select id="documentType" {...register('documentType', { required: true })} defaultValue="论文">
            {['论文', '期刊稿件', '课程作业', '商业文稿'].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="wordCount">字数</label>
          <input id="wordCount" type="number" min={0} {...register('wordCount')} placeholder="建议填写" />
        </div>

        <div className="form-field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="notes">备注</label>
          <textarea id="notes" rows={3} {...register('notes')} placeholder="例如：需要中英文报告、紧急加急等" />
        </div>

        <div className="form-field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="file">上传文档（doc/docx/pdf，≤30MB）</label>
          <input id="file" type="file" accept=".doc,.docx,.pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required />
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="cta-button" type="submit" disabled={isSubmitting || phase === 'submitting'}>
            {phase === 'submitting' ? '提交中...' : '提交检测'}
          </button>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>提交后请保持页面，报告完成即刻提示</span>
        </div>

        {error && (
          <div style={{ gridColumn: '1 / -1', color: '#fda4af', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}
      </form>
    </section>
  );
}
