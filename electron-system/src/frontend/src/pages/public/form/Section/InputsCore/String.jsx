
import RHFTextField from '../../../../../components/hook-form/RHFTextField';

const FormInputString=({name,data,disabled})=>{

    return (
        <RHFTextField  name={name} label={data?.label} disabled={disabled}/>
    )

}

export default FormInputString;