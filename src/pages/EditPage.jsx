import { useState, useEffect } from 'react';
import CustomInputContainer from '../components/CustomInputContainer';
import { Save } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updatePageState } from '../store/tabsSlice';
import { toast } from 'react-toastify';

export default function EditPage({ title, data, endpoint, parentUrl, tabId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!data) return <div>No data provided.</div>;

  const [formData, setFormData] = useState(() => {
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
    if (!hasBusinessData && data.id) {
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await apiFetch(`${endpoint}/${data.id || ''}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
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
      <h2 className="page-title">{title} (Edit)</h2>
      <div className="enterprise-card">
        <form onSubmit={handleSubmit}>
          {keys.map((key) => {
            const placeholder = key.replace(/([A-Z])/g, ' $1');
            const finalPlaceholder = placeholder.charAt(0).toUpperCase() + placeholder.slice(1);
            return (
              <CustomInputContainer
                key={key}
                name={key}
                value={formData[key] || ''}
                onChange={handleInputChange}
                placeholder={finalPlaceholder}
              />
            );
          })}

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
