import * as yup from 'yup';
import errorsText from '../../../../../utils/errorsText';

const validation = {
  // defaultValue:{},
  fieldNames: {
    socials: 'socials',
  },
  schema: () =>
    yup.object().shape({
      [validation.fieldNames.socials]: yup.string().nullable().required(errorsText.blankError()),
    }),
};

export default validation;
