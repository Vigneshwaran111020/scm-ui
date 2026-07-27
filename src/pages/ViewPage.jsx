import { useState, useEffect } from 'react';
import CustomReadOnlyContainer from '../components/CustomReadOnlyContainer';
import { apiFetch } from '../services/api';

export default function ViewPage({ title, data, endpoint }) {
  if (!data) return <div>No data provided.</div>;
  
  const [viewData, setViewData] = useState(() => {
    const initData = { ...data };
    delete initData.parentUrl;
    return initData;
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const keys = Object.keys(viewData).filter(key => key !== 'id');

  useEffect(() => {
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
              setViewData(fetchedData);
            }
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [data, endpoint]);

  if (isLoading) {
    return <div className="enterprise-card" style={{ marginTop: '2rem' }}>Loading record data...</div>;
  }

  
  return (
    <div>
      <h2 className="page-title">{title} (View)</h2>
      <div className="enterprise-card">
        {keys.map((key) => {
          const label = key.replace(/([A-Z])/g, ' $1');
          const finalLabel = label.charAt(0).toUpperCase() + label.slice(1);
          return (
            <CustomReadOnlyContainer 
              key={key} 
              label={finalLabel} 
              value={viewData[key]} 

            />
          );
        })}
      </div>
    </div>
  );
}
