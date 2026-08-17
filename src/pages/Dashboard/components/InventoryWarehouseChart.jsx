import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function InventoryWarehouseChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="enterprise-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Inventory by Warehouse</h3>
        <div style={{ flex: 1, backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }}></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="enterprise-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Inventory by Warehouse</h3>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          No warehouse inventory data available.
        </div>
      </div>
    );
  }

  return (
    <div className="enterprise-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Inventory by Warehouse</h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-divider)" />
            <XAxis dataKey="warehouse" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'var(--border-main)' }} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: 'var(--bg-app)' }}
              contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="totalOnHand" name="Total On Hand" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
