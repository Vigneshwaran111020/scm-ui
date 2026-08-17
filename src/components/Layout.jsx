import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { closeTab, setActiveTab, openTab } from '../store/tabsSlice';
import Sidebar from './Sidebar';
import Header from './Header';
import { X } from 'lucide-react';
import clsx from 'clsx';

// Import all possible tab pages
import Shipments from '../pages/Shipments';
import Locations from '../pages/Locations/Locations';
import Drivers from '../pages/Drivers';
import Warehouses from '../pages/Warehouses/Warehouses';
import Zones from '../pages/Zones/Zones';
import Aisles from '../pages/Aisles/Aisles';
import Racks from '../pages/Racks/Racks';
import Bins from '../pages/Bins/Bins';
import Categories from '../pages/Categories/Categories';
import Uoms from '../pages/Uoms/Uoms';
import Products from '../pages/Products/Products';
import Skus from '../pages/Skus/Skus';
import ViewPage from '../pages/ViewPage';
import EditPage from '../pages/EditPage';
import AddPage from '../pages/AddPage';

import Inventory from '../pages/Inventory/Inventory';
import InventoryAdjustments from '../pages/InventoryAdjustments/InventoryAdjustments';
import InventoryTransactions from '../pages/InventoryTransactions/InventoryTransactions';
import BinTransfer from '../pages/Inventory/BinTransfer';
import BinTransfers from '../pages/BinTransfers/BinTransfers';
import Dashboard from '../pages/Dashboard/Dashboard';

import { inventoryModel } from '../pages/Inventory/model/inventoryModel';
import { inventoryAdjustmentModel } from '../pages/InventoryAdjustments/model/inventoryAdjustmentModel';
import { inventoryTransactionModel } from '../pages/InventoryTransactions/model/inventoryTransactionModel';
import { binTransferModel } from '../pages/BinTransfers/model/binTransferModel';

import { warehouseModel } from '../pages/Warehouses/model/warehouseModel';
import { zoneModel } from '../pages/Zones/model/zoneModel';
import { aisleModel } from '../pages/Aisles/model/aisleModel';
import { rackModel } from '../pages/Racks/model/rackModel';
import { binModel } from '../pages/Bins/model/binModel';
import { categoryModel } from '../pages/Categories/model/categoryModel';
import { uomModel } from '../pages/Uoms/model/uomModel';
import { productModel } from '../pages/Products/model/productModel';
import { skuModel } from '../pages/Skus/model/skuModel';
import { locationModel } from '../pages/Locations/model/locationModel';

