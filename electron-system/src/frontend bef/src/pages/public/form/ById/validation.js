import * as yup from 'yup';
// import errorsText from '../../../../utils/errorsText';

const fieldNames = {
  label: 'label',
};

const validation = {
  fieldNames,
  schema: (params) => yup.object().shape(
    params
  //   {
  //   '1':yup.object().shape({'2':yup.string().required(errorsText.blankError())})
  // }
    ),

};

export default validation;
