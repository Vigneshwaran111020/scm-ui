export const categoryModel = [
  { name: 'categoryCode', label: 'Category Code', required: true },
  { name: 'categoryName', label: 'Category Name', required: true },
  { name: 'parentCategoryId', label: 'Parent Category', type: 'dropdown', endpoint: '/api/categories/dropdown' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'displaySequence', label: 'Display Sequence', type: 'number' }
];
