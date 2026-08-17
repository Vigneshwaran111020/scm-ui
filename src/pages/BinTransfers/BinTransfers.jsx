import React, { useState, useEffect } from 'react';
import CustomTableContainer from '../../components/CustomTableContainer';
import { ArrowRightLeft } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { updatePageState, openTab, setActiveTab } from '../../store/tabsSlice';
import { binTransferModel } from './model/binTransferModel';
import { useNavigate } from 'react-router-dom';

export default function BinTransfers({ tabId }) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageState = useSelector((state) => state.tabs.pageState[tabId]) || {};

  const fetchData = async () => {
    try {
      const response = await apiFetch('/api/bin-transfers');
      const content = response.data?.content || response.data || [];
      setData(content);
      dispatch(updatePageState({ tabId, data: { needsRefresh: false } }));
    } catch (error) {
      console.error('Failed to fetch bin transfers:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (pageState.needsRefresh) {
      fetchData();
    }
  }, [pageState.needsRefresh]);

  const handleAction = (action, row) => {
    if (action === 'VIEW') {
      const payload = {
        id: `bin-transfer-view-${row.id}`,
        type: 'VIEW',
        title: `View Transfer ${row.id}`,
        url: `/wms/bin-transfers/${row.id}/view`,
        endpoint: '/api/bin-transfers',
        params: { id: row.id, parentUrl: '/wms/bin-transfers/viewAll', fields: binTransferModel }
      };
      dispatch(openTab(payload));
      dispatch(setActiveTab(payload.id));
      navigate(payload.url, { state: { row } });
    }
  };

  return (
    <CustomTableContainer
      tableId="binTransfers"
      title="Inventory Transfers"
      icon={ArrowRightLeft}
      data={data}
      onAction={handleAction}
      onRefresh={fetchData}
      // Note: No onAdd, this is a read-only history table. Transfers start from Inventory list.
    />
  );
}
