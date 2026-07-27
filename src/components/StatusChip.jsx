import React from 'react';

export default function StatusChip({ status }) {
  const s = (status || 'draft').toLowerCase();
  
  let chipClass = 'draft';
  if (['completed', 'success', 'delivered'].includes(s)) chipClass = 'success';
  if (['pending', 'warning', 'in-transit', 'delayed'].includes(s)) chipClass = 'warning';
  if (['cancelled', 'error', 'failed'].includes(s)) chipClass = 'error';
  if (['in progress', 'info', 'active'].includes(s)) chipClass = 'info';

  return (
    <span className={`status-chip ${chipClass}`}>
      {status || 'Draft'}
    </span>
  );
}
