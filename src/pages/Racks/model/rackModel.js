export const rackModel = [
  { name: 'warehouseId', label: 'Warehouse', type: 'dropdown', endpoint: '/api/warehouses/dropdown', required: true },
  { name: 'zoneId', label: 'Zone', type: 'dropdown', endpoint: '/api/zones/dropdown', cascadeFrom: 'warehouseId', required: true },
  { name: 'aisleId', label: 'Aisle', type: 'dropdown', endpoint: '/api/aisles/dropdown', cascadeFrom: 'zoneId', required: true },
  { name: 'rackCode', label: 'Rack Code', required: true },
  { name: 'rackName', label: 'Rack Name', required: true },
  { name: 'rackType', label: 'Rack Type', type: 'dropdown', options: ['STANDARD', 'DRIVE_IN', 'PUSH_BACK', 'PALLET_FLOW', 'CANTILEVER', 'MEZZANINE'] },
  { name: 'levels', label: 'Levels', type: 'number' },
  { name: 'maxWeight', label: 'Max Weight', type: 'number' }
];