export default function Layout() {
  const dispatch = useDispatch();
  const { openTabs, activeTabId } = useSelector((state) => state.tabs);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isInitialized = React.useRef(false);

  useEffect(() => {
    isInitialized.current = true;
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const getTabPayloadFromUrl = (pathname) => {
    if (pathname === '/' || pathname === '/dashboard') {
      return { id: 'dashboard', type: 'DASHBOARD', title: 'Dashboard', url: '/dashboard' };
    }
    
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments[0] === 'shipments') {
      if (segments[1] === 'viewAll') return { id: 'shipments-list', type: 'SHIPMENTS_LIST', title: 'Shipments', url: pathname, endpoint: '/api/shipments' };
      if (segments[1] === 'add') return { id: 'add-shipment', type: 'ADD', title: 'Add Shipment', url: pathname, params: { fields: ['shipmentNumber', 'customerName', 'origin', 'destination'], parentTabId: 'shipments-list', parentUrl: '/shipments/viewAll' }, endpoint: '/api/shipments' };
      if (segments[2] === 'edit') return { id: `shipment-edit-${segments[1]}`, type: 'EDIT', title: `Edit Shipment ${segments[1]}`, url: pathname, params: { id: segments[1], parentUrl: '/shipments/viewAll' }, endpoint: '/api/shipments' };
      if (segments[2] === 'view') return { id: `shipment-view-${segments[1]}`, type: 'VIEW', title: `View Shipment ${segments[1]}`, url: pathname, params: { id: segments[1], parentUrl: '/shipments/viewAll' }, endpoint: '/api/shipments' };
    }
    
    if (segments[0] === 'master-data' && segments[1] === 'locations') {
      if (segments[2] === 'viewAll') return { id: 'locations-list', type: 'LOCATIONS_LIST', title: 'Locations', url: pathname, endpoint: '/api/locations' };
      if (segments[2] === 'add') return { id: 'add-location', type: 'ADD', title: 'Add Location', url: pathname, params: { fields: locationModel, parentTabId: 'locations-list', parentUrl: '/master-data/locations/viewAll' }, endpoint: '/api/locations' };
      if (segments[3] === 'edit') return { id: `location-edit-${segments[2]}`, type: 'EDIT', title: `Edit Location ${segments[2]}`, url: pathname, params: { id: segments[2], parentUrl: '/master-data/locations/viewAll', fields: locationModel }, endpoint: '/api/locations' };
      if (segments[3] === 'view') return { id: `location-view-${segments[2]}`, type: 'VIEW', title: `View Location ${segments[2]}`, url: pathname, params: { id: segments[2], parentUrl: '/master-data/locations/viewAll', fields: locationModel }, endpoint: '/api/locations' };
    }
    
    if (segments[0] === 'master-data' && segments[1] === 'drivers') {
      if (segments[2] === 'viewAll') return { id: 'drivers-list', type: 'DRIVERS_LIST', title: 'Drivers', url: pathname, endpoint: '/api/drivers' };
      if (segments[2] === 'add') return { id: 'add-driver', type: 'ADD', title: 'Add Driver', url: pathname, params: { fields: ['driverNumber', 'driverName', 'licenseNumber', 'phoneNumber'], parentTabId: 'drivers-list', parentUrl: '/master-data/drivers/viewAll' }, endpoint: '/api/drivers' };
      if (segments[3] === 'edit') return { id: `driver-edit-${segments[2]}`, type: 'EDIT', title: `Edit Driver ${segments[2]}`, url: pathname, params: { id: segments[2], parentUrl: '/master-data/drivers/viewAll', fields: ['driverNumber', 'driverName', 'licenseNumber', 'phoneNumber'] }, endpoint: '/api/drivers' };
      if (segments[3] === 'view') return { id: `driver-view-${segments[2]}`, type: 'VIEW', title: `View Driver ${segments[2]}`, url: pathname, params: { id: segments[2], parentUrl: '/master-data/drivers/viewAll', fields: ['driverNumber', 'driverName', 'licenseNumber', 'phoneNumber'] }, endpoint: '/api/drivers' };
    }
    
    if (segments[0] === 'wms' && segments[1] === 'warehouses') {
      if (segments[2] === 'viewAll') return { id: 'warehouses-list', type: 'WAREHOUSES_LIST', title: 'Warehouses', url: pathname, endpoint: '/api/warehouses' };
      if (segments[2] === 'add') return { id: 'add-warehouse', type: 'ADD', title: 'Add Warehouse', url: pathname, params: { fields: warehouseModel, parentTabId: 'warehouses-list', parentUrl: '/wms/warehouses/viewAll' }, endpoint: '/api/warehouses' };
      if (segments[3] === 'edit') return { id: `warehouse-edit-${segments[2]}`, type: 'EDIT', title: `Edit Warehouse ${segments[2]}`, url: pathname, params: { id: segments[2], parentUrl: '/wms/warehouses/viewAll', fields: warehouseModel }, endpoint: '/api/warehouses' };
      if (segments[3] === 'view') return { id: `warehouse-view-${segments[2]}`, type: 'VIEW', title: `View Warehouse ${segments[2]}`, url: pathname, params: { id: segments[2], parentUrl: '/wms/warehouses/viewAll', fields: warehouseModel }, endpoint: '/api/warehouses' };
    }

    if (segments[0] === 'wms' && segments[1] === 'zones') {
      if (segments[2] === 'viewAll') return { id: 'zones-list', type: 'ZONES_LIST', title: 'Zones', url: pathname, endpoint: '/api/zones' };
      if (segments[2] === 'add') return { id: 'add-zone', type: 'ADD', title: 'Add Zone', url: pathname, params: { fields: zoneModel, parentTabId: 'zones-list', parentUrl: '/wms/zones/viewAll' }, endpoint: '/api/zones' };
      if (segments[3] === 'edit') return { id: 'zone-edit-' + segments[2], type: 'EDIT', title: 'Edit Zone ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/zones/viewAll', fields: zoneModel }, endpoint: '/api/zones' };
      if (segments[3] === 'view') return { id: 'zone-view-' + segments[2], type: 'VIEW', title: 'View Zone ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/zones/viewAll', fields: zoneModel }, endpoint: '/api/zones' };
    }
    if (segments[0] === 'wms' && segments[1] === 'aisles') {
      if (segments[2] === 'viewAll') return { id: 'aisles-list', type: 'AISLES_LIST', title: 'Aisles', url: pathname, endpoint: '/api/aisles' };
      if (segments[2] === 'add') return { id: 'add-aisle', type: 'ADD', title: 'Add Aisle', url: pathname, params: { fields: aisleModel, parentTabId: 'aisles-list', parentUrl: '/wms/aisles/viewAll' }, endpoint: '/api/aisles' };
      if (segments[3] === 'edit') return { id: 'aisle-edit-' + segments[2], type: 'EDIT', title: 'Edit Aisle ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/aisles/viewAll', fields: aisleModel }, endpoint: '/api/aisles' };
      if (segments[3] === 'view') return { id: 'aisle-view-' + segments[2], type: 'VIEW', title: 'View Aisle ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/aisles/viewAll', fields: aisleModel }, endpoint: '/api/aisles' };
    }
    if (segments[0] === 'wms' && segments[1] === 'racks') {
      if (segments[2] === 'viewAll') return { id: 'racks-list', type: 'RACKS_LIST', title: 'Racks', url: pathname, endpoint: '/api/racks' };
      if (segments[2] === 'add') return { id: 'add-rack', type: 'ADD', title: 'Add Rack', url: pathname, params: { fields: rackModel, parentTabId: 'racks-list', parentUrl: '/wms/racks/viewAll' }, endpoint: '/api/racks' };
      if (segments[3] === 'edit') return { id: 'rack-edit-' + segments[2], type: 'EDIT', title: 'Edit Rack ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/racks/viewAll', fields: rackModel }, endpoint: '/api/racks' };
      if (segments[3] === 'view') return { id: 'rack-view-' + segments[2], type: 'VIEW', title: 'View Rack ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/racks/viewAll', fields: rackModel }, endpoint: '/api/racks' };
    }
    if (segments[0] === 'wms' && segments[1] === 'bins') {
      if (segments[2] === 'viewAll') return { id: 'bins-list', type: 'BINS_LIST', title: 'Bins', url: pathname, endpoint: '/api/bins' };
      if (segments[2] === 'add') return { id: 'add-bin', type: 'ADD', title: 'Add Bin', url: pathname, params: { fields: binModel, parentTabId: 'bins-list', parentUrl: '/wms/bins/viewAll' }, endpoint: '/api/bins' };
      if (segments[3] === 'edit') return { id: 'bin-edit-' + segments[2], type: 'EDIT', title: 'Edit Bin ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/bins/viewAll', fields: binModel }, endpoint: '/api/bins' };
      if (segments[3] === 'view') return { id: 'bin-view-' + segments[2], type: 'VIEW', title: 'View Bin ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/bins/viewAll', fields: binModel }, endpoint: '/api/bins' };
    }
    if (segments[0] === 'wms' && segments[1] === 'categories') {
      if (segments[2] === 'viewAll') return { id: 'categories-list', type: 'CATEGORIES_LIST', title: 'Categorys', url: pathname, endpoint: '/api/categories' };
      if (segments[2] === 'add') return { id: 'add-category', type: 'ADD', title: 'Add Category', url: pathname, params: { fields: categoryModel, parentTabId: 'categories-list', parentUrl: '/wms/categories/viewAll' }, endpoint: '/api/categories' };
      if (segments[3] === 'edit') return { id: 'category-edit-' + segments[2], type: 'EDIT', title: 'Edit Category ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/categories/viewAll', fields: categoryModel }, endpoint: '/api/categories' };
      if (segments[3] === 'view') return { id: 'category-view-' + segments[2], type: 'VIEW', title: 'View Category ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/categories/viewAll', fields: categoryModel }, endpoint: '/api/categories' };
    }
    if (segments[0] === 'wms' && segments[1] === 'uoms') {
      if (segments[2] === 'viewAll') return { id: 'uoms-list', type: 'UOMS_LIST', title: 'Unit Of Measures', url: pathname, endpoint: '/api/uoms' };
      if (segments[2] === 'add') return { id: 'add-uom', type: 'ADD', title: 'Add Unit Of Measure', url: pathname, params: { fields: uomModel, parentTabId: 'uoms-list', parentUrl: '/wms/uoms/viewAll' }, endpoint: '/api/uoms' };
      if (segments[3] === 'edit') return { id: 'uom-edit-' + segments[2], type: 'EDIT', title: 'Edit Unit Of Measure ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/uoms/viewAll', fields: uomModel }, endpoint: '/api/uoms' };
      if (segments[3] === 'view') return { id: 'uom-view-' + segments[2], type: 'VIEW', title: 'View Unit Of Measure ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/uoms/viewAll', fields: uomModel }, endpoint: '/api/uoms' };
    }
    if (segments[0] === 'wms' && segments[1] === 'products') {
      if (segments[2] === 'viewAll') return { id: 'products-list', type: 'PRODUCTS_LIST', title: 'Products', url: pathname, endpoint: '/api/products' };
      if (segments[2] === 'add') return { id: 'add-product', type: 'ADD', title: 'Add Product', url: pathname, params: { fields: productModel, parentTabId: 'products-list', parentUrl: '/wms/products/viewAll' }, endpoint: '/api/products' };
      if (segments[3] === 'edit') return { id: 'product-edit-' + segments[2], type: 'EDIT', title: 'Edit Product ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/products/viewAll', fields: productModel }, endpoint: '/api/products' };
      if (segments[3] === 'view') return { id: 'product-view-' + segments[2], type: 'VIEW', title: 'View Product ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/products/viewAll', fields: productModel }, endpoint: '/api/products' };
    }
    if (segments[0] === 'wms' && segments[1] === 'skus') {
      if (segments[2] === 'viewAll') return { id: 'skus-list', type: 'SKUS_LIST', title: 'SKUs', url: pathname, endpoint: '/api/skus' };
      if (segments[2] === 'add') return { id: 'add-sku', type: 'ADD', title: 'Add SKU', url: pathname, params: { fields: skuModel, parentTabId: 'skus-list', parentUrl: '/wms/skus/viewAll' }, endpoint: '/api/skus' };
      if (segments[3] === 'edit') return { id: 'sku-edit-' + segments[2], type: 'EDIT', title: 'Edit SKU ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/skus/viewAll', fields: skuModel }, endpoint: '/api/skus' };
      if (segments[3] === 'view') return { id: 'sku-view-' + segments[2], type: 'VIEW', title: 'View SKU ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/skus/viewAll', fields: skuModel }, endpoint: '/api/skus' };
    }
    
    if (segments[0] === 'wms' && segments[1] === 'inventory') {
      if (segments[2] === 'viewAll') return { id: 'inventory-list', type: 'INVENTORY_LIST', title: 'Inventory', url: pathname, endpoint: '/api/inventory' };
      if (segments[2] === 'transfer') return { id: 'inventory-transfer-' + (segments[3] || 'new'), type: 'INVENTORY_TRANSFER', title: 'Transfer Inventory', url: pathname, params: { parentUrl: '/wms/inventory/viewAll' } };
      if (segments[3] === 'view') return { id: 'inventory-view-' + segments[2], type: 'VIEW', title: 'View Inventory ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/inventory/viewAll', fields: inventoryModel }, endpoint: '/api/inventory' };
    }

    if (segments[0] === 'wms' && segments[1] === 'bin-transfers') {
      if (segments[2] === 'viewAll') return { id: 'bin-transfers-list', type: 'BIN_TRANSFERS_LIST', title: 'Inventory Transfers', url: pathname, endpoint: '/api/bin-transfers' };
      if (segments[3] === 'view') return { id: 'bin-transfer-view-' + segments[2], type: 'VIEW', title: 'View Transfer ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/bin-transfers/viewAll', fields: binTransferModel }, endpoint: '/api/bin-transfers' };
    }

    if (segments[0] === 'wms' && segments[1] === 'inventory-adjustments') {
      if (segments[2] === 'viewAll') return { id: 'inventory-adjustments-list', type: 'INVENTORY_ADJUSTMENTS_LIST', title: 'Inventory Adjustments', url: pathname, endpoint: '/api/inventory-adjustments' };
      if (segments[2] === 'add') return { id: 'add-inventory-adjustment', type: 'ADD', title: 'Add Adjustment', url: pathname, params: { fields: inventoryAdjustmentModel, parentTabId: 'inventory-adjustments-list', parentUrl: '/wms/inventory-adjustments/viewAll' }, endpoint: '/api/inventory-adjustments' };
      if (segments[3] === 'edit') return { id: 'inventory-adjustment-edit-' + segments[2], type: 'EDIT', title: 'Edit Adjustment ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/inventory-adjustments/viewAll', fields: inventoryAdjustmentModel }, endpoint: '/api/inventory-adjustments' };
      if (segments[3] === 'view') return { id: 'inventory-adjustment-view-' + segments[2], type: 'VIEW', title: 'View Adjustment ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/inventory-adjustments/viewAll', fields: inventoryAdjustmentModel }, endpoint: '/api/inventory-adjustments' };
    }

    if (segments[0] === 'wms' && segments[1] === 'inventory-transactions') {
      if (segments[2] === 'viewAll') return { id: 'inventory-transactions-list', type: 'INVENTORY_TRANSACTIONS_LIST', title: 'Inventory Transactions', url: pathname, endpoint: '/api/inventory-transactions' };
      if (segments[3] === 'view') return { id: 'inventory-transaction-view-' + segments[2], type: 'VIEW', title: 'View Transaction ' + segments[2], url: pathname, params: { id: segments[2], parentUrl: '/wms/inventory-transactions/viewAll', fields: inventoryTransactionModel }, endpoint: '/api/inventory-transactions' };
    }

    return null;
  };

  useEffect(() => {
    const basePayload = getTabPayloadFromUrl(location.pathname);
    if (basePayload) {
      let payload = { ...basePayload };

      if (payload.type === 'ADD') {
        if (location.state?.tabId) {
          payload.id = location.state.tabId;
        } else {
          const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
          const uniqueTabId = `${payload.id}-${uniqueSuffix}`;
          navigate(location.pathname, { state: { ...location.state, tabId: uniqueTabId }, replace: true });
          return;
        }
      } else if (location.state?.tabId && location.state.tabId.startsWith(payload.id)) {
        // Fallback for non-ADD tabs if they happen to use tabId from state
        payload.id = location.state.tabId;
      }

      const existingTab = openTabs.find(t => t.id === payload.id);
      
      if (location.state?.row && (payload.type === 'EDIT' || payload.type === 'VIEW' || payload.type === 'INVENTORY_TRANSFER')) {
        payload.params = { ...payload.params, ...location.state.row };
      }
      
      if (!existingTab) {
        dispatch(openTab(payload));
      } else {
        if (activeTabId !== payload.id) {
          dispatch(setActiveTab(payload.id));
        }
      }
    } else {
      if (location.pathname === '/') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [location.pathname, location.state]);

  useEffect(() => {
    if (activeTabId) {
      const activeTab = openTabs.find(t => t.id === activeTabId);
      if (activeTab && activeTab.url && (activeTab.url !== location.pathname || location.state?.tabId !== activeTab.id)) {
        const statePayload = { tabId: activeTab.id };
        if (activeTab.type === 'EDIT' || activeTab.type === 'VIEW' || activeTab.type === 'INVENTORY_TRANSFER') {
          statePayload.row = activeTab.params;
        }
        navigate(activeTab.url, { state: statePayload, replace: true });
      }
    } else if (isInitialized.current && openTabs.length === 0 && location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [activeTabId, openTabs]);

  const renderTabContent = (tab) => {
    switch (tab.type) {
      case 'SHIPMENTS_LIST': return <Shipments tabId={tab.id} />;
      case 'LOCATIONS_LIST': return <Locations tabId={tab.id} />;
      case 'DRIVERS_LIST': return <Drivers tabId={tab.id} />;
      case 'WAREHOUSES_LIST': return <Warehouses tabId={tab.id} />;
      case 'ZONES_LIST': return <Zones tabId={tab.id} />;
      case 'AISLES_LIST': return <Aisles tabId={tab.id} />;
      case 'RACKS_LIST': return <Racks tabId={tab.id} />;
      case 'BINS_LIST': return <Bins tabId={tab.id} />;
      case 'CATEGORIES_LIST': return <Categories tabId={tab.id} />;
      case 'UOMS_LIST': return <Uoms tabId={tab.id} />;
      case 'PRODUCTS_LIST': return <Products tabId={tab.id} />;
      case 'SKUS_LIST': return <Skus tabId={tab.id} />;
      case 'INVENTORY_LIST': return <Inventory tabId={tab.id} />;
      case 'INVENTORY_TRANSFER': return <BinTransfer tabId={tab.id} data={tab.params} />;
      case 'INVENTORY_ADJUSTMENTS_LIST': return <InventoryAdjustments tabId={tab.id} />;
      case 'INVENTORY_TRANSACTIONS_LIST': return <InventoryTransactions tabId={tab.id} />;
      case 'BIN_TRANSFERS_LIST': return <BinTransfers tabId={tab.id} />;
      case 'VIEW': return <ViewPage title={tab.title} data={tab.params} endpoint={tab.endpoint} fields={tab.params.fields} />;
      case 'EDIT': return <EditPage title={tab.title} data={tab.params} endpoint={tab.endpoint} parentUrl={tab.params.parentUrl} fields={tab.params.fields} />;
      case 'ADD': return <AddPage title={tab.title} endpoint={tab.endpoint} fields={tab.params.fields} parentTabId={tab.params.parentTabId} parentUrl={tab.params.parentUrl} tabId={tab.id} />;
      case 'DASHBOARD': return <Dashboard tabId={tab.id} />;
      default: return <div>Unknown Tab Type: {JSON.stringify(tab)}</div>;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        
        <Header />

        {/* Content Area */}
        <div className="tab-content-area">
          {openTabs.length === 0 ? (
            <div className="empty-state">
              <h2>Welcome to SCM Enterprise</h2>
              <p>Select an item from the sidebar to begin your workspace session.</p>
            </div>
          ) : (
            openTabs.map((tab) => (
              <div 
                key={tab.id} 
                style={{ display: activeTabId === tab.id ? 'block' : 'none' }}
              >
                {renderTabContent(tab)}
              </div>
            ))
          )}
        </div>
        
      </div>
    </div>
  );
}
