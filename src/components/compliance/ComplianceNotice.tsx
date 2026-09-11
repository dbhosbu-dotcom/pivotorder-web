type ComplianceNoticeProps = {
  compact?: boolean;
};

export default function ComplianceNotice({ compact = false }: ComplianceNoticeProps) {
  return (
    <aside
      role="note"
      style={{
        marginTop: compact ? '16px' : '28px',
        padding: compact ? '12px 14px' : '16px 18px',
        borderRadius: '10px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-subtle)',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: compact ? '0.8125rem' : '0.875rem',
          lineHeight: 1.7,
          color: 'var(--color-text-secondary)',
        }}
      >
        报告仅供健康管理参考，不构成医学诊断或治疗建议，亦不承诺获客、成交或疗效。
        跟进须由你人工确认后发送；平台不自动私信、不自动群发。
      </p>
    </aside>
  );
}
