
import { useMemo } from 'react';

import RHFRadioGroups from '../../../../../components/hook-form/RHFRadioGroups';
import RHFCheckboxGroups from '../../../../../components/hook-form/RHFCheckboxGroups';

const FormInputCheckbox=({name,data,disabled})=>{

    const options=useMemo(()=>{
        // const param= JSON.parse(data?.options||'{}');
        return {
            array: data?.options?.items?.map((x)=>({label:x.label,value:x.label})),
            param:data?.options
        }

    },[data])

    return (
        <RHFCheckboxGroups options={options?.array||[]} name={name} label={data?.label} disabled={disabled}/>
    )

}

export default FormInputCheckbox;