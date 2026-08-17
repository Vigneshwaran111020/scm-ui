import React from 'react';
import { ArrowRightLeft, Package, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function RecentTransactions({ transactions = [], loading = false }) {
  if (loading) {
    return (
      <div className="enterprise-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} className="text-primary" />
          Recent Inventory Transactions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ height: '48px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }}></div>
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="enterprise-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} className="text-primary" />
          Recent Inventory Transactions
        </h3>
        <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No recent inventory transactions.
        </div>
      </div>
    );
  }

  return (
    <div className="enterprise-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-divider)' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} className="text-primary" />
          Recent Inventory Transactions
        </h3>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="enterprise-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-main)', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>ID</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-main)', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-main)', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>SKU / Product</th>
              <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid var(--border-main)', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Quantity</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-main)', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>From</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-main)', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>To</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-main)', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, idx) => (
              <tr key={txn.transactionId || idx} style={{ borderBottom: '1px solid var(--border-divider)' }} className="table-row-hover">
                <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>
                  {txn.transactionId}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                    padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600,
                    backgroundColor: txn.transactionType?.includes('IN') ? 'rgba(16, 185, 129, 0.1)' : txn.transactionType?.includes('OUT') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    color: txn.transactionType?.includes('IN') ? '#10b981' : txn.transactionType?.includes('OUT') ? '#ef4444' : '#3b82f6'
                  }}>
                    {txn.transactionType}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>{txn.sku}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{txn.product}</div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {txn.quantity}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {txn.fromBin || '—'}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {txn.toBin || '—'}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {txn.transactionDate ? format(new Date(txn.transactionDate), 'MMM dd, yyyy HH:mm') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
