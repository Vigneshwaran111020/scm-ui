import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Package, MapPin, Users, LayoutDashboard, Menu, Database, ChevronDown, ChevronRight } from 'lucide-react';

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isMasterDataActive = location.pathname.startsWith('/master-data');
  const [isMasterDataExpanded, setIsMasterDataExpanded] = useState(isMasterDataActive);

  const isWmsActive = location.pathname.startsWith('/wms');
  const [isWmsExpanded, setIsWmsExpanded] = useState(isWmsActive);

  const isInventoryActive = location.pathname.startsWith('/wms/inventory');
  const [isInventoryExpanded, setIsInventoryExpanded] = useState(isInventoryActive);

  useEffect(() => {
    if (isMasterDataActive) {
      setIsMasterDataExpanded(true);
    }
  }, [isMasterDataActive]);

  useEffect(() => {
    if (isWmsActive) {
      setIsWmsExpanded(true);
    }
  }, [isWmsActive]);

  useEffect(() => {
    if (isInventoryActive) {
      setIsInventoryExpanded(true);
    }
  }, [isInventoryActive]);

  const handleOpenList = (url) => {
    navigate(url);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className={`sidebar-header ${isCollapsed ? 'collapsed' : ''}`}>
        {!isCollapsed && <h4>SCM Enterprise</h4>}
        <button className="header-btn sidebar-toggle" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
      </div>
      <div className="nav-menu">
        
        <div 
          className={`nav-item ${location.pathname.startsWith('/dashboard') || location.pathname === '/' ? 'active' : ''}`}
          onClick={() => handleOpenList('/dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>

        <div className="nav-section-title">Logistics</div>
        
        <div 
          className={`nav-item ${location.pathname.startsWith('/shipments') ? 'active' : ''}`}
          onClick={() => handleOpenList('/shipments/viewAll')}
        >
          <Package size={20} />
          <span>Shipments</span>
        </div>

        <div className="nav-section-title">WMS</div>
        
        <div 
          className={`nav-item submenu-toggle ${isWmsActive ? 'active-parent' : ''}`}
          onClick={() => setIsWmsExpanded(!isWmsExpanded)}
        >
          <Database size={20} />
          <span>Warehouse Mgmt</span>
          {!isCollapsed && (
            <span className="submenu-icon">
              {isWmsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </div>

        <div className={`submenu-container ${isWmsExpanded ? 'expanded' : ''}`}>
          <div 
            className={`nav-item submenu-item ${location.pathname.startsWith('/wms/warehouses') ? 'active' : ''}`}
            onClick={() => handleOpenList('/wms/warehouses/viewAll')}
          >
            <MapPin size={20} />
            <span>Warehouses</span>
          </div>
          <div 
            className={`nav-item submenu-item ${location.pathname.startsWith('/wms/zones') ? 'active' : ''}`}
            onClick={() => handleOpenList('/wms/zones/viewAll')}
          >
            <MapPin size={20} />
            <span>Zones</span>
          </div>
          <div 
            className={`nav-item submenu-item ${location.pathname.startsWith('/wms/aisles') ? 'active' : ''}`}
            onClick={() => handleOpenList('/wms/aisles/viewAll')}
          >
            <MapPin size={20} />
            <span>Aisles</span>
          </div>
          <div 
            className={`nav-item submenu-item ${location.pathname.startsWith('/wms/racks') ? 'active' : ''}`}
            onClick={() => handleOpenList('/wms/racks/viewAll')}
          >
            <MapPin size={20} />
            <span>Racks</span>
          </div>
          <div 
            className={`nav-item submenu-item ${location.pathname.startsWith('/wms/bins') ? 'active' : ''}`}
            onClick={() => handleOpenList('/wms/bins/viewAll')}
          >
            <MapPin size={20} />
            <span>Bins</span>
          </div>
          <div 
            className={`nav-item submenu-item ${location.pathname.startsWith('/wms/categories') ? 'active' : ''}`}
            onClick={() => handleOpenList('/wms/categories/viewAll')}
          >
            <Package size={20} />
            <span>Categories</span>
          </div>
          <div 
            className={`nav-item submenu-item ${location.pathname.startsWith('/wms/uoms') ? 'active' : ''}`}
            onClick={() => handleOpenList('/wms/uoms/viewAll')}
          >
            <Package size={20} />
            <span>Unit Of Measure</span>
          </div>
          <div 
            className={`nav-item submenu-item ${location.pathname.startsWith('/wms/products') ? 'active' : ''}`}
            onClick={() => handleOpenList('/wms/products/viewAll')}
          >
            <Package size={20} />
            <span>Products</span>
          </div>
          <div 
            className={`nav-item submenu-item ${location.pathname.startsWith('/wms/skus') ? 'active' : ''}`}
            onClick={() => handleOpenList('/wms/skus/viewAll')}
          >
            <Package size={20} />
            <span>SKUs</span>
          </div>
          
          <div 
            className={`nav-item submenu-item submenu-toggle ${isInventoryActive ? 'active-parent' : ''}`}
            onClick={(e) => { e.stopPropagation(); setIsInventoryExpanded(!isInventoryExpanded); }}
          >
            <Package size={20} />
            <span>Inventory Management</span>
            {!isCollapsed && (
              <span className="submenu-icon">
                {isInventoryExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            )}
          </div>
          
          <div className={`submenu-container ${isInventoryExpanded ? 'expanded' : ''}`} style={{ paddingLeft: '1rem' }}>
            <div 
              className={`nav-item submenu-item ${location.pathname === '/wms/inventory/viewAll' ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); handleOpenList('/wms/inventory/viewAll'); }}
            >
              <Database size={18} />
              <span>Inventory</span>
            </div>
            <div 
              className={`nav-item submenu-item ${location.pathname.startsWith('/wms/inventory-adjustments') ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); handleOpenList('/wms/inventory-adjustments/viewAll'); }}
            >
              <Database size={18} />
              <span>Adjustments</span>
            </div>
            <div 
              className={`nav-item submenu-item ${location.pathname.startsWith('/wms/bin-transfers') ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); handleOpenList('/wms/bin-transfers/viewAll'); }}
            >
              <Database size={18} />
              <span>Transfers</span>
            </div>
            <div 
              className={`nav-item submenu-item ${location.pathname.startsWith('/wms/inventory-transactions') ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); handleOpenList('/wms/inventory-transactions/viewAll'); }}
            >
              <Database size={18} />
              <span>Transactions</span>
            </div>
          </div>
        </div>
        
        <div className="nav-section-title">Master Data</div>
        
        <div 
          className={`nav-item submenu-toggle ${isMasterDataActive ? 'active-parent' : ''}`}
          onClick={() => setIsMasterDataExpanded(!isMasterDataExpanded)}
        >
          <Database size={20} />
          <span>General Master</span>
          {!isCollapsed && (
            <span className="submenu-icon">
              {isMasterDataExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </div>

        <div className={`submenu-container ${isMasterDataExpanded ? 'expanded' : ''}`}>
          <div 
            className={`nav-item submenu-item ${location.pathname.startsWith('/master-data/locations') ? 'active' : ''}`}
            onClick={() => handleOpenList('/master-data/locations/viewAll')}
          >
            <MapPin size={20} />
            <span>Locations</span>
          </div>
          
          <div 
            className={`nav-item submenu-item ${location.pathname.startsWith('/master-data/drivers') ? 'active' : ''}`}
            onClick={() => handleOpenList('/master-data/drivers/viewAll')}
          >
            <Users size={20} />
            <span>Drivers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
