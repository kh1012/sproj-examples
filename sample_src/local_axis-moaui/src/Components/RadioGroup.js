import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Typography } from '@mui/material';

function StyledRadio() {
  return(
    <Radio size="small" />
  )
}

export default function RadioButtonsGroup(defaultOp,setValue) {
  
  const handleChange=(event) => {
    setValue(event.target.value);
  }
  
  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        value={defaultOp}
        name="radio-buttons-group"
        onChange={handleChange}
        sx = {{marginLeft:"10px", marginTop:"5px", marginBottom:"5px"}}
      >
        <FormControlLabel value="MCS" control={StyledRadio()} label={<Typography sx={{fontSize:"14px"}}>Monotone Cubic Hermite Spline</Typography>} />
        <FormControlLabel value="NCS" control={StyledRadio()} label={<Typography sx={{fontSize:"14px"}}>Natural Cubic Spline</Typography>} />
        <FormControlLabel value="CCS" control={StyledRadio()} label={<Typography sx={{fontSize:"14px"}}>Clamped Cubic Spline</Typography>} />
      </RadioGroup>
    </FormControl>
  );
}