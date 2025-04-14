import * as yup from 'yup';
import errorsText from '../../../../utils/errorsText';

const validation = {
  // defaultValue:{},
  fieldNames: {
    code_melli: 'code_melli',
    province_id: 'province_id',
    city_id: 'city_id',
    university_id: 'university_id',
    is_active: 'is_active',
  },
  schema: () =>
    yup.object().shape({
      [validation.fieldNames.code_melli]: yup.string(),
      [validation.fieldNames.province_id]: yup.mixed(),
      [validation.fieldNames.city_id]: yup.mixed(),
      [validation.fieldNames.university_id]: yup.mixed(),
      [validation.fieldNames.is_active]: yup.mixed(),
    }),
};

export default validation;
