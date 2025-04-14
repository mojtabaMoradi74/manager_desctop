
import { InputAdornment, Box } from '@mui/material';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import RHFTextField from '../../../../../components/hook-form/RHFTextField';

const FormInputSocial=({name,data})=>{



    return (
        <RHFTextField  name={name} label={data?.label}    InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{
                    cursor:"pointer",
                    "img":{
                      width:"30px",  
                      height:"30px",  
                      borderRadius:"100%",
                      objectFit:"cover",
                      cursor:"pointer",
                    }
                }}>
                    <a href={data?.options?.link} target={"_blank"} rel="noreferrer">
                         <img src={data?.image} alt={data?.label}/>
                    </a>
                </Box>
              </InputAdornment>
            ),
          }}/>
    )

}

export default FormInputSocial;