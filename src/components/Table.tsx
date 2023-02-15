import { Control } from "react-hook-form";
import React from "react";
import { Box, Typography } from "@mui/material";
import { CustomAttributeInputField } from "./CustomAttributeInputField";
import { AttributeSelect } from "./AttributeSelect";

type TableProps = {
  headers: string[];
  control: Control;
};

export const Table: React.FC<TableProps> = ({ headers, control }) => {
  return (
    <table width={'100%'}>
      <thead>
        <tr>
          <th>
            <Typography variant={'h4'}>CSV Headers</Typography>
          </th>
          <th>
            <Typography variant={'h4'}>Map to Attribute</Typography>
          </th>
        </tr>
      </thead>
      <tbody>
        {headers.map((header) => (
          <tr key={header}>
            <td>
              <Typography variant={'h6'}>{header}</Typography>
            </td>
            <td>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <AttributeSelect header={header} control={control} />
                <CustomAttributeInputField control={control} header={header} />
              </Box>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

