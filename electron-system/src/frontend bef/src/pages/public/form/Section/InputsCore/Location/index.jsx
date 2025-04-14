
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Box, Grid, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import RHFTextField from '../../../../../../components/hook-form/RHFTextField';
import FormInputLocationCity from './City';
import FormInputLocationProvince from './Province';

const FormInputLocation=({name,data,sectionId})=>{

  const { watch } = useFormContext();

  // const watchProvince=watch

  // data.

    console.log("* * * FormInputLocation :",{data});
    // <RHFSelector options={options?.array||[]}  name={name} label={data?.label} />
    if(data?.options?.isCity) return <FormInputLocationCity {...{name,data,sectionId}}/>
    if(data?.options?.isProvince) return <FormInputLocationProvince {...{name,data,sectionId}}/>
    return (
            <RHFTextField  name={name}  label={data?.label} />
    )

}

export default FormInputLocation;