import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

export default function CustomInputContainer({ name, value, onChange, placeholder, field = {}, formData = {}, type = 'text', required = false, error }) {
  const actualType = field.type || type;
  const actualRequired = field.required || required;
  
  const [options, setOptions] = useState(field.options || []);
  const [loading, setLoading] = useState(false);

  const isMounted = React.useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const fetchOptions = async (showLoadingState = true) => {
    if (actualType !== 'dropdown' || !field.endpoint) return;
    
    let fetchEndpoint = field.endpoint;
    
    if (field.cascadeFrom) {
      const parentValue = formData[field.cascadeFrom];
      if (!parentValue) {
        setOptions([]);
        return;
      }
      const separator = fetchEndpoint.includes('?') ? '&' : '?';
      const queryParam = field.cascadeParam || field.cascadeFrom;
      fetchEndpoint = `${fetchEndpoint}${separator}${queryParam}=${encodeURIComponent(parentValue)}`;
    }

    if (showLoadingState) setLoading(true);
    
    try {
      const res = await apiFetch(fetchEndpoint);
      if (!isMounted.current) return;
      
      const dataArr = res?.data?.content || res?.data || [];
      let optionsArr = Array.isArray(dataArr) ? dataArr : [];
      // Deduplicate options by value to prevent duplicates if backend returns any
      const seen = new Set();
      optionsArr = optionsArr.filter(opt => {
        const val = typeof opt === 'object' ? (field.valueKey ? opt[field.valueKey] : (opt.value !== undefined ? opt.value : opt.id)) : opt;
        if (seen.has(val)) return false;
        seen.add(val);
        return true;
      });
      setOptions(optionsArr);
    } catch (e) {
      console.error(e);
    } finally {
      if (isMounted.current && showLoadingState) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOptions(true);
  }, [actualType, field.endpoint, field.cascadeFrom, field.cascadeFrom ? formData[field.cascadeFrom] : null]);

  const renderInput = () => {
    if (actualType === 'textarea') {
      return (
        <textarea
          name={name}
          className="form-control"
          value={value || ''}
          onChange={onChange}
          placeholder={`Enter ${placeholder.toLowerCase()}`}
          required={actualRequired}
          rows={3}
          maxLength={field.maxLength}
        />
      );
    }
    
    if (actualType === 'dropdown') {
      return (
        <select
          name={name}
          className="form-control"
          value={value || ''}
          onChange={onChange}
          onFocus={() => fetchOptions(false)}
          required={actualRequired}
          disabled={loading || (field.cascadeFrom && !formData[field.cascadeFrom])}
        >
          <option value="">{loading ? 'Loading...' : `Select ${placeholder}`}</option>
          {options.map((opt, idx) => {
             // Handle both object options and string/number primitive options
             if (typeof opt !== 'object') {
               return <option key={idx} value={opt}>{opt}</option>;
             }
             const optValue = field.valueKey ? opt[field.valueKey] : (opt.value !== undefined ? opt.value : opt.id);
             const entityName = name.replace('Id', '');
             const optLabel = field.labelKey ? opt[field.labelKey] : (opt.name || opt[`${entityName}Name`] || opt[`${entityName}Code`] || optValue);
             return <option key={optValue} value={optValue}>{optLabel}</option>
          })}
        </select>
      );
    }

    if (actualType === 'checkbox') {
       return (
         <div style={{ display: 'flex', alignItems: 'center', height: '38px' }}>
           <input
             type="checkbox"
             name={name}
             checked={!!value}
             onChange={(e) => onChange({ target: { name, value: e.target.checked }})}
           />
           <span style={{ marginLeft: '8px', cursor: 'pointer' }}>{placeholder}</span>
         </div>
       );
    }

    return (
      <input
        type={actualType}
        name={name}
        className="form-control"
        value={value || ''}
        onChange={onChange}
        placeholder={`Enter ${placeholder.toLowerCase()}`}
        required={actualRequired}
        maxLength={field.maxLength}
        min={field.min}
        max={field.max}
      />
    );
  };

  return (
    <div className="form-group">
      {actualType !== 'checkbox' && (
        <label className="form-label">
          {placeholder} {actualRequired && <span style={{ color: 'var(--error)' }}>*</span>}
        </label>
      )}
      {renderInput()}
      {error && <div style={{ color: 'var(--error, red)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</div>}
    </div>
  );
}
