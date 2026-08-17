import React, { useState, useEffect } from 'react';
import CustomTableContainer from '../../components/CustomTableContainer';
import { Package } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { updatePageState, openTab, setActiveTab } from '../../store/tabsSlice';
import { inventoryTransactionModel } from './model/inventoryTransactionModel';
import { useNavigate } from 'react-router-dom';

export default function InventoryTransactions({ tabId }) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageState = useSelector((state) => state.tabs.pageState[tabId]) || {};

  const fetchData = async () => {
    try {
      const response = await apiFetch('/api/inventory-transactions');
      const content = response.data?.content || response.data || [];
      setData(content);
      dispatch(updatePageState({ tabId, data: { needsRefresh: false } }));
    } catch (error) {
      console.error('Failed to fetch inventory transactions:', error);
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
        id: `inventory-transaction-view-${row.id}`,
        type: 'VIEW',
        title: `View Transaction ${row.id}`,
        url: `/wms/inventory-transactions/${row.id}/view`,
        endpoint: '/api/inventory-transactions',
        params: { id: row.id, parentUrl: '/wms/inventory-transactions/viewAll', fields: inventoryTransactionModel }
      };
      dispatch(openTab(payload));
      dispatch(setActiveTab(payload.id));
      navigate(payload.url, { state: { row } });
    }
  };

  return (
    <CustomTableContainer
      tableId="inventoryTransactions"
      title="Inventory Transactions"
      icon={Package}
      data={data}
      onAction={handleAction}
      onRefresh={fetchData}
    />
  );
}
