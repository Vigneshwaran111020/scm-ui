import { useState, useEffect, useRef } from 'react';
import CustomInputWrapper from '../components/CustomInputWrapper';
import { Save } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updatePageState } from '../store/tabsSlice';
import { toast } from 'react-toastify';

export default function EditPage({ title, data, endpoint, parentUrl, tabId, fields }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formRef = useRef(null);

  if (!data) return <div>No data provided.</div>;

  const pageState = useSelector(state => state.tabs.pageState[tabId]) || {};

  const [formData, setFormData] = useState(() => {
    if (pageState.formData) return pageState.formData;
    
    const initData = { ...data };
    delete initData.parentUrl;
    return initData;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const keys = Object.keys(formData).filter(key => key !== 'id');

  useEffect(() => {
    // If deep linked, `data` might only contain routing metadata `{ id, parentUrl }`
    const hasBusinessData = Object.keys(data).some(k => !['id', 'parentUrl', 'tabId'].includes(k));
    if (!hasBusinessData && data.id && !pageState.formData) {
      setIsLoading(true);
      apiFetch(endpoint)
        .then(res => {
          if (res && res.success && res.data) {
            const item = res.data.find(r => r.id === parseInt(data.id, 10) || r.id === data.id);
            if (item) {
              const fetchedData = { ...item };
              delete fetchedData.parentUrl;
              setFormData(fetchedData);
            } else {
              toast.error('Item not found in backend.');
            }
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [data, endpoint]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const nextData = { ...prev, [name]: value };
      
      const clearCascades = (parentName, currentData) => {
        if (!fields) return;
        fields.forEach(f => {
          const fConfig = typeof f === 'object' ? f : null;
          if (fConfig && fConfig.cascadeFrom === parentName) {
            currentData[fConfig.name] = '';
            clearCascades(fConfig.name, currentData);
          }
        });
      };
      
      clearCascades(name, nextData);
      
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
    const currentFields = fields && fields.length > 0 ? fields : keys;
    currentFields.forEach(f => {
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
      const response = await apiFetch(`${endpoint}/${data.id || ''}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      if (response && response.success) {
        toast.success(response.data || 'Record updated successfully!');
      } else {
        toast.success('Record updated successfully!');
      }

      setTimeout(() => {
        // Trigger refresh on parent tab if known
        const parentIdMap = {
          '/shipments/viewAll': 'shipments-list',
          '/master-data/locations/viewAll': 'locations-list',
          '/master-data/drivers/viewAll': 'drivers-list'
        };
        const parentTabId = parentUrl ? parentIdMap[parentUrl] : null;
        if (parentTabId) {
          dispatch(updatePageState({ tabId: parentTabId, data: { needsRefresh: true } }));
        }

        if (parentUrl) {
          navigate(parentUrl);
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="enterprise-card" style={{ marginTop: '2rem' }}>Loading record data...</div>;
  }

  return (
    <div>
      <h2 className="page-title">{title}</h2>
      <div className="enterprise-card">
        <form onSubmit={handleSubmit}>
          <CustomInputWrapper
            ref={formRef}
            model={fields && fields.length > 0 ? fields : keys}
            value={formData}
            onChange={handleInputChange}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
