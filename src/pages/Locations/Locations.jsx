import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePageState } from '../../store/tabsSlice';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { MapPin } from 'lucide-react';
import CustomTableContainer from '../../components/CustomTableContainer';

export default function Locations({ tabId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageState = useSelector(state => state.tabs.pageState[tabId]) || {};
  const locations = pageState.data || [];
  const needsRefresh = pageState.needsRefresh || false;

  useEffect(() => {
    if (!pageState.data || needsRefresh) {
      handleRefresh();
    }
  }, [tabId, needsRefresh, pageState.data]);

  const handleRefresh = async () => {
    dispatch(updatePageState({ tabId, data: { isLoading: true, needsRefresh: false } }));
    try {
      const response = await apiFetch('/api/locations');
      const listData = response?.success && response.data?.content ? response.data.content : (response?.data || []);
      dispatch(updatePageState({ tabId, data: { data: listData, isLoading: false } }));
    } catch (error) {
      console.error('Failed to fetch', error);
      dispatch(updatePageState({ tabId, data: { isLoading: false } }));
    }
  };

  const handleAdd = () => {
    navigate('/master-data/locations/add');
  };

  const handleAction = (type, row) => {
    if (type === 'EDIT') {
      navigate(`/master-data/locations/${row.id}/edit`, { state: { row } });
    } else {
      navigate(`/master-data/locations/${row.id}/view`, { state: { row } });
    }
  };

  return (
    <CustomTableContainer 
      tableId="locations" 
      title="Location Master"
      icon={MapPin}
      data={locations} 
      emptyMessage="No locations found." 
      onAction={handleAction}
      onAdd={handleAdd}
      onRefresh={handleRefresh}
    />
  );
}
