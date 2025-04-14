
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Box, Grid, Typography } from '@mui/material';
import { useMemo } from 'react';
import RHFTextField from '../../../../../components/hook-form/RHFTextField';

const FormInputLocation=({name,data})=>{

    const options=useMemo(()=>{
        // const param= JSON.parse(data?.options||'{}');
        return {
            array: data?.options?.items?.map((x)=>({label:x.label,value:x.label})),
            data:data?.options
        }

    },[data]);

    // <RHFSelector options={options?.array||[]}  name={name} label={data?.label} />
    return (
        <Box>
     
        <Box sx={{
            my:1,
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center"
        }}>
            <Typography>
            {'آدرس محل سکونت (موقعیت مکانی)'}
            </Typography>

            <LocationOnOutlinedIcon/>
            
            </Box>
           <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'grey.200',
            my: 2,
          }}
        />
        <Grid spacing={3} container>
          <Grid item md={6} xs={12}>
            <RHFTextField name={"name"} label={'استان'} />
          </Grid>
          <Grid item md={6} xs={12}>
            <RHFTextField name={"name"} label={'شهر'} />
          </Grid>
          <Grid item  xs={12}>
            <RHFTextField name={"name"} label={'آدرس'} />
          </Grid>
        </Grid>
      </Box>
    )

}

export default FormInputLocation;