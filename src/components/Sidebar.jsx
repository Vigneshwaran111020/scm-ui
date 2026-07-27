import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Package, MapPin, Users, LayoutDashboard, Menu, Database, ChevronDown, ChevronRight } from 'lucide-react';

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isMasterDataActive = location.pathname.startsWith('/master-data');
  const [isMasterDataExpanded, setIsMasterDataExpanded] = useState(isMasterDataActive);

  useEffect(() => {
    if (isMasterDataActive) {
      setIsMasterDataExpanded(true);
    }
  }, [isMasterDataActive]);

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
        
        <div className="nav-section-title">Master Data</div>
        
        <div 
          className={`nav-item submenu-toggle ${isMasterDataActive ? 'active-parent' : ''}`}
          onClick={() => setIsMasterDataExpanded(!isMasterDataExpanded)}
        >
          <Database size={20} />
          <span>Master Data</span>
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
