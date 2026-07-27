import { useState } from 'react';
import CustomInputContainer from '../components/CustomInputContainer';
import { Save } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useDispatch } from 'react-redux';
import { updatePageState } from '../store/tabsSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddPage({ title, endpoint, fields, parentTabId, parentUrl, tabId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const initialState = {};
  fields.forEach(field => { initialState[field] = ''; });
  
  const [formData, setFormData] = useState(initialState);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(formData)
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
      <h2 className="page-title">{title} (Add)</h2>
      <div className="enterprise-card">
        <form onSubmit={handleSubmit}>
          {fields.map((key) => {
            const placeholder = key.replace(/([A-Z])/g, ' $1');
            const finalPlaceholder = placeholder.charAt(0).toUpperCase() + placeholder.slice(1);
            return (
              <CustomInputContainer 
                key={key} 
                name={key}
                value={formData[key]} 
                onChange={handleInputChange} 
                placeholder={finalPlaceholder}
              />
            );
          })}
          
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
