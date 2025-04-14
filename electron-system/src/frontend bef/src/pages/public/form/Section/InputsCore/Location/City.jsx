

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Box, Grid, Typography } from '@mui/material';
import { useMemo, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import CitySelector from '../../../../../../components/selector/City';

const FormInputLocationCity=({name,data,sectionId})=>{

  const { control ,watch} = useFormContext();

  const watchProvince= watch( `${data?.parentProvinceName}` )
  console.log("* * * FormInputLocationCity : ",{name,data,watchProvince},`${data?.parentProvinceName}`);

    // const options=useMemo(()=>{
    //     return true// JSON.parse(data?.options||'{}');
    // },[data]);

    // console.log({options,data});
    // <RHFSelector options={options?.array||[]}  name={name} label={data?.label} />

   

    return (
        <Box>
     <CitySelector.Element  geById={data?.client_inputs?.[0]?.value}  name={name}  label={data?.label} provinceId={watchProvince?.value} />
      </Box>
    )

}

export default FormInputLocationCity;