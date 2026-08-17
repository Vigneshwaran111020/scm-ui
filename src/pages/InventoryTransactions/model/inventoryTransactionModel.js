export const inventoryTransactionModel = [
  { name: 'transactionType', label: 'Transaction Type' },
  { name: 'warehouseId', label: 'Warehouse', type: 'dropdown', endpoint: '/api/warehouses/dropdown' },
  { name: 'inventoryId', label: 'Inventory ID' },
  { name: 'productId', label: 'Product', type: 'dropdown', endpoint: '/api/products/dropdown' },
  { name: 'skuId', label: 'SKU', type: 'dropdown', endpoint: '/api/skus/dropdown' },
  { name: 'uomId', label: 'UOM', type: 'dropdown', endpoint: '/api/uoms/dropdown' },
  { name: 'fromBinId', label: 'From Bin', type: 'dropdown', endpoint: '/api/bins/dropdown' },
  { name: 'toBinId', label: 'To Bin', type: 'dropdown', endpoint: '/api/bins/dropdown' },
  { name: 'quantity', label: 'Quantity', type: 'number' },
  { name: 'lotNumber', label: 'Lot Number' },
  { name: 'serialNumber', label: 'Serial Number' },
  { name: 'referenceType', label: 'Reference Type' },
  { name: 'referenceId', label: 'Reference ID' },
  { name: 'reasonCode', label: 'Reason Code' },
  { name: 'transactionDate', label: 'Transaction Date', type: 'date' }
];
