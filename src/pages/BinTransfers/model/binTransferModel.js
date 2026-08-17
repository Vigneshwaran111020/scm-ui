export const binTransferModel = [
  { name: 'id', label: 'Transfer ID', type: 'number', readOnly: true },
  { name: 'status', label: 'Status', readOnly: true },
  { name: 'createdDate', label: 'Created Date', readOnly: true },

  { name: 'skuId', label: 'SKU', readOnly: true },
  { name: 'uomId', label: 'UOM', readOnly: true },

  { name: 'sourceWarehouseId', label: 'Source Warehouse', readOnly: true },
  { name: 'sourceBinId', label: 'Source Bin', readOnly: true },

  { name: 'destinationWarehouseId', label: 'Destination Warehouse', readOnly: true },
  { name: 'destinationBinId', label: 'Destination Bin', readOnly: true },

  { name: 'quantity', label: 'Quantity', type: 'number', readOnly: true },
  { name: 'reasonCode', label: 'Reason Code', readOnly: true },
  { name: 'remarks', label: 'Remarks', type: 'textarea', readOnly: true },

  { name: 'createdBy', label: 'Created By', readOnly: true }
];
