
import { formTypesObject } from '../../../../../enumeration';
import FormInputText from './Text';
import FormInputNumber from './Number';
import FormInputRadio from './Radio';
import FormInputSelect from './Select';
import FormInputCheckbox from './Checkbox';
import FormInputImage from './Image';
import FormInputSocial from './Social';
import FormInputDate from './Date';
import FormInputString from './String';
import FormInputLocation from './Location';

const InputsCore = ({ data ,...props}) => {

  console.log("* * * InputsCore : ",{data}, data?.type);

  const componentByTypes = {
    [formTypesObject.NUMBER.value]: <FormInputNumber {...{data,...props}}/>,
    [formTypesObject.SELECT.value]: <FormInputSelect {...{data,...props}}/>,
    [formTypesObject.RADIO.value]: <FormInputRadio  {...{data,...props}}/>,
    [formTypesObject.CHECKBOX.value]: <FormInputCheckbox  {...{data,...props}}/>,
    [formTypesObject.SOCIAL_MEDIA.value]: <FormInputSocial {...{data,...props}}/>,
    [formTypesObject.STRING.value]: <FormInputString {...{data,...props}}/>,
    [formTypesObject.code_melli.value]: <FormInputString {...{data,...props}}/>,
    [formTypesObject.TEXT.value]: <FormInputText {...{data,...props}}/>,
    [formTypesObject.IMAGE.value]: <FormInputImage {...{data,...props}}/>,
    [formTypesObject.DATE.value]: <FormInputDate {...{data,...props}}/>,
    [formTypesObject.LOCATION.value]: <FormInputLocation {...{data,...props}}/>,
    [formTypesObject.phone.value]: <FormInputString {...{data,...props}}/>,
    [formTypesObject.code_melli.value]: <FormInputString {...{data,...props}}/>,
    [formTypesObject.STRING.value]: <FormInputString {...{data,...props}}/>,
  };
  
 return (
   data?.type ? componentByTypes[data?.type] || <></> : <></>
 );

};

export default InputsCore;
