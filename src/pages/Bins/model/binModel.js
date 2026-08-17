export const binModel = [
  { name: 'warehouseId', label: 'Warehouse', type: 'dropdown', endpoint: '/api/warehouses/dropdown', required: true },
  { name: 'zoneId', label: 'Zone', type: 'dropdown', endpoint: '/api/zones/dropdown', cascadeFrom: 'warehouseId', required: true },
  { name: 'aisleId', label: 'Aisle', type: 'dropdown', endpoint: '/api/aisles/dropdown', cascadeFrom: 'zoneId', required: true },
  { name: 'rackId', label: 'Rack', type: 'dropdown', endpoint: '/api/racks/dropdown', cascadeFrom: 'aisleId', required: true },
  { name: 'binCode', label: 'Bin Code', required: true },
  { name: 'binType', label: 'Bin Type', type: 'dropdown', options: ['STANDARD', 'PICKING', 'RESERVE', 'REPLENISHMENT', 'BULK'] },
  { name: 'capacity', label: 'Capacity', type: 'number' },
  { name: 'capacityUom', label: 'Capacity UOM' },
  { name: 'maxWeight', label: 'Max Weight', type: 'number' },
  { name: 'occupied', label: 'Occupied', type: 'checkbox' },
  { name: 'allowMixedSku', label: 'Allow Mixed SKU', type: 'checkbox' },
  { name: 'allowMixedLot', label: 'Allow Mixed Lot', type: 'checkbox' },
  { name: 'barcode', label: 'Barcode' }
];
