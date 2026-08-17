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



  return (
    <CustomTableContainer 
      tableId="shipments" 
      title="Supply Chain Management"
      icon={Package}
      data={shipments} 
      emptyMessage="No shipments found." 
      onAction={handleAction}
      onAdd={handleAdd}
      onRefresh={handleRefresh}
    />
  );
}
