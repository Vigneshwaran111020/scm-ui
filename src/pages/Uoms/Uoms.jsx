import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePageState } from '../../store/tabsSlice';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { Database } from 'lucide-react';
import CustomTableContainer from '../../components/CustomTableContainer';

export default function Uoms({ tabId }) {
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
      const response = await apiFetch('/api/uoms');
      const listData = response?.success && response.data?.content ? response.data.content : (response?.data || []);
      dispatch(updatePageState({ tabId, data: { data: listData, isLoading: false } }));
    } catch (error) {
      console.error('Failed to fetch', error);
      dispatch(updatePageState({ tabId, data: { isLoading: false } }));
    }
  };

  const handleAdd = () => {
    navigate('/wms/uoms/add');
  };

  const handleAction = (type, row) => {
    if (type === 'EDIT') {
      navigate(`/wms/uoms/${row.id}/edit`, { state: { row } });
    } else {
      navigate(`/wms/uoms/${row.id}/view`, { state: { row } });
    }
  };

  return (
    <CustomTableContainer
      tableId="uoms"
      title="UOM"
      icon={Database}
      data={data}
      emptyMessage={isLoading ? "Loading uoms..." : "No uoms found."}
      onAction={handleAction}
      onAdd={handleAdd}
      onRefresh={handleRefresh}
    />
  );
}
