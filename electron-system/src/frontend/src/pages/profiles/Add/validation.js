import * as yup from 'yup';
import errorsText from '../../../utils/errorsText';

const validation = {
  // defaultValue:{},
  fieldNames: {
    name: 'name',
    last_name: 'last_name',
    code_melli: 'code_melli',
    email: 'email',
    password: 'password',
    shenasname_number: 'shenasname_number',
    confirm_password: 'confirm_password',
    agent_id: 'agent_id',
    phone: 'phone',
    status: 'status',
  },
  schema: (isEdit) =>
    yup.object().shape({
      [validation.fieldNames.name]: yup.string().required(errorsText.blankError()),
      [validation.fieldNames.last_name]: yup.string().required(errorsText.blankError()),
      [validation.fieldNames.code_melli]: yup.string().required(errorsText.blankError()),
      [validation.fieldNames.email]: yup.string().required(errorsText.blankError()),
      [validation.fieldNames.password]: yup.string().min(8, errorsText.min(8)).nullable(),
      [validation.fieldNames.confirm_password]: yup
        .string()
        .oneOf([yup.ref(validation.fieldNames.password), null], errorsText.passwordNotMatch()),
      [validation.fieldNames.shenasname_number]: yup.string().required(errorsText.blankError()),
      [validation.fieldNames.agent_id]: yup.mixed().nullable(),
      [validation.fieldNames.phone]: yup.string().required(errorsText.blankError()),
    }),
};
// "Passwords must match"
export default validation;
