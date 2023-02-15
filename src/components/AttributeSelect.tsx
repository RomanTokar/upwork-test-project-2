import { Control, Controller } from 'react-hook-form';
import React from 'react';
import { MenuItem, Select } from '@mui/material';
import attributes from '../data/attributes';

type AttributeSelectProps = {
  header: string;
  control: Control;
};

export const AttributeSelect: React.FC<AttributeSelectProps> = ({ header, control }) => {
  return (
    <Controller
      control={control}
      name={`${header}.attribute`}
      render={({ field: { onChange, value, ref, name } }) => (
        <Select name={name} inputRef={ref} value={value || ''} onChange={onChange}>
          {attributes.map((el) => (
            <MenuItem key={el} value={el}>
              {el}
            </MenuItem>
          ))}
        </Select>
      )}
    />
  );
};
