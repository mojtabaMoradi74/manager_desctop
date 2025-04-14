
import RHFTextField from '../../../../../components/hook-form/RHFTextField';

const FormInputNumber=({name,data,disabled})=>{

    return (
        <RHFTextField type={"number"} name={name} label={data?.label}disabled={disabled}/>
    )

}

export default FormInputNumber;