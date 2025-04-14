import * as yup from 'yup'
import errorsText from '../../../utils/errorsText'

const validation = {
  // defaultValue:{},
  fieldNames: {
    firstName: 'firstName',
    lastName: 'lastName',
    mobileNumber: 'mobileNumber',
    type: 'type',
    role: 'role',
    username: 'username',
    description: 'description',
    status: 'status',
    address: 'address',
    isFeatured: 'isFeatured',
    approvedNft: 'approvedNft',
    isVerified: 'isVerified',
    image: 'image',
    background: 'background',
    site: 'website',
    instagram: 'instagram',
    email: 'email',
    password: 'password',
    confirmPassword: 'confirmPassword',
  },
  schema: (isEdit) => {
    const obj = {
      [validation.fieldNames.firstName]: yup.string().required(errorsText.blankError()),
      [validation.fieldNames.lastName]: yup.string().required(errorsText.blankError()),
      [validation.fieldNames.email]: yup.string().nullable(),
      // --------------------------------------
      [validation.fieldNames.status]: yup.mixed().nullable().required(errorsText.blankError()),
      [validation.fieldNames.type]: yup.mixed().required(errorsText.blankError()),

      [validation.fieldNames.image]: yup.mixed().nullable(),
      // --------------------------------------
      [validation.fieldNames.password]: yup
        .string()
        .min(8, errorsText.min(8))
        .required(errorsText.blankError()),
      [validation.fieldNames.confirmPassword]: yup
        .string()
        .oneOf([yup.ref(validation.fieldNames.password), null], errorsText.passwordNotMatch())
        .required(errorsText.blankError()),
    }

    if (isEdit) {
      obj[validation.fieldNames.password] = yup.string().min(8, errorsText.min(8)).nullable()
      obj[validation.fieldNames.confirmPassword] = yup
        .string()
        .oneOf([yup.ref(validation.fieldNames.password), null], errorsText.passwordNotMatch())
    }
    return yup.object().shape(obj)
  },
}

export default validation
