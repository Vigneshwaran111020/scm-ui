export const inventoryAdjustmentModel = [
  { name: 'warehouseId', label: 'Warehouse', type: 'dropdown', endpoint: '/api/warehouses/dropdown', required: true },
  { name: 'zoneId', label: 'Zone', type: 'dropdown', endpoint: '/api/zones/dropdown', cascadeFrom: 'warehouseId' },
  { name: 'aisleId', label: 'Aisle', type: 'dropdown', endpoint: '/api/aisles/dropdown', cascadeFrom: 'zoneId' },
  { name: 'rackId', label: 'Rack', type: 'dropdown', endpoint: '/api/racks/dropdown', cascadeFrom: 'aisleId' },
  { name: 'binId', label: 'Bin', type: 'dropdown', endpoint: '/api/bins/dropdown', cascadeFrom: 'rackId', required: true },
  
  { name: 'productId', label: 'Product', type: 'dropdown', endpoint: '/api/products/dropdown' },
  { name: 'skuId', label: 'SKU', type: 'dropdown', endpoint: '/api/skus/dropdown', required: true },
  { name: 'uomId', label: 'UOM', type: 'dropdown', endpoint: '/api/uoms/dropdown', required: true },
  
  { name: 'adjustmentType', label: 'Adjustment Type', type: 'dropdown', options: ['ADJUSTMENT_IN'], required: true },
  { name: 'quantity', label: 'Quantity', type: 'number', min: 0.01, required: true },
  { name: 'reasonCode', label: 'Reason Code' },
  { name: 'referenceNumber', label: 'Reference Number' },
  { name: 'remarks', label: 'Remarks', type: 'textarea' }
];
