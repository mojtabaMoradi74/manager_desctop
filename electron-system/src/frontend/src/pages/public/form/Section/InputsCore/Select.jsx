
import { useMemo } from 'react';
import RHFSelector from '../../../../../components/hook-form/RHFSelector';

const FormInputSelect=({name,data,disabled})=>{

    const options=useMemo(()=>{
        // const param= JSON.parse(data?.options||'{}');
        return {
            array: data?.options?.items?.map((x)=>({label:x.label,value:x.label})),
            data:data?.options
        }

    },[data]);

    return (
        <RHFSelector options={options?.array||[]}  name={name} label={data?.label} disabled={disabled}/>
    )

}

export default FormInputSelect;