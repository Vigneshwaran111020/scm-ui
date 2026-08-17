import React, { forwardRef, useImperativeHandle, useState } from 'react';
import CustomInputContainer from './CustomInputContainer';

const CustomInputWrapper = forwardRef(({ model = [], value = {}, onChange }, ref) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    model.forEach((fieldItem) => {
      const isObject = typeof fieldItem === 'object';
      const key = isObject ? fieldItem.name : fieldItem;
      const fieldConfig = isObject ? fieldItem : { name: key, type: 'text' };
      const actualRequired = fieldConfig.required;
      
      const fieldValue = value[key];

      if (actualRequired) {
        if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
          const placeholder = key.replace(/([A-Z])/g, ' $1');
          const finalPlaceholder = fieldConfig.label || (placeholder.charAt(0).toUpperCase() + placeholder.slice(1));
          newErrors[key] = `${finalPlaceholder} is required.`;
          isValid = false;
        }
      }
      
      // Extended validation logic (e.g. email) can be added here if needed
      if (fieldConfig.type === 'email' && fieldValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
          newErrors[key] = `Invalid email format.`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  useImperativeHandle(ref, () => ({
    validateForm
  }));

  return (
    <div className="custom-input-wrapper">
      {model.map((fieldItem) => {
        const isObject = typeof fieldItem === 'object';
        const key = isObject ? fieldItem.name : fieldItem;
        const fieldConfig = isObject ? fieldItem : { name: key, type: 'text' };
        
        const placeholder = key.replace(/([A-Z])/g, ' $1');
        const finalPlaceholder = fieldConfig.label || (placeholder.charAt(0).toUpperCase() + placeholder.slice(1));
        
        return (
          <CustomInputContainer
            key={key}
            field={fieldConfig}
            name={key}
            value={value[key]}
            onChange={onChange}
            placeholder={finalPlaceholder}
            formData={value}
            error={errors[key]}
          />
        );
      })}
    </div>
  );
});

export default CustomInputWrapper;
