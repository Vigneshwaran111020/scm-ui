export const skuModel = [
  { name: 'productId', label: 'Product', type: 'dropdown', endpoint: '/api/products/dropdown', required: true },
  { name: 'skuCode', label: 'SKU Code', required: true },
  { name: 'upc', label: 'UPC' },
  { name: 'ean', label: 'EAN' },
  { name: 'packType', label: 'Pack Type', type: 'dropdown', options: ['EACH', 'INNER_PACK', 'CASE', 'MASTER_CASE', 'PALLET', 'CARTON'] },
  { name: 'color', label: 'Color' },
  { name: 'size', label: 'Size' },
  { name: 'weight', label: 'Weight', type: 'number' }
];
