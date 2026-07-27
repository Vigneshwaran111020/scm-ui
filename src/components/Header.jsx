import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
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
    </header>
  );
}
