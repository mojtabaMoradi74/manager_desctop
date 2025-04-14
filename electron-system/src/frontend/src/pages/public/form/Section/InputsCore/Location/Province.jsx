
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Box, Grid, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import RHFTextField from '../../../../../../components/hook-form/RHFTextField';
import ProvinceSelector from '../../../../../../components/selector/Province';

const FormInputLocationProvince=({name,data})=>{

  const { setValue } = useFormContext();

  const handleChange=(a,v)=>{
  console.log("* * * FormInputLocationProvince handleChange : ",{a,v});
    if(data?.childCityName)    setValue(data?.childCityName,undefined)
  }
console.log("* * * FormInputLocationProvince : ",{data});

    return (
        <Box>
            <ProvinceSelector.Element geById={data?.client_inputs?.[0]?.value}  name={name}  label={data?.label} onChange={handleChange}/>
      </Box>
    )

}

export default FormInputLocationProvince;