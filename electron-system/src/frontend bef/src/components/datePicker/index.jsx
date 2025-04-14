/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
/* eslint-disable camelcase */
/* eslint-disable arrow-body-style */
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

const DatePickerComponent = ({
    value,
    onChange = () => null ,
    placeholder="",
    inputClassName = "",
    other
}) => {
    return (
        <>
            <DatePicker
                containerClassName=""
                inputClass={"siteTempInput" + (inputClassName ? ` ${inputClassName}` : "")}
                calendar={persian}
                locale={persian_fa}
                value={value}
                placeholder={placeholder}
                
                // onChange={onChange}
                onChange={(value) => onChange(value?.toDate?.().toString())}
                style={{
                    width:"100%",
                    border:"1px solid #E1E1E3",
                    borderRadius:8,
                    fontSize:"16px",
                    fontFamily:"sans-serif",
                    padding:15
                }}
                containerStyle={{
                    width:"100%"
                }}
                {...other}
            />
        </>
    );
}

export default DatePickerComponent;