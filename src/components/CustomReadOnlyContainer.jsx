export default function CustomReadOnlyContainer({ label, value }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="form-control" style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-secondary)' }}>
        {value || '-'}
      </div>
    </div>
  );
}
