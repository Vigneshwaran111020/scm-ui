export const zoneModel = [
  { name: 'warehouseId', label: 'Warehouse', type: 'dropdown', endpoint: '/api/warehouses/dropdown', required: true },
  { name: 'zoneCode', label: 'Zone Code', required: true },
  { name: 'zoneName', label: 'Zone Name', required: true },
  { name: 'zoneType', label: 'Zone Type', type: 'dropdown', options: ['RECEIVING', 'STORAGE', 'PICKING', 'PACKING', 'DISPATCH', 'RETURNS', 'DAMAGED'] },
  { name: 'temperatureType', label: 'Temperature Type', type: 'dropdown', options: ['AMBIENT', 'DRY', 'REFRIGERATED', 'FROZEN', 'CONTROLLED'] },
  { name: 'sequence', label: 'Sequence', type: 'number' }
];
