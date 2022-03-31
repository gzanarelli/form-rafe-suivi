import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller } from 'react-hook-form';
export const SelectInput = ({name, control, label, options = []}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => {
        return (<FormControl sx={{ m: 1, minWidth: 120 }} style={{marginTop: 10 }}>
        <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          label={label}
          {...field}
        >
          {
            options.map(option => <MenuItem value={option.value}>{option.label}</MenuItem>)
          }
        </Select>
      </FormControl>)
      }}
    />
  )
} 