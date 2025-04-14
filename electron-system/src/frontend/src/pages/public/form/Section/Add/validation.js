import * as yup from 'yup';
import errorsText from '../../../../utils/errorsText';

const fieldNames = {
  label: 'label',
};

const validation = {
  fieldNames,
  schema: () =>
    yup.object().shape({
      [fieldNames.label]:yup.string().nullable().required(errorsText.blankError()),
    }),
};

export default validation;
