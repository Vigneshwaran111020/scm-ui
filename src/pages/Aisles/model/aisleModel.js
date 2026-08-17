export const aisleModel = [
  { name: 'warehouseId', label: 'Warehouse', type: 'dropdown', endpoint: '/api/warehouses/dropdown', required: true },
  { name: 'zoneId', label: 'Zone', type: 'dropdown', endpoint: '/api/zones/dropdown', cascadeFrom: 'warehouseId', required: true },
  { name: 'aisleCode', label: 'Aisle Code', required: true },
  { name: 'aisleName', label: 'Aisle Name', required: true },
  { name: 'sequence', label: 'Sequence', type: 'number' },
  { name: 'length', label: 'Length', type: 'number' },
  { name: 'width', label: 'Width', type: 'number' }
];
