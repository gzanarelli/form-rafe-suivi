import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
export const TextInput = ({name, control, label, type = 'string'}) => {
  return (
    <Controller 
      name={name}
      control={control}
      render={({field}) => {
        return <TextField {...field} label={label} style={{marginTop: 10 }}/>
      }}
    />
  )
} 