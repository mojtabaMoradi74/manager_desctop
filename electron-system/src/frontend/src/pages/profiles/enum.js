import {travelTypeObject} from '../../enumeration'
import {routes} from '../../routes/paths'
import api from '../../services/api'

const caravanTabType = {
  specification: {label: 'مشخصات', value: 'specification'},
  access: {label: 'دسترسی ها', value: 'access'},
  message: {label: 'پیام ها', value: 'message'},
  historyRegistration: {label: 'سابقه ثبت نام ها', value: 'history-registration'},
  nezam: {label: 'نظام وظیفه', value: 'nezam'},
  bank: {label: 'بانک', value: 'bank'},
  // social: { label: 'شبکه اجتماعی', value: 'social' },
  // tutorial: { label: 'آموزش و آزمون', value: 'tutorial' },
  // more: { label: 'سایر امکانات', value: 'more' },
}

const ECaravan = {
  title: {
    name: ['پروفایل', 'پروفایل ها'],
  },
  routes: routes.profile,
  api: api.admin,
  // enum: {
  //   array: Object.values(caravanTabType),
  //   object: caravanTabType,
  // },
  enumTab: {
    array: Object.values(caravanTabType),
    object: caravanTabType,
  },
}

export default ECaravan
