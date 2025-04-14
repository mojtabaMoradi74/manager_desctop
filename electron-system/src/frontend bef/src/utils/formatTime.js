// import { format, getTime, formatDistanceToNow } from 'date-fns';
// import {format, formatDistanceToNow, getTime, toGregorian} from 'date-fns'
import {format, formatDistanceToNow, getTime, toGregorian} from 'date-fns-jalali'

// import moment from 'moment';
// import 'moment/locale/fa';
import moment from 'moment-jalaali'

// moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

// moment.locale('fa');
// ----------------------------------------------------------------------
// moment.locale('fa');
export function fDate(date) {
  // return moment(date).format('YYYY-MM-DD');
  // const gregorianDate = new Date('1403-03-17T00:00:00');
  // return format(gregorianDate, 'dd MMMM yyyy');
  // return moment(date).format('dd MMMM yyyy');
  // const aa = new Date(date);
  // console.log({ aa, date });
  try {
    return format(new Date(date), 'dd MMMM yyyy - HH:mm')
  } catch (error) {
    return false
  }
}

export function fDateJalali(date) {
  return moment(date, 'jYYYY-jMM-jDD').format('jD jMMMM jYYYY')
}

export function fDateTime(date) {
  // return moment(date).format('YYYY-MM-DD - HH:mm');
  return format(new Date(date), 'dd MMMM yyyy - HH:mm')
}

export function fTimestamp(date) {
  return getTime(new Date(date))
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p')
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  })
}

export const toPersianDate = (data) => format(new Date(data), 'd MMMM yyyy')

export const toPersianDateWithTime = (data) => format(new Date(data), 'HH:ss  yyyy/M/d')

export const fDateApi = (date) => moment(date).format('jYYYY-jMM-jDD')
export const fDateForApi = (date) => moment(date).format('YYYY-MM-DD')
export const fDateJalaliForApi = (date) => moment(date, 'jYYYY-jMM-jDD').format('YYYY-MM-DD')
// export const Gregorian=(date)=
