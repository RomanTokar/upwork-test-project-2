import React from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { TextField } from '@mui/material';

type CustomAttributeInputFieldProps = {
  control: Control;
  header: string;
};

export const CustomAttributeInputField: React.FC<CustomAttributeInputFieldProps> = ({
  control,
  header,
}) => {
  const attribute = useWatch({
    control,
    name: `${header}.attribute`,
  });

  if (attribute !== 'Others') return null;

  return (
    <Controller
      control={control}
      name={`${header}.customAttribute`}
      render={({ field: { onChange, value, ref } }) => (
        <TextField
          label={'Custom attribute value'}
          inputRef={ref}
          value={value || ''}
          onChange={onChange}
        />
      )}
    />
  );
};
