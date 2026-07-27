export default function CustomInputContainer({ name, value, onChange, placeholder, type = 'text', required = false }) {
  return (
    <div className="form-group">
      <label className="form-label">{placeholder}</label>
      <input
        type={type}
        name={name}
        className="form-control"
        value={value || ''}
        onChange={onChange}
        placeholder={`Enter ${placeholder.toLowerCase()}`}
        required={required}
      />
    </div>
  );
}
