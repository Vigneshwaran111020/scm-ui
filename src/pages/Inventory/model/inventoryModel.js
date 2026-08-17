export const inventoryModel = [
  { name: 'warehouseId', label: 'Warehouse', type: 'dropdown', endpoint: '/api/warehouses/dropdown' },
  { name: 'zoneId', label: 'Zone', type: 'dropdown', endpoint: '/api/zones/dropdown', cascadeFrom: 'warehouseId' },
  { name: 'binId', label: 'Bin', type: 'dropdown', endpoint: '/api/bins/dropdown', cascadeFrom: 'zoneId' }, // Note: Bin uses zone directly for filtering in UI context usually, but we will rely on backend mapping.
  { name: 'productId', label: 'Product', type: 'dropdown', endpoint: '/api/products/dropdown' },
  { name: 'skuId', label: 'SKU', type: 'dropdown', endpoint: '/api/skus/dropdown' },
  { name: 'uomId', label: 'UOM', type: 'dropdown', endpoint: '/api/uoms/dropdown' },
  { name: 'lotNumber', label: 'Lot Number' },
  { name: 'serialNumber', label: 'Serial Number' },
  { name: 'manufactureDate', label: 'Manufacture Date', type: 'date' },
  { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
  { name: 'inventoryStatus', label: 'Inventory Status' },
  { name: 'onHandQuantity', label: 'On Hand', type: 'number' },
  { name: 'reservedQuantity', label: 'Reserved', type: 'number' },
  { name: 'allocatedQuantity', label: 'Allocated', type: 'number' },
  { name: 'availableQuantity', label: 'Available', type: 'number' }
];
