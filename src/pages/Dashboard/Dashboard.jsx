import React, { useState, useEffect } from 'react';
import { RefreshCw, LayoutDashboard, AlertCircle, Package, Archive, Layers, ShieldCheck, FileText, Settings2 } from 'lucide-react';
import { apiFetch } from '../../services/api';

import DashboardKpiCard from './components/DashboardKpiCard';
import InventoryWarehouseChart from './components/InventoryWarehouseChart';
import InventoryStatusChart from './components/InventoryStatusChart';
import RecentTransactions from './components/RecentTransactions';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch('/api/dashboard/inventory-summary');
      if (response && response.success) {
        setData(response.data);
      } else {
        setError("Unable to load dashboard data. Invalid response from server.");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const summary = data?.summary || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LayoutDashboard className="text-primary" />
          WMS Dashboard
        </h2>
        
        <button 
          className="btn-secondary" 
          onClick={fetchDashboardData} 
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div style={{ backgroundColor: 'var(--bg-error)', color: 'var(--text-error-dark)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* KPI Grid - Responsive */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <DashboardKpiCard 
          title="Total On Hand" 
          value={summary.totalOnHand} 
          icon={Package} 
          colorClass="text-primary" 
          loading={loading} 
        />
        <DashboardKpiCard 
          title="Total Available" 
          value={summary.totalAvailable} 
          icon={ShieldCheck} 
          colorClass="text-success" 
          loading={loading} 
        />
        <DashboardKpiCard 
          title="Total Reserved" 
          value={summary.totalReserved} 
          icon={Archive} 
          colorClass="text-warning" 
          loading={loading} 
        />
        <DashboardKpiCard 
          title="Total Allocated" 
          value={summary.totalAllocated} 
          icon={Layers} 
          colorClass="text-primary" 
          loading={loading} 
        />
        <DashboardKpiCard 
          title="Today's Transactions" 
          value={summary.todayTransactions} 
          icon={FileText} 
          colorClass="text-secondary" 
          loading={loading} 
        />
        <DashboardKpiCard 
          title="Today's Adjustments" 
          value={summary.todayAdjustments} 
          icon={Settings2} 
          colorClass="text-warning" 
          loading={loading} 
        />
      </div>

      {/* Charts Row - Responsive */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <InventoryWarehouseChart data={data?.inventoryByWarehouse} loading={loading} />
        <InventoryStatusChart data={data?.inventoryByStatus} loading={loading} />
      </div>

      {/* Transactions Section */}
      <div>
        <RecentTransactions transactions={data?.recentTransactions} loading={loading} />
      </div>

    </div>
  );
}
