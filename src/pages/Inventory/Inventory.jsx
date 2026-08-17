import React, { useState, useEffect } from 'react';
import CustomTableContainer from '../../components/CustomTableContainer';
import { Package } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { updatePageState, openTab, setActiveTab } from '../../store/tabsSlice';
import { inventoryModel } from './model/inventoryModel';
import { useNavigate } from 'react-router-dom';

export default function Inventory({ tabId }) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageState = useSelector((state) => state.tabs.pageState[tabId]) || {};

  const fetchData = async () => {
    try {
      const response = await apiFetch('/api/inventory');
      const content = response.data?.content || response.data || [];
      setData(content);
      dispatch(updatePageState({ tabId, data: { needsRefresh: false } }));
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
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
        id: `inventory-view-${row.id}`,
        type: 'VIEW',
        title: `View Inventory ${row.id}`,
        url: `/wms/inventory/${row.id}/view`,
        endpoint: '/api/inventory',
        params: { id: row.id, parentUrl: '/wms/inventory/viewAll', fields: inventoryModel }
      };
      dispatch(openTab(payload));
      dispatch(setActiveTab(payload.id));
      navigate(payload.url, { state: { row } });
    }
  };

  const handleAdd = () => {
    const payload = {
        id: 'add-inventory-adjustment',
        type: 'ADD',
        title: 'Add Adjustment',
        url: '/wms/inventory-adjustments/add',
        endpoint: '/api/inventory-adjustments',
        params: { fields: ['warehouseId', 'zoneId', 'aisleId', 'rackId', 'binId', 'productId', 'skuId', 'uomId', 'adjustmentType', 'quantity', 'reasonCode', 'referenceNumber', 'remarks'], parentTabId: tabId, parentUrl: '/wms/inventory/viewAll' }
    };
    // Let layout handle the model correctly. We should use inventoryAdjustmentModel.
    // So we'll map fields appropriately in layout.
    navigate('/wms/inventory-adjustments/add');
  };

  const handleTransfer = (row) => {
    const payload = {
        id: `inventory-transfer-${row.id}`,
        type: 'INVENTORY_TRANSFER',
        title: `Transfer Inv ${row.id}`,
        url: `/wms/inventory/transfer/${row.id}`,
        params: { parentUrl: '/wms/inventory/viewAll', ...row }
    };
    dispatch(openTab(payload));
    dispatch(setActiveTab(payload.id));
    navigate(payload.url, { state: { row } });
  };

  return (
    <CustomTableContainer
      tableId="inventory"
      title="Inventory"
      icon={Package}
      data={data}
      onAction={handleAction}
      onTransfer={handleTransfer}
      onRefresh={fetchData}
      onAdd={handleAdd}
    />
  );
}
