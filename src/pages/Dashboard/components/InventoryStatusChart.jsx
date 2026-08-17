import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

export default function InventoryStatusChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="enterprise-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Inventory by Status</h3>
        <div style={{ flex: 1, backgroundColor: 'var(--bg-app)', borderRadius: '50%', margin: '2rem', animation: 'pulse 1.5s infinite' }}></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="enterprise-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Inventory by Status</h3>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          No inventory status data available.
        </div>
      </div>
    );
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent < 0.05) return null; // Don't show label for very small slices

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="enterprise-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Inventory by Status</h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={110}
              innerRadius={50}
              fill="#8884d8"
              dataKey="quantity"
              nameKey="status"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [value, name]}
              contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)' }}
              itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
