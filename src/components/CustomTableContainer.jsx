import { RefreshCw, Eye, Edit2, Plus } from 'lucide-react';

export default function CustomTableContainer({ columns, data, emptyMessage, onAction }) {
  return (
    <div className="table-container">
      <table className="premium-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
            <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="empty-state">
                {emptyMessage || 'No data found.'}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id || Math.random()}>
                {columns.map((col, index) => (
                  <td key={index}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
                ))}
                <td style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => onAction && onAction('VIEW', row)} 
                    title="View" 
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginRight: '12px' }}
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => onAction && onAction('EDIT', row)} 
                    title="Edit" 
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  >
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
