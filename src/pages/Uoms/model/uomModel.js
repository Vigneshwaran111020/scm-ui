export const uomModel = [
  { name: 'uomCode', label: 'UOM Code', required: true },
  { name: 'uomName', label: 'UOM Name', required: true },
  { name: 'symbol', label: 'Symbol' },
  { name: 'uomType', label: 'UOM Type', type: 'dropdown', options: ['QUANTITY', 'WEIGHT', 'VOLUME', 'LENGTH', 'AREA', 'TIME'] },
  { name: 'baseUom', label: 'Base UOM', type: 'checkbox' },
  { name: 'conversionFactor', label: 'Conversion Factor', type: 'number' }
];
