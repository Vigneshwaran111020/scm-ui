import React from 'react';

export default function StatusChip({ status }) {
  // Handle boolean values gracefully
  let displayValue = status;
  if (typeof status === 'boolean') {
    displayValue = status ? 'Active' : 'Inactive';
  } else if (status === null || status === undefined) {
    displayValue = 'Draft';
  }
  
  const s = String(displayValue).toLowerCase();
  
  let chipClass = 'draft';
  if (['completed', 'success', 'delivered', 'active'].includes(s)) chipClass = 'success';
  if (['pending', 'warning', 'in-transit', 'delayed'].includes(s)) chipClass = 'warning';
  if (['cancelled', 'error', 'failed', 'inactive'].includes(s)) chipClass = 'error';
  if (['in progress', 'info'].includes(s)) chipClass = 'info';

  return (
    <span className={`status-chip ${chipClass}`}>
      {displayValue}
    </span>
  );
}
