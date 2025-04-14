export const travelTypeObject = {
  omre: {
    label: 'عمره',
    value: 'omre',
    type: '0',
  },
  tamato: {
    label: 'تمتع',
    value: 'tamato',
    type: '1',
  },
  atabat_aliat: {
    label: 'عتبات عالیات',
    value: 'atabat_aliat',
    type: '2',
  },
  other: {
    label: 'سفرهای زیارتی دیگر',
    value: 'other',
    type: '3',
  },
};

export const formTypesObject = {
  STRING: {
    label: 'تایتل',
    value: 'STRING',
    options: {},
    title: 'تایتل ورودی متن را بنویسید',
  },
  NUMBER: {
    label: 'عدد',
    value: 'NUMBER',
    options: {},
    title: 'سوال خورد را بنویسید',
  },
  TEXT: {
    label: 'ورودی توضیحات',
    value: 'TEXT',
    options: {},
    title: 'تایتل ورودی متن را بنویسید',
  },
  SELECT: {
    label: 'کشویی',
    value: 'SELECT',
    options: {},
    title: 'سوال خورد را بنویسید',
  },
  CHECKBOX: {
    label: 'چک باکس',
    value: 'CHECKBOX',
    options: {},
    title: 'سوال خورد را بنویسید',
  },
  RADIO: {
    label: 'رادیو باتم',
    value: 'RADIO',
    options: {},
    title: 'سوال خورد را بنویسید',
  },
  code_melli: {
    label: 'کدملی',
    value: 'code_melli',
    options: {},
    title: 'سوال خورد را بنویسید',
  },
  phone: {
    label: 'تلفن',
    value: 'phone',
    options: {},
    title: 'سوال خورد را بنویسید',
  },

  // FILE: {
  //   label: 'بارگزاری',
  //   value: 'FILE',
  //   options: {},
  // title:""
  // },
  IMAGE: {
    label: 'بارگزاری عکس',
    value: 'IMAGE',
    options: {},
    title: 'بنویسید کاربر چه فایلی را باید بارگذاری کند',
  },
  DATE: {
    label: 'تاریخ ',
    value: 'DATE',
    options: {},
    title: 'بنویسید کاربر چه تاریخی را باید وارد کند',
  },
  LOCATION: {
    label: 'موقعیت مکانی',
    value: 'LOCATION',
    options: {},
    title: 'بنویسید کاربر چه موقعیت مکانی را باید وارد کند',
  },
  SOCIAL_MEDIA: {
    label: 'شبکه های اجتماعی',
    value: 'SOCIAL_MEDIA',
    options: {},
    title: 'نام شبکه اجتماعی را  بنویسید',
  },
};

// export const  travelTypeArray = () => {
//   array?.reduce((prev, curr) => {
//     prev[curr.value] = curr;
//     return prev;
//   }, {});
// };

export const haveHasType = {
  1: {
    label: 'دارد',
    value: 1,
  },
  0: {
    label: 'ندارد',
    value: 0,
  },
};

export const statusType = {
  1: {
    label: 'فعال',
    value: 1,
  },
  0: {
    label: 'غیر فعال',
    value: 0,
  },
};

export const caravanType = {
  0: {
    label: 'متاهلین',
    value: 0,
  },
  1: {
    label: 'مجردین',
    value: 1,
  },
  2: {
    label: 'خانم ها',
    value: 2,
  },
  3: {
    label: 'اقایان',
    value: 3,
  },
};

export const agentsType = {
  managerCaravan: {
    label: 'مدیر کاروان',
    value: 1,
  },
  rohani: {
    label: 'روحانی',
    value: 2,
  },
  moeine: {
    label: 'معینه',
    value: 3,
  },
  deputyCaravan: {
    label: 'معاون کاروان',
    value: 4,
  },
  interface: {
    label: 'رایط',
    value: 5,
  },
};
export const refreshTokenSpacer = 3000;
