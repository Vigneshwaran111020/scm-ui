import React, { useState, useEffect } from 'react';
import CustomTableContainer from '../../components/CustomTableContainer';
import { Package } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { updatePageState, openTab, setActiveTab } from '../../store/tabsSlice';
import { inventoryAdjustmentModel } from './model/inventoryAdjustmentModel';
import { useNavigate } from 'react-router-dom';

export default function InventoryAdjustments({ tabId }) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageState = useSelector((state) => state.tabs.pageState[tabId]) || {};

  const fetchData = async () => {
    try {
      const response = await apiFetch('/api/inventory-adjustments');
      const content = response.data?.content || response.data || [];
      setData(content);
      dispatch(updatePageState({ tabId, data: { needsRefresh: false } }));
    } catch (error) {
      console.error('Failed to fetch inventory adjustments:', error);
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
        id: `inventory-adjustment-view-${row.id}`,
        type: 'VIEW',
        title: `View Adjustment ${row.id}`,
        url: `/wms/inventory-adjustments/${row.id}/view`,
        endpoint: '/api/inventory-adjustments',
        params: { id: row.id, parentUrl: '/wms/inventory-adjustments/viewAll', fields: inventoryAdjustmentModel }
      };
      dispatch(openTab(payload));
      dispatch(setActiveTab(payload.id));
      navigate(payload.url, { state: { row } });
    } else if (action === 'EDIT') {
      const payload = {
        id: `inventory-adjustment-edit-${row.id}`,
        type: 'EDIT',
        title: `Edit Adjustment ${row.id}`,
        url: `/wms/inventory-adjustments/${row.id}/edit`,
        endpoint: '/api/inventory-adjustments',
        params: { id: row.id, parentUrl: '/wms/inventory-adjustments/viewAll', fields: inventoryAdjustmentModel }
      };
      dispatch(openTab(payload));
      dispatch(setActiveTab(payload.id));
      navigate(payload.url, { state: { row } });
    }
  };

  const handleAdd = () => {
    navigate('/wms/inventory-adjustments/add');
  };

  return (
    <CustomTableContainer
      tableId="inventoryAdjustments"
      title="Inventory Adjustments"
      icon={Package}
      data={data}
      onAction={handleAction}
      onRefresh={fetchData}
      onAdd={handleAdd}
    />
  );
}
