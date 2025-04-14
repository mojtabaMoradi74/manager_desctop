

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Box, Grid, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import RHFTextField from '../../../../../../components/hook-form/RHFTextField';

const FormInputLocation=({name,data})=>{

  // const { watch } = useFormContext();

  // const watchProvince=watch

    const options=useMemo(()=>{
        return JSON.parse(data?.options||'{}');
    },[data]);

    console.log({options,data});
    // <RHFSelector options={options?.array||[]}  name={name} label={data?.label} />
    return (
        <Box>
     
      
            <RHFTextField  name={name}  label={data?.label} />
            {/* <RHFTextField name={"name"} label={'شهر'} />
            <RHFTextField name={"name"} label={'آدرس'} /> */}
      </Box>
    )

}

export default FormInputLocation;