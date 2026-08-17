import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, X, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiFetch } from '../../services/api';
import { updatePageState } from '../../store/tabsSlice';
import CustomInputWrapper from '../../components/CustomInputWrapper';

export default function BinTransfer({ tabId, data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  const pageState = useSelector(state => state.tabs.pageState[tabId]) || {};

  // The row data is passed through the data prop or location.state.row initially
  const initialRow = data || location.state?.row || {};

  const [formData, setFormData] = useState(() => {
    if (pageState.formData && pageState.formData.sourceWarehouseId) {
      return pageState.formData;
    }

    return {
      // Source details mapping (mostly for display/reference)
      sourceWarehouseId: initialRow.warehouseId || '',
      sourceBinId: initialRow.binId || '',
      skuId: initialRow.skuId || '',
      productId: initialRow.productId || '',
      uomId: initialRow.uomId || '',
      availableQuantity: initialRow.availableQuantity || initialRow.onHandQuantity || 0,

      // Destination mapping
      destinationWarehouseId: initialRow.warehouseId || '',
      destinationZoneId: '',
      destinationAisleId: '',
      destinationRackId: '',
      destinationBinId: '',

      // Transfer details
      quantity: '',
      reasonCode: '',
      remarks: ''
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Destination cascading configuration
  const destinationFields = [
    { name: 'destinationWarehouseId', label: 'Warehouse', type: 'dropdown', endpoint: '/api/warehouses/dropdown', disabled: true },
    { name: 'destinationZoneId', label: 'Zone', type: 'dropdown', endpoint: '/api/zones/dropdown', cascadeFrom: 'destinationWarehouseId', cascadeParam: 'warehouseId', required: true },
    { name: 'destinationAisleId', label: 'Aisle', type: 'dropdown', endpoint: '/api/aisles/dropdown', cascadeFrom: 'destinationZoneId', cascadeParam: 'zoneId', required: true },
    { name: 'destinationRackId', label: 'Rack', type: 'dropdown', endpoint: '/api/racks/dropdown', cascadeFrom: 'destinationAisleId', cascadeParam: 'aisleId', required: true },
    { name: 'destinationBinId', label: 'Bin', type: 'dropdown', endpoint: '/api/bins/dropdown', cascadeFrom: 'destinationRackId', cascadeParam: 'rackId', required: true }
  ];

  const transferFields = [
    { name: 'quantity', label: 'Transfer Quantity', type: 'number', required: true, min: 0.01 },
    { name: 'reasonCode', label: 'Reason', type: 'dropdown', options: ['REPLENISHMENT', 'RELOCATION', 'STORAGE_OPTIMIZATION', 'OTHER'], required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const nextData = { ...prev, [name]: value };

      // Cascade clear logic for destination fields
      const clearCascades = (parentName, currentData) => {
        destinationFields.forEach(f => {
          if (f.cascadeFrom === parentName) {
            currentData[f.name] = '';
            clearCascades(f.name, currentData);
          }
        });
      };
      clearCascades(name, nextData);

      dispatch(updatePageState({ tabId, data: { formData: nextData } }));
      return nextData;
    });
  };

  const handleTransferClick = (e) => {
    e.preventDefault();
    setValidationError('');

    if (formRef.current && !formRef.current.validateForm()) {
      return;
    }

    const qty = Number(formData.quantity);
    if (isNaN(qty) || qty <= 0) {
      setValidationError('Transfer quantity must be greater than 0.');
      return;
    }

    if (qty > formData.availableQuantity) {
      setValidationError(`Transfer quantity cannot exceed available quantity (${formData.availableQuantity}).`);
      return;
    }

    if (formData.sourceBinId === formData.destinationBinId) {
      setValidationError('Destination bin cannot be the same as source bin.');
      return;
    }

    setShowConfirmModal(true);
  };

  const executeTransfer = async () => {
    setIsSaving(true);

    const payload = {
      sourceWarehouseId: formData.sourceWarehouseId,
      sourceBinId: formData.sourceBinId,
      destinationWarehouseId: formData.destinationWarehouseId,
      destinationBinId: formData.destinationBinId,
      skuId: formData.skuId,
      uomId: formData.uomId,
      quantity: Number(formData.quantity),
      reasonCode: formData.reasonCode,
      remarks: formData.remarks || null
    };

    try {
      const response = await apiFetch('/api/bin-transfers', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (response && response.success) {
        toast.success(`Inventory transferred successfully. Transfer Number: ${response.data?.id || 'Success'}`);
        setTimeout(() => {
          // Refresh Inventory tab
          const parentUrl = location.state?.parentUrl || '/wms/inventory/viewAll';
          const parentTabId = 'inventory-list';
          dispatch(updatePageState({ tabId: parentTabId, data: { needsRefresh: true } }));
          navigate(parentUrl);
        }, 1500);
      } else {
        toast.error('Failed to transfer inventory.');
        setIsSaving(false);
        setShowConfirmModal(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
      setIsSaving(false);
      setShowConfirmModal(false);
    }
  };

  if (!formData.sourceWarehouseId || !formData.skuId) {
    return (
      <div className="enterprise-card" style={{ marginTop: '2rem', textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>No source inventory selected.</h3>
        <p style={{ marginTop: '1rem', color: 'var(--text-disabled)' }}>Please start a transfer from the Inventory list screen.</p>
        <button className="btn-secondary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/wms/inventory/viewAll')}>
          Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title"><ArrowRightLeft className="text-primary" style={{ marginRight: '8px' }} /> Transfer Inventory</h2>

      {validationError && (
        <div style={{ backgroundColor: 'var(--bg-error)', color: 'var(--text-error-dark)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: 500 }}>
          {validationError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        {/* Source Panel */}
        <div className="enterprise-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-main)', paddingBottom: '0.75rem', color: 'var(--text-primary)' }}>Source Inventory</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label">Warehouse</label>
              <div className="form-control" style={{ backgroundColor: 'var(--bg-app)' }}>{formData.sourceWarehouseId}</div>
            </div>
            <div>
              <label className="form-label">Source Bin</label>
              <div className="form-control" style={{ backgroundColor: 'var(--bg-app)', fontWeight: 600 }}>{formData.sourceBinId}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">SKU</label>
                <div className="form-control" style={{ backgroundColor: 'var(--bg-app)' }}>{formData.skuId}</div>
              </div>
              <div>
                <label className="form-label">Product</label>
                <div className="form-control" style={{ backgroundColor: 'var(--bg-app)' }}>{formData.productId || 'N/A'}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">UOM</label>
                <div className="form-control" style={{ backgroundColor: 'var(--bg-app)' }}>{formData.uomId}</div>
              </div>
              <div>
                <label className="form-label">Available Quantity</label>
                <div className="form-control" style={{ backgroundColor: 'var(--bg-app)', color: 'var(--primary)', fontWeight: 'bold' }}>{formData.availableQuantity}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Destination Panel */}
        <div className="enterprise-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-main)', paddingBottom: '0.75rem', color: 'var(--text-primary)' }}>Destination Location</h3>
          <CustomInputWrapper
            model={destinationFields}
            value={formData}
            onChange={handleInputChange}
          />
        </div>

      </div>

      <div className="enterprise-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-main)', paddingBottom: '0.75rem', color: 'var(--text-primary)' }}>Transfer Details</h3>
        <form>
          <CustomInputWrapper
            ref={formRef}
            model={transferFields}
            value={formData}
            onChange={handleInputChange}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border-main)', paddingTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate('/wms/inventory/viewAll')} disabled={isSaving}>
              Cancel
            </button>
            <button type="button" className="btn-primary" onClick={handleTransferClick} disabled={isSaving}>
              <ArrowRightLeft size={18} /> Review Transfer
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal Overlay */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(2px)'
        }}>
          <div className="enterprise-card" style={{ width: '450px', padding: '2rem', margin: '0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 className="text-primary" /> Confirm Transfer</h3>
              <button onClick={() => setShowConfirmModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Are you sure you want to transfer the following inventory?</p>

            <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.75rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>SKU:</span>
                <span style={{ fontWeight: 600 }}>{formData.skuId}</span>

                <span style={{ color: 'var(--text-secondary)' }}>Product:</span>
                <span style={{ fontWeight: 500 }}>{formData.productId || 'N/A'}</span>

                <span style={{ color: 'var(--text-secondary)' }}>Quantity:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formData.quantity} {formData.uomId}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-divider)', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>From</div>
                  <div style={{ fontWeight: 600 }}>{formData.sourceBinId}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Available: {Number(formData.availableQuantity) - Number(formData.quantity)} {formData.uomId} (after)</div>
                </div>

                <ArrowRightLeft className="text-primary" size={20} style={{ opacity: 0.5 }} />

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>To</div>
                  <div style={{ fontWeight: 600 }}>{formData.destinationBinId}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowConfirmModal(false)} disabled={isSaving}>Cancel</button>
              <button className="btn-primary" onClick={executeTransfer} disabled={isSaving}>
                {isSaving ? 'Processing...' : 'Confirm Transfer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
