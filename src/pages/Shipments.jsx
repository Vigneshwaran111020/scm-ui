import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePageState } from '../store/tabsSlice';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { Package, Plus, RefreshCw } from 'lucide-react';
import CustomTableContainer from '../components/CustomTableContainer';
import StatusChip from '../components/StatusChip';

export default function Shipments({ tabId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageState = useSelector(state => state.tabs.pageState[tabId]) || {};
  const shipments = pageState.data || [];
  const isLoading = pageState.isLoading || false;
  const needsRefresh = pageState.needsRefresh || false;

  useEffect(() => {
    if (!pageState.data || needsRefresh) {
      handleRefresh();
    }
  }, [tabId, needsRefresh, pageState.data]);

  const handleRefresh = async () => {
    dispatch(updatePageState({ tabId, data: { isLoading: true, needsRefresh: false } }));
    try {
      const response = await apiFetch('/api/shipments');
      dispatch(updatePageState({ tabId, data: { data: response?.success ? response.data : [], isLoading: false } }));
    } catch (error) {
      console.error('Failed to fetch', error);
      dispatch(updatePageState({ tabId, data: { isLoading: false } }));
    }
  };

  const handleAdd = () => {
    navigate('/shipments/add');
  };

  const handleAction = (type, row) => {
    if (type === 'EDIT') {
      navigate(`/shipments/${row.id}/edit`, { state: { row } });
    } else {
      navigate(`/shipments/${row.id}/view`, { state: { row } });
    }
  };

  const tableColumns = [
    { header: 'ID', key: 'id' },
    { header: 'Shipment', key: 'shipmentNumber' },
    { header: 'Customer', key: 'customerName' },
    { header: 'Origin', key: 'origin' },
    { header: 'Destination', key: 'destination' },
    { 
      header: 'Status', 
      key: 'status',
      render: (val, row) => <StatusChip status={row.id % 2 === 0 ? 'In Progress' : 'Completed'} />
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="page-title" style={{ margin: 0 }}>
          <Package className="text-primary" style={{ marginRight: '8px' }} /> Supply Chain Management
        </h2>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-primary" onClick={handleAdd}>
            <Plus size={16} /> Add
          </button>
          <button className="btn-secondary" onClick={handleRefresh}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      <CustomTableContainer 
        columns={tableColumns} 
        data={shipments} 
        emptyMessage="No shipments found." 
        onAction={handleAction}
      />
    </div>
  );
}
