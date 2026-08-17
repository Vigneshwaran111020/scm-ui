import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePageState } from '../../store/tabsSlice';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { Database } from 'lucide-react';
import CustomTableContainer from '../../components/CustomTableContainer';

export default function Zones({ tabId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageState = useSelector(state => state.tabs.pageState[tabId]) || {};
  const data = pageState.data || [];
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
      const response = await apiFetch('/api/zones');
      const listData = response?.success && response.data?.content ? response.data.content : (response?.data || []);
      dispatch(updatePageState({ tabId, data: { data: listData, isLoading: false } }));
    } catch (error) {
      console.error('Failed to fetch', error);
      dispatch(updatePageState({ tabId, data: { isLoading: false } }));
    }
  };

  const handleAdd = () => {
    navigate('/wms/zones/add');
  };

  const handleAction = (type, row) => {
    if (type === 'EDIT') {
      navigate(`/wms/zones/${row.id}/edit`, { state: { row } });
    } else {
      navigate(`/wms/zones/${row.id}/view`, { state: { row } });
    }
  };

  return (
    <CustomTableContainer
      tableId="zones"
      title="Zone"
      icon={Database}
      data={data}
      emptyMessage={isLoading ? "Loading zones..." : "No zones found."}
      onAction={handleAction}
      onAdd={handleAdd}
      onRefresh={handleRefresh}
    />
  );
}
