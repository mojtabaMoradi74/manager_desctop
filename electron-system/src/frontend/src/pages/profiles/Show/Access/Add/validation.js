import * as yup from 'yup';
import errorsText from '../../../../../utils/errorsText';

const validation = {
  // defaultValue:{},
  fieldNames: {
    name: 'name',
    type: 'type',
    startDate: 'registration_start_at',
    endDate: 'registration_finish_at',
    is_active: 'is_active',
    team_count: 'team_count',
  },
  schema: () =>
    yup.object().shape({
      // [validation.fieldNames.type]: yup.object().required(errorsText.blankError()),
      // [validation.fieldNames.name]: yup.string().nullable().required(errorsText.blankError()),
      // [validation.fieldNames.team_count]: yup.string().nullable().required(errorsText.blankError()),
      // [validation.fieldNames.startDate]: yup.string().nullable().required(errorsText.blankError()),
      // [validation.fieldNames.endDate]: yup
      //   .string()
      //   .required(errorsText.blankError())
      //   .test('is-greater', errorsText.startDateIsGreater(), function (value) {
      //     const { startDate } = this.parent;
      //     return !startDate || !value || new Date(value) > new Date(startDate);
      //   }),
    }),
};

export default validation;
