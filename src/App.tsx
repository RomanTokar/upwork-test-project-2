import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React, { useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import * as csv from 'csvtojson';
import { FormProvider, useForm } from 'react-hook-form';
import { Table } from './components/Table';
import { isValidEmail } from './utils/IsValidEmail';
import { isValidName } from './utils/IsValidName';
import { formError } from './utils/formError';
import { AttributeType } from './data/attributes';
import { isValidPhoneNumber } from './utils/IsValidPhoneNumber';
import { fileToString } from './utils/fileToString';

type FieldsValues = {
  [key: string]: { attribute: AttributeType; customAttribute: string };
};

type ValidationType = {
  function: (str: string) => boolean;
  error: string;
};

const validationObject: Record<Exclude<AttributeType, 'Others'>, ValidationType> = {
  'Mobile Number': {
    function: isValidPhoneNumber,
    error: 'Not valid phone number',
  },
  Name: { function: isValidName, error: 'Not valid name' },
  Email: { function: isValidEmail, error: 'Not valid email' },
};

function App() {
  const methods = useForm<FieldsValues>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const headers = useMemo(() => (rows.length > 0 ? Object.keys(rows[0]) : []), [rows]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData: FieldsValues) => {
    setError('');
    const newRows = [];
    let isError = false;
    loop: for (let r of rows) {
      const newRow: Record<string, string> = {};
      for (const [index, [key, value]] of Object.entries(formData).entries()) {
        if (!value.attribute) continue;
        const field = r[key];
        if (value.attribute === 'Others') {
          newRow[value.customAttribute] = field;
        } else {
          const validation = validationObject[value.attribute];
          if (!validation.function(field)) {
            setError(formError(validation.error, key, index));
            isError = true;
            break loop;
          } else {
            newRow[key] = field;
          }
        }
      }
      newRows.push(newRow);
    }
    if (isError) return;
    console.log(newRows);
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    closeDialog();
  };

  const closeDialog = () => {
    setOpen(false);
    methods.reset();
    setError('');
    setSelectedFile(null);
    setRows([]);
  };

  const openDialog = () => setOpen(true);

  const selectFile = () => {
    inputRef.current?.click();
  };

  const onSelectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!(files && files[0])) return;
    const [file] = files;
    methods.reset();
    setSelectedFile(file);
    const text = await fileToString(file);
    const newRows = await csv().fromString(text);
    setRows(newRows);
  };

  return (
    <>
      <Button onClick={openDialog}>Open Popup</Button>
      <FormProvider {...methods}>
        <Dialog
          onClose={closeDialog}
          open={open}
          maxWidth={'lg'}
          scroll={'paper'}
          PaperProps={{
            sx: { width: 1200, height: 1000 },
            component: 'form',
            onSubmit: methods.handleSubmit(onSubmit),
          }}>
          <DialogContent dividers>
            <input type="file" ref={inputRef} hidden onChange={onSelectFile} accept=".csv" />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button onClick={selectFile} variant={'outlined'}>
                Choose file
              </Button>
              {selectedFile && <Typography variant={'body1'}>{selectedFile.name}</Typography>}
            </Box>
            <Typography variant={'h3'}>Header identifiers</Typography>
            <Table headers={headers} control={methods.control} />
          </DialogContent>
          <DialogActions sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Typography sx={{ color: 'error.main' }}>{error}</Typography>
            <Button onClick={closeDialog} variant={'outlined'} type={'button'}>
              Cancel
            </Button>
            <Button variant={'contained'} type={'submit'} disabled={loading}>
              {loading ? <CircularProgress size={20} color={'inherit'} /> : 'Import'}
            </Button>
          </DialogActions>
        </Dialog>
      </FormProvider>
    </>
  );
}

export default App;
