
import RHFTextareaField from '../../../../../components/hook-form/RHFTextareaField';

const FormInputText=({name,data,disabled})=>{

    return (
        <RHFTextareaField  name={name} label={data?.label} disabled={disabled}/>
    )

}

export default FormInputText;