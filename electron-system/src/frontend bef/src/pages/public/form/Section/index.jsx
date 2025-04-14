import { useTranslation } from 'react-i18next';
import { ControlPoint, Edit } from '@mui/icons-material';
import { Box, Button, Grid, Modal, Typography, Alert } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFormContext, Controller } from 'react-hook-form';


import {formTypesObject} from "../../../../enumeration"
import InputsCore from './InputsCore';
import EPublicForm from '../enum';

const SectionPublic = ({ data ,loading,disabled}) => {

  const urlParams = useParams();
  const { t } = useTranslation();

  const { control,watch,setValue,getValues} = useFormContext();

  console.log("* * * SectionPublic : ",{data},data?.label);
  const watchParent = data?.isCompanions&&watch(data?.parentId)
  console.log("* * * SectionPublic : ",{watchParent},data?.label);
  useEffect(()=>{
    
    try {

      if(watchParent >= 0 && data?.parentId){
        const values = getValues()
        const current =  [...values[data?.id]]
        console.log("* * * SectionPublic useEffect: ",{watchParent,values,current,parentId:data?.parentId},data?.label);
      
        if(current?.length > watchParent){
          const newValue = current.slice(0, -(current?.length - watchParent));
          console.log("* * * SectionPublic useEffect: ",{newValue},-(current?.length - watchParent),String(data?.id));
          setValue(String(data?.id),newValue);
        }
      }
  // console.log("* * * SectionPublic useEffect: ",{watchParent,values,current,parentId:data?.parentId},data?.label);
} catch (error) {
  console.log("* * * SectionPublic useEffect: ",{error});
}
  },[watchParent])

return (
 ( data?.isCompanions?watchParent:true)?  <Controller
    name={data?.id?.toString()}
    control={control}
    render={({ field, fieldState: { error } }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: 'grey.main',
          borderRadius: '8px',
        }}
      >
        <Typography>{data?.label}</Typography>
       
      </Box>

     

{
  data?.isCompanions? 
  // true?"":
<Box sx={{
  display:"flex",
  flexDirection:"column",
  gap:3,
}}>
{
 new Array(+watchParent||0).fill({})?.map((x, i) => {

    return (
      <Box sx={{
        p:3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        
        <Grid container sx={{
        // mb:2,
        // backgroundColor: 'grey.main',
        p:0
      

        }}  spacing={3}>
      <Grid
      xs={12}
      item
      
      >
         <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: 'grey.main',
          borderRadius: '8px',
        }}
      >
        <Typography>{`همراه ${i+1}`}</Typography>
        </Box>
      </Grid>
 

      {data?.inputs?.map((x) => {

        let props={
          xs:12,
          md:6,
        }
    
        if([formTypesObject.IMAGE.value,formTypesObject.CHECKBOX.value].includes(x.type)){
          props={
            ...props,
            xs:12,
            md:12
          }
        }
        if(formTypesObject.LOCATION.value ===x.type &&x?.options?.isAddress){
          props={
            ...props,
            xs:12,
            md:12
          }
        }
    
    
        return (
        <Grid 
         key={`${data?.id}.${i}.${x.id}`} item {...props}>
           <InputsCore
            data={x}
            name={`${data?.id}.${i}.${EPublicForm.bseName||""}${x?.id}`}
            loading={loading}
            sectionId={data?.id}
            disabled={disabled}
          />
        </Grid>
      )}
    )
    }
    </Grid>
  </Box>

    )


  })}
  </Box>


  :
  <Grid sx={{}} container spacing={3}>
{data?.inputs?.length ? (
  data?.inputs?.map((x) => {

    let props={
      xs:12,
      md:6
    }

    if([formTypesObject.IMAGE.value,formTypesObject.CHECKBOX.value].includes(x.type)){
      props={
        xs:12,
        md:12
      }
    }
    if(formTypesObject.LOCATION.value ===x.type &&x?.options?.isAddress){
      props={
        xs:12,
        md:12
      }
    }


    return (
    <Grid key={`${data?.id}.${x.id}`} item {...props}>
       <InputsCore
        data={x}
        // name={`name.firstname`}
        name={`${data?.id}.${EPublicForm.bseName||""}${x?.id}`}
        loading={loading}
        sectionId={data?.id}
        disabled={disabled}
      />
    </Grid>
  )})
) : (
  <Grid item xs={12}>
    <Alert severity="info">{'موردی یافت نشد!'}</Alert>
  </Grid>
)}
</Grid>
}
     
    </Box>
          )}
          />:<></>
  );
};

export default SectionPublic;
