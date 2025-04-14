
import RHFDatePicker from '../../../../../components/hook-form/RHFDatePicker';

const FormInputDate=({name,data,disabled})=>{

    return (
        <RHFDatePicker  name={name} label={data?.label} disabled={disabled}/>
    )

}

export default FormInputDate;