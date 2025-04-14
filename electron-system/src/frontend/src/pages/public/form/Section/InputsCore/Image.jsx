
import { useMemo } from 'react';
import { RHFUploadSingleFile } from '../../../../../components/hook-form';

const FormInputImage=({name,data,disabled})=>{

    // const options=useMemo(()=>{
    //     // const param= JSON.parse(data?.options||'{}');
    //     return {
    //         array: data?.options?.items?.map((x)=>({label:x.label,value:x.label})),
    //         data:data?.options
    //     }

    // },[data]);

    return (
        <RHFUploadSingleFile
        name={name} 
          title={data?.label}
          description={`فایل را بکشید و رها کنید یا روی دکمه انتخاب فایل کلیک کنید.
حداکثر حجم قابل قبول برای هر عکس: 5 مگابایت
فرمت های قابل قبول: gif، JPG، PNG،`}
disabled={disabled}
        />
    )

}

export default FormInputImage;