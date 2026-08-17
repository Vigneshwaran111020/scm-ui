import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Plus, RefreshCw, ArrowRightLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSelection, selectAll, clearSelection } from '../store/tableSlice';
import { apiFetch } from '../services/api';
import StatusChip from './StatusChip';
import { formatValue } from '../utils/formatUtils';
import { getTableConfig } from '../services/configService';

export default function CustomTableContainer({ tableId, title, icon: Icon, data, emptyMessage, onAction, onTransfer, onAdd, onRefresh }) {
  const dispatch = useDispatch();
  const selectedIds = useSelector(state => state.table[tableId]?.selectedIds || []);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!tableId) return;

    let isMounted = true;

    const loadConfig = async () => {
      setLoading(true);
      setError(null);
      try {
        const loadedConfig = await getTableConfig(tableId);
        if (isMounted) {
          setConfig(loadedConfig);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, [tableId]);

  const hasSelectColumn = config?.titleProps?.some(prop => prop.bodyType === 'select') || false;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const visibleIds = data.map(row => row.id).filter(Boolean);
      dispatch(selectAll({ tableId, ids: visibleIds }));
    } else {
      dispatch(clearSelection({ tableId }));
    }
  };

  const handleRowSelect = (id) => {
    if (id) dispatch(toggleSelection({ tableId, id }));
  };

  const handleSingleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      setIsDeleting(true);
      await apiFetch(`/api/${tableId}/${id}`, { method: 'DELETE' });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} records?`)) return;
    try {
      setIsDeleting(true);
      await apiFetch(`/api/${tableId}`, {
        method: 'DELETE',
        body: JSON.stringify(selectedIds)
      });
      dispatch(clearSelection({ tableId }));
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Bulk delete failed', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderCellValue = (prop, row) => {
    const val = row[prop.accessPath];

    if (prop.bodyType === 'status' || prop.bodyType === 'badge') {
      return <StatusChip status={val} />;
    }

    if (prop.bodyType || prop.dataType) {
      return formatValue(val, prop.dataType, prop.bodyType);
    }

    return val;
  };

  if (loading) {
    return <div className="table-container" style={{ padding: '2rem', textAlign: 'center' }}>Loading table configuration...</div>;
  }

  if (error) {
    return <div className="table-container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }}>Error loading table configuration: {error}</div>;
  }

  if (!config || !config.titleProps) {
    return null;
  }

  const { titleProps } = config;
  const visibleProps = titleProps.filter((prop) => prop.displayable !== false && prop.bodyType !== 'select');

  return (
    <div>
      {(title || onAdd || onRefresh) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
            {Icon && <Icon className="text-primary" style={{ marginRight: '8px' }} />} {title}
          </h2>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {hasSelectColumn && (
              <button
                onClick={handleBulkDelete}
                disabled={selectedIds.length === 0 || isDeleting}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: selectedIds.length === 0 ? 'var(--bg-secondary, #e0e0e0)' : 'var(--error, #ef4444)',
                  color: selectedIds.length === 0 ? 'var(--text-secondary, #666)' : '#fff',
                  border: 'none', padding: '0.5rem 1rem', borderRadius: '4px',
                  cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <Trash2 size={16} /> Delete
              </button>
            )}
            {onAdd && (
              <button className="btn-primary" onClick={onAdd} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={16} /> Add
              </button>
            )}
            {onRefresh && (
              <button className="btn-secondary" onClick={onRefresh} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RefreshCw size={16} /> Refresh
              </button>
            )}
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              {hasSelectColumn && (
                <th style={{ width: '50px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={data.length > 0 && selectedIds.length === data.length}
                  />
                </th>
              )}
              {visibleProps.map((prop, index) => (
                <th key={index}>{prop.title}</th>
              ))}
              <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={visibleProps.length + (hasSelectColumn ? 2 : 1)} className="empty-state">
                  {emptyMessage || 'No data found.'}
                </td>
              </tr>
            ) : (
              data?.map((row) => (
                <tr key={row.id || Math.random()}>
                  {hasSelectColumn && (
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                      />
                    </td>
                  )}
                  {visibleProps.map((prop, index) => (
                    <td key={index}>{renderCellValue(prop, row)}</td>
                  ))}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => onAction && onAction('VIEW', row)}
                        title="View"
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex' }}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onAction && onAction('EDIT', row)}
                        title="Edit"
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
                      >
                        <Edit2 size={18} />
                      </button>
                      {onTransfer && (
                        <button
                          onClick={() => onTransfer(row)}
                          title="Transfer"
                          style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex' }}
                        >
                          <ArrowRightLeft size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleSingleDelete(row.id)}
                        title="Delete"
                        disabled={isDeleting}
                        style={{ background: 'transparent', border: 'none', color: 'var(--error, #ef4444)', cursor: isDeleting ? 'not-allowed' : 'pointer', display: 'flex' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
