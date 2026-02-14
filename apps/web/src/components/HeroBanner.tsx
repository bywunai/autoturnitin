export function HeroBanner() {
  return (
    <section className="glass-panel" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div>
          <p className="status-pill processing" style={{ display: 'inline-flex', gap: 8 }}>
            AutoTurnitin · 自助检测系统
          </p>
          <h1 id="hero-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: 16, marginBottom: 16 }}>
            复制 Turnitin 提交体验
          </h1>
          <p style={{ color: '#cbd5f5', maxWidth: 520, marginBottom: 24 }}>
            无需登录即可上传稿件、输入检测码、等待管理员处理。前台实时反馈进度，后台可人工上传查重与 AI 报告，24 小时后自动清理。
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button className="cta-button" type="button">
              立即提交检测
            </button>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>全天候监控 · 官方报告格式 · 数据加密存储</div>
          </div>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 16 }}>
          {[
            '输入检测码锁定配额，支持批量生成',
            '上传稿件后呈现实时进度与倒计时',
            '报告上线后提供 24 小时签名下载'
          ].map((item) => (
            <li key={item} className="progress-step active">
              <span style={{ fontSize: '1.8rem' }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
