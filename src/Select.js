import { FormControl, InputLabel, MenuItem, Select, Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import ReactSelect from 'react-select';

export const SelectInput = ({name, control, label, options = [], setValue, defaultValue = ''}) => {
  const [selected, setSelected] = useState('')
  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => {
        if (field.value === '') {
          setSelected('')
        }
        return (<FormControl sx={{ width: '100%' }} style={{marginTop: 10 }}>
        <Autocomplete
          {...field}
          disableClearable
          value={selected}
          // getOptionLabel={(options) => options.label}
          onChange={(event, newValue) => {
            setSelected(newValue.label)
            setValue(name, newValue.value);
          }}
          options={options}
          sx={{ width: '100%' }}
          renderInput={(params) => <TextField {...params} label={label} value={selected} />}
        />
      </FormControl>
    )}}
    />
  )
} 