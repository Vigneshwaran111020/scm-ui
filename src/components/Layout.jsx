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
import Locations from '../pages/Locations';
import Drivers from '../pages/Drivers';
import ViewPage from '../pages/ViewPage';
import EditPage from '../pages/EditPage';
import AddPage from '../pages/AddPage';

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
      if (segments[2] === 'add') return { id: 'add-location', type: 'ADD', title: 'Add Location', url: pathname, params: { fields: ['locationCode', 'locationName', 'city', 'state'], parentTabId: 'locations-list', parentUrl: '/master-data/locations/viewAll' }, endpoint: '/api/locations' };
      if (segments[3] === 'edit') return { id: `location-edit-${segments[2]}`, type: 'EDIT', title: `Edit Location ${segments[2]}`, url: pathname, params: { id: segments[2], parentUrl: '/master-data/locations/viewAll' }, endpoint: '/api/locations' };
      if (segments[3] === 'view') return { id: `location-view-${segments[2]}`, type: 'VIEW', title: `View Location ${segments[2]}`, url: pathname, params: { id: segments[2], parentUrl: '/master-data/locations/viewAll' }, endpoint: '/api/locations' };
    }
    
    if (segments[0] === 'master-data' && segments[1] === 'drivers') {
      if (segments[2] === 'viewAll') return { id: 'drivers-list', type: 'DRIVERS_LIST', title: 'Drivers', url: pathname, endpoint: '/api/drivers' };
      if (segments[2] === 'add') return { id: 'add-driver', type: 'ADD', title: 'Add Driver', url: pathname, params: { fields: ['driverNumber', 'driverName', 'licenseNumber', 'phoneNumber'], parentTabId: 'drivers-list', parentUrl: '/master-data/drivers/viewAll' }, endpoint: '/api/drivers' };
      if (segments[3] === 'edit') return { id: `driver-edit-${segments[2]}`, type: 'EDIT', title: `Edit Driver ${segments[2]}`, url: pathname, params: { id: segments[2], parentUrl: '/master-data/drivers/viewAll' }, endpoint: '/api/drivers' };
      if (segments[3] === 'view') return { id: `driver-view-${segments[2]}`, type: 'VIEW', title: `View Driver ${segments[2]}`, url: pathname, params: { id: segments[2], parentUrl: '/master-data/drivers/viewAll' }, endpoint: '/api/drivers' };
    }
    return null;
  };

  useEffect(() => {
    const payload = getTabPayloadFromUrl(location.pathname);
    if (payload) {
      const existingTab = openTabs.find(t => t.id === payload.id);
      
      if (location.state?.row && (payload.type === 'EDIT' || payload.type === 'VIEW')) {
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
      if (activeTab && activeTab.url && activeTab.url !== location.pathname) {
        navigate(activeTab.url, { replace: true });
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
      case 'VIEW': return <ViewPage title={tab.title} data={tab.params} endpoint={tab.endpoint} />;
      case 'EDIT': return <EditPage title={tab.title} data={tab.params} endpoint={tab.endpoint} parentUrl={tab.params.parentUrl} />;
      case 'ADD': return <AddPage title={tab.title} endpoint={tab.endpoint} fields={tab.params.fields} parentTabId={tab.params.parentTabId} parentUrl={tab.params.parentUrl} tabId={tab.id} />;
      case 'DASHBOARD': return <div><h2 className="page-title">Dashboard</h2><div className="enterprise-card">Dashboard features coming soon.</div></div>;
      default: return <div>Unknown Tab Type: {JSON.stringify(tab)}</div>;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        
        <Header />

        {/* Tab Bar */}
        {openTabs.length > 0 && (
          <div className="tab-bar">
            {openTabs.map((tab) => (
              <div 
                key={tab.id} 
                className={clsx('tab-item', { active: activeTabId === tab.id })}
                onClick={() => navigate(tab.url || '/')}
              >
                <span className="tab-title">{tab.title}</span>
                <button 
                  className="tab-close-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(closeTab(tab.id));
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

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
