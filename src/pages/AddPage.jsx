import { useState, useRef } from 'react';
import CustomInputWrapper from '../components/CustomInputWrapper';
import { Save } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { updatePageState } from '../store/tabsSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddPage({ title, endpoint, fields, parentTabId, parentUrl, tabId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const pageState = useSelector(state => state.tabs.pageState[tabId]) || {};
  
  const [formData, setFormData] = useState(() => {
    if (pageState.formData) return pageState.formData;
    
    const initialState = {};
    fields.forEach(fieldItem => {
      const key = typeof fieldItem === 'object' ? fieldItem.name : fieldItem;
      initialState[key] = '';
    });
    return initialState;
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const nextData = { ...prev, [name]: value };
      
      // Cascade reset logic: clear any child fields that depend on the changed field
      const clearCascades = (parentName, currentData) => {
        fields.forEach(f => {
          const fConfig = typeof f === 'object' ? f : null;
          if (fConfig && fConfig.cascadeFrom === parentName) {
            currentData[fConfig.name] = '';
            clearCascades(fConfig.name, currentData); // recursively clear children
          }
        });
      };
      
      clearCascades(name, nextData);
      
      // Persist to Redux for tab switching
      dispatch(updatePageState({ tabId, data: { formData: nextData } }));
      
      return nextData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (formRef.current && !formRef.current.validateForm()) {
      setIsSaving(false);
      return;
    }

    const payload = { ...formData };
    
    // Format payload to ensure proper data types
    fields.forEach(f => {
      const fConfig = typeof f === 'object' ? f : { name: f };
      const key = fConfig.name;
      const val = payload[key];
      
      if (val === '' || val === undefined) {
        // Send null instead of empty string for empty optional fields
        payload[key] = null;
      } else if (fConfig.type === 'number') {
        payload[key] = Number(val);
      } else if (fConfig.type === 'checkbox') {
        payload[key] = Boolean(val);
      }
    });

    try {
      const response = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (response && response.success) {
        toast.success(response.data || 'Record created successfully!');
        setTimeout(() => {
          if (parentTabId) {
            dispatch(updatePageState({ tabId: parentTabId, data: { needsRefresh: true } }));
          }
          if (parentUrl) {
            navigate(parentUrl);
          } else {
            navigate('/');
          }
        }, 1500);
      } else {
        toast.error('Failed to create record.');
        setIsSaving(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">{title}</h2>
      <div className="enterprise-card">
        <form onSubmit={handleSubmit}>
          <CustomInputWrapper
            ref={formRef}
            model={fields}
            value={formData}
            onChange={handleInputChange}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              <Save size={18} /> {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
