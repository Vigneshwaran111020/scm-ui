import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { closeTab, closeAllTabs } from '../store/tabsSlice';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openTabs, activeTabId } = useSelector((state) => state.tabs);
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    const handleEscape = (e) => { if (e.key === 'Escape') setContextMenu(null); };
    
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        {openTabs.length > 0 && (
          <div className="tab-bar">
            {openTabs.map((tab) => (
              <div 
                key={tab.id} 
                className={clsx('tab-item', { active: activeTabId === tab.id })}
                onClick={() => {
                  const statePayload = { tabId: tab.id };
                  if (tab.type === 'EDIT' || tab.type === 'VIEW' || tab.type === 'INVENTORY_TRANSFER') {
                    statePayload.row = tab.params;
                  }
                  navigate(tab.url || '/', { state: statePayload });
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    tabId: tab.id
                  });
                }}
              >
                <span className="tab-title" title={tab.title}>{tab.title}</span>
                <button 
                  className="tab-close-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(closeTab(tab.id));
                    setContextMenu(null);
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="header-right">
        <button className="header-btn">
          <Bell size={20} />
        </button>
        <div className="user-profile">
          <div className="avatar">V</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            Vignesh
          </div>
        </div>
      </div>

      {contextMenu && (
        <div 
          className="context-menu" 
          style={{ 
            position: 'fixed', 
            top: contextMenu.y, 
            left: contextMenu.x, 
            zIndex: 1000 
          }}
        >
          <div 
            className="context-menu-item"
            onClick={() => {
              dispatch(closeTab(contextMenu.tabId));
              setContextMenu(null);
            }}
          >
            Close This Tab
          </div>
          <div 
            className="context-menu-item"
            onClick={() => {
              dispatch(closeAllTabs());
              setContextMenu(null);
            }}
          >
            Close All Tabs
          </div>
        </div>
      )}
    </header>
  );
}
