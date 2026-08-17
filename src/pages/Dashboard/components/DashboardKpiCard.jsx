import React from 'react';

export default function DashboardKpiCard({ title, value, icon: Icon, colorClass = "text-primary", loading = false }) {
  return (
    <div className="enterprise-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          {title}
        </h4>
        {Icon && (
          <div className={`icon-container ${colorClass}`} style={{ backgroundColor: 'var(--bg-app)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Icon size={20} />
          </div>
        )}
      </div>
      
      <div style={{ marginTop: 'auto' }}>
        {loading ? (
          <div style={{ height: '32px', width: '60%', backgroundColor: 'var(--border-divider)', borderRadius: 'var(--radius-sm)', animation: 'pulse 1.5s infinite' }}></div>
        ) : (
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', lineHeight: 1.2 }}>
            {value !== undefined && value !== null ? value.toLocaleString() : '—'}
          </span>
        )}
      </div>
    </div>
  );
}
