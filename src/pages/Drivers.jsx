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



  return (
    <CustomTableContainer 
      tableId="drivers" 
      title="Driver Master"
      icon={Users}
      data={drivers} 
      emptyMessage="No drivers found." 
      onAction={handleAction}
      onAdd={handleAdd}
      onRefresh={handleRefresh}
    />
  );
}
