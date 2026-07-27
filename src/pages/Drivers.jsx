import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePageState } from '../store/tabsSlice';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { Users, Plus, RefreshCw } from 'lucide-react';
import CustomTableContainer from '../components/CustomTableContainer';

export default function Drivers({ tabId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageState = useSelector(state => state.tabs.pageState[tabId]) || {};
  const drivers = pageState.data || [];
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
      const response = await apiFetch('/api/drivers');
      dispatch(updatePageState({ tabId, data: { data: response?.success ? response.data : [], isLoading: false } }));
    } catch (error) {
      console.error('Failed to fetch', error);
      dispatch(updatePageState({ tabId, data: { isLoading: false } }));
    }
  };

  const handleAdd = () => {
    navigate('/master-data/drivers/add');
  };

  const handleAction = (type, row) => {
    if (type === 'EDIT') {
      navigate(`/master-data/drivers/${row.id}/edit`, { state: { row } });
    } else {
      navigate(`/master-data/drivers/${row.id}/view`, { state: { row } });
    }
  };

  const tableColumns = [
    { header: 'ID', key: 'id' },
    { header: 'Driver Number', key: 'driverNumber' },
    { header: 'Driver Name', key: 'driverName' },
    { header: 'License Number', key: 'licenseNumber' },
    { header: 'Phone Number', key: 'phoneNumber' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="page-title" style={{ margin: 0 }}>
          <Users className="text-primary" style={{ marginRight: '8px' }} /> Driver Master
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
        data={drivers} 
        emptyMessage="No drivers found." 
        onAction={handleAction}
      />
    </div>
  );
}
